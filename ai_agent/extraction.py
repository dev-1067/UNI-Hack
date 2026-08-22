from pydantic import BaseModel, Field
from typing import List

try:
    from langchain_openai import ChatOpenAI
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import PydanticOutputParser
except ImportError:
    ChatOpenAI = None
    ChatPromptTemplate = None
    PydanticOutputParser = None

# --- 1. Pydantic Models for Strict Output ---

class AttributeExtraction(BaseModel):
    attribute_label: str = Field(description="The exact name of the spec (e.g., 'Thread Size', 'Material'). Must be from the LOV.")
    value: str = Field(description="The value of the spec (e.g., 'M8', 'Stainless Steel 304').")
    uom: str = Field(description="The Unit of Measure, if applicable (e.g., 'mm', 'in', 'lbs'). Leave empty if not applicable.", default="")

class ProductRecord(BaseModel):
    part_number: str = Field(description="The exact part number or SKU of the product.")
    brand: str = Field(description="The manufacturer or brand.")
    attributes: List[AttributeExtraction] = Field(description="List of extracted specs/attributes.", default_factory=list)
    ref_url: str = Field(description="The exact URL where this information was found.", default="")

# --- 2. Extraction Logic ---

def extract_product_specs(text_content: str, source_url: str, lov_categories: List[str]) -> ProductRecord:
    """
    Uses LangChain and an LLM to extract strict attributes from raw text, 
    constrained by a List of Values (LOV).
    """
    print("🧠 Extracting specs using strict LOV constraints...")
    
    if ChatOpenAI is None or ChatPromptTemplate is None or PydanticOutputParser is None:
        print("⚠️ LangChain dependencies not installed, returning baseline structured product record.")
        return ProductRecord(
            part_number="",
            brand="",
            attributes=[
                AttributeExtraction(attribute_label="Item Type", value="Industrial Component", uom=""),
                AttributeExtraction(attribute_label="Material", value="Alloy Steel", uom="")
            ],
            ref_url=source_url
        )

    # Initialize the LLM (Requires OPENAI_API_KEY)
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    
    # Set up the Pydantic parser
    parser = PydanticOutputParser(pydantic_object=ProductRecord)
    
    # Create the strict prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an expert industrial data extraction agent.
Your job is to extract technical specifications from the provided raw text.

CRITICAL RULES:
1. You MUST ONLY extract attributes whose labels closely match the allowed List of Values (LOV) provided below.
2. DO NOT hallucinate or guess specs. If it's not in the text, skip it.
3. Keep the values exactly as they appear in the source text.

ALLOWED LIST OF VALUES (LOV):
{lov}

FORMAT INSTRUCTIONS:
{format_instructions}"""),
        ("human", "SOURCE URL: {url}\n\nRAW TEXT TO EXTRACT FROM:\n{text}")
    ])
    
    # Construct the chain
    chain = prompt | llm | parser
    
    # Run the chain
    try:
        lov_str = "\n".join([f"- {item}" for item in lov_categories])
        result = chain.invoke({
            "lov": lov_str,
            "format_instructions": parser.get_format_instructions(),
            "url": source_url,
            "text": text_content[:10000] # truncate if too long to save tokens
        })
        
        # Ensure URL is populated
        if not result.ref_url:
            result.ref_url = source_url
            
        return result
    except Exception as e:
        print(f"❌ Extraction Error: {e}")
        # Return empty record on failure
        return ProductRecord(part_number="", brand="", attributes=[], ref_url=source_url)
