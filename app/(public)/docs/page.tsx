"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
export default function Page() {
  const [activeTab, setActiveTab] = useState<"quickstart" | "api" | "examples">(
    "quickstart",
  );
  const [copied, setCopied] = useState(false);
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Sidebar Nav */}
            <div className="w-full md:w-64 flex-shrink-0">
              <h2 className="text-lg font-bold text-white mb-4">
                Documentation
              </h2>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("quickstart")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "quickstart" ? "bg-emerald-500/10 text-emerald-400" : "text-gray-400 hover:text-white hover:bg-gray-900"}`}
                >
                  Quickstart
                </button>
                <button
                  onClick={() => setActiveTab("api")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "api" ? "bg-emerald-500/10 text-emerald-400" : "text-gray-400 hover:text-white hover:bg-gray-900"}`}
                >
                  API Reference
                </button>
                <button
                  onClick={() => setActiveTab("examples")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "examples" ? "bg-emerald-500/10 text-emerald-400" : "text-gray-400 hover:text-white hover:bg-gray-900"}`}
                >
                  Examples
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {activeTab === "quickstart" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-4">
                      Quickstart Guide
                    </h1>
                    <p className="text-gray-400 text-lg">
                      Get up and running with Guard in less than 5 minutes.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="border-l-2 border-emerald-500 pl-4">
                      <h3 className="text-lg font-semibold text-white">
                        1. Install the SDK
                      </h3>
                      <p className="text-gray-400 mt-1 mb-3">
                        Install the Guard Node.js client.
                      </p>
                      <div className="relative rounded-lg bg-gray-900 border border-gray-800 p-4 font-mono text-sm">
                        <span className="text-emerald-400">npm</span> install
                        @guard/node
                        <button
                          onClick={() => copyCode("npm install @guard/node")}
                          className="absolute top-3 right-3 text-gray-500 hover:text-white"
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="border-l-2 border-emerald-500 pl-4">
                      <h3 className="text-lg font-semibold text-white">
                        2. Initialize Client
                      </h3>
                      <p className="text-gray-400 mt-1 mb-3">
                        Use your API key from the dashboard.
                      </p>
                      <div className="rounded-lg bg-gray-900 border border-gray-800 p-4 font-mono text-sm overflow-x-auto">
                        <div className="text-gray-300">
                          <span className="text-purple-400">import</span> {"{"}{" "}
                          Guard {"}"}{" "}
                          <span className="text-purple-400">from</span>{" "}
                          <span className="text-green-300">'@guard/node'</span>;
                          <br />
                          <br />
                          <span className="text-purple-400">const</span> guard ={" "}
                          <span className="text-purple-400">new</span>{" "}
                          <span className="text-yellow-300">Guard</span>({"{"}
                          <br />
                          &nbsp;&nbsp;apiKey:{" "}
                          <span className="text-green-300">'grd_live_...'</span>
                          <br />
                          {"}"});
                        </div>
                      </div>
                    </div>

                    <div className="border-l-2 border-emerald-500 pl-4">
                      <h3 className="text-lg font-semibold text-white">
                        3. Check Requests
                      </h3>
                      <p className="text-gray-400 mt-1 mb-3">
                        Call the check method before your business logic.
                      </p>
                      <div className="rounded-lg bg-gray-900 border border-gray-800 p-4 font-mono text-sm overflow-x-auto">
                        <div className="text-gray-300">
                          <span className="text-purple-400">const</span> {"{"}{" "}
                          allowed {"}"} ={" "}
                          <span className="text-purple-400">await</span> guard.
                          <span className="text-yellow-300">check</span>({"{"}
                          <br />
                          &nbsp;&nbsp;ip:{" "}
                          <span className="text-green-300">'1.2.3.4'</span>,
                          <br />
                          &nbsp;&nbsp;path:{" "}
                          <span className="text-green-300">'/api/login'</span>
                          <br />
                          {"}"});
                          <br />
                          <br />
                          <span className="text-purple-400">
                            if
                          </span> (!allowed) {"{"}
                          <br />
                          &nbsp;&nbsp;
                          <span className="text-purple-400">
                            throw new
                          </span>{" "}
                          <span className="text-yellow-300">Error</span>(
                          <span className="text-green-300">'Rate limited'</span>
                          );
                          <br />
                          {"}"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "api" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-4">
                      API Reference
                    </h1>
                    <p className="text-gray-400 text-lg">
                      Direct HTTP endpoints if you prefer not to use the SDK.
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
                      <div className="bg-gray-900/80 border-b border-gray-800 px-6 py-4 flex items-center gap-3">
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-bold">
                          POST
                        </span>
                        <code className="text-sm font-mono text-white">
                          /v1/check
                        </code>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-400 mb-4">
                          Check if a request should be allowed or blocked.
                        </p>
                        <h4 className="text-sm font-semibold text-white mb-2">
                          Request Body
                        </h4>
                        <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300 mb-4">
                          {`{
  "apiKey": "string",
  "ip": "string",
  "path": "string",
  "method": "string" // optional
}`}
                        </pre>
                        <h4 className="text-sm font-semibold text-white mb-2">
                          Response
                        </h4>
                        <pre className="bg-gray-950 rounded-lg p-4 text-sm font-mono text-gray-300">
                          {`{
  "allowed": boolean,
  "remaining": number,
  "reset": number // unix timestamp
}`}
                        </pre>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
                      <div className="bg-gray-900/80 border-b border-gray-800 px-6 py-4 flex items-center gap-3">
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold">
                          GET
                        </span>
                        <code className="text-sm font-mono text-white">
                          /v1/usage
                        </code>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-400 mb-4">
                          Get current usage statistics for an API key.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "examples" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-4">
                      Examples
                    </h1>
                    <p className="text-gray-400 text-lg">
                      Common patterns and integrations.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        Express Middleware
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Protect all routes in an Express application.
                      </p>
                      <div className="rounded-lg bg-gray-900 border border-gray-800 p-4 font-mono text-sm overflow-x-auto">
                        <div className="text-gray-300">
                          app.<span className="text-yellow-300">use</span>(
                          <span className="text-purple-400">async</span> (req,
                          res, next) =&gt; {"{"}
                          <br />
                          &nbsp;&nbsp;
                          <span className="text-purple-400">const</span> result
                          = <span className="text-purple-400">await</span>{" "}
                          guard.<span className="text-yellow-300">check</span>(
                          {"{"}
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;ip: req.ip,
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;path: req.path
                          <br />
                          &nbsp;&nbsp;{"}"});
                          <br />
                          <br />
                          &nbsp;&nbsp;
                          <span className="text-purple-400">if</span>{" "}
                          (!result.allowed) {"{"}
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <span className="text-purple-400">return</span> res.
                          <span className="text-yellow-300">status</span>(429).
                          <span className="text-yellow-300">send</span>(
                          <span className="text-green-300">
                            'Too Many Requests'
                          </span>
                          );
                          <br />
                          &nbsp;&nbsp;{"}"}
                          <br />
                          &nbsp;&nbsp;
                          <span className="text-yellow-300">next</span>();
                          <br />
                          {"}"});
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
