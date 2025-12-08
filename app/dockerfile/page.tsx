"use client";

import { useState } from "react";
import { Copy, FileCode } from "lucide-react";
import Sidebar from "../components/SideBar";

type Template = {
  name: string;
  description: string;
  example: string;
};

const templates: Template[] = [
  {
    name: "Node.js (App)",
    description: "A basic Node.js application Dockerfile using Alpine for small image size.",
    example: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
  },
  {
    name: "Next.js Production",
    description: "A production-grade Dockerfile for Next.js apps using multi-stage builds.",
    example: `# Install dependencies
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]`,
  },
  {
    name: "Python FastAPI",
    description: "A lightweight Python + FastAPI Dockerfile using Uvicorn.",
    example: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
  },
  {
    name: "Golang App",
    description: "Multi-stage Dockerfile for a Go application.",
    example: `# Build stage
FROM golang:1.21 AS builder
WORKDIR /app
COPY . .
RUN go build -o main .

# Run stage
FROM alpine
WORKDIR /app
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]`,
  },
  {
    name: "Nginx Static Website",
    description: "Perfect for hosting static HTML/CSS/JS sites.",
    example: `FROM nginx:alpine
COPY ./dist /usr/share/nginx/html
EXPOSE 80`,
  },
  {
    name: "PHP Apache",
    description: "A PHP + Apache container for running PHP apps.",
    example: `FROM php:8.2-apache
COPY . /var/www/html/
EXPOSE 80`,
  },
];

export default function DockerfileGenerator() {
  const [selected, setSelected] = useState<Template | null>(null);
  const [custom, setCustom] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  const output = isCustomMode ? custom : selected?.example || "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="flex items-center gap-3 mb-6">
          <FileCode className="w-7 h-7 text-black dark:text-white" />
          <h1 className="text-3xl font-bold">Dockerfile Generator</h1>
        </div>

        {/* Template Selector */}
        <div className="mb-6">
          <label className="font-semibold text-lg">Choose a template:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {templates.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  setSelected(t);
                  setIsCustomMode(false);
                }}
                className="p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
              >
                <p className="font-bold">{t.name}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.description}</p>
              </button>
            ))}

            {/* Custom Mode */}
            <button
              onClick={() => {
                setIsCustomMode(true);
                setSelected(null);
              }}
              className="p-4 rounded-xl border border-blue-500 hover:bg-blue-200 dark:hover:bg-blue-900 transition"
            >
              <p className="font-bold">Custom Dockerfile</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Build your own Dockerfile manually.
              </p>
            </button>
          </div>
        </div>

        {/* Description */}
        {selected && !isCustomMode && (
          <div className="mb-6 p-4 border border-zinc-300 dark:border-zinc-700 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-zinc-700 dark:text-zinc-400">{selected.description}</p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Usage Example</h3>
            <pre className="bg-zinc-900 text-white p-4 rounded-xl text-sm whitespace-pre-wrap">
              docker build -t myapp .
            </pre>
            <pre className="bg-zinc-900 text-white p-4 mt-2 rounded-xl text-sm whitespace-pre-wrap">
              docker run -p 3000:3000 myapp
            </pre>
          </div>
        )}

        {/* Editor */}
        <div className="relative">
          {output && (
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 px-3 py-1 bg-black text-white dark:bg-white dark:text-black rounded-md hover:opacity-80"
            >
              <Copy size={16} />
            </button>
          )}

          <textarea
            className="w-full min-h-[280px] p-4 bg-zinc-900 text-white rounded-xl font-mono text-sm"
            value={output}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Write your custom Dockerfile here..."
            disabled={!isCustomMode}
          />
        </div>
      </main>
    </div>
  );
}
