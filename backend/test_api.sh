#!/bin/bash

# Test script for Xolak backend API

echo "Testing Xolak Backend API"
echo "========================="

# Test health endpoint
echo "1. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:8080/health)
echo "Health check: $HEALTH_RESPONSE"
echo ""

# Test query endpoint with sample data
echo "2. Testing /query-agent endpoint..."
QUERY_RESPONSE=$(curl -s -X POST http://localhost:8080/query-agent \
  -H "Content-Type: application/json" \
  -d '{"query": "Beginner Python developer looking for first contribution"}' \
  2>&1)

echo "Query response:"
echo "$QUERY_RESPONSE"
echo ""

echo "Test complete!"
echo ""
echo "To run the backend with your API keys:"
echo "1. Copy .env.example to .env"
echo "2. Fill in your GITHUB_TOKEN, GRADIENT_API_KEY, and GRADIENT_AGENT_ID"
echo "3. Run: source .env && ./xolak-backend"