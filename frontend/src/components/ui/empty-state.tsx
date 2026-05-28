import { Package } from "lucide-react";

export default function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Package className="mb-4 h-12 w-12 text-zinc-600" />
      <p className="text-sm font-medium text-zinc-400">{title}</p>
      <p className="mt-1 text-xs text-zinc-600">{subtitle}</p>
    </div>
  );
}
