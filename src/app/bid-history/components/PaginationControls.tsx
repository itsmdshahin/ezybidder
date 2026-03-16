'use client';

export default function PaginationControls({ page, pageSize, total, onPageChange }: any) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Page {page} of {totalPages} — {total} total
      </div>

      <div className="space-x-2">
        <button
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-3 py-2 bg-muted rounded-md"
        >
          Prev
        </button>

        <button
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-2 bg-muted rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
}
