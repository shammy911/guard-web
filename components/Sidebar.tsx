"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Key,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const navItems = [
    {
      name: "Dashboard",
      path: "/app/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "API Keys",
      path: "/app/keys",
      icon: Key,
    },
    {
      name: "Logs",
      path: "/app/logs",
      icon: FileText,
    },
    {
      name: "Billing",
      path: "/app/billing",
      icon: CreditCard,
    },
    {
      name: "Settings",
      path: "/app/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-800 bg-gray-950">
      <div className="flex h-16 items-center px-6 border-b border-gray-800">
        <Link href="/app/dashboard" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-emerald-500" />
          <span className="text-lg font-bold text-white">Guard</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500" : "text-gray-400 hover:bg-gray-900 hover:text-white"}`}
              >
                <item.icon
                  className={`h-5 w-5 ${active ? "text-emerald-500" : "text-gray-500"}`}
                />

                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">John Doe</p>
            <p className="truncate text-xs text-gray-500">john@example.com</p>
          </div>
        </div>
        <Link
          href="/login"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </Link>
      </div>
    </div>
  );
}
