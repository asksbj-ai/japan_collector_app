---
name: tavily-search
description: Web search using Tavily API. Use when user needs to search the web for information.
metadata:
---

# Tavily Search Skill

Web search using Tavily API for real-time web search results.

## Setup

**Required:** Tavily API key

Set the API key in your environment:
```bash
export TAVILY_API_KEY="your-tavily-api-key"
```

Or add to `openclaw.json`:
```json
{
  "env": {
    "TAVILY_API_KEY": "your-api-key"
  }
}
```

Get your API key at: https://tavily.com/

## Usage

This skill provides web search capability using Tavily's search API.

### Search Command

```bash
tavily-search "your search query"
```

The tool will:
1. Call Tavily Search API
2. Return formatted search results with titles, URLs, and snippets

### Example Results

Results include:
- **Title** - Result headline
- **URL** - Link to the page
- **Snippet** - Relevant content preview
- **Score** - Relevance score (0-1)

## Implementation

This skill uses the Tavily Search API endpoint:
- **Endpoint:** `https://api.tavily.com/search`
- **Method:** POST
- **Parameters:**
  - `api_key`: Your Tavily API key
  - `query`: Search query
  - `search_depth`: "basic" or "comprehensive"
  - `max_results`: Number of results (default 10)

## Notes

- Tavily provides fresh web results optimized for AI grounding
- Results are cached for 15 minutes
- Supports advanced filters via API parameters
