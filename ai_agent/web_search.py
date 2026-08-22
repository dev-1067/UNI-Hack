import os
import json

try:
    from tavily import TavilyClient
except ImportError:
    TavilyClient = None

CACHE_FILE = "search_cache.json"

def _load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            return json.load(f)
    return {}

def _save_cache(cache_data):
    with open(CACHE_FILE, "w") as f:
        json.dump(cache_data, f, indent=4)

def exact_web_search(part_number: str, brand: str) -> dict:
    """
    Performs an exact web search for a specific Part Number and Brand.
    Uses a local JSON cache first to ensure demo reliability.
    Returns a dictionary with 'content' (scraped text) and 'url' (reference link).
    """
    search_query = f"{brand} {part_number} specifications"
    
    # 1. Check Cache first (Crucial for Demo Reliability)
    cache = _load_cache()
    if search_query in cache:
        print(f"✅ Found in Cache: {search_query}")
        return cache[search_query]
        
    print(f"🌐 Searching Web for: {search_query}")
    
    # 2. Live Web Search fallback
    tavily_api_key = os.getenv("TAVILY_API_KEY")
    if not tavily_api_key or TavilyClient is None:
        print("⚠️ Tavily API Key missing or client not installed, continuing without live web grounding.")
        return {"content": "", "url": f"https://example.com/{brand}/{part_number}"}
        
    client = TavilyClient(api_key=tavily_api_key)
    
    try:
        # We want the exact scraped content, not just a snippet
        response = client.search(
            query=search_query,
            search_depth="advanced",
            include_raw_content=True,
            max_results=1
        )
        
        if response and response.get('results'):
            best_result = response['results'][0]
            
            result_data = {
                "content": best_result.get('raw_content', best_result.get('content', '')),
                "url": best_result.get('url', '')
            }
            
            # Save to cache for next time
            cache[search_query] = result_data
            _save_cache(cache)
            
            return result_data
        else:
            print("⚠️ No results found on the web.")
            return {"content": "", "url": ""}
            
    except Exception as e:
        print(f"❌ Web Search Error: {e}")
        return {"content": "", "url": ""}
