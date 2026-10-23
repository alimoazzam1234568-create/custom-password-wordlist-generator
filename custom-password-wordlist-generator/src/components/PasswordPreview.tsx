import { useState } from 'react';
import { Copy, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface PasswordPreviewProps {
  passwords: string[];
  onDownload: () => void;
}

const PAGE_SIZE = 100;

export default function PasswordPreview({ passwords, onDownload }: PasswordPreviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const filtered = searchQuery
    ? passwords.filter((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
    : passwords;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const copyPassword = (pw: string, idx: number) => {
    navigator.clipboard.writeText(pw);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(filtered.join('\n'));
  };

  if (passwords.length === 0) return null;

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-700/50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Generated Passwords
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {filtered.length.toLocaleString()} passwords
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              className="w-full sm:w-48 pl-9 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
            />
          </div>
          <button
            onClick={copyAll}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy All</span>
          </button>
          <button
            onClick={onDownload}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm text-white font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Password List */}
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
        <div className="divide-y divide-gray-800/50">
          {paginated.map((pw, idx) => {
            const globalIdx = page * PAGE_SIZE + idx;
            return (
              <div
                key={globalIdx}
                className="group flex items-center px-5 py-2 hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-xs text-gray-600 w-14 font-mono shrink-0">
                  {(globalIdx + 1).toString().padStart(4, '0')}
                </span>
                <span className="font-mono text-sm text-gray-200 flex-1 truncate select-all">
                  {pw}
                </span>
                <button
                  onClick={() => copyPassword(pw, globalIdx)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  {copiedIndex === globalIdx ? (
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-gray-700/50 flex items-center justify-between">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 rounded-lg text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          <span className="text-sm text-gray-400">
            Page {page + 1} of {totalPages.toLocaleString()}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1.5 rounded-lg text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
