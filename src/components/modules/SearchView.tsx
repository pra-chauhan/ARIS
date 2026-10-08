import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Check,
  ExternalLink,
  BookOpen,
  Sparkles,
  Loader2,
  FileText,
  MessageSquare,
  Scale
} from 'lucide-react';
import type { AcademicPaper } from '../../types/research';
import { ApiClient } from '../../services/apiClient';

interface SearchViewProps {
  onAddPaperToProject: (paper: AcademicPaper) => void;
  existingPaperIds: Set<string>;
  onInspectPaper: (paper: AcademicPaper) => void;
  onAskAiAboutPaper: (paper: AcademicPaper) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  onAddPaperToProject,
  existingPaperIds,
  onInspectPaper,
  onAskAiAboutPaper
}) => {
  const [query, setQuery] = useState('Methods for mitigating citation hallucinations in large language models');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AcademicPaper[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Filters
  const [selectedSource, setSelectedSource] = useState<'All' | 'arXiv' | 'OpenAlex' | 'Semantic Scholar'>('All');
  const [onlyOpenAccess, setOnlyOpenAccess] = useState(false);
  const [minCitations, setMinCitations] = useState(0);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const papers = await ApiClient.searchPapers(query.trim(), 14);
      setResults(papers);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((p) => {
    if (selectedSource !== 'All' && p.source !== selectedSource) return false;
    if (onlyOpenAccess && !p.isOpenAccess) return false;
    if (p.citationCount < minCitations) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SEMANTIC DISCOVERY & ACADEMIC HARVESTING</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Academic Literature Search</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Semantically query arXiv, OpenAlex, Semantic Scholar, and Crossref with automatic metadata extraction.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search research semantically (e.g. 'mechanistic interpretability of sparse autoencoders')..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>Search</span>
        </button>
      </form>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-850 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Source:</span>
            {(['All', 'arXiv', 'OpenAlex', 'Semantic Scholar'] as const).map((src) => (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedSource === src
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-200">
            <input
              type="checkbox"
              checked={onlyOpenAccess}
              onChange={(e) => setOnlyOpenAccess(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0"
            />
            <span>Open Access Only</span>
          </label>
        </div>

        <div className="flex items-center gap-2 text-zinc-400">
          <span>Min Citations:</span>
          <select
            value={minCitations}
            onChange={(e) => setMinCitations(Number(e.target.value))}
            className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none"
          >
            <option value={0}>Any</option>
            <option value={10}>10+</option>
            <option value={50}>50+</option>
            <option value={100}>100+</option>
          </select>
        </div>
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm font-medium">Querying open academic registries and normalizing metadata...</p>
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
            <span>Showing {filteredResults.length} relevant scientific papers</span>
            <span>Sorted by semantic relevance</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredResults.map((paper) => {
              const isAdded = existingPaperIds.has(paper.id);
              return (
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
                        {paper.isOpenAccess && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Open Access
                          </span>
                        )}
                        <span className="text-xs text-zinc-400">
                          {paper.venue || 'Scholarly Publication'} • {paper.year}
                        </span>
                        {paper.relevanceScore && (
                          <span className="text-[11px] font-mono text-zinc-500">
                            Relevance: {Math.round(paper.relevanceScore * 100)}%
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

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onAddPaperToProject(paper)}
                        disabled={isAdded}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-zinc-800 text-zinc-400 cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                        }`}
                      >
                        {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{isAdded ? 'In Workspace' : 'Add to Project'}</span>
                      </button>

                      <button
                        onClick={() => onInspectPaper(paper)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                        title="Inspect in Reader"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onAskAiAboutPaper(paper)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                        title="Ask RAG Chat"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Abstract */}
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {paper.abstract}
                  </p>

                  {/* Footer metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-500">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-cyan-400">{paper.citationCount} citations</span>
                      {paper.doi && (
                        <span>DOI: <strong className="text-zinc-400 font-mono">{paper.doi}</strong></span>
                      )}
                      {paper.arxivId && (
                        <span>arXiv: <strong className="text-zinc-400 font-mono">{paper.arxivId}</strong></span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {paper.pdfUrl && (
                        <a
                          href={paper.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-indigo-400 hover:underline"
                        >
                          <FileText className="w-3 h-3" />
                          <span>PDF</span>
                        </a>
                      )}
                      {paper.paperUrl && (
                        <a
                          href={paper.paperUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Source URL</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : hasSearched ? (
        <div className="py-16 text-center text-zinc-500">
          <p className="text-sm">No research papers found matching your query criteria.</p>
          <p className="text-xs mt-1">Try broadening search terms or relaxing citation filters.</p>
        </div>
      ) : (
        <div className="py-16 text-center text-zinc-600 border border-dashed border-zinc-800 rounded-2xl">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Enter a natural language query above to discover papers across global registries.</p>
        </div>
      )}
    </div>
  );
};
