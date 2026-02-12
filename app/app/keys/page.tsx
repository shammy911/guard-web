"use client";

import React, { useState } from "react";
import { Plus, Copy, Trash2, RotateCw, Eye, EyeOff } from "lucide-react";
import CreateKeysPage from "./create/page";
export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keys, setKeys] = useState([
    {
      id: 1,
      name: "Production API Key",
      prefix: "grd_live_",
      lastUsed: "2 mins ago",
      created: "Oct 12, 2023",
      status: "active",
    },
    {
      id: 2,
      name: "Development Key",
      prefix: "grd_test_",
      lastUsed: "5 days ago",
      created: "Nov 01, 2023",
      status: "active",
    },
  ]);
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">API Keys</h1>
          <p className="text-gray-400">
            Manage your API keys for authentication.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Key
        </button>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950/50 text-gray-400">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Key Token</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Last Used</th>
              <th className="px-6 py-3 font-medium">Created</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {keys.map((key) => (
              <tr
                key={key.id}
                className="hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4 text-white font-medium">{key.name}</td>
                <td className="px-6 py-4 font-mono text-gray-400">
                  {key.prefix}••••••••••••••••
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">{key.lastUsed}</td>
                <td className="px-6 py-4 text-gray-300">{key.created}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="Copy Key"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="Rotate Key"
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Revoke Key"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Key Modal Mockup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
            {/* <h3 className="text-lg font-bold text-white mb-4">
              Create New API Key
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Key Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Production Server"
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
                >
                  Create Key
                </button>
              </div>
            </div> */}

            <CreateKeysPage />
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
