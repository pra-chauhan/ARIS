import type {
  AcademicPaper,
  PaperChunk,
  ResearchGap,
  Contradiction,
  KnowledgeGraphData,
  ReproducibilityReport,
  PeerReviewReport,
  ExperimentPlan,
  ClaimVerificationResult,
  DiagramArtifact,
  ResearchProject
} from '../types/research';
import { INITIAL_PROJECT } from '../data/seedData';

const STORAGE_KEY = 'aris_research_projects_v1';
const ACTIVE_PROJ_KEY = 'aris_active_project_id_v1';

export class ApiClient {
  static async checkHealth(): Promise<{ status: string; hasGeminiApiKey: boolean }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'healthy', hasGeminiApiKey: false };
    }
  }

  static async searchPapers(query: string, limit = 12): Promise<AcademicPaper[]> {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit })
    });
    if (!res.ok) throw new Error('Academic search failed');
    const data = await res.json();
    return data.papers || [];
  }

  static async parsePdf(base64Pdf: string, fileName: string): Promise<{ paper: AcademicPaper; chunks: PaperChunk[] }> {
    const res = await fetch('/api/papers/parse-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Pdf, fileName })
    });
    if (!res.ok) throw new Error('PDF parsing failed');
    const data = await res.json();
    return { paper: data.paper, chunks: data.chunks };
  }

  static async queryRag(
    query: string,
    chunks: PaperChunk[],
    filterPaperIds?: string[],
    maxChunks = 5
  ) {
    const res = await fetch('/api/rag/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, chunks, filterPaperIds, maxChunks })
    });
    if (!res.ok) throw new Error('RAG query failed');
    return await res.json();
  }

  static async detectGaps(papers: AcademicPaper[]): Promise<ResearchGap[]> {
    const res = await fetch('/api/research/gaps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ papers })
    });
    if (!res.ok) throw new Error('Gap detection failed');
    const data = await res.json();
    return data.gaps || [];
  }

  static async detectContradictions(papers: AcademicPaper[]): Promise<Contradiction[]> {
    const res = await fetch('/api/research/contradictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ papers })
    });
    if (!res.ok) throw new Error('Contradiction detection failed');
    const data = await res.json();
    return data.contradictions || [];
  }

  static async buildKnowledgeGraph(papers: AcademicPaper[]): Promise<KnowledgeGraphData> {
    const res = await fetch('/api/research/knowledge-graph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ papers })
    });
    if (!res.ok) throw new Error('Knowledge graph build failed');
    const data = await res.json();
    return data.graph || { nodes: [], edges: [] };
  }

  static async analyzeReproducibility(paper: AcademicPaper): Promise<ReproducibilityReport> {
    const res = await fetch('/api/research/reproducibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paper })
    });
    if (!res.ok) throw new Error('Reproducibility analysis failed');
    const data = await res.json();
    return data.report;
  }

  static async generatePeerReview(paper: AcademicPaper): Promise<PeerReviewReport> {
    const res = await fetch('/api/research/peer-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paper })
    });
    if (!res.ok) throw new Error('Peer review generation failed');
    const data = await res.json();
    return data.report;
  }

  static async verifyClaim(claim: string, papers: AcademicPaper[]): Promise<ClaimVerificationResult> {
    const res = await fetch('/api/research/verify-claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claim, papers })
    });
    if (!res.ok) throw new Error('Claim verification failed');
    const data = await res.json();
    return data.result;
  }

  static async generateExperimentPlan(problemStatement: string, papers: AcademicPaper[] = []): Promise<ExperimentPlan> {
    const res = await fetch('/api/research/experiment-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemStatement, papers })
    });
    if (!res.ok) throw new Error('Experiment plan generation failed');
    const data = await res.json();
    return data.plan;
  }

  static async generateDiagram(prompt: string, type: DiagramArtifact['type']): Promise<DiagramArtifact> {
    const res = await fetch('/api/research/diagram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, type })
    });
    if (!res.ok) throw new Error('Diagram generation failed');
    const data = await res.json();
    return data.diagram;
  }

  static async generateWritingDraft(params: {
    sectionType: string;
    topic: string;
    papers: AcademicPaper[];
    withCitations: boolean;
    format: 'markdown' | 'latex';
  }): Promise<{ content: string; bibtex: string }> {
    const res = await fetch('/api/writing/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Writing draft generation failed');
    return await res.json();
  }

  // Workspace Local Persistence
  static getProjects(): ResearchProject[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to read stored projects from localStorage:', e);
    }
    return [INITIAL_PROJECT];
  }

  static saveProjects(projects: ResearchProject[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.warn('Failed to save projects to localStorage:', e);
    }
  }

  static getActiveProjectId(): string {
    return localStorage.getItem(ACTIVE_PROJ_KEY) || INITIAL_PROJECT.id;
  }

  static setActiveProjectId(id: string): void {
    localStorage.setItem(ACTIVE_PROJ_KEY, id);
  }
}
