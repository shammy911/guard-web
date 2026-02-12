"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Shield className="h-6 w-6 text-emerald-500" />
            <span className="text-lg font-bold tracking-tight text-white">
              Guard
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-emerald-400 ${isActive("/") ? "text-emerald-500" : "text-gray-300"}`}
          >
            Home
          </Link>
          <Link
            href="/pricing"
            className={`text-sm font-medium transition-colors hover:text-emerald-400 ${isActive("/pricing") ? "text-emerald-500" : "text-gray-300"}`}
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className={`text-sm font-medium transition-colors hover:text-emerald-400 ${isActive("/docs") ? "text-emerald-500" : "text-gray-300"}`}
          >
            Docs
          </Link>
          <Link
            href="/status"
            className={`text-sm font-medium transition-colors hover:text-emerald-400 ${isActive("/status") ? "text-emerald-500" : "text-gray-300"}`}
          >
            Status
          </Link>
        </div>

        <div className="hidden md:flex md:items-center md:gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-950"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-4 space-y-4">
          <Link
            href="/"
            className="block text-sm font-medium text-gray-300 hover:text-emerald-400"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/pricing"
            className="block text-sm font-medium text-gray-300 hover:text-emerald-400"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className="block text-sm font-medium text-gray-300 hover:text-emerald-400"
            onClick={() => setIsOpen(false)}
          >
            Docs
          </Link>
          <Link
            href="/status"
            className="block text-sm font-medium text-gray-300 hover:text-emerald-400"
            onClick={() => setIsOpen(false)}
          >
            Status
          </Link>
          <div className="pt-4 border-t border-gray-800 flex flex-col gap-3">
            <Link
              href="/login"
              className="block text-center text-sm font-medium text-gray-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="block text-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              onClick={() => setIsOpen(false)}
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
