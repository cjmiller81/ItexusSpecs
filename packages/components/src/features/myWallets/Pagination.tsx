import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (p: number) => void;
  maxWindow?: number;
}

const btnBase: React.CSSProperties = {
  minWidth: 36,
  height: 36,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'transparent',
  color: 'rgba(255,255,255,0.9)',
  cursor: 'pointer',
  userSelect: 'none',
  padding: 0,
};

const btnDisabled: React.CSSProperties = {
  ...btnBase,
  opacity: 0.35,
  cursor: 'not-allowed',
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  background: '#00C48C',
  color: '#0a0a0a',
  border: 'none',
};

function buildPaginationItems(page: number, totalPages: number, window: number) {
  // window = maxWindow (e.g. 2) => show current +/- window
  const items: (number | 'ellipsis')[] = [];
  if (totalPages <= 1) return items;

  const left = Math.max(1, page - window);
  const right = Math.min(totalPages, page + window);

  if (left > 1) {
    items.push(1);
    if (left > 2) items.push('ellipsis');
  }

  for (let i = left; i <= right; i++) items.push(i);

  if (right < totalPages) {
    if (right < totalPages - 1) items.push('ellipsis');
    items.push(totalPages);
  }

  return items;
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  maxWindow = 2,
}: PaginationProps) {
  const items = buildPaginationItems(page, totalPages, maxWindow);

  const startItem = totalItems && itemsPerPage ? (page - 1) * itemsPerPage + 1 : undefined;
  const endItem = totalItems && itemsPerPage ? Math.min(totalItems, page * itemsPerPage) : undefined;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 8,
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {/* Prev */}
      <button
        aria-label="Previous page"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        style={page <= 1 ? btnDisabled : btnBase}
      >
        ←
      </button>

      {/* Page buttons */}
      {items.map((it, idx) =>
        it === 'ellipsis' ? (
          <div
            key={`ell-${idx}`}
            style={{
              minWidth: 36,
              height: 36,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.5)',
              userSelect: 'none',
            }}
          >
            …
          </div>
        ) : (
          <button
            key={it}
            onClick={() => onPageChange(it)}
            aria-current={it === page ? 'page' : undefined}
            style={it === page ? btnActive : btnBase}
          >
            {it}
          </button>
        )
      )}

      {/* Next */}
      <button
        aria-label="Next page"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        style={page >= totalPages ? btnDisabled : btnBase}
      >
        →
      </button>

      {/* Optional info */}
      {typeof startItem === 'number' && typeof endItem === 'number' && typeof totalItems === 'number' && (
        <div style={{ marginLeft: 8, color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
          {startItem}-{endItem} of {totalItems}
        </div>
      )}
    </div>
  );
}