# UniHack 2026: Team Development & Execution Plan
**Project:** AI-Powered Product Intelligence for Industrial Commerce
**Team Size:** 3 Members

---

## 👥 Role Division & Responsibilities

To maximize efficiency for the hackathon, the 7-Step Architecture and the HITL Dashboard have been divided into three distinct roles. 

### 🧠 Person 1: AI & Agent Engineer (The Brains)
**Focus:** LLM Orchestration, Document Parsing, and Web Search Grounding.
*   **Step 1 (Ingestion):** Set up `LlamaParse` to extract text/tables from complex industrial PDFs. Configure Vision models for image specs.
*   **Step 4 (Web Search):** Build the exact web search scraper using Tavily or DuckDuckGo API. 
*   **Demo Reliability:** Implement the **pre-indexed cache** (local database/JSON) for manufacturer pages to ensure the live demo doesn't fail.
*   **Step 5 (Extraction):** Write the strict prompt engineering and LangChain logic to extract the 50 `ATTRIBUTE_LABEL` triples bounded by the approved List of Values (LOV).
*   **Tech:** Python, LangChain, LlamaParse, LLM APIs (GPT-4o/Claude).

### ⚙️ Person 2: Backend & Data Pipeline Engineer (The Engine)
**Focus:** API Architecture, Data Normalization, Schema Validation, and Deployment.
*   **API Gateway:** Build the `FastAPI` backend to receive files/images and orchestrate the AI pipeline.
*   **Step 2 & 3 (Classification):** Implement the Brand Fuzzy Matching logic and 3-level Category Classification routing.
*   **Step 6 & 7 (Formatting):** Write deterministic Python scripts for Unit & Fraction Normalization (e.g., `1/2 inch` -> `0.5 in`) and generate Fixed Description Templates.
*   **Validation:** Create the massive 252-column `Pydantic` schema to ensure the AI output perfectly matches the UniHack CSV format.
*   **Deployment:** Dockerize the backend and deploy to a cloud provider (e.g., Render, Railway, AWS) for the demo.
*   **Tech:** Python, FastAPI, Pydantic, Docker, Cloud Hosting.

### 🎨 Person 3: Frontend & UI/UX Engineer (The Face)
**Focus:** Human-in-the-Loop (HITL) Dashboard and User Experience.
*   **UI Foundation:** Initialize the `React` app with `TailwindCSS` for a clean, industrial, highly professional look.
*   **Dual-Pane View:** Build the core UI featuring the original PDF/Image on the left side and the editable 252-column AI output on the right.
*   **Visual Highlighting:** Implement the UI logic so that clicking an extracted attribute on the right highlights the source text/bounding box on the left PDF.
*   **API Integration:** Connect the React frontend to Person 2's FastAPI endpoints.
*   **Review Mechanics:** Add "Approve", "Edit", and "Flag" buttons for the Confidence-Based Auto-Routing system.
*   **Tech:** React (Vite/Next.js), TailwindCSS, Axios/Fetch, PDF.js (or similar for PDF rendering).

---

## 🚀 Recommended Development Phases (Hackathon Timeline)

### Phase 1: Skeleton & Setup (Hours 1-4)
*   **Person 1:** Get API keys (LLM, LlamaParse). Write a basic script that takes a PDF and prints extracted text.
*   **Person 2:** Setup FastAPI boilerplate, define the Pydantic schema, create a mock endpoint returning dummy JSON.
*   **Person 3:** Scaffold React app, create the Dual-Pane layout using dummy JSON from Person 2.

### Phase 2: Core Logic Integration (Hours 5-16)
*   **Person 1:** Finalize the Web Search Grounding and strict LOV prompt extraction.
*   **Person 2:** Build the deterministic Python scripts for Steps 2, 3, 6, and 7. Connect Person 1's LangChain code into the FastAPI routes.
*   **Person 3:** Implement PDF rendering on the frontend and connect to the live FastAPI endpoints.

### Phase 3: The "Wow" Factor (Hours 17-20)
*   **Person 1:** Build the local HTML cache for web searches (crucial for demo safety).
*   **Person 2:** Deploy the backend to the cloud. Fix CORS issues. 
*   **Person 3:** Perfect the Visual Boundary Highlighting (the killer feature for the judges) and polish Tailwind styling.

### Phase 4: Testing & Pitch Prep (Hours 21-24)
*   **All:** Stop coding new features. 
*   **All:** Run end-to-end tests on 3 specific "Hero" PDFs that you will show the judges.
*   **All:** Practice the pitch focusing on the **Business Impact** (80% time reduction) and the **Innovative Architecture** (No RAG hallucinations).
