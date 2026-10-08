import type { ResearchProject, AcademicPaper, PaperChunk } from '../types/research';

export const SEED_PAPERS: AcademicPaper[] = [
  {
    id: 'paper_acl_2024_01',
    title: 'Retrieval-Augmented Generation with Source-Attributed Verification for Scientific Literature',
    authors: [
      { name: 'Dr. Elena Rostova', affiliation: 'Stanford AI Lab' },
      { name: 'Dr. David K. Chen', affiliation: 'MIT CSAIL' },
      { name: 'Sophia Alvarez', affiliation: 'Oxford Institute for Science' }
    ],
    abstract: 'Large language models frequently generate confident yet non-factual citations when synthesizing scientific literature. We propose a hybrid dense-sparse retrieval architecture with deterministic token attribution that verifies citation alignment before generation. Across 12,000 biomedical and computer science benchmarks, our method improves factual precision by 34.2% while reducing hallucinated citations to under 0.8%.',
    year: 2024,
    venue: 'ACL 2024 (Annual Meeting of the Association for Computational Linguistics)',
    doi: '10.1145/3637528.3671982',
    arxivId: '2403.09871',
    citationCount: 142,
    paperUrl: 'https://arxiv.org/abs/2403.09871',
    pdfUrl: 'https://arxiv.org/pdf/2403.09871.pdf',
    topics: ['Retrieval-Augmented Generation', 'Fact-Checking', 'Scientific NLP', 'Hallucination Mitigation'],
    isOpenAccess: true,
    source: 'arXiv',
    relevanceScore: 0.98,
    fullText: `Retrieval-Augmented Generation with Source-Attributed Verification for Scientific Literature
Elena Rostova, David K. Chen, Sophia Alvarez

1. Introduction
Modern scientific discovery increasingly relies on automated synthesis of vast scholarly publications. However, contemporary large language models exhibit alarming rates of citation hallucination—inventing plausible bibliographic entries and asserting ungrounded empirical claims. In this paper, we formulate deterministic source attribution as a constraint on decoding.

2. Related Work
Standard retrieval architectures rely solely on vector proximity (Karpukhin et al., 2020). Dense representations often blur granular numerical tokens and specific scientific nomenclature, leading to false-positive retrieval.

3. Methodology & Architecture
Our framework introduces Reciprocal Token Verification (RTV). Given a research query q, candidate passages P are ranked via hybrid BM25 and dense bi-encoder scoring:
Score(q, d) = alpha * BM25(q, d) + (1 - alpha) * Cosine(E(q), E(d))
Before generation, an attribution matrix M verifies that every asserted claim corresponds to an exact substring in the retrieved chunk with confidence tau > 0.85.

4. Experiments & Evaluation
We evaluate across SciFact, PubMedQA, and ArxivQA. Baselines include vanilla GPT-4, standard Dense RAG (BGE-large), and BM25-only retrieval.

5. Results & Discussion
Our proposed RTV framework achieves 91.4% Citation Precision@1, outperforming dense RAG (68.2%) by 23.2 percentage points. Hallucinated citations drop from 14.8% to 0.78%. In ablation studies, removing sparse lexical tokens causes a 12% drop in precision on biochemical terms.

6. Limitations & Threats to Validity
Our evaluation is restricted to English-language publications. Computational latency increases by 38ms during the attribution verification pass. Scaling to multi-hop cross-paper synthesis requires future investigation.

7. References
[1] Lewis et al., Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, NeurIPS 2020.
[2] Thorne et al., FEVER: a large-scale dataset for Fact Extraction and VERification, NAACL 2018.`,
    sections: [
      {
        title: 'Introduction',
        content: 'Modern scientific discovery increasingly relies on automated synthesis of vast scholarly publications. However, contemporary large language models exhibit alarming rates of citation hallucination—inventing plausible bibliographic entries and asserting ungrounded empirical claims. In this paper, we formulate deterministic source attribution as a constraint on decoding.'
      },
      {
        title: 'Methodology & Architecture',
        content: 'Our framework introduces Reciprocal Token Verification (RTV). Given a research query q, candidate passages P are ranked via hybrid BM25 and dense bi-encoder scoring:\nScore(q, d) = alpha * BM25(q, d) + (1 - alpha) * Cosine(E(q), E(d))\nBefore generation, an attribution matrix M verifies that every asserted claim corresponds to an exact substring in the retrieved chunk with confidence tau > 0.85.'
      },
      {
        title: 'Experiments & Results',
        content: 'Our proposed RTV framework achieves 91.4% Citation Precision@1, outperforming dense RAG (68.2%) by 23.2 percentage points. Hallucinated citations drop from 14.8% to 0.78%. In ablation studies, removing sparse lexical tokens causes a 12% drop in precision on biochemical terms.'
      },
      {
        title: 'Limitations',
        content: 'Our evaluation is restricted to English-language publications. Computational latency increases by 38ms during the attribution verification pass. Scaling to multi-hop cross-paper synthesis requires future investigation.'
      }
    ],
    equations: [
      {
        id: 'eq_1',
        latex: '\\text{Score}(q, d) = \\alpha \\cdot \\text{BM25}(q, d) + (1 - \\alpha) \\cdot \\cos(\\mathbf{E}_q, \\mathbf{E}_d)',
        explanation: 'Hybrid scoring function combining sparse lexical BM25 matching with dense neural embedding cosine similarity.'
      },
      {
        id: 'eq_2',
        latex: '\\mathcal{A}(c, p) = \\max_{s \\in \\text{sentences}(p)} \\sigma(\\mathbf{W} [\\mathbf{h}_c ; \\mathbf{h}_s]) \\ge \\tau',
        explanation: 'Attribution confidence gate checking if candidate claim c is verified by sentence s in passage p.'
      }
    ],
    tables: [
      {
        id: 'tab_1',
        caption: 'Table 1: Citation Precision & Hallucination Rate across Scientific Benchmarks',
        data: 'Method | SciFact P@1 | PubMedQA P@1 | Hallucination %\nVanilla LLM | 54.2% | 48.6% | 22.4%\nDense RAG | 68.2% | 65.4% | 14.8%\nProposed RTV (Ours) | 91.4% | 89.1% | 0.78%'
      }
    ],
    figures: [
      {
        id: 'fig_1',
        caption: 'Figure 1: Overall architectural pipeline showing pre-generation token attribution and citation gating.'
      }
    ],
    claims: [
      {
        id: 'claim_1',
        statement: 'Deterministic token attribution reduces hallucinated citations to under 0.8% in scientific question answering.',
        section: 'Results & Discussion',
        confidence: 'High',
        evidenceSnippet: 'Hallucinated citations drop from 14.8% to 0.78% across 12,000 benchmark queries.'
      },
      {
        id: 'claim_2',
        statement: 'Sparse lexical BM25 indexing is necessary to prevent a 12% accuracy drop on biochemical terminology.',
        section: 'Methodology & Ablations',
        confidence: 'High',
        evidenceSnippet: 'In ablation studies, removing sparse lexical tokens causes a 12% drop in precision on biochemical terms.'
      }
    ],
    limitations: [
      'Evaluated strictly on English-language scientific manuscripts',
      '38ms latency overhead during attribution verification pass',
      'Requires document text with clean section segmentation'
    ],
    reproducibilityScore: 84
  },
  {
    id: 'paper_neurips_2024_02',
    title: 'Benchmarking Contradiction Detection Across Multi-Study Machine Learning Experiments',
    authors: [
      { name: 'Marcus Vance', affiliation: 'Oxford Robotics' },
      { name: 'Sophia Li', affiliation: 'Berkeley AI Research' },
      { name: 'Klaus Neumann', affiliation: 'TUM Munich' }
    ],
    abstract: 'Empirical machine learning papers often report conflicting performance outcomes when evaluating similar architectures. We analyze 450 published papers on vision transformers and identify three root causes for empirical contradictions: undisclosed random seed variances, subtle differences in token pruning thresholds, and data preprocessing shifts. We establish the CrossEval benchmark for automated contradiction detection.',
    year: 2024,
    venue: 'NeurIPS 2024 (Advances in Neural Information Processing Systems)',
    doi: '10.5555/3618408.3619914',
    arxivId: '2401.14582',
    citationCount: 89,
    paperUrl: 'https://arxiv.org/abs/2401.14582',
    pdfUrl: 'https://arxiv.org/pdf/2401.14582.pdf',
    topics: ['Contradiction Detection', 'Empirical ML', 'Reproducibility', 'Benchmarking'],
    isOpenAccess: true,
    source: 'arXiv',
    relevanceScore: 0.94,
    fullText: `Benchmarking Contradiction Detection Across Multi-Study Machine Learning Experiments
Marcus Vance, Sophia Li, Klaus Neumann

1. Introduction
Contradictory findings frequently emerge in published literature. While Paper A asserts that attention layer pruning yields a 2.4% speedup with zero accuracy loss, Paper B observes catastrophic degradation. We present CrossEval, the first automated contradiction audit suite.

2. Typology of Contradictions
We formalize scientific contradictions into three classes:
Type I: Directional Inversion (Effect is positive vs negative).
Type II: Magnitude Discrepancy (Effect size differs by >3 sigma).
Type III: Null Disagreement (Statistically significant vs no observed difference).

3. Empirical Audit Findings
Across 450 ML papers, 63.8% of reported empirical contradictions dissolve when controlling for random seed selection and exact data augmentation transforms. Unreported seed variance accounts for 42% of observed metric delta.

4. The CrossEval Benchmark
CrossEval comprises 3,200 human-annotated scientific claim pairs across Computer Vision, NLP, and Reinforcement Learning.

5. Limitations
Annotator agreement for nuanced theoretical disagreements remains moderate (Fleiss kappa = 0.68). Automated parsing can misinterpret speculative discussion text as experimental claims.`,
    sections: [
      {
        title: 'Introduction',
        content: 'Contradictory findings frequently emerge in published literature. While Paper A asserts that attention layer pruning yields a 2.4% speedup with zero accuracy loss, Paper B observes catastrophic degradation. We present CrossEval, the first automated contradiction audit suite.'
      },
      {
        title: 'Typology of Contradictions',
        content: 'We formalize scientific contradictions into three classes: Type I: Directional Inversion; Type II: Magnitude Discrepancy; Type III: Null Disagreement.'
      },
      {
        title: 'Empirical Audit Findings',
        content: 'Across 450 ML papers, 63.8% of reported empirical contradictions dissolve when controlling for random seed selection and exact data augmentation transforms. Unreported seed variance accounts for 42% of observed metric delta.'
      },
      {
        title: 'Limitations',
        content: 'Annotator agreement for nuanced theoretical disagreements remains moderate (Fleiss kappa = 0.68). Automated parsing can misinterpret speculative discussion text as experimental claims.'
      }
    ],
    claims: [
      {
        id: 'claim_vance_1',
        statement: '63.8% of empirical contradictions across published ML papers dissolve when controlling for random seeds and data augmentation.',
        section: 'Empirical Audit Findings',
        confidence: 'High',
        evidenceSnippet: 'Across 450 ML papers, 63.8% of reported empirical contradictions dissolve when controlling for random seed selection.'
      }
    ],
    limitations: [
      'Focuses primarily on computer vision and NLP empirical benchmarks',
      'Does not evaluate hardware architectural thermal throttling impacts'
    ],
    reproducibilityScore: 79
  },
  {
    id: 'paper_iclr_2024_03',
    title: 'Automated Scientific Reproducibility Audits: A Multimodal Analysis of Code and Paper Artifacts',
    authors: [
      { name: 'Dr. Amina Al-Mansoor', affiliation: 'ETH Zürich' },
      { name: 'Julian Weber', affiliation: 'Max Planck Institute for Informatics' }
    ],
    abstract: 'Scientific reproducibility remains an urgent challenge across computational sciences. We present an automated auditing framework that extracts hyperparameter specifications, dependency environments, and evaluation protocols from PDF papers and their paired GitHub repositories. In an audit of 1,200 open-access machine learning papers, only 31.4% provided all dependencies required to execute baseline scripts.',
    year: 2024,
    venue: 'ICLR 2024 (International Conference on Learning Representations)',
    doi: '10.48550/arXiv.2310.08912',
    arxivId: '2310.08912',
    citationCount: 215,
    paperUrl: 'https://arxiv.org/abs/2310.08912',
    pdfUrl: 'https://arxiv.org/pdf/2310.08912.pdf',
    topics: ['Reproducibility', 'Artifact Evaluation', 'Open Science', 'Meta-Research'],
    isOpenAccess: true,
    source: 'OpenAlex',
    relevanceScore: 0.91,
    fullText: `Automated Scientific Reproducibility Audits: A Multimodal Analysis of Code and Paper Artifacts
Amina Al-Mansoor, Julian Weber

1. Introduction
The computational sciences face an acute reproducibility crisis. Despite mandatory checklist initiatives at top venues, automated verification remains nonexistent. We develop ArtifactAudit, a multimodal parser that evaluates synchronization between paper text and code repository artifacts.

2. Framework & Audit Criteria
ArtifactAudit evaluates seven core reproducibility axes:
(1) Code availability; (2) Dataset links; (3) Hyperparameter completeness; (4) Hardware disclosure; (5) Random seed specifications; (6) Evaluation metric definitions; (7) Docker/Conda dependency reproducibility.

3. Results on 1,200 Papers
Only 31.4% of audited repositories contained exact pinned dependency versions (e.g. requirements.txt with == versions). Over 52% of papers omitted random seed documentation. 81% did not disclose training hardware or compute budgets.

4. Recommendations for Venues
We propose that academic conferences mandate automated container build verification prior to final camera-ready acceptance.`,
    sections: [
      {
        title: 'Introduction',
        content: 'The computational sciences face an acute reproducibility crisis. Despite mandatory checklist initiatives at top venues, automated verification remains nonexistent. We develop ArtifactAudit, a multimodal parser that evaluates synchronization between paper text and code repository artifacts.'
      },
      {
        title: 'Audit Criteria & Results',
        content: 'ArtifactAudit evaluates seven core reproducibility axes: Code, Datasets, Hyperparameters, Hardware, Random seeds, Evaluation protocol, and Dependency environments. Only 31.4% of audited repositories contained exact pinned dependencies.'
      },
      {
        title: 'Recommendations',
        content: 'We propose that academic conferences mandate automated container build verification prior to final camera-ready acceptance.'
      }
    ],
    claims: [
      {
        id: 'claim_amina_1',
        statement: 'Only 31.4% of audited ML code repositories provide exact pinned dependency versions needed for execution.',
        section: 'Results on 1,200 Papers',
        confidence: 'High',
        evidenceSnippet: 'Only 31.4% of audited repositories contained exact pinned dependency versions.'
      }
    ],
    limitations: [
      'Cannot execute proprietary enterprise datasets or restricted clinical cohorts',
      'Assumes GitHub repository links are persistently accessible'
    ],
    reproducibilityScore: 92
  }
];

export const SEED_CHUNKS: PaperChunk[] = [
  {
    id: 'chunk_acl_1',
    paperId: 'paper_acl_2024_01',
    paperTitle: 'Retrieval-Augmented Generation with Source-Attributed Verification for Scientific Literature',
    section: 'Introduction',
    pageNumber: 1,
    chunkIndex: 0,
    content: 'Modern scientific discovery increasingly relies on automated synthesis of vast scholarly publications. However, contemporary large language models exhibit alarming rates of citation hallucination—inventing plausible bibliographic entries and asserting ungrounded empirical claims. In this paper, we formulate deterministic source attribution as a constraint on decoding.',
    tokenCount: 65
  },
  {
    id: 'chunk_acl_2',
    paperId: 'paper_acl_2024_01',
    paperTitle: 'Retrieval-Augmented Generation with Source-Attributed Verification for Scientific Literature',
    section: 'Methodology & Architecture',
    pageNumber: 3,
    chunkIndex: 1,
    content: 'Our framework introduces Reciprocal Token Verification (RTV). Given a research query q, candidate passages P are ranked via hybrid BM25 and dense bi-encoder scoring: Score(q, d) = alpha * BM25(q, d) + (1 - alpha) * Cosine(E(q), E(d)). Before generation, an attribution matrix M verifies that every asserted claim corresponds to an exact substring in the retrieved chunk with confidence tau > 0.85.',
    tokenCount: 88
  },
  {
    id: 'chunk_acl_3',
    paperId: 'paper_acl_2024_01',
    paperTitle: 'Retrieval-Augmented Generation with Source-Attributed Verification for Scientific Literature',
    section: 'Experiments & Results',
    pageNumber: 5,
    chunkIndex: 2,
    content: 'Our proposed RTV framework achieves 91.4% Citation Precision@1, outperforming dense RAG (68.2%) by 23.2 percentage points. Hallucinated citations drop from 14.8% to 0.78%. In ablation studies, removing sparse lexical tokens causes a 12% drop in precision on biochemical terms.',
    tokenCount: 62
  },
  {
    id: 'chunk_acl_4',
    paperId: 'paper_acl_2024_01',
    paperTitle: 'Retrieval-Augmented Generation with Source-Attributed Verification for Scientific Literature',
    section: 'Limitations',
    pageNumber: 7,
    chunkIndex: 3,
    content: 'Our evaluation is restricted to English-language publications. Computational latency increases by 38ms during the attribution verification pass. Scaling to multi-hop cross-paper synthesis requires future investigation.',
    tokenCount: 39
  },
  {
    id: 'chunk_neurips_1',
    paperId: 'paper_neurips_2024_02',
    paperTitle: 'Benchmarking Contradiction Detection Across Multi-Study Machine Learning Experiments',
    section: 'Empirical Audit Findings',
    pageNumber: 4,
    chunkIndex: 4,
    content: 'Across 450 ML papers, 63.8% of reported empirical contradictions dissolve when controlling for random seed selection and exact data augmentation transforms. Unreported seed variance accounts for 42% of observed metric delta.',
    tokenCount: 45
  },
  {
    id: 'chunk_iclr_1',
    paperId: 'paper_iclr_2024_03',
    paperTitle: 'Automated Scientific Reproducibility Audits: A Multimodal Analysis of Code and Paper Artifacts',
    section: 'Audit Criteria & Results',
    pageNumber: 4,
    chunkIndex: 5,
    content: 'ArtifactAudit evaluates seven core reproducibility axes: Code, Datasets, Hyperparameters, Hardware, Random seeds, Evaluation protocol, and Dependency environments. Only 31.4% of audited repositories contained exact pinned dependency versions (e.g. requirements.txt with == versions). Over 52% of papers omitted random seed documentation.',
    tokenCount: 68
  }
];

export const INITIAL_PROJECT: ResearchProject = {
  id: 'proj_hallucination_mitigation',
  name: 'Scientific RAG Grounding & Hallucination Mitigation',
  description: 'Investigating deterministic token attribution, empirical contradiction detection, and automated reproducibility verification for AI scientific literature review.',
  targetDomain: 'Artificial Intelligence & Scientific Computing',
  createdAt: '2024-09-15T10:00:00.000Z',
  updatedAt: new Date().toISOString(),
  papers: SEED_PAPERS,
  chunks: SEED_CHUNKS,
  collections: [
    {
      id: 'col_rag_core',
      name: 'Grounded RAG Architectures',
      description: 'Foundational papers on token attribution, dense-sparse hybrid retrieval, and citation verification.',
      paperIds: ['paper_acl_2024_01'],
      tags: ['RAG', 'Citation Grounding', 'Faithfulness'],
      createdAt: '2024-09-15T10:30:00.000Z'
    },
    {
      id: 'col_reproducibility',
      name: 'Reproducibility & Meta-Science',
      description: 'Empirical variance, seed sensitivity, and code dependency audits.',
      paperIds: ['paper_neurips_2024_02', 'paper_iclr_2024_03'],
      tags: ['Reproducibility', 'Audit', 'Seeds', 'Benchmarking'],
      createdAt: '2024-09-16T11:00:00.000Z'
    }
  ],
  notes: [
    {
      id: 'note_1',
      title: 'Synthesizing Sparse vs Dense Retrieval on Scientific Nomenclature',
      content: `## Key Observations
- Rostova et al. (ACL 2024) observed that purely dense vector representations drop 12% accuracy on biochemical nomenclature.
- Vance et al. (NeurIPS 2024) demonstrated that 63.8% of reported empirical gains disappear once random seeds are controlled.

### Proposed Next Experiment
Test whether reciprocal rank fusion (RRF) with BM25 can be dynamically weighted based on the Inverse Document Frequency (IDF) of query keywords. If query contains rare alphanumeric tokens (like chemical formulas or genes), boost BM25 weight to 0.85.`,
      tags: ['Retrieval', 'Ablations', 'Hypothesis'],
      linkedPaperIds: ['paper_acl_2024_01', 'paper_neurips_2024_02'],
      createdAt: '2024-09-18T14:20:00.000Z',
      updatedAt: '2024-09-18T15:00:00.000Z'
    },
    {
      id: 'note_2',
      title: 'Reproducibility Checkpoints for Camera-Ready Submission',
      content: `## Mandatory Artifacts (from Al-Mansoor & Weber 2024):
1. **Pinned Dependencies**: Use Docker container with exact CUDA and PyTorch versions.
2. **Seed Matrix**: Report 5 random seed runs with mean ± standard error.
3. **Attribution Log**: Store ground-truth citation spans in SciFact evaluation suite.`,
      tags: ['Reproducibility', 'Checklist'],
      linkedPaperIds: ['paper_iclr_2024_03'],
      createdAt: '2024-09-20T09:15:00.000Z',
      updatedAt: '2024-09-20T09:15:00.000Z'
    }
  ],
  knowledgeGraph: {
    nodes: [
      { id: 'paper_acl_2024_01', label: 'Rostova et al. (ACL 2024)', type: 'paper', color: '#6366f1', description: 'Grounded RAG with token attribution' },
      { id: 'paper_neurips_2024_02', label: 'Vance et al. (NeurIPS 2024)', type: 'paper', color: '#6366f1', description: 'CrossEval contradiction benchmark' },
      { id: 'paper_iclr_2024_03', label: 'Al-Mansoor & Weber (ICLR 2024)', type: 'paper', color: '#6366f1', description: 'Automated reproducibility audits' },
      { id: 'method_rtv', label: 'Reciprocal Token Verification', type: 'method', color: '#f59e0b', description: 'Pre-generation citation attribution matrix' },
      { id: 'method_hybrid_rag', label: 'Dense-Sparse Hybrid Retrieval', type: 'method', color: '#f59e0b', description: 'BM25 + Bi-Encoder fusion' },
      { id: 'dataset_scifact', label: 'SciFact Benchmark', type: 'dataset', color: '#06b6d4', description: 'Scientific claim fact-checking dataset' },
      { id: 'dataset_crosseval', label: 'CrossEval Corpus', type: 'dataset', color: '#06b6d4', description: 'Contradiction benchmark across 450 papers' },
      { id: 'concept_hallucination', label: 'Citation Hallucination', type: 'concept', color: '#10b981', description: 'Non-factual or fabricated bibliographic assertions' },
      { id: 'concept_seed_variance', label: 'Random Seed Sensitivity', type: 'concept', color: '#ec4899', description: 'Empirical variance induced by pseudo-random initializations' }
    ],
    edges: [
      { id: 'e1', source: 'paper_acl_2024_01', target: 'method_rtv', relationship: 'proposes', weight: 2 },
      { id: 'e2', source: 'paper_acl_2024_01', target: 'dataset_scifact', relationship: 'evaluates', weight: 2 },
      { id: 'e3', source: 'paper_acl_2024_01', target: 'concept_hallucination', relationship: 'supports', weight: 3 },
      { id: 'e4', source: 'paper_neurips_2024_02', target: 'dataset_crosseval', relationship: 'proposes', weight: 2 },
      { id: 'e5', source: 'paper_neurips_2024_02', target: 'concept_seed_variance', relationship: 'supports', weight: 3 },
      { id: 'e6', source: 'paper_neurips_2024_02', target: 'paper_acl_2024_01', relationship: 'cites', weight: 1 },
      { id: 'e7', source: 'paper_iclr_2024_03', target: 'concept_seed_variance', relationship: 'supports', weight: 2 },
      { id: 'e8', source: 'method_rtv', target: 'method_hybrid_rag', relationship: 'extends', weight: 2 }
    ]
  },
  gaps: [
    {
      id: 'gap_polyglot_rag',
      title: 'Multilingual Attributed Retrieval in Scientific Literature',
      affectedArea: 'Scientific NLP & Cross-Lingual Information Retrieval',
      gapType: 'missing_benchmark',
      confidence: 'High',
      evidence: 'Rostova et al. (ACL 2024) specifically state in Section 6 that evaluation was constrained strictly to English corpora, despite 35% of international clinical trials being reported in regional journals.',
      inference: 'Dense vector retrieval models exhibit degraded token attribution when query language differs from manuscript language.',
      hypothesis: 'Cross-lingual alignment vectors suffer from asymmetric semantic drift, raising false citation rates by >25% in multilingual synthesis.',
      whyItMatters: 'Essential for global clinical meta-analyses where evidence spans multiple languages and regional registries.',
      suggestedDirection: 'Develop a cross-lingual scientific RAG benchmark with parallel sentence alignments across English, Chinese, German, and Spanish biomedical papers.',
      supportingPaperIds: ['paper_acl_2024_01']
    },
    {
      id: 'gap_seed_variance_standards',
      title: 'Absence of Seed Variance Disclosure Standards in Retrieval Papers',
      affectedArea: 'Empirical Machine Learning & Reproducibility',
      gapType: 'reproducibility_gap',
      confidence: 'High',
      evidence: 'Vance et al. (NeurIPS 2024) proved that 63.8% of empirical contradictions stem from unreported random seed noise, while Al-Mansoor & Weber (ICLR 2024) found over 52% of papers omit seed specifications entirely.',
      inference: 'Many published 1-2% NDCG gains in RAG leaderboards may be statistical artifacts of lucky seed selection.',
      hypothesis: 'Benchmarking 10 contemporary rerankers across 10 distinct random seeds will re-order at least 40% of leaderboard positions.',
      whyItMatters: 'Prevents thousands of researcher hours wasted pursuing non-reproducible baseline improvements.',
      suggestedDirection: 'Require all benchmark submissions to report 5-seed confidence intervals and Wilcoxon signed-rank significance tests.',
      supportingPaperIds: ['paper_neurips_2024_02', 'paper_iclr_2024_03']
    }
  ],
  contradictions: [
    {
      id: 'contra_dense_vs_sparse',
      topic: 'Dense Embedding Superiority on Specialized Scientific Terminology',
      paperA: {
        paperId: 'paper_acl_2024_01',
        paperTitle: 'Retrieval-Augmented Generation with Source-Attributed Verification for Scientific Literature',
        claim: 'Purely dense representations suffer severe precision drops on biochemical nomenclature without lexical BM25 matching.',
        evidence: 'Section 5 demonstrates a 12% accuracy drop when removing sparse lexical token channels.'
      },
      paperB: {
        paperId: 'paper_neurips_2024_02',
        paperTitle: 'Benchmarking Contradiction Detection Across Multi-Study Machine Learning Experiments',
        claim: 'Dense contrastive bi-encoders consistently encode token n-grams adequately if subword tokenizers have scientific domain coverage.',
        evidence: 'Section 4.2 indicates domain-adapted bi-encoders outperform BM25 even on specialized vision tokens.'
      },
      underlyingCauses: [
        'Domain vocabulary distribution: subword tokenization splits rare chemical formulas into arbitrary sub-tokens.',
        'Tokenizer pretraining corpus size and medical vocabulary inclusion.',
        'Evaluation query length differences (short keyword queries vs long paragraph queries).'
      ],
      explanation: 'The disagreement is caused by tokenizer out-of-vocabulary treatment. When chemical terms fragment into 6+ sub-tokens, dense encoders lose semantic coherence, whereas BM25 exact token matching retains exact lookup integrity.',
      resolutionHypothesis: 'Dynamic query-adaptive reciprocal rank fusion weighting: automatically compute query out-of-vocabulary ratio and scale sparse BM25 weight accordingly.'
    }
  ],
  experiments: [
    {
      id: 'exp_rtv_benchmark',
      researchProblem: 'Quantifying the trade-off between deterministic token attribution verification latency and citation precision across multilingual biomedical literature.',
      researchQuestions: [
        'RQ1: What is the minimum context window required for deterministic token attribution to achieve >90% precision?',
        'RQ2: How does latency scale with corpus size when using reciprocal rank fusion?',
        'RQ3: Does attribution pre-verification prevent hallucinated statistical figures?'
      ],
      hypotheses: [
        'H1: Pre-generation token attribution gates reduce hallucinated citations to under 1.0% without hurting generation fluency.',
        'H2: Dynamic BM25/Dense weighting maintains >0.90 NDCG@10 on rare scientific entities with <45ms latency overhead.'
      ],
      variables: {
        independent: ['Retrieval architecture (Sparse, Dense, Hybrid RTV)', 'Attribution confidence threshold tau (0.70, 0.85, 0.95)'],
        dependent: ['Citation Precision@1', 'Hallucination Rate (%)', 'Inference Latency (ms)', 'RAGAS Faithfulness F1'],
        control: ['Backbone LLM weights', 'Decoding temperature (0.1)', 'Fixed random seeds (42, 1337, 2024, 7, 99)']
      },
      datasets: [
        { name: 'SciFact', rationale: 'Gold-standard benchmark for claim verification with evidence sentence spans' },
        { name: 'PubMedQA', rationale: 'Biomedical question answering with expert-verified citations' },
        { name: 'CrossEval', rationale: 'Contradiction detection across published machine learning literature' }
      ],
      baselines: [
        'Standard Dense RAG (BGE-large-en-v1.5)',
        'Standard BM25 Lexical Retriever',
        'Vanilla Zero-Shot Generation (GPT-4 / Claude)'
      ],
      evaluationMetrics: [
        'Citation Precision@1',
        'NDCG@10',
        'Faithfulness Score (RAGAS)',
        'Wall-Clock Attribution Time (ms)'
      ],
      experimentSteps: [
        '1. Segment and index SciFact and PubMedQA corpora with exact section and token offset metadata.',
        '2. Run 5-seed evaluation on baseline Dense and BM25 systems.',
        '3. Implement pre-generation attribution matrix M with threshold tau = 0.85.',
        '4. Measure citation precision, hallucination rate, and execution latency.',
        '5. Perform Wilcoxon signed-rank significance tests against all baselines.'
      ],
      expectedOutcomes: [
        'Statistically significant 20+ point increase in citation precision over dense RAG',
        'Reduction of hallucinated citations from ~15% to <1%',
        'Acceptable latency penalty of approximately 35-40ms'
      ],
      possibleRisks: [
        'Tokenizer boundary mismatches between query and target documents',
        'Increased memory footprint for dense index caches'
      ],
      requiredResources: [
        '1x NVIDIA A100 or RTX 4090 GPU (24GB VRAM)',
        'PyTorch 2.4, HuggingFace Transformers, Qdrant Vector Store'
      ],
      createdAt: '2024-09-22T16:00:00.000Z'
    }
  ],
  reproducibilityReports: [
    {
      id: 'rep_acl_1',
      paperId: 'paper_acl_2024_01',
      paperTitle: 'Retrieval-Augmented Generation with Source-Attributed Verification for Scientific Literature',
      overallScore: 84,
      breakdown: {
        codeAvailability: { status: 'Available', score: 100, details: 'Public GitHub repository link with MIT license provided.' },
        datasetAvailability: { status: 'Available', score: 95, details: 'Benchmark data mapped directly to public HuggingFace datasets.' },
        hyperparameters: { status: 'Available', score: 90, details: 'Batch sizes, learning rates, and threshold tau = 0.85 specified in Section 3.' },
        hardwareSpecs: { status: 'Partial', score: 60, details: 'Mentioned 4x A100 GPUs but omitted exact driver / CUDA runtime versions.' },
        randomSeeds: { status: 'Partial', score: 65, details: 'Single seed reported for main benchmark table; 3 seeds in appendix.' },
        evaluationProtocol: { status: 'Available', score: 95, details: 'Formal mathematical formulation of citation precision and RAGAS metrics provided.' },
        dependencyEnv: { status: 'Available', score: 85, details: 'Environment yaml and poetry.lock file provided in repository.' }
      },
      recommendations: [
        'Conduct evaluation across at least 5 random seed initializations with confidence intervals.',
        'Document exact CUDA runtime and cuDNN library versions in repository README.',
        'Provide automated Dockerfile reproducing Table 1 benchmarks with single command.'
      ],
      createdAt: '2024-09-24T12:00:00.000Z'
    }
  ],
  peerReviews: [
    {
      id: 'rev_acl_1',
      paperId: 'paper_acl_2024_01',
      paperTitle: 'Retrieval-Augmented Generation with Source-Attributed Verification for Scientific Literature',
      summary: 'The paper tackles the critical problem of citation hallucination in scientific NLP. The proposed Reciprocal Token Verification architecture is elegant and supported by thorough empirical evaluations on SciFact and PubMedQA.',
      strengths: [
        'Clear problem formulation with compelling real-world scientific significance',
        'Statistically significant 23.2% precision increase over dense baseline models',
        'Transparent reporting of computational latency trade-offs (38ms overhead)'
      ],
      weaknesses: [
        'Evaluation restricted strictly to English-language academic publications',
        'Omission of paired statistical significance tests across evaluation runs',
        'Overclaiming total elimination of hallucination in Section 1'
      ],
      verdict: 'Minor Revision',
      disclaimer: 'This review was generated by ARIS AI Peer Reviewer for pre-submission quality assurance and does not replace human blind peer review.',
      findings: [
        {
          id: 'find_1',
          category: 'Overclaiming',
          severity: 'MEDIUM',
          claimOrPassage: 'This architecture eliminates hallucination in all real-world scientific literature queries.',
          issue: 'Absolute term "eliminates" is not supported by empirical observation.',
          evidence: 'Table 1 reports a 0.78% hallucination rate, which is an exceptional reduction but not zero.',
          explanation: 'Claiming total elimination rather than substantial mitigation invites rejection from rigorous reviewers.',
          recommendation: 'Rephrase to: "substantially reduces citation hallucination to under 0.8% across benchmark evaluations."'
        },
        {
          id: 'find_2',
          category: 'Statistics & Baselines',
          severity: 'HIGH',
          claimOrPassage: 'Table 1: Citation Precision & Hallucination Rate across Scientific Benchmarks',
          issue: 'Missing statistical significance test (p-value / bootstrap resampling).',
          evidence: 'Only mean precision numbers are displayed without confidence intervals.',
          explanation: 'Reviewers at ACL/NeurIPS mandate significance testing to confirm deltas are not stochastic.',
          recommendation: 'Add standard error bars and p-values (p < 0.001) using paired t-tests or bootstrap resampling.'
        }
      ],
      createdAt: '2024-09-25T14:30:00.000Z'
    }
  ],
  writingDrafts: [
    {
      id: 'draft_intro_1',
      title: 'Introduction: Grounded Scientific Knowledge Synthesis',
      sectionType: 'introduction',
      format: 'markdown',
      content: `# 1. Introduction

The velocity of contemporary scientific publication presents an unprecedented challenge for human researchers. With hundreds of thousands of preprints deposited annually across arXiv and PubMed, automated retrieval-augmented synthesis has emerged as a cornerstone for literature discovery.

However, standard generative language models exhibit severe citation hallucination. As demonstrated by Rostova et al. [1], ungrounded dense retrievers hallucinate citations in up to 14.8% of queries when encountering specialized nomenclature. Concurrently, Vance et al. [2] reveal that empirical contradictions across machine learning literature frequently arise from unrecorded seed variances rather than genuine architectural breakthroughs.

To address these compounding failure modes, we formulate an integrated research intelligence architecture that pairs deterministic token attribution with automated contradiction detection.`,
      citedPaperIds: ['paper_acl_2024_01', 'paper_neurips_2024_02'],
      bibtex: `@article{rostova2024rtv,
  title={Retrieval-Augmented Generation with Source-Attributed Verification for Scientific Literature},
  author={Rostova, Elena and Chen, David K. and Alvarez, Sophia},
  year={2024},
  journal={ACL 2024}
}

@article{vance2024crosseval,
  title={Benchmarking Contradiction Detection Across Multi-Study Machine Learning Experiments},
  author={Vance, Marcus and Li, Sophia and Neumann, Klaus},
  year={2024},
  journal={NeurIPS 2024}
}`,
      createdAt: '2024-09-26T17:00:00.000Z',
      updatedAt: '2024-09-26T17:30:00.000Z'
    }
  ],
  diagrams: [
    {
      id: 'diag_rag_core',
      title: 'Attributed Scientific RAG Pipeline',
      type: 'rag_pipeline',
      mermaidCode: `flowchart TD
    PDF[Scientific PDF Paper] --> Parser[Structure Parser & Chunking]
    Parser --> Dense[Dense Vector Store]
    Parser --> Sparse[BM25 Inverted Index]
    
    Query[Researcher Query] --> Hybrid[Hybrid Ranker Score]
    Dense --> Hybrid
    Sparse --> Hybrid
    
    Hybrid --> TopK[Top Grounded Chunks]
    TopK --> AttribGate{Attribution Gate tau > 0.85}
    
    AttribGate -- Verified --> Gen[Constrained LLM Synthesis]
    AttribGate -- Unverified --> Fallback[Flag Insufficient Evidence]
    
    Gen --> Response[Response with Grounded [1] Citations]`,
      description: 'End-to-end architecture showing hybrid scoring and pre-generation attribution gating.',
      createdAt: '2024-09-28T10:00:00.000Z'
    }
  ],
  chatHistory: [
    {
      id: 'msg_1',
      role: 'user',
      content: 'What methodology does Rostova et al. use to reduce citation hallucinations, and what are their empirical results?',
      timestamp: '2024-09-29T11:00:00.000Z'
    },
    {
      id: 'msg_2',
      role: 'assistant',
      content: `Based on the retrieved research context, Rostova et al. introduce **Reciprocal Token Verification (RTV)** to mitigate citation hallucination.

### Methodology
1. **Hybrid Retrieval**: Candidate passages are scored combining sparse BM25 and dense bi-encoder cosine similarity:
   $$\\text{Score}(q, d) = \\alpha \\cdot \\text{BM25}(q, d) + (1 - \\alpha) \\cdot \\cos(\\mathbf{E}_q, \\mathbf{E}_d)$$ [1]
2. **Attribution Gate**: Before generating text, an attribution matrix verifies that every asserted claim corresponds to an exact substring in the retrieved chunk with confidence threshold $\\tau > 0.85$ [1].

### Empirical Results
- **Citation Precision@1**: Improved from **68.2%** (dense RAG) to **91.4%** (RTV), representing a **23.2 percentage point increase** [2].
- **Hallucinated Citations**: Dropped from **14.8%** to **0.78%** across 12,000 scientific benchmark queries [2].
- **Ablation Findings**: Removing sparse lexical BM25 matching caused a **12% accuracy drop** on biochemical terminology [2].

### Evidence Synthesis
- **Source Fact**: Measured on SciFact and PubMedQA benchmarks (ACL 2024).
- **Inference**: Sparse lexical channels are indispensable when indexing rare alphanumeric scientific tokens that dense embeddings blur.`,
      timestamp: '2024-09-29T11:00:05.000Z',
      citations: [
        {
          index: 1,
          paperId: 'paper_acl_2024_01',
          paperTitle: 'Retrieval-Augmented Generation with Source-Attributed Verification for Scientific Literature',
          section: 'Methodology & Architecture',
          page: 3,
          chunkId: 'chunk_acl_2',
          snippet: 'Our framework introduces Reciprocal Token Verification (RTV). Given a research query q, candidate passages P are ranked via hybrid BM25 and dense bi-encoder scoring...'
        },
        {
          index: 2,
          paperId: 'paper_acl_2024_01',
          paperTitle: 'Retrieval-Augmented Generation with Source-Attributed Verification for Scientific Literature',
          section: 'Experiments & Results',
          page: 5,
          chunkId: 'chunk_acl_3',
          snippet: 'Our proposed RTV framework achieves 91.4% Citation Precision@1, outperforming dense RAG (68.2%) by 23.2 percentage points. Hallucinated citations drop from 14.8% to 0.78%...'
        }
      ],
      evidenceType: 'SOURCE FACT'
    }
  ]
};
