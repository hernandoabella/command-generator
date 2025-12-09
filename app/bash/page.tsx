"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Terminal, Sparkles, ChevronRight, Check, Wand2, BookOpen, Zap, Search, X } from "lucide-react";
import Sidebar from "../components/SideBar";
import { motion, AnimatePresence } from "framer-motion";

// --- Data Constants for Command Structure (Dark Mode Optimized Colors) ---
const COMMAND_CATEGORIES = [
    // Optimized colors for darker backgrounds
    { id: "files", label: "Files", icon: "📁", color: "from-blue-600 to-cyan-600" }, 
    { id: "folders", label: "Folders", icon: "📂", color: "from-emerald-600 to-green-600" },
    { id: "git", label: "Git", icon: "🐙", color: "from-orange-600 to-red-600" },
    { id: "system", label: "System", icon: "⚙️", color: "from-purple-600 to-pink-600" },
    { id: "network", label: "Network", icon: "🌐", color: "from-indigo-600 to-violet-600" },
] as const;

const ACTIONS_BY_CATEGORY: Record<string, string[]> = {
    files: ["touch", "rm", "cat", "chmod", "mv", "cp"],
    folders: ["mkdir", "rmdir", "ls", "cd", "tree"],
    git: ["git clone", "git pull", "git add .", "git commit -m", "git push", "git checkout -b"],
    system: ["sudo apt update", "sudo apt upgrade", "sudo reboot", "df -h", "top"],
    network: ["ping", "curl", "wget", "ifconfig", "netstat -tulnp"],
};

const COMMAND_DESCRIPTIONS: Record<string, { desc: string; example: string; tips?: string[] }> = {
    touch: { 
        desc: "Creates a new empty file.", 
        example: "touch notes.txt",
        tips: ["Use touch to update file timestamps", "Create multiple files: touch file1.txt file2.txt"]
    },
    rm: { 
        desc: "Deletes files or directories.", 
        example: "rm old-photo.png",
        tips: ["Use -r flag for directories", "Use -f to force delete without confirmation"]
    },
    cat: { 
        desc: "Displays content of a file.", 
        example: "cat README.md",
        tips: ["Combine files: cat file1.txt file2.txt > combined.txt", "Use with grep: cat file.txt | grep 'search'"]
    },
    chmod: { 
        desc: "Changes file permissions.", 
        example: "chmod 755 script.sh",
        tips: ["Common permissions: 755 (rwxr-xr-x)", "Symbolic mode: chmod u+x script.sh"]
    },
    mv: { 
        desc: "Moves or renames files/folders.", 
        example: "mv photo.jpg images/",
        tips: ["Rename: mv oldname.txt newname.txt", "Use -i for interactive mode"]
    },
    cp: { 
        desc: "Copies files or directories.", 
        example: "cp data.json backup/data.json",
        tips: ["Copy directories: cp -r source/ destination/", "Preserve attributes: cp -p file.txt backup/"]
    },
    mkdir: { 
        desc: "Creates a directory.", 
        example: "mkdir projects",
        tips: ["Create nested directories: mkdir -p parent/child", "Set permissions: mkdir -m 755 directory"]
    },
    rmdir: { 
        desc: "Deletes an empty directory.", 
        example: "rmdir temp-folder",
        tips: ["Use rm -r for non-empty directories", "Safer alternative to rm -rf for empty dirs"]
    },
    ls: { 
        desc: "Lists files and directories.", 
        example: "ls -la",
        tips: ["Show human readable sizes: ls -lh", "Sort by size: ls -lS", "Show hidden files: ls -a"]
    },
    cd: { 
        desc: "Changes the current directory.", 
        example: "cd documents",
        tips: ["Go home: cd ~", "Go to previous: cd -", "Go up one level: cd .."]
    },
    tree: { 
        desc: "Shows directory structure in tree form.", 
        example: "tree src/",
        tips: ["Limit depth: tree -L 2", "Show hidden files: tree -a", "Show only directories: tree -d"]
    },
    "git clone": { 
        desc: "Downloads a remote repository.", 
        example: "git clone https://github.com/user/project.git",
        tips: ["Clone specific branch: git clone -b branch-name repo-url", "Clone with depth: git clone --depth 1"]
    },
    "git pull": { 
        desc: "Downloads and merges latest changes.", 
        example: "git pull origin main",
        tips: ["Pull with rebase: git pull --rebase", "Force pull: git pull -f"]
    },
    "git add .": { 
        desc: "Stages all modified files.", 
        example: "git add .",
        tips: ["Stage specific file: git add filename", "Interactive staging: git add -p"]
    },
    "git commit -m": { 
        desc: "Saves staged changes with a message.", 
        example: 'git commit -m "Fix login bug"',
        tips: ["Amend last commit: git commit --amend", "Skip staging area: git commit -am 'message'"]
    },
    "git push": { 
        desc: "Uploads local commits to remote.", 
        example: "git push origin main",
        tips: ["Push with tags: git push --tags", "Force push: git push -f", "Set upstream: git push -u origin branch"]
    },
    "git checkout -b": { 
        desc: "Creates and switches to a new branch.", 
        example: "git checkout -b feature/ui-redesign",
        tips: ["Switch branches: git checkout branch-name", "Create from remote: git checkout -b local-name origin/remote-name"]
    },
    "sudo apt update": { 
        desc: "Updates package information.", 
        example: "sudo apt update",
        tips: ["Update specific repo: sudo apt update repo-name", "Combined update: sudo apt update && sudo apt upgrade"]
    },
    "sudo apt upgrade": { 
        desc: "Installs available package upgrades.", 
        example: "sudo apt upgrade -y",
        tips: ["Upgrade specific package: sudo apt install --only-upgrade package-name", "Dry run: sudo apt upgrade -s"]
    },
    "sudo reboot": { 
        desc: "Restarts the system.", 
        example: "sudo reboot",
        tips: ["Schedule reboot: sudo shutdown -r +10", "Force reboot: sudo reboot -f"]
    },
    "df -h": { 
        desc: "Shows disk usage in human-readable format.", 
        example: "df -h",
        tips: ["Show specific filesystem: df -h /home", "Show inodes: df -i", "Exclude types: df -h -x tmpfs"]
    },
    top: { 
        desc: "Displays running processes and system usage.", 
        example: "top",
        tips: ["Batch mode: top -b -n 1", "Sort by memory: press M", "Show specific user: top -u username"]
    },
    ping: { 
        desc: "Tests network connectivity to a host.", 
        example: "ping google.com",
        tips: ["Limit packets: ping -c 4 google.com", "Set interval: ping -i 2 google.com", "Flood ping: ping -f google.com"]
    },
    curl: { 
        desc: "Downloads or interacts with URLs.", 
        example: "curl https://api.example.com/data",
        tips: ["Save to file: curl -o output.txt url", "Follow redirects: curl -L url", "Include headers: curl -i url"]
    },
    wget: { 
        desc: "Downloads files from the internet.", 
        example: "wget https://example.com/file.zip",
        tips: ["Resume download: wget -c url", "Recursive download: wget -r url", "Limit bandwidth: wget --limit-rate=200k url"]
    },
    ifconfig: { 
        desc: "Shows or configures network interfaces.", 
        example: "ifconfig eth0",
        tips: ["Modern alternative: ip addr show", "Show specific interface: ifconfig eth0", "Enable/disable: ifconfig eth0 up/down"]
    },
    "netstat -tulnp": { 
        desc: "Lists active ports and listening services.", 
        example: "netstat -tulnp",
        tips: ["Show only listening: netstat -l", "Show numeric: netstat -n", "Modern alternative: ss -tulnp"]
    },
};

const RECENT_COMMANDS_KEY = "bash_generator_recent_commands";
const MAX_RECENT_COMMANDS = 5;

export default function BashCommandGenerator() {
    const [category, setCategory] = useState("");
    const [action, setAction] = useState("");
    const [target, setTarget] = useState("");
    const [command, setCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [showExample, setShowExample] = useState(true);
    const [recentCommands, setRecentCommands] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showTips, setShowTips] = useState(false);

    // Load recent commands from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(RECENT_COMMANDS_KEY);
        if (saved) {
            setRecentCommands(JSON.parse(saved));
        }
    }, []);

    // Save command to recent when generated
    const saveToRecent = useCallback((cmd: string) => {
        if (!cmd) return;
        
        const updated = [cmd, ...recentCommands.filter(c => c !== cmd)].slice(0, MAX_RECENT_COMMANDS);
        setRecentCommands(updated);
        localStorage.setItem(RECENT_COMMANDS_KEY, JSON.stringify(updated));
    }, [recentCommands]);

    // Generate command automatically when action changes
    useEffect(() => {
        if (action) {
            const finalCommand = target ? `${action} ${target}`.trim() : action;
            setCommand(finalCommand);
            saveToRecent(finalCommand);
        }
    }, [action, target, saveToRecent]);

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
        setSearchQuery("");
    };

    // Clear everything
    const handleClear = () => {
        setCategory("");
        setAction("");
        setTarget("");
        setCommand("");
        setSearchQuery("");
    };

    // Load command from recent
    const loadRecentCommand = (cmd: string) => {
        // Extract action and target from command
        const words = cmd.split(' ');
        const possibleAction = words[0];
        
        // Try to find matching action (This logic might need refinement for multi-word commands like "git commit -m")
        // For simplicity here, we assume the first word is the command unless it's a known multi-word command.
        // The original implementation doesn't seem to fully reconstruct complex actions like "git commit -m" from a single recent string,
        // but for basic commands, this is fine. I'll preserve the original logic structure.
        let foundAction = false;
        for (const cat of COMMAND_CATEGORIES) {
            const actions = ACTIONS_BY_CATEGORY[cat.id];
            
            // Check for multi-word action match (e.g., "git clone")
            const multiWordAction = actions.find(a => cmd.startsWith(a));
            
            if (multiWordAction) {
                 setCategory(cat.id);
                 setAction(multiWordAction);
                 setTarget(cmd.substring(multiWordAction.length).trim());
                 foundAction = true;
                 break;
            } else if (actions.includes(possibleAction)) {
                setCategory(cat.id);
                setAction(possibleAction);
                setTarget(words.slice(1).join(' '));
                foundAction = true;
                break;
            }
        }
        
        // Fallback for commands not perfectly parsed back into action/target, just set the command
        if (!foundAction) {
             setCommand(cmd);
             setCategory("");
             setAction("");
             setTarget("");
        }
    };

    // Filter commands based on search
    const filteredCommands = searchQuery ? 
        Object.keys(COMMAND_DESCRIPTIONS).filter(cmd => 
            cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
            COMMAND_DESCRIPTIONS[cmd].desc.toLowerCase().includes(searchQuery.toLowerCase())
        ) : [];

    return (
        // --- Dark Mode Base Styling: bg-gradient-to-br from-gray-900 to-gray-950 ---
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
            <Sidebar />

            <main className="ml-0  w-full min-h-screen p-4 md:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 md:mb-12"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl shadow-lg">
                                    <Terminal className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                                        Bash Command Generator
                                    </h1>
                                    <p className="text-gray-400 mt-2">
                                        Generate, learn, and master Linux commands with examples
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {/* Tips Button (Inverted colors for dark mode) */}
                                <button
                                    onClick={() => setShowTips(!showTips)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors shadow-md"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    <span className="hidden sm:inline">Tips</span>
                                </button>
                                {/* Clear Button (Inverted colors for dark mode) */}
                                <button
                                    onClick={handleClear}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors shadow-md"
                                >
                                    <X className="w-4 h-4" />
                                    <span className="hidden sm:inline">Clear</span>
                                </button>
                            </div>
                        </div>

                        {/* Search Bar (Dark Mode Input Styling) */}
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search commands or descriptions..."
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Search Results (Dark Mode Styling) */}
                        <AnimatePresence>
                            {searchQuery && filteredCommands.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl mb-6 overflow-hidden"
                                >
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-300 mb-3">Search Results</h3>
                                        <div className="space-y-2">
                                            {filteredCommands.map((cmd) => (
                                                <button
                                                    key={cmd}
                                                    onClick={() => {
                                                        setAction(cmd);
                                                        setSearchQuery("");
                                                    }}
                                                    className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors group"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <code className="font-mono text-emerald-400 group-hover:text-emerald-300">
                                                                {cmd}
                                                            </code>
                                                            <p className="text-sm text-gray-400 mt-1">
                                                                {COMMAND_DESCRIPTIONS[cmd].desc}
                                                            </p>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Categories (Dark Mode Styling) */}
                        <div className="mb-8">
                            <label className="block mb-4 font-medium text-gray-300">
                                <span className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-amber-400" />
                                    Select Category
                                </span>
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {COMMAND_CATEGORIES.map((cat) => (
                                    <motion.button
                                        key={cat.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 ${category === cat.id
                                            ? `bg-gradient-to-br ${cat.color} text-white border-transparent shadow-lg shadow-black/30`
                                            : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700/50"
                                            }`}
                                    >
                                        <span className="text-2xl">{cat.icon}</span>
                                        <span className="font-medium">{cat.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Command Selection & Configuration */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Command Selection (Dark Mode Styling) */}
                            {category && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl"
                                >
                                    <label className="block mb-4 font-medium text-gray-300">
                                        <span className="flex items-center gap-2">
                                            <Wand2 className="w-5 h-5 text-purple-400" />
                                            Select Command
                                        </span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {ACTIONS_BY_CATEGORY[category].map((cmd) => (
                                            <button
                                                key={cmd}
                                                onClick={() => setAction(cmd)}
                                                className={`p-4 rounded-xl border text-left transition-all ${action === cmd
                                                    ? "bg-emerald-900/40 border-emerald-700 text-emerald-300 shadow-md"
                                                    : "border-gray-700 hover:border-gray-600 hover:bg-gray-700/50 text-gray-200"
                                                    }`}
                                            >
                                                <code className="font-mono font-semibold">{cmd}</code>
                                                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                                    {COMMAND_DESCRIPTIONS[cmd].desc}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Target Input (Dark Mode Styling) */}
                            {action && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl"
                                >
                                    <label className="block mb-4 font-medium text-gray-300">
                                        <span className="flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-amber-400" />
                                            Target (Optional)
                                        </span>
                                        <span className="text-sm font-normal text-gray-500 mt-1 block">
                                            File, folder, URL, or leave empty for basic command
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., file.txt, folder-name, https://example.com"
                                        className="w-full p-4 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow shadow-inner"
                                        value={target}
                                        onChange={(e) => setTarget(e.target.value)}
                                    />
                                </motion.div>
                            )}

                            {/* Command Details (Dark Mode Styling) */}
                            {action && COMMAND_DESCRIPTIONS[action] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-br from-blue-900/10 to-cyan-900/10 rounded-2xl border border-blue-800/50 p-6 shadow-xl"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <BookOpen className="w-5 h-5 text-blue-400" />
                                            <h3 className="font-semibold text-gray-200">
                                                Command Details
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setShowExample(!showExample)}
                                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            {showExample ? "Hide Example" : "Show Example"}
                                        </button>
                                    </div>

                                    <p className="text-gray-300 mb-6">
                                        {COMMAND_DESCRIPTIONS[action].desc}
                                    </p>

                                    {showExample && (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-gray-400 mb-2">
                                                Example Usage
                                            </h4>
                                            <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 shadow-inner">
                                                <code className="text-gray-100 font-mono text-sm">
                                                    <span className="text-emerald-400">$ </span>
                                                    {COMMAND_DESCRIPTIONS[action].example}
                                                </code>
                                            </div>
                                        </div>
                                    )}

                                    {showTips && COMMAND_DESCRIPTIONS[action].tips && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-400 mb-2">
                                                Pro Tips
                                            </h4>
                                            <ul className="space-y-2">
                                                {COMMAND_DESCRIPTIONS[action].tips?.map((tip, index) => (
                                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                                                        <span className="text-emerald-500 mt-0.5">•</span>
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Right Column - Generated Command & Recent */}
                        <div className="space-y-6">
                            {/* Generated Command (Dark Mode High Contrast) */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-6 shadow-2xl"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-200">
                                        Generated Command
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex space-x-1">
                                            {/* Terminal Window Dots */}
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                    <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                                        <button
                                            onClick={copyToClipboard}
                                            className="absolute top-3 right-3 p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-white transition-colors flex items-center gap-2 z-10"
                                            title="Copy to clipboard"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-xs text-emerald-400">Copied!</span>
                                                </>
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                        <pre className="text-gray-100 font-mono text-sm overflow-x-auto pr-16">
                                            <span className="text-emerald-400 select-none">$ </span>
                                            {command || "Select options to generate command"}
                                        </pre>
                                    </div>
                                </div>

                                {command && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={copyToClipboard}
                                        className={`w-full mt-4 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${copied
                                            ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/20"
                                            : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:to-cyan-400 shadow-lg shadow-cyan-500/30"
                                            }`}
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        {copied ? "Command Copied!" : "Copy Command"}
                                    </motion.button>
                                )}
                            </motion.div>

                            {/* Recent Commands (Dark Mode Styling) */}
                            {recentCommands.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl"
                                >
                                    <h3 className="font-semibold text-gray-300 mb-4">
                                        Recent Commands
                                    </h3>
                                    <div className="space-y-2">
                                        {recentCommands.map((cmd, index) => (
                                            <button
                                                key={index}
                                                onClick={() => loadRecentCommand(cmd)}
                                                className="w-full text-left p-3 rounded-lg bg-gray-900 hover:bg-gray-700 border border-gray-700 transition-colors"
                                            >
                                                <code className="font-mono text-sm text-cyan-400 block truncate">
                                                    <span className="text-gray-500 select-none">$ </span>
                                                    {cmd}
                                                </code>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}