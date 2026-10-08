import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';

import { unifiedAcademicSearch } from './server/academicSearch';
import { processPdfBuffer } from './server/pdfProcessor';
import { executeRagQuery } from './server/ragEngine';
import {
  detectResearchGaps,
  detectContradictions,
  buildKnowledgeGraph,
  analyzeReproducibility,
  generatePeerReview,
  verifyClaimAgainstCorpus,
  generateExperimentPlan,
  generateResearchDiagram
} from './server/researchAnalytics';
import { generateAcademicText } from './server/aiService';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Increase payload limit to support PDF uploads up to 50MB
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Route: Health & Status
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      system: 'ARIS — Advanced Research Intelligence System',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      hasGeminiApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    });
  });

  // API Route: Semantic Research Search (arXiv, OpenAlex, Semantic Scholar, Crossref)
  app.post('/api/search', async (req, res) => {
    try {
      const { query, limit = 12 } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query parameter is required' });
      }
      const papers = await unifiedAcademicSearch(query, limit);
      res.json({ success: true, count: papers.length, papers });
    } catch (err) {
      console.error('Search API error:', err);
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // API Route: PDF Parsing & Multimodal Ingestion
  app.post('/api/papers/parse-pdf', async (req, res) => {
    try {
      const { base64Pdf, fileName = 'paper.pdf' } = req.body;
      if (!base64Pdf) {
        return res.status(400).json({ error: 'base64Pdf is required' });
      }

      // Strip potential data URL prefix
      const base64Data = base64Pdf.replace(/^data:application\/pdf;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const result = await processPdfBuffer(buffer, fileName);
      res.json({ success: true, paper: result.paper, chunksCount: result.chunks.length, chunks: result.chunks });
    } catch (err) {
      console.error('PDF parsing error:', err);
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // API Route: Citation-Grounded RAG Query
  app.post('/api/rag/query', async (req, res) => {
    try {
      const { query, chunks, filterPaperIds, maxChunks } = req.body;
      if (!query || !Array.isArray(chunks)) {
        return res.status(400).json({ error: 'query and chunks array are required' });
      }

      const response = await executeRagQuery({
        query,
        chunks,
        filterPaperIds,
        maxChunks
      });

      res.json({ success: true, ...response });
    } catch (err) {
      console.error('RAG query error:', err);
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // API Route: Research Gap Detection
  app.post('/api/research/gaps', async (req, res) => {
    try {
      const { papers } = req.body;
      if (!Array.isArray(papers)) {
        return res.status(400).json({ error: 'papers array is required' });
      }
      const gaps = await detectResearchGaps(papers);
      res.json({ success: true, count: gaps.length, gaps });
    } catch (err) {
      console.error('Gap detection error:', err);
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // API Route: Contradiction Detection
  app.post('/api/research/contradictions', async (req, res) => {
    try {
      const { papers } = req.body;
      if (!Array.isArray(papers)) {
        return res.status(400).json({ error: 'papers array is required' });
      }
      const contradictions = await detectContradictions(papers);
      res.json({ success: true, count: contradictions.length, contradictions });
    } catch (err) {
      console.error('Contradiction detection error:', err);
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // API Route: Knowledge Graph Generation
  app.post('/api/research/knowledge-graph', async (req, res) => {
    try {
      const { papers } = req.body;
      if (!Array.isArray(papers)) {
        return res.status(400).json({ error: 'papers array is required' });
      }
      const graph = await buildKnowledgeGraph(papers);
      res.json({ success: true, graph });
    } catch (err) {
      console.error('Knowledge graph error:', err);
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // API Route: Reproducibility Analysis
  app.post('/api/research/reproducibility', async (req, res) => {
    try {
      const { paper } = req.body;
      if (!paper) {
        return res.status(400).json({ error: 'paper object is required' });
      }
      const report = analyzeReproducibility(paper);
      res.json({ success: true, report });
    } catch (err) {
      console.error('Reproducibility analysis error:', err);
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // API Route: AI Peer Review
  app.post('/api/research/peer-review', async (req, res) => {
    try {
      const { paper } = req.body;
      if (!paper) {
        return res.status(400).json({ error: 'paper object is required' });
      }
      const report = await generatePeerReview(paper);
      res.json({ success: true, report });
    } catch (err) {
      console.error('Peer review error:', err);
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // API Route: Claim Verification
  app.post('/api/research/verify-claim', (req, res) => {
    try {
      const { claim, papers } = req.body;
      if (!claim || !Array.isArray(papers)) {
        return res.status(400).json({ error: 'claim and papers array are required' });
      }
      const result = verifyClaimAgainstCorpus(claim, papers);
      res.json({ success: true, result });
    } catch (err) {
      console.error('Claim verification error:', err);
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // API Route: Experiment Planner
  app.post('/api/research/experiment-plan', async (req, res) => {
    try {
      const { problemStatement, papers = [] } = req.body;
      if (!problemStatement) {
        return res.status(400).json({ error: 'problemStatement is required' });
      }
      const plan = await generateExperimentPlan(problemStatement, papers);
      res.json({ success: true, plan });
    } catch (err) {
      console.error('Experiment planner error:', err);
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // API Route: Mermaid Diagram Generator
  app.post('/api/research/diagram', async (req, res) => {
    try {
      const { prompt, type = 'rag_pipeline' } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'prompt is required' });
      }
      const diagram = await generateResearchDiagram(prompt, type);
      res.json({ success: true, diagram });
    } catch (err) {
      console.error('Diagram generator error:', err);
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // API Route: Academic Writing & LaTeX Assistant
  app.post('/api/writing/generate', async (req, res) => {
    try {
      const { sectionType, topic, papers = [], withCitations = true, format = 'markdown' } = req.body;

      const contextPapers = papers.map((p: any, idx: number) => 
        `[Ref ${idx + 1}] Title: "${p.title}", Authors: ${p.authors.map((a: any) => a.name).join(', ')}, Year: ${p.year}\nKey finding: ${p.abstract}`
      ).join('\n\n');

      const systemPrompt = `You are ARIS Academic Writing Assistant.
You write publication-ready scientific text for the "${sectionType}" section.
${withCitations 
  ? 'STRICT CITATION RULE: You MUST cite available papers using citations like [1] or \\cite{paper_id}. Do NOT invent citations.' 
  : 'Write without explicit citations.'}
Format in ${format === 'latex' ? 'LaTeX code' : 'clean academic Markdown'}.`;

      const userPrompt = `Topic / Research Objective: "${topic}"\n\nReferenced Literature:\n${contextPapers}\n\nPlease generate a rigorous academic draft for the ${sectionType} section.`;

      const draftContent = await generateAcademicText(userPrompt, systemPrompt);

      // Generate BibTeX for referenced papers
      const bibtexEntries = papers.map((p: any, idx: number) => {
        const firstAuthorLast = (p.authors[0]?.name || 'Author').split(' ').pop()?.toLowerCase() || 'ref';
        const key = `${firstAuthorLast}${p.year || 2024}`;
        return `@article{${key},\n  title={${p.title}},\n  author={${p.authors.map((a: any) => a.name).join(' and ')}},\n  year={${p.year || 2024}},\n  journal={${p.venue || 'arXiv preprint'}}\n}`;
      }).join('\n\n');

      res.json({
        success: true,
        content: draftContent,
        bibtex: bibtexEntries,
        format
      });
    } catch (err) {
      console.error('Writing generation error:', err);
      res.status(500).json({ success: false, error: (err as Error).message });
    }
  });

  // Connect Vite in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ARIS Full-Stack Platform active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start ARIS server:', err);
  process.exit(1);
});
