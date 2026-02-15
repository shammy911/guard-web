import type { ReactNode } from "react";
import DocsSidebar from "@/components/docs/DocsSidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Sidebar Nav (same UI vibe) */}
            <div className="w-full md:w-64 flex-shrink-0">
              <h2 className="text-lg font-bold text-white mb-4">
                Documentation
              </h2>
              <DocsSidebar />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
