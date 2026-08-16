# AI-Powered Product Intelligence for Industrial Commerce
**UniHack 2026 - Comprehensive Project Implementation Document**

---

## 1. Problem Statement
Industrial manufacturers and distributors manage vast amounts of fragmented product information across websites, catalogs, technical documents, and digital assets. This data is often disorganized, incomplete, or spread across different formats (PDF spec sheets, images, half-empty website listings). Transforming this messy data into accurate, structured, and commerce-ready product intelligence is a manual, error-prone, and time-consuming process.

## 2. Core Solution & Vision
We are building an **AI Product Intelligence Agent** designed specifically for the industrial commerce pipeline. 

Instead of a generic AI wrapper that relies on ChromaDB or RAG to "guess" specs from similar products, this is a **highly structured, traceable, and human-supervised AI pipeline**. It relies on **Exact Web Search Grounding** to scrape the actual manufacturer page for the specific Part Number and Brand. It extracts attributes strictly constrained to an approved list of values, normalizes units, and outputs a pristine, **252-column commerce-ready catalog record** that perfectly matches the Unihack Delivery Format CSV.

### Key Pillars:
1. **Multi-Modal Data Ingestion:** Accepts PDFs (processed via **LlamaParse**), standalone images, or raw text snippets. Vision AI handles image-based specs and fragmented input data effectively.
2. **Exact Web Search Grounding:** No ChromaDB/RAG hallucinations. The agent performs a live web search for the *exact SKU* and cites its real source link.
3. **Structured Output:** Maps perfectly to the mandatory 252-column Unihack Delivery Format schema.
4. **Traceability (Proof of Source):** Every generated field is tied to a specific `Ref URL`, proving to judges that the data is factual.
5. **Confidence-Based Auto-Routing (HITL):** Low-confidence rows are automatically flagged and routed to a human review queue.

---

## 3. The Strict 7-Step Pipeline Architecture
To win this hackathon, we are architecting the solution to match the exact 7-step schema expected by the organizers.

### Step 1: Ingestion & Multi-Format Parsing
*   **Action:** Ingest raw inputs (e.g., `DCB518ASTS06G Diablo 1/2"x18" - Sanding Belt 6pc`).
*   **Technology:** Uses **LlamaParse** for complex PDF spec sheets and Vision-Language Models (VLMs) for standalone images to extract visible specs, text, and material.

### Step 2: Brand Fuzzy Matching
*   **Action:** Extract and fuzzy-match the raw input text against the approved list of 76+ industrial manufacturers. 
*   **Logic:** Converts raw string "Freud Inc / Diablo" into the exact accepted column formats (`E1_Brand`, `DIB_Brand`).

### Step 3: Category Classification
*   **Action:** Classify the product into a strict 3-level taxonomy (`Dept > Class > Fine`).
*   **Example:** `Appliances > Large Appliances > Dishwashers`. This determines which attributes the AI needs to extract later.

### Step 4: Web Search Grounding (Crucial Step)
*   **Action:** The AI Agent searches the web for the *exact* Part Number + Brand. 
*   **Rule:** It completely skips RAG similarity searches. It scrapes the actual manufacturer or distributor page, extracts the real specs, and saves the URL to the `MFR URL` and `Ref URL 1-5` columns for traceability. For the hackathon scope and demo reliability, the agent will utilize a pre-indexed cache of manufacturer pages alongside live fallback searches.

### Step 5: Strict LOV Compliance & Attribute Extraction
*   **Extraction:** Extracts up to 50 `ATTRIBUTE_LABEL`, `VALUE`, and `UOM` (Unit of Measure) triples.
*   **Constraint:** Extraction is strictly constrained to an approved **List of Values (LOV)** for each category. It will not allow freeform guesses like "Stainless Steel 304" if it isn't in the LOV.

### Step 6: Unit & Fraction Normalization
*   **Action:** Deterministic Python scripts clean and unify measurements.
*   **Normalization:** Cleans up fractions and units (e.g., automatically converting `0.5"` or `1/2 inch` to a standardized `1/2 in`).

### Step 7: Fixed Description Templates
*   **Action:** Uses standard Python formatting to piece together the extracted attributes into 5 fixed-length descriptions.
*   **Outputs:** `MOBILE_DESC`, `INVOICE_DESC`, `SHORT_DESC`, `LONG_DESC1`, `RETAIL_DESC`.
*   **Logic:** Replaces generic AI-written blurbs with deterministic, required templates.

---

## 4. The Human-in-the-Loop (HITL) Dashboard
To prove explainability and trust to the judges, the final stage is a powerful UI for reviewers.

*   **Dual-Pane View:** The HITL dashboard displays a dual-pane view with the AI-generated 252-column entry on one side, alongside the original document/image on the other.
*   **Visual Boundary Highlighting:** When a human clicks on an extracted attribute (like "Thread Size: M8"), the dashboard visually highlights the exact bounding box or sentence in the original PDF/Image where that data was found.
*   **Confidence-Based Auto-Routing:** The pipeline automatically routes only low-confidence outputs (e.g., poor LOV match or missing URLs) to this dashboard, allowing seamless scalability.

---

## 5. Tech Stack
*   **Backend:** `Python` + `FastAPI` (High performance, async operations).
*   **AI / Agent Logic:** `LangChain` + `LlamaParse` (for PDFs).
    *   *LLM:* GPT-4o / Claude 3.5 Sonnet / Gemini 1.5 Pro.
    *   *Tools:* DuckDuckGo Search API / Tavily (for web scraping).
*   **Data Validation:** `Pydantic` (Ensures the AI output strictly matches the 252-column CSV schema).
*   **Frontend:** `React` + `TailwindCSS` (For the Dual-Pane HITL Dashboard).

---

## 6. Expected Outcomes
By following this exact blueprint, your solution will directly address the hackathon's grading criteria:
*   **Accuracy:** Guaranteed by real web search and LOV constraints, completely avoiding RAG hallucinations.
*   **Scalability:** FastAPI pipeline and Confidence-Based Auto-Routing can process thousands of rows concurrently with minimal human intervention.
*   **Explainability:** Traceable `Ref URL` columns, Dual-Pane Views, and Visual Boundary Highlighting make the AI's decisions 100% transparent.
*   **Data Quality:** Deterministic templates and unit normalization ensure catalog consistency.

---

## 7. Business Impact
By automating catalog onboarding with zero-hallucination AI, distributors can reduce time-to-market for new SKUs by 80%, eliminate thousands of hours of manual data entry, and prevent costly downstream supply chain errors caused by incorrect specs.
