'use client';

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
}

export default function PaginationControls({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing page {page} of {totalPages} — {total.toLocaleString()} total
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={prev} disabled={page === 1} className="px-3 py-2 bg-background border rounded-md">Prev</button>
        <button onClick={next} disabled={page === totalPages} className="px-3 py-2 bg-background border rounded-md">Next</button>
      </div>
    </div>
  );
}
