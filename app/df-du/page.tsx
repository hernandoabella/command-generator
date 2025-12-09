"use client";

import { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

export default function BashCommandGenerator() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<"curl" | "wget">("curl");
  const [copied, setCopied] = useState(false);

  // Generate command safely
  const command =
    method === "curl"
      ? `curl -s "${url}"`
      : `wget -qO- "${url}"`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6 py-10">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-zinc-200">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-black" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Bash Command Generator
          </h1>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-600">
            Enter URL
          </label>
          <input
            className="w-full p-3 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="https://example.com/api"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        {/* Method Toggle */}
        <div className="flex gap-3">
          {["curl", "wget"].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m as "curl" | "wget")}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                method === m
                  ? "bg-black text-white border-black"
                  : "border-zinc-300 hover:bg-zinc-100"
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Output Box */}
        <div className="bg-zinc-900 text-zinc-100 p-4 rounded-xl font-mono text-sm relative">
          <pre className="whitespace-pre-wrap">{command}</pre>

          <button
            onClick={copyToClipboard}
            className="absolute top-3 right-3 bg-white text-black p-1.5 rounded-lg shadow hover:bg-zinc-200 transition"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
