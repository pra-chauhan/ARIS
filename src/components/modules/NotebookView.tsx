import React, { useState } from 'react';
import {
  NotebookPen,
  Plus,
  Trash2,
  Sparkles,
  Save,
  Tag,
  Link as LinkIcon,
  BookOpen,
  Loader2,
  FileText
} from 'lucide-react';
import type { ResearchNote, AcademicPaper } from '../../types/research';

interface NotebookViewProps {
  notes: ResearchNote[];
  papers: AcademicPaper[];
  onSaveNote: (note: ResearchNote) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NotebookView: React.FC<NotebookViewProps> = ({
  notes,
  papers,
  onSaveNote,
  onDeleteNote
}) => {
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [aiGenerating, setAiGenerating] = useState(false);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const handleCreateNote = () => {
    const newNote: ResearchNote = {
      id: `note_${Date.now()}`,
      title: 'Untitled Research Observation',
      content: '## Research Hypothesis & Notes\n\n- Observation:\n- Methodology thought:\n- Next steps:',
      tags: ['Hypothesis'],
      linkedPaperIds: papers.slice(0, 1).map(p => p.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveNote(newNote);
    setActiveNoteId(newNote.id);
  };

  const handleTitleChange = (val: string) => {
    if (!activeNote) return;
    onSaveNote({ ...activeNote, title: val, updatedAt: new Date().toISOString() });
  };

  const handleContentChange = (val: string) => {
    if (!activeNote) return;
    onSaveNote({ ...activeNote, content: val, updatedAt: new Date().toISOString() });
  };

  const handleAiAction = (action: 'summarize' | 'synthesize' | 'todos') => {
    if (!activeNote) return;
    setAiGenerating(true);

    setTimeout(() => {
      let appended = '';
      if (action === 'summarize') {
        appended = '\n\n### AI Synthesis Summary\nKey scientific consensus identifies sparse BM25 fusion as necessary for domain-specific terminology preservation, while random seed variance accounts for over 40% of observed leaderboard shifts.';
      } else if (action === 'todos') {
        appended = '\n\n### Actionable Research Tasks\n- [ ] Benchmark token attribution matrix on 5 distinct initialization seeds\n- [ ] Extract confidence intervals for SciFact evaluation table\n- [ ] Containerize baseline dependencies in reproducible Dockerfile';
      } else {
        appended = '\n\n### Cross-Paper Methodological Synthesis\nLinking Rostova et al. (ACL 2024) attribution with Vance et al. (NeurIPS 2024) seed audit: attribution gates maintain high precision even under stochastic initialization noise, confirming architectural validity.';
      }

      onSaveNote({
        ...activeNote,
        content: activeNote.content + appended,
        updatedAt: new Date().toISOString()
      });
      setAiGenerating(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto p-6 gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-0.5">
            <NotebookPen className="w-3.5 h-3.5" />
            <span>LABORATORY & LITERATURE LOG</span>
          </div>
          <h2 className="text-base font-bold text-white">Research Notebook</h2>
        </div>

        <button
          onClick={handleCreateNote}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Split View: Left List, Right Editor */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {/* Left: Notes List */}
        <div className="md:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 overflow-y-auto space-y-2">
          {notes.map((note) => {
            const isSelected = note.id === activeNote?.id;
            return (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-zinc-850 border-indigo-500/50 shadow-md'
                    : 'bg-zinc-950/60 border-zinc-850 hover:border-zinc-750'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold text-zinc-100 line-clamp-1">
                    {note.title || 'Untitled Note'}
                  </h3>
                  {notes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="text-zinc-500 hover:text-rose-400 p-0.5"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                  {note.content.replace(/#+/g, '').trim()}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {note.tags.map((t, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                      #{t}
                    </span>
                  ))}
                  <span className="text-[9px] text-zinc-500 ml-auto font-mono">
                    {new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Markdown Editor */}
        {activeNote ? (
          <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-xl">
            <div className="space-y-4 flex-1 flex flex-col">
              {/* Note Header & AI Commands */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Note Title..."
                  className="bg-transparent text-lg font-bold text-white focus:outline-none flex-1 min-w-[200px]"
                />

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAiAction('synthesize')}
                    disabled={aiGenerating}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>Synthesize</span>
                  </button>
                  <button
                    onClick={() => handleAiAction('todos')}
                    disabled={aiGenerating}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Extract Tasks</span>
                  </button>
                </div>
              </div>

              {/* Linked Papers Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-zinc-500 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" />
                  <span>Linked Papers:</span>
                </span>
                {papers.map((p) => {
                  const isLinked = activeNote.linkedPaperIds?.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        const newLinked = isLinked
                          ? (activeNote.linkedPaperIds || []).filter(id => id !== p.id)
                          : [...(activeNote.linkedPaperIds || []), p.id];
                        onSaveNote({ ...activeNote, linkedPaperIds: newLinked });
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                        isLinked
                          ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {p.authors[0]?.name.split(' ').pop()} ({p.year})
                    </button>
                  );
                })}
              </div>

              {/* Textarea */}
              <textarea
                value={activeNote.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Write your research observations, mathematical conjectures, or synthesis in Markdown..."
                className="w-full flex-1 bg-zinc-950 border border-zinc-850 rounded-xl p-4 font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/60 resize-none leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
              <span>Auto-saved to workspace</span>
              <span>Markdown formatting supported (headings, lists, code)</span>
            </div>
          </div>
        ) : (
          <div className="md:col-span-2 flex items-center justify-center text-zinc-500">
            Select or create a note.
          </div>
        )}
      </div>
    </div>
  );
};
