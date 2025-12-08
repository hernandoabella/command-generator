"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Terminal, Sparkles, ChevronRight, Check } from "lucide-react";
import Sidebar from "../components/SideBar";

// Move data to separate constants for better organization
const COMMAND_CATEGORIES = [
    { id: "files", label: "Files" },
    { id: "folders", label: "Folders" },
    { id: "git", label: "Git" },
    { id: "system", label: "System" },
    { id: "network", label: "Network" },
] as const;

const ACTIONS_BY_CATEGORY: Record<string, string[]> = {
    files: ["touch", "rm", "cat", "chmod", "mv", "cp"],
    folders: ["mkdir", "rmdir", "ls", "cd", "tree"],
    git: ["git clone", "git pull", "git add .", "git commit -m", "git push", "git checkout -b"],
    system: ["sudo apt update", "sudo apt upgrade", "sudo reboot", "df -h", "top"],
    network: ["ping", "curl", "wget", "ifconfig", "netstat -tulnp"],
};

const COMMAND_DESCRIPTIONS: Record<string, { desc: string; example: string }> = {
    touch: { desc: "Creates a new empty file.", example: "touch notes.txt" },
    rm: { desc: "Deletes a file.", example: "rm old-photo.png" },
    cat: { desc: "Displays content of a file.", example: "cat README.md" },
    chmod: { desc: "Changes file permissions.", example: "chmod 755 script.sh" },
    mv: { desc: "Moves or renames a file/folder.", example: "mv photo.jpg images/" },
    cp: { desc: "Copies a file or folder.", example: "cp data.json backup/data.json" },
    mkdir: { desc: "Creates a directory.", example: "mkdir projects" },
    rmdir: { desc: "Deletes an empty directory.", example: "rmdir temp-folder" },
    ls: { desc: "Lists files and directories.", example: "ls -la" },
    cd: { desc: "Changes the current directory.", example: "cd documents" },
    tree: { desc: "Shows directory structure in tree form.", example: "tree src/" },
    "git clone": { desc: "Downloads a remote repository.", example: "git clone https://github.com/user/project.git" },
    "git pull": { desc: "Downloads and merges latest changes.", example: "git pull origin main" },
    "git add .": { desc: "Stages all modified files.", example: "git add ." },
    "git commit -m": { desc: "Saves staged changes with a message.", example: 'git commit -m "Fix login bug"' },
    "git push": { desc: "Uploads local commits to remote.", example: "git push origin main" },
    "git checkout -b": { desc: "Creates and switches to a new branch.", example: "git checkout -b feature/ui-redesign" },
    "sudo apt update": { desc: "Updates package information.", example: "sudo apt update" },
    "sudo apt upgrade": { desc: "Installs available package upgrades.", example: "sudo apt upgrade -y" },
    "sudo reboot": { desc: "Restarts the system.", example: "sudo reboot" },
    "df -h": { desc: "Shows disk usage in human-readable format.", example: "df -h" },
    top: { desc: "Displays running processes and system usage.", example: "top" },
    ping: { desc: "Tests network connectivity to a host.", example: "ping google.com" },
    curl: { desc: "Downloads or interacts with URLs.", example: "curl https://api.example.com/data" },
    wget: { desc: "Downloads files from the internet.", example: "wget https://example.com/file.zip" },
    ifconfig: { desc: "Shows or configures network interfaces.", example: "ifconfig eth0" },
    "netstat -tulnp": { desc: "Lists active ports and listening services.", example: "netstat -tulnp" },
};

export default function BashCommandGenerator() {
    const [category, setCategory] = useState("");
    const [action, setAction] = useState("");
    const [target, setTarget] = useState("");
    const [command, setCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [showExample, setShowExample] = useState(true);

    // Generate command automatically when action changes
    useEffect(() => {
        if (action) {
            const finalCommand = target ? `${action} ${target}`.trim() : action;
            setCommand(finalCommand);
        }
    }, [action, target]);

    // Handle copy with feedback
    const copyToClipboard = useCallback(async () => {
        if (!command) return;

        try {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }, [command]);

    // Reset action when category changes
    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory);
        setAction("");
        setTarget("");
    };

    // Clear everything
    const handleClear = () => {
        setCategory("");
        setAction("");
        setTarget("");
        setCommand("");
    };

    return (
        <div className=" flex">
            <Sidebar />
            <main className="ml-64 w-full min-h-screen bg-gray-100 p-12 flex justify-center">
                {/* Header */}
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                            Bash Command Generator
                        </h1>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Generate and learn common bash commands with examples
                    </p>
                </div>

                {/* Main Content */}
                <div className="p-8">
                    {/* Category Selection */}
                    <div className="mb-8">
                        <label className="block mb-3 font-medium text-zinc-700 dark:text-zinc-300">
                            <span className="flex items-center gap-2">
                                <ChevronRight className="w-4 h-4" />
                                Select Category
                            </span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {COMMAND_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`p-3 rounded-lg border transition-all duration-200 ${category === cat.id
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                        }`}
                                >
                                    <span className="font-medium">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Selection */}
                    {category && (
                        <div className="mb-8">
                            <label className="block mb-3 font-medium text-zinc-700 dark:text-zinc-300">
                                <span className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4" />
                                    Select Command
                                </span>
                            </label>
                            <select
                                className="w-full p-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow"
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                            >
                                <option value="">Choose a command...</option>
                                {ACTIONS_BY_CATEGORY[category].map((cmd) => (
                                    <option key={cmd} value={cmd}>
                                        {cmd}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Command Info */}
                    {action && COMMAND_DESCRIPTIONS[action] && (
                        <div className="mb-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    <span className="font-medium text-zinc-700 dark:text-zinc-300">Command Details</span>
                                </div>
                                <button
                                    onClick={() => setShowExample(!showExample)}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    {showExample ? "Hide" : "Show"} example
                                </button>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4">
                                <p className="text-zinc-700 dark:text-zinc-300 mb-3">
                                    {COMMAND_DESCRIPTIONS[action].desc}
                                </p>

                                {showExample && (
                                    <div className="mt-3 pt-3 border-t border-blue-100 dark:border-blue-800/30">
                                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">Example:</p>
                                        <code className="block bg-white dark:bg-zinc-800 px-4 py-2.5 rounded-lg text-zinc-900 dark:text-zinc-100 border border-blue-100 dark:border-blue-800/50 font-mono text-sm">
                                            {COMMAND_DESCRIPTIONS[action].example}
                                        </code>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Target Input */}
                    {action && (
                        <div className="mb-8">
                            <label className="block mb-3 font-medium text-zinc-700 dark:text-zinc-300">
                                <span className="flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4" />
                                    Target (optional)
                                </span>
                                <span className="text-sm font-normal text-zinc-500 dark:text-zinc-500 mt-1 block">
                                    Specify file, folder, URL, or leave empty for the command only
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., file.txt, folder-name, https://example.com"
                                className="w-full p-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Generated Command */}
                    {command && (
                        <div className="mb-8">
                            <label className="block mb-3 font-medium text-zinc-700 dark:text-zinc-300">
                                Generated Command
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                                <div className="relative bg-zinc-900 dark:bg-black rounded-xl p-4 border border-zinc-800 dark:border-zinc-700">
                                    <button
                                        onClick={copyToClipboard}
                                        className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white transition-colors flex items-center gap-2"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 text-green-400" />
                                                <span className="text-xs text-green-400">Copied!</span>
                                            </>
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                    <pre className="text-white font-mono text-sm md:text-base overflow-x-auto pr-12">
                                        <span className="text-green-400">$ </span>
                                        {command}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleClear}
                            className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors font-medium"
                        >
                            Clear All
                        </button>
                        {command && (
                            <button
                                onClick={copyToClipboard}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex-1 shadow-lg shadow-blue-500/20"
                            >
                                {copied ? "Copied!" : "Copy Command"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-500">
                        Tip: Click on any command to see its description and usage example
                    </p>
                </div>
            </main>
        </div>
    );
}