package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type QueryRequest struct {
	Query string `json:"query"`
}

type GradientRequest struct {
	Query string `json:"query"`
}

type GradientResponse struct {
	Result string `json:"result"`
}

func main() {
	// Initialize Fiber app with configuration
	app := fiber.New(fiber.Config{
		ErrorHandler: func(ctx *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return ctx.Status(code).JSON(fiber.Map{
				"error": err.Error(),
			})
		},
	})

	// Add CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization,X-Requested-With",
		AllowCredentials: false,
		ExposeHeaders:    "Content-Length",
		MaxAge:           86400,
	}))

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
			"time":   time.Now(),
		})
	})

	// Main query endpoint
	app.Post("/query-agent", handleQueryAgent)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}

func handleQueryAgent(c *fiber.Ctx) error {
	var req QueryRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if req.Query == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Query is required",
		})
	}

	log.Printf("Processing query: %s", req.Query)

	// Call Gradient Agent API - it handles everything and returns JSON
	agentResponse, err := callGradientAPI(req.Query)
	if err != nil {
		log.Printf("Gradient API error: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to get AI recommendations",
		})
	}

	// Extract and process the content from Gradient response
	processedResponse, err := processGradientResponse(agentResponse)
	if err != nil {
		log.Printf("Error processing Gradient response: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to process AI recommendations",
		})
	}

	return c.JSON(processedResponse)
}

func callGradientAPI(query string) (map[string]interface{}, error) {
	// Use the correct Gradient API endpoint with POST request
	apiURL := "https://svzed6csddujlan4fle3rd2c.agents.do-ai.run/api/v1/chat/completions"
	
	// Create the request payload according to the API spec
	payload := map[string]interface{}{
		"messages": []map[string]interface{}{
			{
				"role": "user",
				"content": query,
			},
		},
		"stream": false,
		"max_tokens": 1000,
	}
	
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshaling payload: %v", err)
		return nil, fmt.Errorf("failed to marshal payload: %v", err)
	}
	
	log.Printf("Calling Gradient API with URL: %s", apiURL)
	log.Printf("Payload: %s", string(jsonPayload))
	
	client := &http.Client{
		Timeout: 10 * time.Second,
	}
	
	req, err := http.NewRequest("POST", apiURL, strings.NewReader(string(jsonPayload)))
	if err != nil {
		log.Printf("Error creating request: %v", err)
		return nil, fmt.Errorf("failed to create request: %v", err)
	}
	
	req.Header.Set("Content-Type", "application/json")
	
	// Use the agent ID as the Bearer token
	if agentID := os.Getenv("GRADIENT_AGENT_ID"); agentID != "" {
		req.Header.Set("Authorization", "Bearer "+agentID)
		log.Printf("Using agent ID for authentication")
	} else {
		log.Printf("No agent ID found in GRADIENT_AGENT_ID environment variable")
	}
	
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error calling Gradient API: %v", err)
		return nil, fmt.Errorf("failed to call gradient API: %v", err)
	}
	defer resp.Body.Close()
	
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading response body: %v", err)
		return nil, fmt.Errorf("failed to read response: %v", err)
	}
	
	log.Printf("Gradient API response status: %d", resp.StatusCode)
	log.Printf("Gradient API response body: %s", string(body))
	
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("gradient API returned status %d: %s", resp.StatusCode, string(body))
	}
	
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		log.Printf("Error unmarshaling JSON: %v", err)
		return nil, fmt.Errorf("failed to parse response: %v", err)
	}
	
	return result, nil
}

func processGradientResponse(gradientResp map[string]interface{}) (map[string]interface{}, error) {
	log.Printf("Processing Gradient response")
	
	// Extract choices array
	choices, ok := gradientResp["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		return nil, fmt.Errorf("no choices found in gradient response")
	}
	
	// Get first choice
	firstChoice, ok := choices[0].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid choice format")
	}
	
	// Extract message
	message, ok := firstChoice["message"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("no message found in choice")
	}
	
	// Extract content
	content, ok := message["content"].(string)
	if !ok {
		return nil, fmt.Errorf("no content found in message")
	}
	
	log.Printf("Extracted content: %s", content)
	
	// Remove markdown code block formatting if present
	cleanContent := content
	if strings.Contains(content, "```json") {
		// Find the start and end of the JSON block
		startIdx := strings.Index(content, "```json")
		if startIdx != -1 {
			startIdx += 7 // length of "```json"
			// Skip any newlines after ```json
			for startIdx < len(content) && (content[startIdx] == '\n' || content[startIdx] == '\r') {
				startIdx++
			}
			
			endIdx := strings.Index(content[startIdx:], "```")
			if endIdx != -1 {
				cleanContent = content[startIdx : startIdx+endIdx]
			} else {
				cleanContent = content[startIdx:]
			}
		}
	}
	
	// Clean up any extra whitespace
	cleanContent = strings.TrimSpace(cleanContent)
	log.Printf("Cleaned content: %s", cleanContent)
	
	// Parse the JSON content
	var recommendations map[string]interface{}
	if err := json.Unmarshal([]byte(cleanContent), &recommendations); err != nil {
		log.Printf("Error parsing recommendations JSON: %v", err)
		log.Printf("Content was: %s", cleanContent)
		return nil, fmt.Errorf("failed to parse recommendations: %v", err)
	}
	
	log.Printf("Successfully parsed recommendations: %+v", recommendations)
	
	// Transform the recommendations to match frontend expectations
	if recsArray, ok := recommendations["recommendations"].([]interface{}); ok {
		transformedRecs := make([]map[string]interface{}, 0, len(recsArray))
		
		for _, rec := range recsArray {
			if recMap, ok := rec.(map[string]interface{}); ok {
				transformed := make(map[string]interface{})
				
				// Map fields to match frontend interface
				if repoName, exists := recMap["repo_name"]; exists {
					transformed["name"] = repoName
				}
				if link, exists := recMap["link"]; exists {
					transformed["url"] = link
				}
				if description, exists := recMap["description"]; exists {
					transformed["description"] = description
				}
				
				// Set default values for missing fields
				transformed["language"] = "Unknown"
				transformed["stars"] = 0
				transformed["difficulty"] = "Beginner"
				
				// Transform issues to good_first_issues
				if issues, exists := recMap["issues"]; exists {
					if issuesArray, ok := issues.([]interface{}); ok {
						goodFirstIssues := make([]map[string]interface{}, 0, len(issuesArray))
						for _, issue := range issuesArray {
							if issueMap, ok := issue.(map[string]interface{}); ok {
								goodFirstIssue := make(map[string]interface{})
								if title, exists := issueMap["title"]; exists {
									goodFirstIssue["title"] = title
								}
								if link, exists := issueMap["link"]; exists {
									goodFirstIssue["url"] = link
								}
								goodFirstIssues = append(goodFirstIssues, goodFirstIssue)
							}
						}
						transformed["good_first_issues"] = goodFirstIssues
					}
				} else {
					transformed["good_first_issues"] = []map[string]interface{}{}
				}
				
				transformedRecs = append(transformedRecs, transformed)
			}
		}
		
		recommendations["recommendations"] = transformedRecs
	}
	
	// Add a message field for the frontend
	if recommendations["message"] == nil {
		recommendations["message"] = "Here are some great repositories for you:"
	}
	
	return recommendations, nil
}


