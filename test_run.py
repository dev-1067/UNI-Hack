import json
from ai_agent.pipeline import run_agent_pipeline

def test():
    # Example industrial part
    brand = "Diablo"
    part_number = "DCB518ASTS06G"
    
    # Run the pipeline (assuming no PDF for this basic test, just web search)
    # The web search should trigger Tavily, scrape the page, and the LLM will extract specs
    result = run_agent_pipeline(brand, part_number, pdf_path=None)
    
    if result:
        print("\n🏆 FINAL OUTPUT (Ready for Person 2's CSV Pipeline):")
        print(result.model_dump_json(indent=4))
    else:
        print("Test failed to produce a result.")

if __name__ == "__main__":
    # Note: Ensure you have populated your .env file with API keys before running this
    test()
