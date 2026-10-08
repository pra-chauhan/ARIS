import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Scale,
  Sparkles,
  Loader2,
  ExternalLink,
  Plus,
  FolderPlus,
  CheckCircle2,
  Tag
} from 'lucide-react';
import type { AcademicPaper, LiteratureCollection } from '../../types/research';
import { ApiClient } from '../../services/apiClient';

interface PaperLibraryViewProps {
  papers: AcademicPaper[];
  collections: LiteratureCollection[];
  onUploadSuccess: (paper: AcademicPaper, chunks: any[]) => void;
  onRemovePaper: (paperId: string) => void;
  onInspectPaper: (paper: AcademicPaper) => void;
  onAskAi: (paper: AcademicPaper) => void;
  onAuditReproducibility: (paper: AcademicPaper) => void;
  onPeerReview: (paper: AcademicPaper) => void;
  onCreateCollection: (name: string, description: string) => void;
  onAddPaperToCollection: (collectionId: string, paperId: string) => void;
}

export const PaperLibraryView: React.FC<PaperLibraryViewProps> = ({
  papers,
  collections,
  onUploadSuccess,
  onRemovePaper,
  onInspectPaper,
  onAskAi,
  onAuditReproducibility,
  onPeerReview,
  onCreateCollection,
  onAddPaperToCollection
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDesc, setCollectionDesc] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF research documents (.pdf) are supported.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Pdf = reader.result as string;
          const result = await ApiClient.parsePdf(base64Pdf, file.name);
          onUploadSuccess(result.paper, result.chunks);
        } catch (err) {
          setUploadError(`Failed to process PDF: ${(err as Error).message}`);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadError((err as Error).message);
      setUploading(false);
    }
  };

  const handleCreateCollectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionName.trim()) return;
    onCreateCollection(collectionName.trim(), collectionDesc.trim());
    setCollectionName('');
    setCollectionDesc('');
    setShowNewCollectionModal(false);
  };

  const filteredPapers = selectedCollection === 'all'
    ? papers
    : papers.filter(p => {
        const col = collections.find(c => c.id === selectedCollection);
        return col?.paperIds.includes(p.id);
      });

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>PROJECT CORPUS & DOCUMENT INGESTION</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Paper Library ({papers.length})</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Ingest scientific PDFs, extract sections & equations, and maintain organized reading collections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewCollectionModal(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 flex items-center gap-2 transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-indigo-400" />
            <span>New Collection</span>
          </button>

          <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer transition-all">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{uploading ? 'Parsing PDF...' : 'Upload PDF'}</span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {uploadError}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div className="relative border-2 border-dashed border-zinc-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center bg-zinc-900/40 hover:bg-zinc-900/80 transition-all">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={uploading}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          </div>
          <div className="text-sm font-semibold text-zinc-200">
            {uploading ? 'Extracting text, sections, equations & figures...' : 'Drop PDF Research Paper Here'}
          </div>
          <p className="text-xs text-zinc-500 max-w-sm">
            Automatically extracts title, authors, abstract, structured sections, LaTeX equations, tables, figures, and builds hybrid RAG chunks.
          </p>
        </div>
      </div>

      {/* Collections Tabs */}
      {collections.length > 0 && (
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 text-xs">
          <button
            onClick={() => setSelectedCollection('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCollection === 'all'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Papers ({papers.length})
          </button>
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => setSelectedCollection(col.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedCollection === col.id
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {col.name} ({col.paperIds.length})
            </button>
          ))}
        </div>
      )}

      {/* Papers Grid */}
      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {paper.source}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {paper.venue || 'Academic Venue'} ({paper.year})
                    </span>
                    {paper.reproducibilityScore && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Reproducibility: {paper.reproducibilityScore}/100
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-zinc-100 hover:text-indigo-300 transition-colors">
                    {paper.title}
                  </h3>

                  <p className="text-xs text-zinc-400">
                    {paper.authors.map((a) => a.name).join(', ')}
                  </p>
                </div>

                {/* Primary Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onInspectPaper(paper)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Reader</span>
                  </button>

                  <button
                    onClick={() => onAskAi(paper)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask RAG</span>
                  </button>

                  <button
                    onClick={() => onAuditReproducibility(paper)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-emerald-400 transition-colors"
                    title="Audit Reproducibility"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onPeerReview(paper)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-amber-400 transition-colors"
                    title="Run AI Peer Review"
                  >
                    <Scale className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemovePaper(paper.id)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 transition-colors"
                    title="Remove from Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Abstract */}
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                {paper.abstract}
              </p>

              {/* Badges / Collections */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-cyan-400">{paper.citationCount} citations</span>
                  {paper.doi && (
                    <span>DOI: <strong className="text-zinc-400 font-mono">{paper.doi}</strong></span>
                  )}
                  {paper.sections && (
                    <span className="text-zinc-400">{paper.sections.length} structured sections</span>
                  )}
                  {paper.equations && paper.equations.length > 0 && (
                    <span className="text-amber-400">{paper.equations.length} formulas</span>
                  )}
                </div>

                {/* Add to Collection drop */}
                {collections.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-500">Add to collection:</span>
                    <select
                      onChange={(e) => {
                        if (e.target.value) onAddPaperToCollection(e.target.value, paper.id);
                      }}
                      className="bg-zinc-800 text-zinc-300 text-[10px] rounded px-2 py-0.5 border border-zinc-700 focus:outline-none"
                      defaultValue=""
                    >
                      <option value="" disabled>Select collection...</option>
                      {collections.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-zinc-600 border border-dashed border-zinc-800 rounded-2xl">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No papers in this collection yet. Upload a PDF or search to add papers.</p>
        </div>
      )}

      {/* New Collection Modal */}
      {showNewCollectionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Create Literature Collection</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Group papers by subtopic, methodology, or reading list priority.
            </p>
            <form onSubmit={handleCreateCollectionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Collection Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LLM Reasoning & Chain of Thought"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Papers analyzing multi-step reasoning accuracy"
                  value={collectionDesc}
                  onChange={(e) => setCollectionDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCollectionModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
