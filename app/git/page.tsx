"use client";

import { useState, useCallback } from "react";
import { Copy, GitBranch, GitCommit, GitPullRequest, Terminal, Code, Check } from "lucide-react";
import Sidebar from "../components/SideBar";
import { motion, AnimatePresence } from "framer-motion";

// --- Data Structure ---
interface GitCommand {
    command: string;
    description: string;
    usage: string;
}

const gitCommands: Record<string, { icon: React.ReactNode, commands: GitCommand[] }> = {
    "Basics": {
        icon: <Terminal className="w-5 h-5 text-cyan-400" />,
        commands: [
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
        ]
    },
    "Commits": {
        icon: <GitCommit className="w-5 h-5 text-amber-400" />,
        commands: [
            {
                command: "git commit -m \"message\"",
                description: "Creates a new commit with a descriptive message.",
                usage: "git commit -m \"fixed login bug\""
            },
            {
                command: "git commit -am \"message\"",
                description: "Stages and commits modified files in one command.",
                usage: "git commit -am \"quick fix\""
            },
            {
                command: "git log",
                description: "Shows the commit history.",
                usage: "git log --oneline"
            }
        ]
    },
    "Branches": {
        icon: <GitBranch className="w-5 h-5 text-green-400" />,
        commands: [
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
        ]
    },
    "Remote": {
        icon: <GitPullRequest className="w-5 h-5 text-purple-400" />,
        commands: [
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
    }
};

// --- Component ---

export default function GitWorkflowGenerator() {
    const [selectedCategory, setSelectedCategory] = useState("Basics");
    const [selectedCommand, setSelectedCommand] = useState<GitCommand | null>(null);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = useCallback(async () => {
        if (!selectedCommand) return;

        try {
            await navigator.clipboard.writeText(selectedCommand.usage);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }, [selectedCommand]);

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        setSelectedCommand(null);
    }

    return (
        // Dark Mode Base Styling
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">

            <Sidebar />

            {/* MAIN CONTENT */}
            <main className="ml-0 lg:ml-64 flex flex-col gap-8 p-6 md:p-12 w-full max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl shadow-lg">
                            <Code className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                            Git Workflow Assistant
                        </h1>
                    </div>
                    <p className="text-lg text-gray-400 mt-2">
                        Select a category and then a command to instantly view its usage and copy the example.
                    </p>
                </motion.div>

                {/* --- Category Selector --- */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">1. Choose Category</h2>
                    <div className="flex gap-4 flex-wrap">
                        {Object.keys(gitCommands).map((cat) => (
                            <motion.button
                                key={cat}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${selectedCategory === cat
                                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:border-cyan-500 border border-gray-700"}`}
                            >
                                {gitCommands[cat].icon}
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* --- Command List --- */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">2. Select Command</h2>
                    <motion.div
                        key={selectedCategory}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {gitCommands[selectedCategory].commands.map((cmd, index) => (
                            <motion.button
                                key={cmd.command}
                                whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(6, 182, 212, 0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedCommand(cmd)}
                                className={`p-4 text-left rounded-xl border transition-all ${selectedCommand?.command === cmd.command
                                    ? "bg-blue-900/50 border-cyan-500 text-cyan-300 shadow-lg"
                                    : "bg-gray-900 border-gray-700 hover:bg-gray-700/50 text-gray-200"}`}
                            >
                                <code className="font-mono font-semibold text-base">{cmd.command}</code>
                                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                    {cmd.description}
                                </p>
                            </motion.button>
                        ))}
                    </motion.div>
                </div>

                {/* --- Selected Command Details (Output) --- */}
                <AnimatePresence mode="wait">
                    {selectedCommand && (
                        <motion.div
                            key={selectedCommand.command}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="p-6 bg-gradient-to-br from-black to-gray-900 rounded-2xl border border-blue-700 shadow-2xl relative"
                        >
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">3. Command Details & Usage</h2>

                            <p className="text-gray-300 mb-4">
                                **Description:** {selectedCommand.description}
                            </p>

                            <p className="font-semibold text-lg mb-2 text-cyan-400">Usage Example:</p>
                            
                            {/* Command Output Box */}
                            <div className="relative group">
                                <pre className="bg-gray-800 p-4 rounded-xl mb-4 font-mono text-sm text-gray-100 border border-gray-700 overflow-x-auto pr-16">
                                    <span className="text-cyan-400 select-none">$ </span>
                                    {selectedCommand.usage}
                                </pre>

                                {/* Copy Button */}
                                <motion.button
                                    onClick={copyToClipboard}
                                    className={`absolute top-4 right-4 p-2 rounded-lg transition-all flex items-center gap-1 ${copied
                                        ? "bg-emerald-600 text-white"
                                        : "bg-blue-600 text-white hover:bg-blue-500"
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Copy to clipboard"
                                >
                                    <AnimatePresence mode="wait">
                                        {copied ? (
                                            <motion.div
                                                key="check"
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                            >
                                                <Check size={16} />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="copy"
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                            >
                                                <Copy size={16} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}