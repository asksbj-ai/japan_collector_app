#!/bin/bash
# Tavily Search CLI

API_KEY="${TAVILY_API_KEY}"
MAX_RESULTS="${1:-10}"
QUERY="${2:-}"

if [ -z "$QUERY" ]; then
    echo "Usage: tavily-search <query> [max_results]"
    exit 1
fi

if [ -z "$API_KEY" ]; then
    echo "Error: TAVILY_API_KEY not set"
    exit 1
fi

# Call Tavily API
response=$(curl -s -X POST "https://api.tavily.com/search" \
    -H "Content-Type: application/json" \
    -d "{
        \"api_key\": \"$API_KEY\",
        \"query\": \"$QUERY\",
        \"search_depth\": \"basic\",
        \"max_results\": $MAX_RESULTS
    }")

# Parse and display results
echo "$response" | jq -r '.results[]? | "【\(.title)】\n\(.url)\n\(.content)\n---"' 2>/dev/null || echo "$response"
