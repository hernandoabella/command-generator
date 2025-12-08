"use client";

import { useState, useCallback } from "react";
import Sidebar from "../components/SideBar";
import { Copy, FileCode, Check, Edit, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Data Constants ---
type Template = {
  name: string;
  description: string;
  example: string;
  icon: React.ReactNode;
};

const TEMPLATES: Template[] = [
  {
    name: "Node.js (Basic)",
    description: "A simple Node.js application Dockerfile using Alpine for small image size.",
    example: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
    icon: <Layers className="w-5 h-5 text-teal-400" />,
  },
  {
    name: "Next.js (Multi-Stage)",
    description: "Production-grade Dockerfile for Next.js using multi-stage builds for security and size.",
    example: `# Builder Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Runner Stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]`,
    icon: <Layers className="w-5 h-5 text-purple-400" />,
  },
  {
    name: "Python FastAPI",
    description: "Lightweight Python + FastAPI Dockerfile optimized for Uvicorn and Gunicorn setup.",
    example: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
    icon: <Layers className="w-5 h-5 text-yellow-400" />,
  },
  {
    name: "Golang (Multi-Stage)",
    description: "Builds a tiny, static binary in one stage and runs it on a scratch image in the second.",
    example: `# Build Stage: Use full Go environment
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o main .

# Final Stage: Use lightweight alpine
FROM alpine:latest
WORKDIR /app
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]`,
    icon: <Layers className="w-5 h-5 text-blue-400" />,
  },
  {
    name: "Nginx Static Site",
    description: "Simple setup for hosting static HTML/CSS/JS sites using the official Nginx image.",
    example: `FROM nginx:alpine
COPY ./dist /usr/share/nginx/html
EXPOSE 80`,
    icon: <Layers className="w-5 h-5 text-red-400" />,
  },
  {
    name: "PHP Apache",
    description: "A standard PHP + Apache container for running traditional PHP applications.",
    example: `FROM php:8.2-apache
COPY . /var/www/html/
EXPOSE 80`,
    icon: <Layers className="w-5 h-5 text-indigo-400" />,
  },
];

// --- Component ---

export default function DockerfileGenerator() {
  const [selected, setSelected] = useState<Template | null>(TEMPLATES[1]); // Default to Next.js Multi-stage
  const [custom, setCustom] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Determines the content of the editor
  const output = isCustomMode ? custom : selected?.example || "";

  const copyToClipboard = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [output]);

  // Handler to switch between template and custom mode
  const handleSelectTemplate = (t: Template | null) => {
    setSelected(t);
    setIsCustomMode(t === null); // Custom mode is active if template is null
  }

  return (
    // Dark Mode Base Styling
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      <Sidebar />

      <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8 md:mb-12"
        >
          <div className="p-3 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl shadow-lg">
            <FileCode className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-teal-400 bg-clip-text text-transparent">
            Dockerfile Template & Editor
          </h1>
        </motion.div>

        {/* --- 1. Template Selector --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-400" />
            Choose a Template or Go Custom
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {TEMPLATES.map((t) => (
              <motion.button
                key={t.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectTemplate(t)}
                className={`p-4 text-left rounded-xl border transition-all duration-200 ${selected?.name === t.name && !isCustomMode
                  ? "bg-teal-900/50 border-teal-500 text-teal-300 shadow-lg shadow-teal-900/40"
                  : "bg-gray-900 border-gray-700 hover:bg-gray-700/50 text-gray-200"
                  }`}
              >
                <p className="font-bold flex items-center gap-2">{t.icon} {t.name}</p>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{t.description}</p>
              </motion.button>
            ))}

            {/* Custom Mode Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectTemplate(null)}
              className={`p-4 text-left rounded-xl border transition-all duration-200 ${isCustomMode
                ? "bg-indigo-900/50 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-900/40"
                : "bg-gray-900 border-gray-700 hover:bg-gray-700/50 text-gray-200"
                }`}
            >
              <p className="font-bold flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-400" />
                Custom Dockerfile
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Start from scratch or paste your existing code.
              </p>
            </motion.button>
          </div>
        </motion.div>

        {/* --- 2. Output Editor --- */}
        <motion.div
          key={isCustomMode ? 'custom' : selected?.name || 'empty'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-black to-gray-900 rounded-2xl border border-cyan-700 shadow-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-white" />
            {isCustomMode ? "Manual Editor (Write or Paste Here)" : `Template: ${selected?.name || "None Selected"}`}
          </h2>

          {/* Copy Button */}
          {output && (
            <motion.button
              onClick={copyToClipboard}
              className={`absolute top-6 right-6 p-2 rounded-lg transition-all flex items-center gap-1 ${copied
                ? "bg-emerald-600 text-white"
                : "bg-teal-600 text-white hover:bg-teal-500"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Copy Dockerfile"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div key="check" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                    <Check size={16} />
                  </motion.div>
                ) : (
                  <motion.div key="copy" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                    <Copy size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}

          {/* Text Area / Editor */}

          {/* Text Area / Editor */}
          <textarea
            className="w-full min-h-[350px] p-4 bg-gray-900 text-white rounded-xl font-mono text-sm border border-gray-700 focus:ring-2 focus:ring-teal-500 transition-shadow resize-y"
            value={output}
            onChange={(e) => setCustom(e.target.value)}
            placeholder={`FROM base_image:tag\nWORKDIR /app\nCOPY . .\nCMD ["./start"]`}
            disabled={!isCustomMode && !!selected}
          />


          {/* Multi-Stage Tip */}
          {selected?.example.includes("AS builder") && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-teal-500">
              <p className="text-sm font-semibold text-teal-400 mb-1">
                💡 Multi-Stage Build Tip:
              </p>
              <p className="text-xs text-gray-400">
                This template uses a **multi-stage build** which significantly reduces the final image size and attack surface by only shipping the necessary runtime artifacts (not dev dependencies or build tools).
              </p>

            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}