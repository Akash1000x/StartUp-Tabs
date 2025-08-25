import { FolderOpen } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-8 text-slate-400">
      <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
      <p className="text-sm">No websites added yet.</p>
    </div>
  );
}
