import React, { useState, useEffect } from 'react';
import type { 
  ResearchProject, 
  AcademicPaper, 
  PaperChunk, 
  ChatMessage, 
  ResearchGap,
  Contradiction,
  KnowledgeGraphData,
  ReproducibilityReport,
  PeerReviewReport,
  ExperimentPlan,
  WritingDraft,
  DiagramArtifact,
  ResearchNote
} from './types/research';
import { ApiClient } from './services/apiClient';
import { Header } from './components/layout/Header';
import { Sidebar, type NavTab } from './components/layout/Sidebar';
import { DashboardView } from './components/modules/DashboardView';
import { SearchView } from './components/modules/SearchView';
import { PaperLibraryView } from './components/modules/PaperLibraryView';
import { PaperDetailView } from './components/modules/PaperDetailView';
import { RagChatView } from './components/modules/RagChatView';
import { KnowledgeGraphView } from './components/modules/KnowledgeGraphView';
import { GapsContradictionsView } from './components/modules/GapsContradictionsView';
import { LiteratureMatrixView } from './components/modules/LiteratureMatrixView';
import { NotebookView } from './components/modules/NotebookView';
import { ExperimentPlannerView } from './components/modules/ExperimentPlannerView';
import { ReproducibilityView } from './components/modules/ReproducibilityView';
import { PeerReviewView } from './components/modules/PeerReviewView';
import { WritingStudioView } from './components/modules/WritingStudioView';
import { DiagramStudioView } from './components/modules/DiagramStudioView';

export function App() {
  const [projects, setProjects] = useState<ResearchProject[]>(() => ApiClient.getProjects());
  const [activeProjectId, setActiveProjectId] = useState<string>(() => ApiClient.getActiveProjectId());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedPaper, setSelectedPaper] = useState<AcademicPaper | null>(null);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  // Find active project
  const currentProject = projects.find(p => p.id === activeProjectId) || projects[0];

  // Save changes to localStorage whenever projects change
  useEffect(() => {
    ApiClient.saveProjects(projects);
  }, [projects]);

  // Sync activeProjectId
  useEffect(() => {
    ApiClient.setActiveProjectId(activeProjectId);
  }, [activeProjectId]);

  // Initial health check
  useEffect(() => {
    ApiClient.checkHealth().then(res => {
      setHasGeminiKey(res.hasGeminiApiKey);
    });
  }, []);

  // Global Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuickSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper to update current project state
  const updateCurrentProject = (updater: (prev: ResearchProject) => ResearchProject) => {
    setProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id === currentProject.id) {
          const updated = updater(p);
          return { ...updated, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  // Actions
  const handleCreateProject = (name: string, description: string) => {
    const newProj: ResearchProject = {
      id: `proj_${Date.now()}`,
      name,
      description,
      targetDomain: 'Interdisciplinary Computational Sciences',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      papers: [],
      chunks: [],
      collections: [],
      notes: [],
      knowledgeGraph: { nodes: [], edges: [] },
      gaps: [],
      contradictions: [],
      experiments: [],
      reproducibilityReports: [],
      peerReviews: [],
      writingDrafts: [],
      diagrams: [],
      chatHistory: []
    };
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
  };

  const handleExportProject = () => {
    const jsonStr = JSON.stringify(currentProject, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aris_project_${currentProject.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result as string);
        if (imported && imported.id && imported.name) {
          setProjects(prev => [imported, ...prev.filter(p => p.id !== imported.id)]);
          setActiveProjectId(imported.id);
        }
      } catch (err) {
        alert('Invalid project JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleAddPaperToProject = (paper: AcademicPaper) => {
    // Generate basic chunks if paper has abstract / full text
    const textToChunk = paper.fullText || `${paper.title}\n\nAbstract: ${paper.abstract}`;
    const newChunks: PaperChunk[] = [
      {
        id: `chunk_${paper.id}_0`,
        paperId: paper.id,
        paperTitle: paper.title,
        section: 'Abstract & Overview',
        pageNumber: 1,
        chunkIndex: 0,
        content: textToChunk.substring(0, 1200),
        tokenCount: Math.round(Math.min(1200, textToChunk.length) / 4)
      }
    ];

    updateCurrentProject(prev => {
      if (prev.papers.some(p => p.id === paper.id)) return prev;

      // Incrementally update knowledge graph with new paper node
      const newNodes = [
        ...prev.knowledgeGraph.nodes,
        {
          id: paper.id,
          label: paper.title.length > 35 ? paper.title.substring(0, 32) + '...' : paper.title,
          type: 'paper' as const,
          color: '#6366f1',
          description: `${paper.venue || 'Publication'} (${paper.year})`,
          paperId: paper.id
        }
      ];

      return {
        ...prev,
        papers: [paper, ...prev.papers],
        chunks: [...newChunks, ...prev.chunks],
        knowledgeGraph: {
          ...prev.knowledgeGraph,
          nodes: newNodes
        }
      };
    });
  };

  const handlePdfUploadSuccess = (paper: AcademicPaper, chunks: PaperChunk[]) => {
    updateCurrentProject(prev => ({
      ...prev,
      papers: [paper, ...prev.papers],
      chunks: [...chunks, ...prev.chunks],
      knowledgeGraph: {
        nodes: [
          ...prev.knowledgeGraph.nodes,
          {
            id: paper.id,
            label: paper.title.length > 35 ? paper.title.substring(0, 32) + '...' : paper.title,
            type: 'paper' as const,
            color: '#6366f1',
            description: `Uploaded Manuscript (${paper.year})`,
            paperId: paper.id
          }
        ],
        edges: prev.knowledgeGraph.edges
      }
    }));
    setSelectedPaper(paper);
    setActiveTab('reader');
  };

  const handleRemovePaper = (paperId: string) => {
    updateCurrentProject(prev => ({
      ...prev,
      papers: prev.papers.filter(p => p.id !== paperId),
      chunks: prev.chunks.filter(c => c.paperId !== paperId)
    }));
    if (selectedPaper?.id === paperId) {
      setSelectedPaper(null);
    }
  };

  const handleInspectPaper = (paper: AcademicPaper) => {
    setSelectedPaper(paper);
    setActiveTab('reader');
  };

  const handleAskAiAboutPaper = (paper: AcademicPaper, initialQuery?: string) => {
    setSelectedPaper(paper);
    setActiveTab('rag-chat');
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans antialiased">
      {/* Left Application Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        paperCount={currentProject.papers.length}
        gapCount={currentProject.gaps.length}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Persistent Top Header */}
        <Header
          currentProject={currentProject}
          projects={projects}
          onSelectProject={setActiveProjectId}
          onCreateProject={handleCreateProject}
          onExportProject={handleExportProject}
          onImportProject={handleImportProject}
          hasGeminiKey={hasGeminiKey}
          onOpenQuickSearch={() => setShowQuickSearch(true)}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 overflow-y-auto bg-zinc-950">
          {activeTab === 'dashboard' && (
            <DashboardView
              project={currentProject}
              onNavigate={setActiveTab}
              onSelectPaper={handleInspectPaper}
            />
          )}

          {activeTab === 'search' && (
            <SearchView
              onAddPaperToProject={handleAddPaperToProject}
              existingPaperIds={new Set(currentProject.papers.map(p => p.id))}
              onInspectPaper={handleInspectPaper}
              onAskAiAboutPaper={handleAskAiAboutPaper}
            />
          )}

          {activeTab === 'papers' && (
            <PaperLibraryView
              papers={currentProject.papers}
              collections={currentProject.collections}
              onUploadSuccess={handlePdfUploadSuccess}
              onRemovePaper={handleRemovePaper}
              onInspectPaper={handleInspectPaper}
              onAskAi={handleAskAiAboutPaper}
              onAuditReproducibility={(p) => {
                setSelectedPaper(p);
                setActiveTab('reproducibility');
              }}
              onPeerReview={(p) => {
                setSelectedPaper(p);
                setActiveTab('peer-review');
              }}
              onCreateCollection={(name, description) => {
                const newCol = {
                  id: `col_${Date.now()}`,
                  name,
                  description,
                  paperIds: [],
                  tags: [],
                  createdAt: new Date().toISOString()
                };
                updateCurrentProject(prev => ({
                  ...prev,
                  collections: [...prev.collections, newCol]
                }));
              }}
              onAddPaperToCollection={(collectionId, paperId) => {
                updateCurrentProject(prev => ({
                  ...prev,
                  collections: prev.collections.map(c => {
                    if (c.id === collectionId && !c.paperIds.includes(paperId)) {
                      return { ...c, paperIds: [...c.paperIds, paperId] };
                    }
                    return c;
                  })
                }));
              }}
            />
          )}

          {activeTab === 'reader' && (
            <PaperDetailView
              paper={selectedPaper || currentProject.papers[0]}
              chunks={currentProject.chunks}
              onAskAi={handleAskAiAboutPaper}
              onAuditReproducibility={(p) => {
                setSelectedPaper(p);
                setActiveTab('reproducibility');
              }}
              onPeerReview={(p) => {
                setSelectedPaper(p);
                setActiveTab('peer-review');
              }}
            />
          )}

          {activeTab === 'rag-chat' && (
            <RagChatView
              papers={currentProject.papers}
              chunks={currentProject.chunks}
              messages={currentProject.chatHistory}
              onSendMessage={(msg) => {
                updateCurrentProject(prev => ({
                  ...prev,
                  chatHistory: [...prev.chatHistory, msg]
                }));
              }}
              onJumpToPaper={(paperId) => {
                const p = currentProject.papers.find(x => x.id === paperId);
                if (p) handleInspectPaper(p);
              }}
              initialActivePaperId={selectedPaper?.id}
            />
          )}

          {activeTab === 'knowledge-graph' && (
            <KnowledgeGraphView
              graph={currentProject.knowledgeGraph}
              papers={currentProject.papers}
              onUpdateGraph={(newGraph) => {
                updateCurrentProject(prev => ({ ...prev, knowledgeGraph: newGraph }));
              }}
              onSelectPaper={handleInspectPaper}
            />
          )}

          {activeTab === 'gaps' && (
            <GapsContradictionsView
              gaps={currentProject.gaps}
              contradictions={currentProject.contradictions}
              papers={currentProject.papers}
              onUpdateGaps={(gaps) => {
                updateCurrentProject(prev => ({ ...prev, gaps }));
              }}
              onUpdateContradictions={(contras) => {
                updateCurrentProject(prev => ({ ...prev, contradictions: contras }));
              }}
              onFormulateExperiment={(topic) => {
                setActiveTab('experiments');
              }}
            />
          )}

          {activeTab === 'literature-matrix' && (
            <LiteratureMatrixView
              papers={currentProject.papers}
              collections={currentProject.collections}
              onSelectPaper={handleInspectPaper}
            />
          )}

          {activeTab === 'notebook' && (
            <NotebookView
              notes={currentProject.notes}
              papers={currentProject.papers}
              onSaveNote={(note) => {
                updateCurrentProject(prev => {
                  const exists = prev.notes.some(n => n.id === note.id);
                  return {
                    ...prev,
                    notes: exists ? prev.notes.map(n => n.id === note.id ? note : n) : [note, ...prev.notes]
                  };
                });
              }}
              onDeleteNote={(noteId) => {
                updateCurrentProject(prev => ({
                  ...prev,
                  notes: prev.notes.filter(n => n.id !== noteId)
                }));
              }}
            />
          )}

          {activeTab === 'experiments' && (
            <ExperimentPlannerView
              experiments={currentProject.experiments}
              papers={currentProject.papers}
              onAddExperiment={(plan) => {
                updateCurrentProject(prev => ({
                  ...prev,
                  experiments: [plan, ...prev.experiments]
                }));
              }}
            />
          )}

          {activeTab === 'reproducibility' && (
            <ReproducibilityView
              reports={currentProject.reproducibilityReports}
              papers={currentProject.papers}
              onAddReport={(report) => {
                updateCurrentProject(prev => ({
                  ...prev,
                  reproducibilityReports: [report, ...prev.reproducibilityReports.filter(r => r.paperId !== report.paperId)]
                }));
              }}
              initialPaperId={selectedPaper?.id}
            />
          )}

          {activeTab === 'peer-review' && (
            <PeerReviewView
              reports={currentProject.peerReviews}
              papers={currentProject.papers}
              onAddReport={(report) => {
                updateCurrentProject(prev => ({
                  ...prev,
                  peerReviews: [report, ...prev.peerReviews.filter(r => r.paperId !== report.paperId)]
                }));
              }}
              initialPaperId={selectedPaper?.id}
            />
          )}

          {activeTab === 'writing' && (
            <WritingStudioView
              drafts={currentProject.writingDrafts}
              papers={currentProject.papers}
              onSaveDraft={(draft) => {
                updateCurrentProject(prev => {
                  const exists = prev.writingDrafts.some(d => d.id === draft.id);
                  return {
                    ...prev,
                    writingDrafts: exists ? prev.writingDrafts.map(d => d.id === draft.id ? draft : d) : [draft, ...prev.writingDrafts]
                  };
                });
              }}
            />
          )}

          {activeTab === 'diagrams' && (
            <DiagramStudioView
              diagrams={currentProject.diagrams}
              onAddDiagram={(diag) => {
                updateCurrentProject(prev => ({
                  ...prev,
                  diagrams: [diag, ...prev.diagrams.filter(d => d.id !== diag.id)]
                }));
              }}
            />
          )}
        </main>
      </div>

      {/* Quick Search Modal (Cmd+K) */}
      {showQuickSearch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800">
              <input
                type="text"
                autoFocus
                placeholder="Jump to paper, section, note, or module..."
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-zinc-500"
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
              {currentProject.papers
                .filter(p => !quickQuery || p.title.toLowerCase().includes(quickQuery.toLowerCase()))
                .map(paper => (
                  <div
                    key={paper.id}
                    onClick={() => {
                      handleInspectPaper(paper);
                      setShowQuickSearch(false);
                    }}
                    className="p-3 rounded-lg hover:bg-zinc-800 cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-medium text-zinc-200 truncate">{paper.title}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Paper</span>
                  </div>
                ))}
              <div
                onClick={() => {
                  setActiveTab('rag-chat');
                  setShowQuickSearch(false);
                }}
                className="p-3 rounded-lg hover:bg-zinc-800 cursor-pointer flex items-center justify-between text-indigo-400 font-medium"
              >
                <span>Ask Citation RAG</span>
                <span className="text-[10px] text-zinc-500 font-mono">Module</span>
              </div>
            </div>
            <div className="p-3 bg-zinc-950/70 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between">
              <span>Press ESC to close</span>
              <span>ARIS Command Palette</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
