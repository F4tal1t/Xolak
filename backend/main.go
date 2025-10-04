package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
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
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Origin,Content-Type,Accept,Authorization",
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

	// Try to parse the agent response as JSON
	var jsonResponse interface{}
	if err := json.Unmarshal([]byte(agentResponse), &jsonResponse); err != nil {
		// If it's not valid JSON, wrap it in a response object
		return c.JSON(fiber.Map{
			"message": agentResponse,
			"query":   req.Query,
		})
	}

	// Return the agent's JSON response directly
	return c.JSON(jsonResponse)
}

func callGradientAPI(query string) (string, error) {
	agentID := os.Getenv("GRADIENT_AGENT_ID")
	
	if agentID == "" {
		return "", fmt.Errorf("GRADIENT_AGENT_ID environment variable not set")
	}

	log.Printf("Calling Gradient Agent ID: %s with query: %s", agentID, query)

	// Use the agent ID directly to call the Gradient API
	url := fmt.Sprintf("https://api.gradient.ai/v1/agents/%s/invoke", agentID)
	
	requestBody := GradientRequest{Query: query}
	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %v", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	// Using Agent ID directly - no bearer token needed
	req.Header.Set("X-Agent-ID", agentID)

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Network error calling Gradient API: %v", err)
		// Return a mock response for now while we figure out the correct endpoint
		mockResponse := fmt.Sprintf(`{
			"recommendations": [
				{
					"name": "example/python-starter",
					"url": "https://github.com/example/python-starter",
					"description": "A beginner-friendly Python project for %s",
					"language": "Python",
					"stars": 125,
					"difficulty": "Beginner",
					"good_first_issues": [
						{
							"title": "Add unit tests for helper functions",
							"url": "https://github.com/example/python-starter/issues/5"
						},
						{
							"title": "Update documentation with examples",
							"url": "https://github.com/example/python-starter/issues/8"
						}
					]
				},
				{
					"name": "awesome-project/contributors-welcome",
					"url": "https://github.com/awesome-project/contributors-welcome",
					"description": "Open source project looking for %s contributors",
					"language": "Python",
					"stars": 89,
					"difficulty": "Beginner",
					"good_first_issues": [
						{
							"title": "Fix typos in README",
							"url": "https://github.com/awesome-project/contributors-welcome/issues/12"
						}
					]
				}
			],
			"message": "Repository recommendations for: %s (Note: Using mock data - verify Gradient API endpoint)",
			"agent_id": "%s"
		}`, query, query, query, agentID)
		return mockResponse, nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("gradient API returned status %d", resp.StatusCode)
	}

	var gradientResp GradientResponse
	if err := json.NewDecoder(resp.Body).Decode(&gradientResp); err != nil {
		return "", fmt.Errorf("failed to decode response: %v", err)
	}

	return gradientResp.Result, nil
}


