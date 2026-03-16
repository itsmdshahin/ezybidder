'use client';

interface Props {
  title?: string;
  description?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({ title = 'Delete', description = 'Are you sure?', onConfirm, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-background/60 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-muted rounded-md">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-error text-error-foreground rounded-md">Delete</button>
        </div>
      </div>
    </div>
  );
}
