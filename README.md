# ARIS — Advanced Research Intelligence System

ARIS is an integrated **AI Research Operating System** designed for academics, computer scientists, biomedical researchers, and engineers. Rather than functioning as a surface-level PDF chatbot, ARIS functions as a cohesive scientific workbench for literature discovery, multimodal understanding, citation-grounded RAG, topological knowledge graphs, contradiction detection, reproducibility analysis, peer review, and LaTeX manuscript drafting.

---

## Core Capabilities & The 12 V1 Modules

1. **Semantic Research Search**:
   - Queries open academic APIs concurrently: **arXiv**, **OpenAlex**, **Semantic Scholar**, and **Crossref**.
   - Normalizes schemas, removes duplicates by DOI/arXiv ID/title, and extracts open-access PDF links, venues, citations, and topics.

2. **Multimodal Paper Understanding**:
   - Ingests uploaded research PDFs.
   - Extracts structured sections (*Abstract*, *Introduction*, *Methodology*, *Experiments*, *Results*, *Limitations*, *References*), LaTeX mathematical formulas, tables, figures, claims, and limitations.

3. **Citation-Grounded RAG Pipeline**:
   - Hybrid **BM25 lexical scoring + dense semantic vector retrieval**.
   - Pre-generation attribution verification ensuring assertions cite exact source chunks `[1]`, `[2]`.
   - Clickable citation cards jumping directly to exact context chunk and page number.
   - Transparently states: `"Insufficient evidence found in the available sources."` when context is deficient.
   - Explicit taxonomy distinguishing `SOURCE FACT`, `INFERENCE`, and `HYPOTHESIS`.

4. **Research Knowledge Graph**:
   - Interactive SVG canvas with zoom, pan, and force-directed radial topologies.
   - Nodes: Papers, Methods, Datasets, Authors, Concepts, Metrics.
   - Relationships: `proposes`, `uses_method`, `contradicts`, `supports`, `evaluates`, `uses_dataset`, `extends`, `cites`.
   - Clickable node inspection drawer and incremental graph synchronization.

5. **Research Gap & Contradiction Detection**:
   - **Gap Engine**: Detects underexplored benchmarks, missing populations, and unaddressed assumptions, structured as *Evidence* (reported fact), *Inference* (logical derivation), and *Hypothesis* (unvalidated proposal).
   - **Contradiction Detector**: Identifies empirical divergence between studies (e.g. Paper A vs Paper B) and isolates root causes (random seed variance, tokenizer shifts, differing evaluation protocols).

6. **Literature Review & Citation Manager**:
   - Cross-study comparative matrix synthesizing Problem, Methodology, Datasets, Metrics, Findings, and Limitations.
   - BibTeX export (`.bib` download and clipboard copy) and APA formatting.
   - Literature collections and reading lists.

7. **Research Notebook**:
   - Notion-like Markdown laboratory notebook.
   - Note tagging and bidirectional linking to papers, claims, and experiments.
   - Context-aware AI commands: *Synthesize Findings*, *Extract Tasks*, *Summarize Notes*.

8. **Research Question & Experiment Planner**:
   - Formulates formal research problems, hypotheses ($H_1, H_2$), independent/dependent/control variables, evaluation datasets, baselines, and step-by-step protocols.

9. **Reproducibility Analyzer**:
   - Audits manuscripts against the ACM/IEEE open science criteria.
   - 0–100 Reproducibility Score with breakdown for: *Code*, *Datasets*, *Hyperparameters*, *Hardware disclosure*, *Random seed matrix*, *Evaluation metrics*, and *Dependency environments*.

10. **AI Peer Reviewer & Claim Verification**:
    - Generates constructive pre-submission reviews categorized by *Methodology*, *Evidence & Claims*, *Statistics & Baselines*, *Reproducibility*, and *Overclaiming*.
    - Severity ratings: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
    - Claim Verification workflow: validates scientific assertions against the corpus.

11. **Academic Writing & LaTeX Studio**:
    - Split-screen workspace: Referenced literature on left, editor in center, AI assistant on right.
    - Strict citation mode (*With Citations* vs *Without Citations*).
    - Dual Markdown and LaTeX output with BibTeX keys.

12. **Research Visualization & Diagram Studio**:
    - Generates Mermaid.js diagrams for RAG pipelines, system architectures, ML training workflows, and experiment protocols.
    - Live client-side rendering with SVG export and zoom/pan controls.

---

## Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide icons, Mermaid.js.
- **Backend API Layer**: Express with TypeScript running inside Vite middlewares in dev (`tsx server.ts`).
- **AI Model**: Google Gemini (`gemini-3.8-flash` via `@google/genai`).
- **Document Processing**: `pdf-parse` for text, section outline, equation, table, and chunk extraction.
- **Retrieval Engine**: Hybrid BM25 sparse + dense semantic vector ranker with reciprocal token attribution.
- **Persistence**: Project state stored in local storage and JSON export/import backup.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` if custom keys are needed:
```bash
cp .env.example .env
```
*(In AI Studio, `GEMINI_API_KEY` is injected automatically).*

### 3. Start Development Server
```bash
npm run dev
```
The server will start on port `3000`:
`http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

---

## License
MIT License. Built for open, transparent, and reproducible scientific inquiry.
