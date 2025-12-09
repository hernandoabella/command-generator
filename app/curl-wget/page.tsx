"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { Copy, Download, Check, ChevronDown, ChevronUp } from "lucide-react";

/* ------------------------------
   TypeScript Interfaces
--------------------------------*/
interface CopyableProps {
  command: string;
  onCopy: (text: string) => void;
  commandName: string;
}

/* ------------------------------
   CopyableCommand Component
--------------------------------*/
const CopyableCommand: React.FC<CopyableProps> = ({
  command,
  onCopy,
  commandName
}) => {
  const [localCopied, setLocalCopied] = useState(false);

  const handleCopy = () => {
    onCopy(command);
    setLocalCopied(true);
    setTimeout(() => setLocalCopied(false), 2000);
  };

  const primaryColorClass = "bg-orange-600 hover:bg-orange-500";

  return (
    <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
      <span className="select-none text-orange-400">$ </span>

      <pre className="flex-1 overflow-x-auto mx-2 whitespace-pre-wrap break-all">
        {command}
      </pre>

      <button
        onClick={handleCopy}
        className={`p-1.5 rounded transition-all flex-shrink-0 ${
          localCopied ? "bg-emerald-600" : primaryColorClass
        }`}
        title="Copy Command"
      >
        {localCopied ? (
          <Check size={16} className="text-white" />
        ) : (
          <Copy size={16} className="text-white" />
        )}
      </button>
    </div>
  );
};

/* ------------------------------
   Main Component
--------------------------------*/
export default function CurlWgetCommandGenerator() {
  const [commandType, setCommandType] = useState<"curl" | "wget">("curl");
  const [url, setUrl] = useState("https://api.example.com/data");
  const [method, setMethod] = useState("GET");
  const [header, setHeader] = useState("Content-Type: application/json");
  const [data, setData] = useState("");
  const [outputFile, setOutputFile] = useState("");
  const [recursive, setRecursive] = useState(false);
  const [limitRate, setLimitRate] = useState("");
  const [generatedCommand, setGeneratedCommand] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  /* -------- Generate Command -------- */
  useEffect(() => {
    let cmd = "";
    const targetUrl = url.trim() || "http://example.com";

    if (commandType === "curl") {
      cmd = "curl";

      // Method
      if (method !== "GET") cmd += ` -X ${method}`;

      // Header
      if (header.trim()) cmd += ` -H '${header}'`;

      // Data
      if (data.trim() && (method === "POST" || method === "PUT" || method === "PATCH")) {
        cmd += ` -d '${data}'`;
      }

      // Output file
      if (outputFile.trim()) {
        cmd += ` -o ${outputFile}`;
      }

      // URL
      cmd += ` ${targetUrl}`;
    } else {
      cmd = "wget";

      // Recursive
      if (recursive) cmd += " -r -l 10";

      // Rate limit
      if (limitRate.trim()) cmd += ` --limit-rate=${limitRate}`;

      // Output file
      if (outputFile.trim()) cmd += ` -O ${outputFile}`;

      // URL
      cmd += ` ${targetUrl}`;
    }

    setGeneratedCommand(cmd.trim().replace(/\s+/g, " "));
  }, [commandType, url, method, header, data, outputFile, recursive, limitRate]);

  /* -------- Copy Logic -------- */
  const copyToClipboard = useCallback(async (text: string) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const inputBaseClasses =
    "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 outline-none transition-all";
  const labelBaseClasses = "block mb-1 text-sm font-medium text-gray-400";
  const containerBaseClasses =
    "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";

  /* ---------------------------------------------------------------
     MAIN RETURN
  ----------------------------------------------------------------*/
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      <Sidebar />

      <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-6xl mx-auto pt-20 lg:pt-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 border-b border-gray-700/50 pb-6">
          <div className="p-3 bg-gradient-to-br from-orange-600 to-amber-700 rounded-xl shadow-lg">
            <Download className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
            curl & wget Command Generator
          </h1>
        </div>

        {/* MODE SELECTION */}
        <div className={`${containerBaseClasses} mb-8 border-orange-700/30`}>
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Select Command Type
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {["curl", "wget"].map((m) => (
              <button
                key={m}
                onClick={() => setCommandType(m as "curl" | "wget")}
                className={`py-3 rounded-xl font-semibold transition-all flex items-center justify-center ${
                  commandType === m
                    ? "bg-orange-600 text-white ring-2 ring-orange-500 shadow"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-700/50 border border-gray-700"
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* INPUTS */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left */}
          <div className={`${containerBaseClasses}`}>
            <h2 className="text-xl font-semibold text-gray-200 mb-6">
              Parameters for{" "}
              <span className="text-orange-400">{commandType}</span>
            </h2>

            <div className="space-y-5">
              <div>
                <label className={labelBaseClasses}>Target URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={inputBaseClasses}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className={labelBaseClasses}>
                  Save Output As {commandType === "curl" ? "(-o)" : "(-O)"}
                </label>
                <input
                  type="text"
                  value={outputFile}
                  onChange={(e) => setOutputFile(e.target.value)}
                  className={inputBaseClasses}
                  placeholder="output.html"
                />
              </div>

              {commandType === "curl" && (
                <div className="space-y-5 border border-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-300">
                    cURL Options
                  </h3>

                  <div>
                    <label className={labelBaseClasses}>HTTP Method</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className={inputBaseClasses}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelBaseClasses}>Header (-H)</label>
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => setHeader(e.target.value)}
                      className={inputBaseClasses}
                      placeholder="Content-Type: application/json"
                    />
                  </div>

                  {(method === "POST" || method === "PUT" || method === "PATCH") && (
                    <div>
                      <label className={labelBaseClasses}>
                        Data Payload (-d)
                      </label>
                      <textarea
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        rows={3}
                        className={inputBaseClasses}
                        placeholder='{"key": "value"}'
                      />
                    </div>
                  )}
                </div>
              )}

              {commandType === "wget" && (
                <div className="space-y-5 border border-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-300">
                    wget Options
                  </h3>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={recursive}
                      onChange={(e) => setRecursive(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-3 text-sm">
                      Recursive Download (-r -l 10)
                    </span>
                  </div>

                  <div>
                    <label className={labelBaseClasses}>
                      Rate Limit (--limit-rate)
                    </label>
                    <input
                      type="text"
                      value={limitRate}
                      onChange={(e) => setLimitRate(e.target.value)}
                      className={inputBaseClasses}
                      placeholder="200k"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className={`${containerBaseClasses} flex flex-col`}>
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              Generated Command
            </h2>

            <div className="flex-1 flex flex-col justify-end">
              {generatedCommand ? (
                <CopyableCommand
                  command={generatedCommand}
                  onCopy={copyToClipboard}
                  commandName={commandType}
                />
              ) : (
                <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                  Fill the form to generate a command.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Guide Section */}
        <div className={`${containerBaseClasses}`}>
          <button
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="w-full flex items-center justify-between text-left"
          >
            <h2 className="text-xl font-semibold text-gray-200">
              Quick Reference Guide
            </h2>
            {isGuideOpen ? (
              <ChevronUp className="text-orange-400" />
            ) : (
              <ChevronDown className="text-orange-400" />
            )}
          </button>

          {isGuideOpen && (
            <div className="mt-6 space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-orange-400 mb-2">curl</h3>
                <ul className="space-y-1 text-sm list-disc list-inside">
                  <li>-X: Specify HTTP method (GET, POST, PUT, DELETE)</li>
                  <li>-H: Add custom headers</li>
                  <li>-d: Send data in request body</li>
                  <li>-o: Save output to file</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-orange-400 mb-2">wget</h3>
                <ul className="space-y-1 text-sm list-disc list-inside">
                  <li>-r: Recursive download</li>
                  <li>-l: Maximum recursion depth</li>
                  <li>-O: Save to specific filename</li>
                  <li>--limit-rate: Limit download speed</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}