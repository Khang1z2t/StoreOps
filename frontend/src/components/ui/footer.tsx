import { Store } from "lucide-react";

// components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-900/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500">
            <Store className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-zinc-100">StoreOps</span>
        </div>

        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} StoreOps · Built for 7-Eleven Vietnam
        </p>

        <p className="text-xs text-zinc-600">v1.0.0</p>
      </div>
    </footer>
  )
}