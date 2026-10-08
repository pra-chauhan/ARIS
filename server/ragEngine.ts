import type { PaperChunk, Citation } from '../src/types/research';
import { generateAcademicText } from './aiService';

export interface RagQueryOptions {
  query: string;
  chunks: PaperChunk[];
  filterPaperIds?: string[];
  maxChunks?: number;
}

export interface RagResponse {
  answer: string;
  citations: Citation[];
  evidenceType: 'SOURCE FACT' | 'INFERENCE' | 'HYPOTHESIS' | 'MIXED';
  isInsufficientEvidence: boolean;
  retrievedChunks: { chunk: PaperChunk; score: number }[];
}

// Tokenize and clean text
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

// BM25 + Keyword Hybrid Scoring
export function scoreChunk(chunk: PaperChunk, queryTokens: string[], avgDocLen: number, idfMap: Map<string, number>): number {
  const chunkTokens = tokenize(chunk.content + ' ' + chunk.section + ' ' + chunk.paperTitle);
  const docLen = chunkTokens.length;
  
  if (docLen === 0) return 0;

  const k1 = 1.5;
  const b = 0.75;
  
  // Count term frequencies
  const tfMap = new Map<string, number>();
  for (const token of chunkTokens) {
    tfMap.set(token, (tfMap.get(token) || 0) + 1);
  }

  let bm25Score = 0;
  let exactMatchCount = 0;

  for (const qToken of queryTokens) {
    const tf = tfMap.get(qToken) || 0;
    if (tf > 0) {
      exactMatchCount++;
      const idf = idfMap.get(qToken) || 1.0;
      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + b * (docLen / avgDocLen));
      bm25Score += idf * (numerator / denominator);
    }
  }

  // Boost if query matches section header or paper title
  const titleTokens = tokenize(chunk.paperTitle);
  const sectionTokens = tokenize(chunk.section);
  for (const qToken of queryTokens) {
    if (titleTokens.includes(qToken)) bm25Score += 2.0;
    if (sectionTokens.includes(qToken)) bm25Score += 1.5;
  }

  // Jaccard token overlap bonus
  const overlapRatio = exactMatchCount / Math.max(1, queryTokens.length);
  return bm25Score * (1 + overlapRatio);
}

// Execute Hybrid Retrieval & RAG
export async function executeRagQuery(options: RagQueryOptions): Promise<RagResponse> {
  const { query, chunks, filterPaperIds, maxChunks = 5 } = options;

  let candidateChunks = chunks;
  if (filterPaperIds && filterPaperIds.length > 0) {
    const allowed = new Set(filterPaperIds);
    candidateChunks = chunks.filter(c => allowed.has(c.paperId));
  }

  if (candidateChunks.length === 0) {
    return {
      answer: "Insufficient evidence found in the available sources. No papers or passages match the current scope.",
      citations: [],
      evidenceType: 'SOURCE FACT',
      isInsufficientEvidence: true,
      retrievedChunks: []
    };
  }

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return {
      answer: "Please provide a more specific research query.",
      citations: [],
      evidenceType: 'SOURCE FACT',
      isInsufficientEvidence: false,
      retrievedChunks: []
    };
  }

  // Calculate Corpus Statistics for BM25
  const totalDocs = candidateChunks.length;
  let totalTokens = 0;
  const dfMap = new Map<string, number>();

  for (const chunk of candidateChunks) {
    const tokens = new Set(tokenize(chunk.content + ' ' + chunk.section + ' ' + chunk.paperTitle));
    totalTokens += tokens.size;
    for (const t of tokens) {
      dfMap.set(t, (dfMap.get(t) || 0) + 1);
    }
  }

  const avgDocLen = Math.max(1, totalTokens / totalDocs);
  const idfMap = new Map<string, number>();
  for (const [t, df] of dfMap.entries()) {
    idfMap.set(t, Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5)));
  }

  // Score candidate chunks
  const scored = candidateChunks.map(chunk => ({
    chunk,
    score: scoreChunk(chunk, queryTokens, avgDocLen, idfMap)
  }));

  // Sort by score
  scored.sort((a, b) => b.score - a.score);

  // Top candidates
  const topCandidates = scored.filter(s => s.score > 0.1).slice(0, maxChunks);

  // Check if we have sufficient retrieval relevance
  if (topCandidates.length === 0 || topCandidates[0].score < 0.2) {
    return {
      answer: "Insufficient evidence found in the available sources. None of the indexed papers contain direct evidence regarding this specific query.",
      citations: [],
      evidenceType: 'SOURCE FACT',
      isInsufficientEvidence: true,
      retrievedChunks: []
    };
  }

  // Format context for LLM with explicit grounding contracts
  const contextPassages = topCandidates.map((item, idx) => {
    const c = item.chunk;
    return `[Chunk ${idx + 1}] Paper: "${c.paperTitle}", Section: "${c.section}", Page: ${c.pageNumber || 1}: ${c.content}`;
  }).join('\n\n');

  const systemPrompt = `You are ARIS, an elite Academic Research Intelligence System and RAG citation validator.
RULES:
1. Every factual assertion MUST be grounded strictly in the provided [Chunk X] passages.
2. In your text, cite sources using explicit bracketed numbers like [1], [2], corresponding to [Chunk 1], [Chunk 2].
3. For each citation, specify the paper title and section.
4. Internally and explicitly differentiate:
   - **SOURCE FACT**: Directly stated in the retrieved chunk.
   - **INFERENCE**: Logical derivation from the reported findings.
   - **HYPOTHESIS**: Suggested open question or speculation.
5. If the retrieved chunks do not contain enough facts to answer accurately, explicitly output: "Insufficient evidence found in the available sources."
6. NEVER fabricate author names, page numbers, benchmark scores, or citations.`;

  const userPrompt = `Research Question: "${query}"

Available Context Chunks:
${contextPassages}

Please provide a rigorous, factual, citation-grounded response answering the research question based on the provided context. Include inline [1], [2] citations and a synthesis distinguishing Source Facts from Inferences.`;

  const rawAnswer = await generateAcademicText(userPrompt, systemPrompt);

  // Extract citations and verify them against retrieved chunks
  const citations: Citation[] = [];
  const citationRefRegex = /\[(\d+)\]/g;
  const foundIndices = new Set<number>();
  let match;
  while ((match = citationRefRegex.exec(rawAnswer)) !== null) {
    const idx = parseInt(match[1], 10);
    if (idx >= 1 && idx <= topCandidates.length) {
      foundIndices.add(idx);
    }
  }

  // Build verified citation list
  Array.from(foundIndices).sort((a, b) => a - b).forEach(idx => {
    const candidate = topCandidates[idx - 1];
    if (candidate) {
      const c = candidate.chunk;
      citations.push({
        index: idx,
        paperId: c.paperId,
        paperTitle: c.paperTitle,
        section: c.section,
        page: c.pageNumber,
        chunkId: c.id,
        snippet: c.content.substring(0, 240) + '...'
      });
    }
  });

  const isInsufficient = rawAnswer.includes("Insufficient evidence found");

  return {
    answer: rawAnswer,
    citations,
    evidenceType: 'MIXED',
    isInsufficientEvidence: isInsufficient,
    retrievedChunks: topCandidates
  };
}
