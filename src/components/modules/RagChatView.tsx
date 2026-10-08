import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Loader2,
  FileText,
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Filter,
  X,
  BookOpen
} from 'lucide-react';
import type { AcademicPaper, PaperChunk, ChatMessage, Citation } from '../../types/research';
import { ApiClient } from '../../services/apiClient';

interface RagChatViewProps {
  papers: AcademicPaper[];
  chunks: PaperChunk[];
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  onJumpToPaper: (paperId: string) => void;
  initialActivePaperId?: string;
}

export const RagChatView: React.FC<RagChatViewProps> = ({
  papers,
  chunks,
  messages,
  onSendMessage,
  onJumpToPaper,
  initialActivePaperId
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPaperId, setSelectedPaperId] = useState<string>(initialActivePaperId || 'all');
  const [activeCitationModal, setActiveCitationModal] = useState<Citation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryText = (customQuery || input).trim();
    if (!queryText || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toISOString()
    };
    onSendMessage(userMsg);
    setInput('');
    setLoading(true);

    try {
      const filterPaperIds = selectedPaperId === 'all' ? undefined : [selectedPaperId];
      const result = await ApiClient.queryRag(queryText, chunks, filterPaperIds, 5);

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: result.answer,
        timestamp: new Date().toISOString(),
        citations: result.citations,
        evidenceType: result.evidenceType,
        isInsufficientEvidence: result.isInsufficientEvidence
      };
      onSendMessage(assistantMsg);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: `Error performing citation-grounded retrieval: ${(err as Error).message}`,
        timestamp: new Date().toISOString(),
        isInsufficientEvidence: true
      };
      onSendMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render citation badges [1], [2] as clickable spans
  const renderMessageContent = (msg: ChatMessage) => {
    const text = msg.content;
    const parts = text.split(/(\[\d+\])/g);

    return (
      <div className="space-y-3 leading-relaxed text-sm">
        <div className="whitespace-pre-wrap">
          {parts.map((part, i) => {
            const match = part.match(/\[(\d+)\]/);
            if (match && msg.citations && msg.citations.length > 0) {
              const citeIndex = parseInt(match[1], 10);
              const citation = msg.citations.find(c => c.index === citeIndex);
              if (citation) {
                return (
                  <button
                    key={i}
                    onClick={() => setActiveCitationModal(citation)}
                    className="inline-flex items-center px-1.5 py-0.2 mx-0.5 rounded text-[11px] font-mono font-bold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-colors cursor-pointer align-baseline"
                    title={`Source: ${citation.paperTitle} (${citation.section})`}
                  >
                    [{citeIndex}]
                  </button>
                );
              }
            }
            return <span key={i}>{part}</span>;
          })}
        </div>

        {/* Citations Preview Footer */}
        {msg.citations && msg.citations.length > 0 && (
          <div className="pt-3 border-t border-zinc-800 space-y-1.5">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grounded Citations ({msg.citations.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {msg.citations.map((c) => (
                <div
                  key={c.index}
                  onClick={() => setActiveCitationModal(c)}
                  className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800 hover:border-indigo-500/40 text-xs cursor-pointer transition-all flex items-start gap-2 group"
                >
                  <span className="font-mono text-indigo-400 font-bold shrink-0">[{c.index}]</span>
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-200 truncate group-hover:text-indigo-300">
                      {c.paperTitle}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {c.section} {c.page ? `• Page ${c.page}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto p-6 gap-4">
      {/* Top Scope Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CITATION-GROUNDED RAG ENGINE</span>
          </div>
          <h2 className="text-base font-bold text-white">Academic Evidence Assistant</h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Scope:</span>
          <select
            value={selectedPaperId}
            onChange={(e) => setSelectedPaperId(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-200 focus:outline-none max-w-xs truncate cursor-pointer"
          >
            <option value="all">Entire Project Corpus ({papers.length} Papers)</option>
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-200">Ask Any Question About Your Research</h3>
              <p className="text-xs text-zinc-400 max-w-md mt-1">
                Every claim is verified against indexed document chunks with explicit [1] source attribution. Unsupported claims are rejected.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl w-full pt-2">
              {[
                'What methodology does this paper introduce?',
                'What are the limitations and threats to validity?',
                'How does this approach compare with standard dense vector RAG?',
                'Where does the paper discuss random seed variance?'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(undefined, q)}
                  className="p-3 text-left rounded-xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/40 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-3xl rounded-2xl p-5 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                }`}
              >
                {msg.role === 'assistant' ? renderMessageContent(msg) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}

                <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.evidenceType && (
                    <span className="font-semibold text-zinc-400">
                      Category: {msg.evidenceType}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              <span>Executing BM25 + dense hybrid retrieval and validating citation boundaries...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={(e) => handleSubmit(e)} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            selectedPaperId === 'all'
              ? 'Ask anything across all papers in this project...'
              : `Ask about selected paper (${papers.find(p => p.id === selectedPaperId)?.title.substring(0, 30)}...)...`
          }
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Send</span>
        </button>
      </form>

      {/* Citation Inspector Modal / Drawer */}
      {activeCitationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-indigo-400 font-bold text-sm">
                  Citation [{activeCitationModal.index}]
                </span>
                <span className="text-xs text-zinc-400">Verified Evidence Grounding</span>
              </div>
              <button
                onClick={() => setActiveCitationModal(null)}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {activeCitationModal.paperTitle}
              </h3>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="text-cyan-400 font-semibold">{activeCitationModal.section}</span>
                {activeCitationModal.page && (
                  <span>• Page {activeCitationModal.page}</span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Retrieved Context Passages
              </span>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 leading-relaxed max-h-60 overflow-y-auto">
                {activeCitationModal.snippet}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-zinc-500">
                Extracted by ARIS Attribution Matrix (tau &gt; 0.85)
              </span>
              <button
                onClick={() => {
                  onJumpToPaper(activeCitationModal.paperId);
                  setActiveCitationModal(null);
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open in Reader</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
