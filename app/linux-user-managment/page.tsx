"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/SideBar"; 
import { Copy, User, Lock, Trash2, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Data Constants ---

interface UserCommand {
    command: (target: string) => string;
    description: string;
    example: string;
    icon: React.ReactNode;
}

const COMMANDS: Record<string, UserCommand> = {
    "Create User + Home": {
        command: (target: string) => `sudo useradd -m ${target}`,
        description: "Creates a new user, automatically creating their default home directory.",
        example: "sudo useradd -m jane",
        icon: <Plus className="w-4 h-4 text-green-400" />,
    },
    "Set User Password": {
        command: (target: string) => `sudo passwd ${target}`,
        description: "Prompts you to set or update the password for the specified user.",
        example: "sudo passwd jane",
        icon: <Lock className="w-4 h-4 text-yellow-400" />,
    },
    "Add to Group (sudo)": {
        command: (target: string) => `sudo usermod -aG sudo ${target}`,
        description: "Adds the user to the 'sudo' group, granting them administrative privileges.",
        example: "sudo usermod -aG sudo jane",
        icon: <User className="w-4 h-4 text-cyan-400" />,
    },
    "Lock Account": {
        command: (target: string) => `sudo usermod -L ${target}`,
        description: "Disables the user account immediately by locking the password.",
        example: "sudo usermod -L jane",
        icon: <Lock className="w-4 h-4 text-orange-400" />,
    },
    "Unlock Account": {
        command: (target: string) => `sudo usermod -U ${target}`,
        description: "Re-enables a locked user account by unlocking the password.",
        example: "sudo usermod -U jane",
        icon: <Lock className="w-4 h-4 text-green-500" />,
    },
    "Delete User + Home": {
        command: (target: string) => `sudo userdel -r ${target}`,
        description: "Deletes the user and recursively removes their entire home directory and mail spool.",
        example: "sudo userdel -r jane",
        icon: <Trash2 className="w-4 h-4 text-red-500" />,
    },
};

// --- Component ---

export default function UserManagement() {
    const [selectedKey, setSelectedKey] = useState<string>("Create User + Home");
    const [target, setTarget] = useState("john");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    // Auto-generate command whenever selectedKey or target changes
    useEffect(() => {
        if (selectedKey && target) {
            const cmd = COMMANDS[selectedKey].command(target.trim().replace(/\s/g, '')); // Ensure no spaces
            setOutput(cmd);
        } else {
            setOutput("");
        }
    }, [selectedKey, target]);

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

    const selectedCommand = COMMANDS[selectedKey];

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
                    <div className="p-3 bg-gradient-to-br from-green-600 to-teal-700 rounded-xl shadow-lg">
                        <User className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                        Linux User Manager
                    </h1>
                </motion.div>

                {/* --- 1. Target Input --- */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-teal-400" />
                        Target Username
                    </h2>
                    
                    <label className="block mb-2 font-medium text-gray-400">Username (e.g., jane, deployer, admin)</label>
                    <input
                        type="text"
                        placeholder="Enter username"
                        className="w-full p-4 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 transition-shadow"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                    />
                </motion.div>

                {/* --- 2. Command Selector --- */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                        <Copy className="w-5 h-5 text-teal-400" />
                        Select Action
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(COMMANDS).map(([key, cmd]) => (
                            <motion.button
                                key={key}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedKey(key)}
                                className={`p-4 text-left rounded-xl border transition-all duration-200 ${selectedKey === key
                                    ? "bg-green-900/50 border-green-500 text-green-300 shadow-lg shadow-green-900/40"
                                    : "bg-gray-900 border-gray-700 hover:bg-gray-700/50 text-gray-200"
                                    }`}
                            >
                                <p className="font-bold text-lg mb-1 flex items-center gap-2">{cmd.icon} {key}</p>
                                <p className="text-sm text-gray-400 line-clamp-2">{cmd.description}</p>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
                
                {/* --- 3. Generated Output --- */}
                <AnimatePresence mode="wait">
                    {output && (
                        <motion.div
                            key={selectedKey + target}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="p-6 bg-gradient-to-br from-black to-gray-900 rounded-2xl border border-green-700 shadow-2xl relative"
                        >
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">Generated Command</h2>
                            
                            {/* Command Output Box */}
                            <div className="relative group">
                                <pre className="bg-gray-800 p-4 rounded-xl font-mono text-base text-gray-100 border border-green-500 overflow-x-auto pr-16">
                                    <span className="text-green-400 select-none">$ </span>
                                    {output}
                                </pre>

                                {/* Copy Button */}
                                <motion.button
                                    onClick={copyToClipboard}
                                    className={`absolute top-4 right-4 p-2 rounded-lg transition-all flex items-center gap-1 ${copied
                                        ? "bg-emerald-600 text-white"
                                        : "bg-green-600 text-white hover:bg-green-500"
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
                                <h3 className="font-semibold text-lg mb-2 text-teal-400">Example Usage:</h3>
                                <pre className="bg-gray-800 p-4 rounded-xl font-mono text-sm text-gray-300 border border-gray-700 overflow-x-auto">
                                    <span className="text-teal-400 select-none">$ </span>
                                    {selectedCommand.example.replace('john', target)}
                                </pre>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}