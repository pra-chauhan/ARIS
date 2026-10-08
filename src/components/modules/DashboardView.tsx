import React from 'react';
import {
  FileText,
  Hash,
  AlertTriangle,
  FlaskConical,
  Search,
  Upload,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import type { ResearchProject, AcademicPaper } from '../../types/research';
import type { NavTab } from '../layout/Sidebar';

interface DashboardViewProps {
  project: ResearchProject;
  onNavigate: (tab: NavTab) => void;
  onSelectPaper: (paper: AcademicPaper) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  onNavigate,
  onSelectPaper
}) => {
  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Hero Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Research Operating System</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            {project.name}
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('search')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Discover Papers</span>
            </button>
            <button
              onClick={() => onNavigate('papers')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF Paper</span>
            </button>
            <button
              onClick={() => onNavigate('rag-chat')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Query Citation RAG</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('papers')}
          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-5 rounded-xl cursor-pointer transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400">Indexed Papers</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{project.papers.length}</div>
          <div className="text-[11px] text-zinc-500">Cross-verified across 4 academic APIs</div>
        </div>

        <div 
          onClick={() => onNavigate('rag-chat')}
          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-5 rounded-xl cursor-pointer transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400">Grounded Chunks</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Hash className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{project.chunks.length}</div>
          <div className="text-[11px] text-zinc-500">Section-aware context windows</div>
        </div>

        <div 
          onClick={() => onNavigate('gaps')}
          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-5 rounded-xl cursor-pointer transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400">Detected Research Gaps</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{project.gaps.length}</div>
          <div className="text-[11px] text-zinc-500">Separated: Evidence / Inference / Hypo</div>
        </div>

        <div 
          onClick={() => onNavigate('experiments')}
          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-5 rounded-xl cursor-pointer transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400">Active Experiment Plans</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{project.experiments.length}</div>
          <div className="text-[11px] text-zinc-500">Variables & baselines formulated</div>
        </div>
      </div>

      {/* Two Column Layout: Papers & Research Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Corpus Papers */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-100">Project Literature Corpus</h2>
              <p className="text-xs text-zinc-400">Manuscripts currently indexed in hybrid RAG vector space</p>
            </div>
            <button
              onClick={() => onNavigate('papers')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {project.papers.slice(0, 4).map((paper) => (
              <div
                key={paper.id}
                onClick={() => {
                  onSelectPaper(paper);
                  onNavigate('reader');
                }}
                className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-850 hover:border-zinc-700 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {paper.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                      {paper.abstract}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-zinc-500">
                      <span>{paper.authors.map(a => a.name).slice(0, 2).join(', ')}</span>
                      <span>•</span>
                      <span>{paper.venue || 'Academic Venue'} ({paper.year})</span>
                      <span>•</span>
                      <span className="font-mono text-cyan-400">{paper.citationCount} citations</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                        {paper.source}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-indigo-400 flex items-center gap-1">
                      Inspect <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Key Insights & Gaps */}
        <div className="space-y-6">
          {/* Research Gaps Alert */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-semibold text-zinc-100">Top Research Gap</h2>
              </div>
              <button
                onClick={() => onNavigate('gaps')}
                className="text-xs text-amber-400 hover:text-amber-300"
              >
                Explore All
              </button>
            </div>

            {project.gaps.length > 0 ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <div className="text-xs font-semibold text-amber-300 mb-1">
                    {project.gaps[0].title}
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-3 mb-2">
                    {project.gaps[0].evidence}
                  </p>
                  <div className="text-[10px] text-zinc-500">
                    <strong className="text-zinc-400">Suggested Direction: </strong>
                    {project.gaps[0].suggestedDirection}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500">No gaps detected yet.</p>
            )}
          </div>

          {/* Reproducibility Quick Pulse */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-zinc-100">Reproducibility Pulse</h2>
              </div>
              <button
                onClick={() => onNavigate('reproducibility')}
                className="text-xs text-emerald-400 hover:text-emerald-300"
              >
                Full Audit
              </button>
            </div>

            {project.reproducibilityReports.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400 truncate max-w-[180px]">
                    {project.reproducibilityReports[0].paperTitle}
                  </span>
                  <span className="text-sm font-bold text-emerald-400">
                    {project.reproducibilityReports[0].overallScore}/100
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${project.reproducibilityReports[0].overallScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-2">
                  Code & benchmark verified. Minor seed variance documentation required.
                </p>
              </div>
            ) : (
              <p className="text-xs text-zinc-500">No reproducibility reports generated yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
