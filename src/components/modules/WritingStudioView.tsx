import React, { useState } from 'react';
import {
  PenTool,
  Sparkles,
  Download,
  Copy,
  Check,
  BookOpen,
  Code,
  FileText,
  Loader2,
  Share2,
  RefreshCw
} from 'lucide-react';
import type { WritingDraft, AcademicPaper } from '../../types/research';
import { ApiClient } from '../../services/apiClient';

interface WritingStudioViewProps {
  drafts: WritingDraft[];
  papers: AcademicPaper[];
  onSaveDraft: (draft: WritingDraft) => void;
}

export const WritingStudioView: React.FC<WritingStudioViewProps> = ({
  drafts,
  papers,
  onSaveDraft
}) => {
  const [activeDraftIdx, setActiveDraftIdx] = useState(0);
  const [topic, setTopic] = useState('Deterministic token attribution architecture for grounded scientific literature synthesis');
  const [sectionType, setSectionType] = useState<WritingDraft['sectionType']>('introduction');
  const [format, setFormat] = useState<'markdown' | 'latex'>('markdown');
  const [withCitations, setWithCitations] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeDraft = drafts[activeDraftIdx] || drafts[0];

  const handleGenerate = async () => {
    if (!topic.trim() || generating) return;
    setGenerating(true);

    try {
      const res = await ApiClient.generateWritingDraft({
        sectionType,
        topic: topic.trim(),
        papers,
        withCitations,
        format
      });

      const newDraft: WritingDraft = {
        id: `draft_${Date.now()}`,
        title: `${sectionType.toUpperCase()}: ${topic.substring(0, 40)}`,
        sectionType,
        format,
        content: res.content,
        citedPaperIds: papers.map(p => p.id),
        bibtex: res.bibtex,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSaveDraft(newDraft);
      setActiveDraftIdx(0);
    } catch (err) {
      console.error('Draft generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!activeDraft) return;
    navigator.clipboard.writeText(activeDraft.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeDraft) return;
    const ext = activeDraft.format === 'latex' ? 'tex' : 'md';
    const blob = new Blob([activeDraft.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `draft_${activeDraft.sectionType}_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto p-6 gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-0.5">
            <PenTool className="w-3.5 h-3.5" />
            <span>ACADEMIC MANUSCRIPT & LATEX STUDIO</span>
          </div>
          <h2 className="text-base font-bold text-white">Scientific Writing Assistant</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Draft'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export {activeDraft?.format === 'latex' ? '.tex' : '.md'}</span>
          </button>
        </div>
      </div>

      {/* 3-Column Split Studio */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Column: References & Literature Context (3 cols) */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 overflow-y-auto space-y-3">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Indexed Sources ({papers.length})</span>
          </div>

          <p className="text-[11px] text-zinc-500">
            ARIS strictly cites these papers. No fake citations are generated.
          </p>

          <div className="space-y-2">
            {papers.map((p, idx) => (
              <div key={p.id} className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1 text-xs">
                <span className="font-mono text-[10px] text-indigo-400 font-bold">[{idx + 1}]</span>
                <p className="font-semibold text-zinc-200 line-clamp-1">{p.title}</p>
                <p className="text-[10px] text-zinc-500">{p.authors[0]?.name} • {p.venue || 'Venue'} ({p.year})</p>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Editor (6 cols) */}
        <div className="lg:col-span-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {activeDraft?.title || 'Academic Draft'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                {activeDraft?.format}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setFormat('markdown')}
                className={`px-2 py-1 rounded text-xs font-medium ${activeDraft?.format === 'markdown' ? 'bg-indigo-600 text-white' : 'text-zinc-400'}`}
              >
                Markdown
              </button>
              <button
                onClick={() => setFormat('latex')}
                className={`px-2 py-1 rounded text-xs font-medium ${activeDraft?.format === 'latex' ? 'bg-indigo-600 text-white' : 'text-zinc-400'}`}
              >
                LaTeX
              </button>
            </div>
          </div>

          <textarea
            value={activeDraft?.content || ''}
            onChange={(e) => {
              if (activeDraft) {
                onSaveDraft({ ...activeDraft, content: e.target.value, updatedAt: new Date().toISOString() });
              }
            }}
            placeholder="Generated draft text will appear here..."
            className="w-full flex-1 bg-zinc-950 border border-zinc-850 rounded-xl p-4 font-mono text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none my-3 leading-relaxed"
          />

          <div className="text-[10px] text-zinc-500 flex justify-between items-center font-mono">
            <span>Traceable scientific citations</span>
            <span>Character count: {activeDraft?.content?.length || 0}</span>
          </div>
        </div>

        {/* Right Column: AI Assistant Controls (3 cols) */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 overflow-y-auto space-y-4">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Writing Engine</span>
          </div>

          {/* Section Picker */}
          <div className="space-y-1">
            <label className="text-[11px] text-zinc-400 font-medium">Target Section</label>
            <select
              value={sectionType}
              onChange={(e) => setSectionType(e.target.value as any)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none capitalize"
            >
              {['abstract', 'introduction', 'related_work', 'methodology', 'experiments', 'discussion', 'conclusion'].map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Topic Objective */}
          <div className="space-y-1">
            <label className="text-[11px] text-zinc-400 font-medium">Research Focus</label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none resize-none"
            />
          </div>

          {/* Citations Toggle */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={withCitations}
                onChange={(e) => setWithCitations(e.target.checked)}
                className="rounded bg-zinc-800 border-zinc-700 text-indigo-600 focus:ring-0"
              />
              <span>Generate with Strict Citations</span>
            </label>
            <p className="text-[10px] text-zinc-500">
              Only references papers already ingested into ARIS. Never invents citations.
            </p>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{generating ? 'Drafting Section...' : 'Draft Section'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
