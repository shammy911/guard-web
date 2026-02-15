"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const session = useSession();
  const isActive = (path: string) => pathname === path;
  const user = session.data?.user;
  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U";
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
        <div className="hidden md:absolute md:left-1/2 md:flex md:-translate-x-1/2 md:items-center md:gap-8">
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

        <div className="hidden md:flex md:items-center md:gap-4 ">
          {user ? (
            <>
              <div className="relative">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-3 rounded-full border border-gray-800 bg-gray-950 px-3 py-2 transition-colors hover:border-gray-700">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                        {initials}
                      </div>
                    )}
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-medium text-white">
                        {user.name || "User"}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {user.email || "No email"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen((open) => !open)}
                      className="rounded-full border border-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-900 hover:text-white"
                      aria-label="Open user menu"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isUserMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {isUserMenuOpen ? (
                  <div className="absolute  right-0 mt-2 w-48 rounded-lg border border-gray-800 bg-gray-950 py-2 shadow-xl">
                    <Link
                      href="/app/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-blue-600/30 hover:text-white"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                      className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-orange-600/30 hover:text-white"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
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
            {user ? (
              <>
                <Link
                  href="/app/dashboard"
                  className="block text-center text-sm font-medium text-gray-300 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                      {initials}
                    </div>
                  )}
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-medium text-white">
                      {user.name || "User"}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {user.email || "No email"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="block w-full rounded-lg border border-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-900 hover:text-white"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
