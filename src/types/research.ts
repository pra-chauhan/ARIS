export interface Author {
  name: string;
  affiliation?: string;
}

export interface PaperChunk {
  id: string;
  paperId: string;
  paperTitle: string;
  section: string;
  subsection?: string;
  pageNumber?: number;
  chunkIndex: number;
  content: string;
  tokenCount?: number;
}

export interface AcademicPaper {
  id: string;
  title: string;
  authors: Author[];
  abstract: string;
  year: number;
  venue?: string;
  doi?: string;
  arxivId?: string;
  citationCount: number;
  pdfUrl?: string;
  paperUrl?: string;
  topics: string[];
  isOpenAccess: boolean;
  source: 'arXiv' | 'OpenAlex' | 'Crossref' | 'Semantic Scholar' | 'Uploaded';
  relevanceScore?: number;
  addedAt?: string;
  
  // Structured content when parsed or ingested
  fullText?: string;
  sections?: {
    title: string;
    content: string;
    subsections?: { title: string; content: string }[];
  }[];
  equations?: { id: string; latex: string; explanation?: string }[];
  tables?: { id: string; caption: string; data?: string }[];
  figures?: { id: string; caption: string; url?: string }[];
  claims?: {
    id: string;
    statement: string;
    section: string;
    confidence: 'High' | 'Medium' | 'Low';
    evidenceSnippet: string;
  }[];
  limitations?: string[];
  reproducibilityScore?: number;
}

export interface Citation {
  index: number;
  paperId: string;
  paperTitle: string;
  section: string;
  page?: number;
  chunkId?: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  evidenceType?: 'SOURCE FACT' | 'INFERENCE' | 'HYPOTHESIS' | 'MIXED';
  isInsufficientEvidence?: boolean;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'paper' | 'method' | 'dataset' | 'author' | 'concept' | 'metric' | 'claim';
  description?: string;
  paperId?: string;
  frequency?: number;
  color?: string;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relationship: 
    | 'proposes'
    | 'uses_method'
    | 'contradicts'
    | 'supports'
    | 'evaluates'
    | 'uses_dataset'
    | 'extends'
    | 'cites'
    | 'related_to';
  evidence?: string;
  weight?: number;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export interface ResearchGap {
  id: string;
  title: string;
  affectedArea: string;
  gapType: 'underexplored_dataset' | 'missing_benchmark' | 'methodological_flaw' | 'unexplored_combination' | 'scalability_issue' | 'reproducibility_gap';
  confidence: 'High' | 'Medium' | 'Low';
  evidence: string;
  inference: string;
  hypothesis: string;
  whyItMatters: string;
  suggestedDirection: string;
  supportingPaperIds: string[];
}

export interface Contradiction {
  id: string;
  topic: string;
  paperA: {
    paperId: string;
    paperTitle: string;
    claim: string;
    evidence: string;
  };
  paperB: {
    paperId: string;
    paperTitle: string;
    claim: string;
    evidence: string;
  };
  underlyingCauses: string[];
  explanation: string;
  resolutionHypothesis: string;
}

export interface LiteratureCollection {
  id: string;
  name: string;
  description: string;
  paperIds: string[];
  tags: string[];
  createdAt: string;
}

export interface ResearchNote {
  id: string;
  title: string;
  content: string; // Markdown
  tags: string[];
  linkedPaperIds: string[];
  linkedClaimIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExperimentPlan {
  id: string;
  researchProblem: string;
  researchQuestions: string[];
  hypotheses: string[];
  variables: {
    independent: string[];
    dependent: string[];
    control: string[];
  };
  datasets: { name: string; rationale: string; url?: string }[];
  baselines: string[];
  evaluationMetrics: string[];
  experimentSteps: string[];
  expectedOutcomes: string[];
  possibleRisks: string[];
  requiredResources: string[];
  createdAt: string;
}

export interface ReproducibilityReport {
  id: string;
  paperId: string;
  paperTitle: string;
  overallScore: number; // 0-100
  breakdown: {
    datasetAvailability: { status: 'Available' | 'Partial' | 'Missing'; score: number; details: string };
    codeAvailability: { status: 'Available' | 'Partial' | 'Missing'; score: number; details: string };
    hyperparameters: { status: 'Available' | 'Partial' | 'Missing'; score: number; details: string };
    hardwareSpecs: { status: 'Available' | 'Partial' | 'Missing'; score: number; details: string };
    randomSeeds: { status: 'Available' | 'Partial' | 'Missing'; score: number; details: string };
    evaluationProtocol: { status: 'Available' | 'Partial' | 'Missing'; score: number; details: string };
    dependencyEnv: { status: 'Available' | 'Partial' | 'Missing'; score: number; details: string };
  };
  recommendations: string[];
  createdAt: string;
}

export interface PeerReviewFinding {
  id: string;
  category: 'Methodology' | 'Evidence & Claims' | 'Statistics & Baselines' | 'Reproducibility' | 'Citations & Literature' | 'Overclaiming';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  claimOrPassage: string;
  issue: string;
  evidence: string;
  explanation: string;
  recommendation: string;
}

export interface PeerReviewReport {
  id: string;
  paperId: string;
  paperTitle: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  findings: PeerReviewFinding[];
  verdict: 'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject';
  disclaimer: string;
  createdAt: string;
}

export interface ClaimVerificationResult {
  claim: string;
  status: 'SUPPORTED' | 'PARTIALLY_SUPPORTED' | 'CONTRADICTED' | 'INSUFFICIENT_EVIDENCE';
  confidence: number; // 0-1
  evidencePassages: {
    paperTitle: string;
    section: string;
    text: string;
  }[];
  explanation: string;
}

export interface DiagramArtifact {
  id: string;
  title: string;
  type: 'architecture' | 'rag_pipeline' | 'ml_workflow' | 'experiment_protocol' | 'concept_map';
  mermaidCode: string;
  description: string;
  createdAt: string;
}

export interface WritingDraft {
  id: string;
  title: string;
  sectionType: 'abstract' | 'introduction' | 'related_work' | 'methodology' | 'experiments' | 'discussion' | 'conclusion';
  format: 'markdown' | 'latex';
  content: string;
  citedPaperIds: string[];
  bibtex: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchProject {
  id: string;
  name: string;
  description: string;
  targetDomain: string;
  createdAt: string;
  updatedAt: string;
  papers: AcademicPaper[];
  chunks: PaperChunk[];
  collections: LiteratureCollection[];
  notes: ResearchNote[];
  knowledgeGraph: KnowledgeGraphData;
  gaps: ResearchGap[];
  contradictions: Contradiction[];
  experiments: ExperimentPlan[];
  reproducibilityReports: ReproducibilityReport[];
  peerReviews: PeerReviewReport[];
  writingDrafts: WritingDraft[];
  diagrams: DiagramArtifact[];
  chatHistory: ChatMessage[];
}
