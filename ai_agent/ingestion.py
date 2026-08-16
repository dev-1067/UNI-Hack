import os
from llama_parse import LlamaParse

def parse_pdf(file_path: str) -> str:
    """
    Ingests a complex industrial PDF spec sheet and extracts text and tables as markdown.
    Requires LLAMA_CLOUD_API_KEY environment variable to be set.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found at {file_path}")
        
    print(f"📄 Parsing PDF: {file_path} using LlamaParse...")
    
    # Initialize parser
    # We use markdown output to preserve table structures which are common in spec sheets
    parser = LlamaParse(
        result_type="markdown", 
        verbose=True
    )
    
    # Parse the document
    try:
        documents = parser.load_data(file_path)
        
        # Combine all parsed pages/documents into a single markdown string
        full_text = "\n\n".join([doc.text for doc in documents])
        return full_text
    except Exception as e:
        print(f"❌ Error parsing PDF: {e}")
        return ""
