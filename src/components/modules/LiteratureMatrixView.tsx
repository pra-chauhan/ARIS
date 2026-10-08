import React, { useState } from 'react';
import {
  TableProperties,
  Download,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Sparkles,
  FileText,
  Filter,
  CheckCircle2
} from 'lucide-react';
import type { AcademicPaper, LiteratureCollection } from '../../types/research';

interface LiteratureMatrixViewProps {
  papers: AcademicPaper[];
  collections: LiteratureCollection[];
  onSelectPaper: (paper: AcademicPaper) => void;
}

export const LiteratureMatrixView: React.FC<LiteratureMatrixViewProps> = ({
  papers,
  collections,
  onSelectPaper
}) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [copiedAllBibtex, setCopiedAllBibtex] = useState(false);

  const filteredPapers = selectedCollection === 'all'
    ? papers
    : papers.filter(p => {
        const col = collections.find(c => c.id === selectedCollection);
        return col?.paperIds.includes(p.id);
      });

  // Build collective BibTeX
  const fullBibtex = filteredPapers.map(p => {
    const firstAuthor = (p.authors[0]?.name || 'Author').split(' ').pop()?.toLowerCase() || 'ref';
    const key = `${firstAuthor}${p.year}`;
    return `@article{${key},\n  title={${p.title}},\n  author={${p.authors.map(a => a.name).join(' and ')}},\n  year={${p.year}},\n  journal={${p.venue || 'Academic Venue'}}${p.doi ? `,\n  doi={${p.doi}}` : ''}\n}`;
  }).join('\n\n');

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(fullBibtex);
    setCopiedAllBibtex(true);
    setTimeout(() => setCopiedAllBibtex(false), 2000);
  };

  const handleDownloadBibtex = () => {
    const blob = new Blob([fullBibtex], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aris_literature_corpus_${Date.now()}.bib`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <TableProperties className="w-3.5 h-3.5" />
            <span>SYNTHESIS & CITATION MANAGEMENT</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Literature Matrix & Citations</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Cross-compare methodologies, datasets, findings, and export publication-ready BibTeX bibliographies.
          </p>
        </div>

        {/* BibTeX Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyBibtex}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedAllBibtex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAllBibtex ? 'BibTeX Copied' : 'Copy All BibTeX'}</span>
          </button>
          <button
            onClick={handleDownloadBibtex}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .bib</span>
          </button>
        </div>
      </div>

      {/* Collection Filter */}
      {collections.length > 0 && (
        <div className="flex items-center gap-2 text-xs border-b border-zinc-800 pb-2">
          <span className="text-zinc-500">Filter Collection:</span>
          <button
            onClick={() => setSelectedCollection('all')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              selectedCollection === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All ({papers.length})
          </button>
          {collections.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCollection(c.id)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                selectedCollection === c.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Comparative Matrix Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/80 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="p-4 min-w-[200px]">Paper & Authors</th>
                <th className="p-4 min-w-[120px]">Year / Venue</th>
                <th className="p-4 min-w-[220px]">Research Problem</th>
                <th className="p-4 min-w-[220px]">Methodology</th>
                <th className="p-4 min-w-[200px]">Key Findings</th>
                <th className="p-4 min-w-[180px]">Disclosed Limitations</th>
                <th className="p-4 min-w-[80px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
              {filteredPapers.map((paper) => (
                <tr key={paper.id} className="hover:bg-zinc-850/50 transition-colors">
                  <td className="p-4 align-top">
                    <div className="font-semibold text-zinc-100 hover:text-indigo-400 cursor-pointer" onClick={() => onSelectPaper(paper)}>
                      {paper.title}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1 line-clamp-1">
                      {paper.authors.map(a => a.name).join(', ')}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <span className="font-mono text-zinc-200">{paper.year}</span>
                    <div className="text-[11px] text-zinc-500 truncate max-w-[120px]">
                      {paper.venue || 'Academic Venue'}
                    </div>
                  </td>
                  <td className="p-4 align-top leading-relaxed text-zinc-400">
                    {paper.abstract.substring(0, 140)}...
                  </td>
                  <td className="p-4 align-top leading-relaxed text-zinc-300">
                    {paper.sections?.find(s => s.title.toLowerCase().includes('method'))?.content.substring(0, 140) ||
                      'Dense vector and sparse lexical representations.'}
                  </td>
                  <td className="p-4 align-top leading-relaxed">
                    {paper.claims && paper.claims.length > 0 ? (
                      <span className="text-emerald-300">
                        {paper.claims[0].statement}
                      </span>
                    ) : (
                      <span className="text-zinc-400">Evaluated on standard benchmarks.</span>
                    )}
                  </td>
                  <td className="p-4 align-top text-zinc-400 leading-relaxed text-[11px]">
                    {(paper.limitations || []).slice(0, 2).join('; ') || 'Domain bounds.'}
                  </td>
                  <td className="p-4 align-top text-right">
                    <button
                      onClick={() => onSelectPaper(paper)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Inspect"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
