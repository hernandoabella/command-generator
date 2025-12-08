"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { Copy, Users, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Component ---

export default function ChownGenerator() {
    const [owner, setOwner] = useState("john_doe");
    const [group, setGroup] = useState("webdev");
    const [path, setPath] = useState("/var/www/html/project");
    const [recursive, setRecursive] = useState(false);
    const [changeGroupOnly, setChangeGroupOnly] = useState(false);
    
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);

    // Auto-generate command when inputs change
    useEffect(() => {
        let command = "";
        let targetOwnerGroup = "";
        
        const options = recursive ? " -R" : "";
        const targetPath = path || "/path/to/file";

        if (changeGroupOnly) {
            // Use chgrp
            targetOwnerGroup = group || "newgroup";
            command = `sudo chgrp${options} ${targetOwnerGroup} ${targetPath}`;
        } else {
            // Use chown
            const ownerPart = owner || "newuser";
            const groupPart = group ? `:${group}` : "";
            
            targetOwnerGroup = `${ownerPart}${groupPart}`;
            command = `sudo chown${options} ${targetOwnerGroup} ${targetPath}`;
        }

        setGeneratedCommand(command);
    }, [owner, group, path, recursive, changeGroupOnly]);

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

    return (
        // Dark Mode Base Styling
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
            <Sidebar />

            <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-5xl mx-auto">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-8 md:mb-10"
                >
                    <div className="p-3 bg-gradient-to-br from-yellow-700 to-amber-800 rounded-xl shadow-lg">
                        <Users className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-amber-400 bg-clip-text text-transparent">
                        chown / chgrp Ownership Generator
                    </h1>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    
                    {/* --- Input Panel --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl h-full"
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Ownership Targets</h2>
                        
                        {/* Owner Input */}
                        <label className="block mb-1 text-sm font-medium text-gray-400">New Owner (User)</label>
                        <input
                            type="text"
                            placeholder="john_doe"
                            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 transition-shadow mb-4"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                            disabled={changeGroupOnly}
                        />
                        
                        {/* Group Input */}
                        <label className="block mb-1 text-sm font-medium text-gray-400">New Group (Optional)</label>
                        <input
                            type="text"
                            placeholder="webdev or root (leave blank for no group change)"
                            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 transition-shadow mb-6"
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                        />

                        {/* Path Input */}
                        <label className="block mb-1 text-sm font-medium text-gray-400">Target File or Directory Path</label>
                        <input
                            type="text"
                            placeholder="/var/www/html/project"
                            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 transition-shadow mb-6"
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                        />

                        {/* Options */}
                        <h3 className="text-lg font-semibold text-gray-200 mb-3">Options</h3>
                        <div className="space-y-3">
                            {/* Recursive Toggle */}
                            <div 
                                onClick={() => setRecursive(!recursive)}
                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${recursive ? 'bg-amber-900/50 border border-amber-600' : 'bg-gray-900 border border-gray-700 hover:bg-gray-700/50'}`}
                            >
                                <span className="text-base font-medium">Recursive (`-R`)</span>
                                <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${recursive ? 'bg-amber-500' : 'bg-gray-600'}`}>
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${recursive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            {/* Change Group Only Toggle */}
                            <div 
                                onClick={() => setChangeGroupOnly(!changeGroupOnly)}
                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${changeGroupOnly ? 'bg-amber-900/50 border border-amber-600' : 'bg-gray-900 border border-gray-700 hover:bg-gray-700/50'}`}
                            >
                                <span className="text-base font-medium">Change Group Only (`chgrp`)</span>
                                <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${changeGroupOnly ? 'bg-amber-500' : 'bg-gray-600'}`}>
                                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${changeGroupOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- Output Panel --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl h-full flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">Generated Command</h2>

                            {/* Command Output Box */}
                            <AnimatePresence mode="wait">
                                {generatedCommand && (
                                    <motion.div
                                        key={generatedCommand}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative bg-gray-900 p-4 rounded-xl font-mono text-sm text-gray-300 border border-amber-600"
                                    >
                                        <div className="flex items-start justify-between">
                                            <pre className="flex-1 overflow-x-auto pr-2">
                                                <span className="text-amber-400 select-none">$ </span>
                                                {generatedCommand}
                                            </pre>

                                            <motion.button
                                                onClick={() => copyToClipboard(generatedCommand)}
                                                className={`p-2 rounded-lg transition-all flex items-center gap-1 ml-4 ${copied
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-amber-600 text-white hover:bg-amber-500"
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
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {/* --- Usage Guide --- */}
                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <h3 className="text-lg font-bold text-amber-400 mb-3">Usage and Syntax</h3>
                            
                            <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                                <li>**`chown user:group file`**: Changes both the **owner** and the **group**.</li>
                                <li>**`chown user file`**: Changes only the **owner**.</li>
                                <li>**`chown :group file`**: Changes only the **group** (same as `chgrp`).</li>
                                <li>**`chown -R`**: Applies the changes **recursively** to directories and their contents.</li>
                                <li>**`chgrp`**: A dedicated command used for changing **only the group**.</li>
                            </ul>
                            
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}