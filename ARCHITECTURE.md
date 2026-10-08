# ARIS Architecture & Technical Specification

## 1. System Overview

ARIS follows a modern full-stack modular architecture designed for low-latency scientific exploration and zero citation hallucination:

```
[ Researcher Web Client ]
       │
       ▼
[ Express API Proxy & Controller (server.ts) ]
  ├── /api/search (arXiv, OpenAlex, Semantic Scholar, Crossref)
  ├── /api/papers/parse-pdf (pdf-parse & section segmentation)
  ├── /api/rag/query (BM25 + Dense Hybrid Scoring & Citation Validator)
  ├── /api/research/gaps (Evidence-Inference-Hypothesis Analyzer)
  ├── /api/research/contradictions (Empirical Divergence Audit)
  ├── /api/research/knowledge-graph (Relational Extraction)
  ├── /api/research/reproducibility (ACM/IEEE Checklist Audit)
  ├── /api/research/peer-review & verify-claim
  ├── /api/research/experiment-plan
  ├── /api/research/diagram (Mermaid Generator)
  └── /api/writing/generate (LaTeX & Markdown with BibTeX)
       │
       ├──► [@google/genai (Gemini 3.8 Flash)]
       └──► [Vite SPA Frontend Pipeline]
```

---

## 2. RAG & Citation Grounding Mechanism

1. **Document Ingestion & Chunking**:
   - PDF manuscripts are parsed using `pdf-parse`.
   - Structural headers (*Introduction*, *Methodology*, *Results*, etc.) delimit logical sections.
   - Chunks are generated with 1,200 character sliding windows with 200 character overlaps.
   - Metadata is attached to every chunk: `paperId`, `paperTitle`, `section`, `pageNumber`, `chunkIndex`, `tokenCount`.

2. **Hybrid Retrieval**:
   - Candidate generation uses BM25 token frequencies calculated over the local project corpus:
     $$\text{Score}_{BM25}(q, d) = \sum_{t \in q} \text{IDF}(t) \cdot \frac{\text{TF}(t, d) \cdot (k_1 + 1)}{\text{TF}(t, d) + k_1 \cdot (1 - b + b \cdot \frac{|d|}{\text{avgdoclen}})}$$
   - Matches against section headers and paper titles are boosted to prioritize methodological sections.

3. **Citation Attribution Gate**:
   - The LLM prompt strictly requires citation indices `[1]`, `[2]` corresponding only to retrieved chunks.
   - The backend validates all generated brackets against retrieved candidate identifiers.
   - If retrieval confidence falls below threshold $\tau$, the system returns:
     `"Insufficient evidence found in the available sources."`

---

## 3. Data Integrity & Scientific Taxonomy

Every AI response classifies insights into three strict epistemological tiers:
- **SOURCE FACT**: Directly supported by text in retrieved literature.
- **INFERENCE**: Logical deductions derived from experimental numbers.
- **HYPOTHESIS**: Unverified proposals, explicitly flagged as open research conjectures.

---

## 4. Portability & Deployment

- Runs fully self-contained on port `3000`.
- Zero local database installation required; full state persistence with JSON export/import.
- Build command: `npm run build`
- Dev server command: `npm run dev`
