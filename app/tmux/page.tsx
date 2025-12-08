"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { Copy, Terminal, SplitSquareHorizontal, SplitSquareVertical, Minimize2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Data Constants ---
type TmuxCommand = {
    command: string;
    description: string;
    example: string;
    type: 'session' | 'pane' | 'other';
    icon: React.ReactNode;
};

const TMUX_COMMANDS: Record<string, TmuxCommand> = {
    "Create Session": {
        command: "tmux new -s session_name",
        description: "Creates a new TMUX session with a custom name.",
        example: "tmux new -s my-project-dev",
        type: 'session',
        icon: <Terminal className="w-5 h-5 text-purple-400" />,
    },
    "Attach Session": {
        command: "tmux attach -t session_name",
        description: "Re-attaches to an existing TMUX session by name.",
        example: "tmux attach -t my-project-dev",
        type: 'session',
        icon: <Terminal className="w-5 h-5 text-purple-400" />,
    },
    "List Sessions": {
        command: "tmux ls",
        description: "Displays all active TMUX sessions running on the server.",
        example: "tmux ls",
        type: 'session',
        icon: <Terminal className="w-5 h-5 text-purple-400" />,
    },
    "Detach (Prefix Key)": {
        command: "Ctrl+b d",
        description: "Detaches from the current session and returns to the base shell without killing processes.",
        example: "Press Ctrl+b then press d",
        type: 'session',
        icon: <Minimize2 className="w-5 h-5 text-purple-400" />,
    },
    "Kill Session": {
        command: "tmux kill-session -t session_name",
        description: "Terminates a specific TMUX session and all running processes inside it.",
        example: "tmux kill-session -t my-old-session",
        type: 'session',
        icon: <Terminal className="w-5 h-5 text-purple-400" />,
    },
    "Split Pane (Horizontal)": {
        command: "Ctrl+b %",
        description: "Splits the current pane vertically into two horizontal segments.",
        example: "Press Ctrl+b then press %",
        type: 'pane',
        icon: <SplitSquareHorizontal className="w-5 h-5 text-pink-400" />,
    },
    "Split Pane (Vertical)": {
        command: "Ctrl+b \"",
        description: "Splits the current pane horizontally into two vertical segments.",
        example: "Press Ctrl+b then press \"",
        type: 'pane',
        icon: <SplitSquareVertical className="w-5 h-5 text-pink-400" />,
    },
    "Move between Panes": {
        command: "Ctrl+b <arrow keys>",
        description: "Moves the focus to the pane in the specified direction (up, down, left, or right).",
        example: "Press Ctrl+b then press an arrow key",
        type: 'pane',
        icon: <Minimize2 className="w-5 h-5 text-pink-400" />,
    },
    "List Key Bindings": {
        command: "tmux list-keys",
        description: "Shows all TMUX key bindings for prefix commands.",
        example: "tmux list-keys",
        type: 'other',
        icon: <Terminal className="w-5 h-5 text-gray-400" />,
    },
};

// --- Component ---

export default function TmuxGenerator() {
    const defaultKey = "Create Session";
    const [selectedKey, setSelectedKey] = useState<string>(defaultKey);
    const [generatedCommand, setGeneratedCommand] = useState<string>(TMUX_COMMANDS[defaultKey].command);
    const [copied, setCopied] = useState(false);

    // Auto-update command based on selection
    useEffect(() => {
        if (selectedKey) {
            setGeneratedCommand(TMUX_COMMANDS[selectedKey].command);
        }
    }, [selectedKey]);

    const copyToClipboard = useCallback(async () => {
        if (!generatedCommand) return;
        try {
            await navigator.clipboard.writeText(generatedCommand);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }, [generatedCommand]);

    const selectedCommandData = TMUX_COMMANDS[selectedKey];

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
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl shadow-lg">
                        <Terminal className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
                        TMUX Command Assistant
                    </h1>
                </motion.div>

                {/* --- 1. Command Selector --- */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-pink-400" />
                        Select an Action
                    </h2>
                    
                    {/* Session Management */}
                    <h3 className="text-lg font-semibold text-purple-300 mt-4 mb-2 border-b border-gray-700 pb-1">Session Management</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {Object.entries(TMUX_COMMANDS).filter(([, cmd]) => cmd.type === 'session').map(([key, cmd]) => (
                            <CommandButton key={key} commandKey={key} cmd={cmd} selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
                        ))}
                    </div>

                    {/* Pane/Window Control */}
                    <h3 className="text-lg font-semibold text-pink-300 mt-4 mb-2 border-b border-gray-700 pb-1">Pane/Window Control</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(TMUX_COMMANDS).filter(([, cmd]) => cmd.type === 'pane').map(([key, cmd]) => (
                            <CommandButton key={key} commandKey={key} cmd={cmd} selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
                        ))}
                    </div>
                    
                    {/* Other Commands */}
                    <h3 className="text-lg font-semibold text-gray-400 mt-4 mb-2 border-b border-gray-700 pb-1">Other</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(TMUX_COMMANDS).filter(([, cmd]) => cmd.type === 'other').map(([key, cmd]) => (
                            <CommandButton key={key} commandKey={key} cmd={cmd} selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
                        ))}
                    </div>

                </motion.div>
                
                {/* --- 2. Generated Output --- */}
                <AnimatePresence mode="wait">
                    {selectedCommandData && (
                        <motion.div
                            key={selectedKey}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="p-6 bg-gradient-to-br from-black to-gray-900 rounded-2xl border border-pink-700 shadow-2xl relative"
                        >
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">{selectedKey} Details</h2>
                            
                            <p className="text-gray-300 mb-4 border-b border-gray-700 pb-3">
                                **Description:** {selectedCommandData.description}
                            </p>

                            <h3 className="font-semibold text-lg mb-2 text-purple-400">Generated Command / Prefix Key:</h3>
                            
                            {/* Command Output Box */}
                            <div className="relative group">
                                <pre className="bg-gray-800 p-4 rounded-xl font-mono text-base text-gray-100 border border-purple-500 overflow-x-auto pr-16">
                                    <span className="text-purple-400 select-none">$ </span>
                                    {generatedCommand}
                                </pre>

                                {/* Copy Button */}
                                <motion.button
                                    onClick={copyToClipboard}
                                    className={`absolute top-4 right-4 p-2 rounded-lg transition-all flex items-center gap-1 ${copied
                                        ? "bg-emerald-600 text-white"
                                        : "bg-pink-600 text-white hover:bg-pink-500"
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Copy Command"
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
                            </div>
                            
                            {/* Example Usage */}
                            <div className="mt-6">
                                <h3 className="font-semibold text-lg mb-2 text-pink-400">Example / Usage Note:</h3>
                                <pre className="bg-gray-800 p-4 rounded-xl font-mono text-sm text-gray-300 border border-gray-700 overflow-x-auto">
                                    <span className="text-pink-400 select-none">Note: </span>
                                    {selectedCommandData.example}
                                </pre>
                            </div>
                             

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

// Helper Component for Command Buttons
const CommandButton: React.FC<{ commandKey: string, cmd: TmuxCommand, selectedKey: string, setSelectedKey: (key: string) => void }> = ({ commandKey, cmd, selectedKey, setSelectedKey }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedKey(commandKey)}
        className={`p-4 text-left rounded-xl border transition-all duration-200 ${selectedKey === commandKey
            ? "bg-purple-900/50 border-purple-500 text-purple-300 shadow-lg shadow-purple-900/40"
            : "bg-gray-900 border-gray-700 hover:bg-gray-700/50 text-gray-200"
            }`}
    >
        <p className="font-bold text-lg mb-1 flex items-center gap-2">{cmd.icon} {commandKey}</p>
        <p className="text-sm text-gray-400 line-clamp-2">{cmd.description}</p>
    </motion.button>
);