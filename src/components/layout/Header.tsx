import React, { useState } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Sparkles, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Search,
  Hash,
  Database
} from 'lucide-react';
import type { ResearchProject } from '../../types/research';

interface HeaderProps {
  currentProject: ResearchProject;
  projects: ResearchProject[];
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, description: string) => void;
  onExportProject: () => void;
  onImportProject: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasGeminiKey: boolean;
  onOpenQuickSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onCreateProject,
  onExportProject,
  onImportProject,
  hasGeminiKey,
  onOpenQuickSearch
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateProject(newTitle.trim(), newDesc.trim() || 'Custom scientific research workspace.');
    setNewTitle('');
    setNewDesc('');
    setShowNewModal(false);
  };

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between z-20 sticky top-0">
      {/* Left: Project Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={currentProject.id}
                onChange={(e) => onSelectProject(e.target.value)}
                className="bg-transparent text-sm font-semibold text-zinc-100 hover:text-white focus:outline-none cursor-pointer border-b border-dashed border-zinc-700 pb-0.5"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-zinc-900 text-zinc-200">
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowNewModal(true)}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="New Research Project"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-zinc-500 truncate max-w-xs">{currentProject.targetDomain}</p>
          </div>
        </div>

        {/* Project Stats Badges */}
        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-zinc-800 text-xs text-zinc-400">
          <span className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
            <FileText className="w-3 h-3 text-indigo-400" />
            <strong className="text-zinc-200">{currentProject.papers.length}</strong> Papers
          </span>
          <span className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
            <Hash className="w-3 h-3 text-cyan-400" />
            <strong className="text-zinc-200">{currentProject.chunks.length}</strong> Chunks
          </span>
          <span className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <strong className="text-zinc-200">{currentProject.gaps.length}</strong> Gaps
          </span>
        </div>
      </div>

      {/* Right: Quick Actions & Status */}
      <div className="flex items-center gap-3">
        {onOpenQuickSearch && (
          <button
            onClick={onOpenQuickSearch}
            className="hidden sm:flex items-center gap-2 bg-zinc-900 hover:bg-zinc-850 px-3 py-1.5 rounded-lg border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <span>Search corpus...</span>
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-zinc-400">⌘K</kbd>
          </button>
        )}

        {/* API Engine Status */}
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs"
          title={hasGeminiKey ? "Connected to Gemini 3.8 Flash model" : "Operating in deterministic academic reasoning mode"}
        >
          {hasGeminiKey ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-300 font-medium">Gemini 3.8 Flash</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-zinc-300 font-medium">ARIS Academic Engine</span>
            </>
          )}
        </div>

        {/* Export / Import Workspace */}
        <button
          onClick={onExportProject}
          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Export Workspace JSON"
        >
          <Download className="w-4 h-4" />
        </button>

        <label 
          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          title="Import Workspace JSON"
        >
          <Upload className="w-4 h-4" />
          <input type="file" accept=".json" onChange={onImportProject} className="hidden" />
        </label>
      </div>

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Create New Research Project</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Initialize an isolated workspace for literature, embeddings, knowledge graphs, and peer reviews.
            </p>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diffusion Models for Protein Folding"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Target Research Domain</label>
                <input
                  type="text"
                  placeholder="e.g. Structural Biology & Machine Learning"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
