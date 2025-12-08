"use client";

import { useState } from "react";
import Sidebar from "../components/SideBar";
import { Copy } from "lucide-react";

export default function ChmodGenerator() {
  const [owner, setOwner] = useState("7");
  const [group, setGroup] = useState("5");
  const [other, setOther] = useState("5");

  const permissions = `${owner}${group}${other}`;

  const descriptions: Record<string, string> = {
    "7": "Read, write and execute",
    "6": "Read and write",
    "5": "Read and execute",
    "4": "Read only",
    "3": "Write and execute",
    "2": "Write only",
    "1": "Execute only",
    "0": "No permissions"
  };

  const example = `chmod ${permissions} <file-or-folder>`;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
      <Sidebar />

      <main className="ml-56 p-12 w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">chmod Permission Generator</h1>

        {/* SELECTS */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {/* OWNER */}
          <div>
            <label className="font-semibold">Owner</label>
            <select
              className="w-full mt-2 p-3 rounded-lg bg-zinc-200 dark:bg-zinc-800"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            >
              {Object.keys(descriptions).map((p) => (
                <option key={p} value={p}>
                  {p} - {descriptions[p]}
                </option>
              ))}
            </select>
          </div>

          {/* GROUP */}
          <div>
            <label className="font-semibold">Group</label>
            <select
              className="w-full mt-2 p-3 rounded-lg bg-zinc-200 dark:bg-zinc-800"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              {Object.keys(descriptions).map((p) => (
                <option key={p} value={p}>
                  {p} - {descriptions[p]}
                </option>
              ))}
            </select>
          </div>

          {/* OTHER */}
          <div>
            <label className="font-semibold">Other</label>
            <select
              className="w-full mt-2 p-3 rounded-lg bg-zinc-200 dark:bg-zinc-800"
              value={other}
              onChange={(e) => setOther(e.target.value)}
            >
              {Object.keys(descriptions).map((p) => (
                <option key={p} value={p}>
                  {p} - {descriptions[p]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-xl relative">
          <button
            onClick={() => navigator.clipboard.writeText(example)}
            className="absolute right-3 top-3 p-2 rounded-md bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition"
          >
            <Copy size={16} />
          </button>

          <p className="font-mono text-lg">{example}</p>
        </div>

        {/* DETAILS */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Permission Breakdown</h2>

          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Owner:</strong> {descriptions[owner]}</li>
            <li><strong>Group:</strong> {descriptions[group]}</li>
            <li><strong>Other:</strong> {descriptions[other]}</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-3">Example Usage</h2>

          <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg font-mono">
            chmod {permissions} myscript.sh
          </div>
        </div>
      </main>
    </div>
  );
}
