"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`block w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "text-gray-400 hover:text-white hover:bg-gray-900"
      }`}
    >
      {label}
    </Link>
  );
}

export default function DocsSidebar() {
  return (
    <nav className="space-y-1">
      <NavItem href="/docs/quickstart" label="Quickstart" />
      <NavItem href="/docs/api" label="API Reference" />
      <NavItem href="/docs/examples" label="Examples" />
    </nav>
  );
}
