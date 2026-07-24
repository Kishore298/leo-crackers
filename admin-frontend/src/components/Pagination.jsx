import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ page, pages, setPage }) => {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      range.unshift("...");
    }
    if (page + delta < pages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (pages !== 1) {
      range.push(pages);
    }
    return range;
  };

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 py-4 border-t border-border bg-surface-2 flex-wrap px-4">
      <button 
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg font-bold text-sm transition bg-surface border border-border hover:border-primary text-text-secondary disabled:opacity-50 disabled:hover:border-border disabled:cursor-not-allowed"
      >
        <FaChevronLeft className="text-xs" />
      </button>

      {getPageNumbers().map((p, i) => (
        p === "..." ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-text-secondary">...</span>
        ) : (
          <button 
            key={p} 
            onClick={() => setPage(p)}
            className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-lg font-bold text-sm transition ${
              p === page 
                ? 'bg-fire-gradient text-white shadow-[0_0_15px_rgba(255,102,0,0.4)] border-none' 
                : 'bg-surface border border-border hover:border-primary text-text-secondary'
            }`}
          >
            {p}
          </button>
        )
      ))}

      <button 
        onClick={() => setPage(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg font-bold text-sm transition bg-surface border border-border hover:border-primary text-text-secondary disabled:opacity-50 disabled:hover:border-border disabled:cursor-not-allowed"
      >
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  );
};

export default Pagination;
