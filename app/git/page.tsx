"use client";

import { useState } from "react";
import { Copy, GitBranch, GitCommit, GitPullRequest, Terminal } from "lucide-react";
import Sidebar from "../components/SideBar";

interface GitCommand {
  command: string;
  description: string;
  usage: string;
}

const gitCommands: Record<string, GitCommand[]> = {
  "Basics": [
    {
      command: "git init",
      description: "Initializes a new Git repository in the current folder.",
      usage: "git init"
    },
    {
      command: "git status",
      description: "Shows the status of your working directory and staged files.",
      usage: "git status"
    },
    {
      command: "git add <file>",
      description: "Stages a file to be committed.",
      usage: "git add index.js"
    },
  ],
  "Commits": [
    {
      command: "git commit -m \"message\"",
      description: "Creates a new commit with a descriptive message.",
      usage: "git commit -m \"fixed login bug\""
    },
    {
      command: "git commit -am \"message\"",
      description: "Stages and commits modified files in one command.",
      usage: "git commit -am \"quick fix\""
    }
  ],
  "Branches": [
    {
      command: "git branch",
      description: "Lists all local branches.",
      usage: "git branch"
    },
    {
      command: "git checkout -b <name>",
      description: "Creates a new branch and switches to it.",
      usage: "git checkout -b feature/auth"
    },
    {
      command: "git merge <branch>",
      description: "Merges a branch into the current branch.",
      usage: "git merge main"
    }
  ],
  "Remote": [
    {
      command: "git remote -v",
      description: "Displays remote repository URLs.",
      usage: "git remote -v"
    },
    {
      command: "git push origin <branch>",
      description: "Pushes your commits to a remote branch.",
      usage: "git push origin main"
    },
    {
      command: "git pull",
      description: "Fetches and merges from the remote repository.",
      usage: "git pull"
    }
  ]
};

export default function GitWorkflowGenerator() {
  const [selectedCategory, setSelectedCategory] = useState("Basics");
  const [selectedCommand, setSelectedCommand] = useState<GitCommand | null>(null);

  const copy = () => {
    if (!selectedCommand) return;
    navigator.clipboard.writeText(selectedCommand.usage);
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-zinc-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex flex-col gap-6 p-12 w-full">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Terminal className="w-8 h-8" />
          Git Command Workflow Generator
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Select a Git category → choose a command → see the description & usage example instantly.
        </p>

        {/* CATEGORY SELECTOR */}
        <div className="flex gap-4 flex-wrap">
          {Object.keys(gitCommands).map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setSelectedCommand(null); }}
              className={`px-4 py-2 rounded-xl border font-medium transition
                ${selectedCategory === cat 
                ? "bg-black text-white dark:bg-white dark:text-black" 
                : "bg-white dark:bg-zinc-900 border-zinc-400 dark:border-zinc-600"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* COMMAND LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {gitCommands[selectedCategory].map((cmd, index) => (
            <button
              key={index}
              onClick={() => setSelectedCommand(cmd)}
              className="p-4 text-left bg-white dark:bg-zinc-900 rounded-xl border shadow hover:scale-[1.02] transition"
            >
              <p className="font-semibold">{cmd.command}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {cmd.description}
              </p>
            </button>
          ))}
        </div>

        {/* SELECTED COMMAND DETAILS */}
        {selectedCommand && (
          <div className="mt-8 p-6 bg-white dark:bg-zinc-900 rounded-xl border shadow-lg relative">
            <h2 className="text-2xl font-bold mb-4">{selectedCommand.command}</h2>

            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              {selectedCommand.description}
            </p>

            <p className="font-semibold text-lg mb-2">Usage Example:</p>
            <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg mb-4 font-mono text-sm">
              {selectedCommand.usage}
            </pre>

            <button
              onClick={copy}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:scale-105 transition"
            >
              <Copy size={16} />
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
