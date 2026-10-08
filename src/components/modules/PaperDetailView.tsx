import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Hash,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Scale,
  MessageSquare,
  ChevronRight,
  Code2,
  Table as TableIcon,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import type { AcademicPaper, PaperChunk } from '../../types/research';

interface PaperDetailViewProps {
  paper: AcademicPaper;
  chunks: PaperChunk[];
  onAskAi: (paper: AcademicPaper, initialQuery?: string) => void;
  onAuditReproducibility: (paper: AcademicPaper) => void;
  onPeerReview: (paper: AcademicPaper) => void;
}

export const PaperDetailView: React.FC<PaperDetailViewProps> = ({
  paper,
  chunks,
  onAskAi,
  onAuditReproducibility,
  onPeerReview
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'equations' | 'tables' | 'claims' | 'chunks' | 'fulltext'>('overview');
  const [selectedSectionIdx, setSelectedSectionIdx] = useState(0);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const paperChunks = chunks.filter(c => c.paperId === paper.id);

  // Generate BibTeX
  const firstAuthorLast = (paper.authors[0]?.name || 'Author').split(' ').pop()?.toLowerCase() || 'paper';
  const bibtex = `@article{${firstAuthorLast}${paper.year},\n  title={${paper.title}},\n  author={${paper.authors.map(a => a.name).join(' and ')}},\n  year={${paper.year}},\n  journal={${paper.venue || 'Academic Venue'}}${paper.doi ? `,\n  doi={${paper.doi}}` : ''}\n}`;

  const copyBibtex = () => {
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      {/* Paper Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {paper.source}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              {paper.venue || 'Scholarly Publication'} • {paper.year}
            </span>
            {paper.isOpenAccess && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Open Access
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAskAi(paper)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask RAG</span>
            </button>
            <button
              onClick={() => onAuditReproducibility(paper)}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reproducibility</span>
            </button>
            <button
              onClick={() => onPeerReview(paper)}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Peer Review</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">
          {paper.title}
        </h1>

        <div className="text-xs text-zinc-400">
          <strong className="text-zinc-300">Authors: </strong>
          {paper.authors.map(a => a.name + (a.affiliation ? ` (${a.affiliation})` : '')).join(', ')}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 border-b border-zinc-800 pt-3 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'sections', label: `Sections (${paper.sections?.length || 0})` },
            { id: 'equations', label: `Equations (${paper.equations?.length || 0})` },
            { id: 'tables', label: `Tables & Figures (${(paper.tables?.length || 0) + (paper.figures?.length || 0)})` },
            { id: 'claims', label: `Claims & Limits (${(paper.claims?.length || 0) + (paper.limitations?.length || 0)})` },
            { id: 'chunks', label: `RAG Chunks (${paperChunks.length})` },
            { id: 'fulltext', label: 'Full Text Reader' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-3">Abstract</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {paper.abstract}
              </p>
            </div>

            {/* Quick Contextual Prompts */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Contextual AI Inquiries</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'What specific methodology does this paper introduce?',
                  'What are the primary benchmark baselines and datasets?',
                  'What are the stated threats to validity and limitations?',
                  'How does this work compare with standard dense vector RAG?'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAskAi(paper, prompt)}
                    className="p-3 text-left rounded-lg bg-zinc-950/70 border border-zinc-800 hover:border-indigo-500/40 text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span>{prompt}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Metadata Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3 text-xs">
              <h3 className="font-semibold text-zinc-200 uppercase tracking-wider">Citation & Identifiers</h3>
              
              <div className="space-y-2 text-zinc-400">
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span>Citation Count:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{paper.citationCount}</span>
                </div>
                {paper.doi && (
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span>DOI:</span>
                    <span className="font-mono text-zinc-200">{paper.doi}</span>
                  </div>
                )}
                {paper.arxivId && (
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span>arXiv:</span>
                    <span className="font-mono text-zinc-200">{paper.arxivId}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span>Year:</span>
                  <span className="text-zinc-200">{paper.year}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Venue:</span>
                  <span className="text-zinc-200 truncate max-w-[140px]">{paper.venue || 'Academic Venue'}</span>
                </div>
              </div>

              {/* BibTeX box */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-zinc-400">BibTeX Citation</span>
                  <button
                    onClick={copyBibtex}
                    className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedBibtex ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBibtex ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded bg-zinc-950 font-mono text-[10px] text-zinc-400 overflow-x-auto border border-zinc-800">
                  {bibtex}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sections */}
      {activeTab === 'sections' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Section List */}
          <div className="md:col-span-1 space-y-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <div className="px-2 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Document Outline
            </div>
            {paper.sections?.map((sec, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSectionIdx(idx)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedSectionIdx === idx
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>

          {/* Section Content */}
          <div className="md:col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            {paper.sections && paper.sections[selectedSectionIdx] ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <h2 className="text-base font-bold text-white">
                    {paper.sections[selectedSectionIdx].title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAskAi(paper, `Summarize the key arguments of section "${paper.sections![selectedSectionIdx].title}"`)}
                      className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium"
                    >
                      Summarize Section
                    </button>
                    <button
                      onClick={() => onAskAi(paper, `Identify claims and methodological limitations in section "${paper.sections![selectedSectionIdx].title}"`)}
                      className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium"
                    >
                      Audit Claims
                    </button>
                  </div>
                </div>
                <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {paper.sections[selectedSectionIdx].content}
                </div>
              </>
            ) : (
              <p className="text-sm text-zinc-500">No sections available.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Equations */}
      {activeTab === 'equations' && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400">
            Detected mathematical expressions and objective functions extracted from the manuscript.
          </div>
          {paper.equations && paper.equations.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {paper.equations.map((eq) => (
                <div key={eq.id} className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400 font-semibold">{eq.id}</span>
                    <button
                      onClick={() => onAskAi(paper, `Explain the mathematical variables and scientific intuition behind equation: ${eq.latex}`)}
                      className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Explain Formula</span>
                    </button>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-950 font-mono text-sm text-zinc-100 overflow-x-auto border border-zinc-850">
                    {eq.latex}
                  </div>
                  {eq.explanation && (
                    <p className="text-xs text-zinc-400">{eq.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 py-10 text-center">No explicit LaTeX equations detected in this manuscript.</p>
          )}
        </div>
      )}

      {/* Tab 4: Tables & Figures */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          {paper.tables && paper.tables.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-cyan-400" />
                <span>Extracted Tables</span>
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {paper.tables.map(tab => (
                  <div key={tab.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="text-xs font-semibold text-zinc-200">{tab.caption}</div>
                    {tab.data && (
                      <pre className="p-3 rounded bg-zinc-950 text-xs font-mono text-zinc-300 overflow-x-auto border border-zinc-850">
                        {tab.data}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {paper.figures && paper.figures.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>Extracted Figures & Captions</span>
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {paper.figures.map(fig => (
                  <div key={fig.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="text-xs font-semibold text-zinc-200">{fig.caption}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Claims & Limitations */}
      {activeTab === 'claims' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Claims */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Identified Scientific Claims
            </h3>
            {paper.claims && paper.claims.length > 0 ? (
              paper.claims.map(claim => (
                <div key={claim.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {claim.confidence} Confidence
                    </span>
                    <span className="text-[10px] text-zinc-500">{claim.section}</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-200">{claim.statement}</p>
                  <p className="text-[11px] text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-850">
                    <strong className="text-zinc-500">Evidence: </strong> {claim.evidenceSnippet}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500">No structured claims extracted.</p>
            )}
          </div>

          {/* Limitations */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Disclosed Limitations & Threats to Validity
            </h3>
            {paper.limitations && paper.limitations.length > 0 ? (
              paper.limitations.map((lim, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-300 leading-relaxed">{lim}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500">No explicit limitations found.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: Chunks */}
      {activeTab === 'chunks' && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400">
            Total {paperChunks.length} vector chunks indexed for hybrid BM25 / dense semantic retrieval.
          </div>
          <div className="grid grid-cols-1 gap-3">
            {paperChunks.map(chunk => (
              <div key={chunk.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-semibold">
                    Chunk #{chunk.chunkIndex} • {chunk.section}
                  </span>
                  <span className="text-zinc-500 font-mono">
                    Page {chunk.pageNumber || 1} • ~{chunk.tokenCount || 100} tokens
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed bg-zinc-950 p-3 rounded border border-zinc-850">
                  {chunk.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Full Text */}
      {activeTab === 'fulltext' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <input
            type="text"
            placeholder="Search text in this manuscript..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
          />
          <div className="text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto p-4 bg-zinc-950 rounded border border-zinc-850">
            {paper.fullText || paper.abstract}
          </div>
        </div>
      )}
    </div>
  );
};
