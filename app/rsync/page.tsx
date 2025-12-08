"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { Copy, Cloud, Server, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Component ---

export default function RsyncGenerator() {
    const [mode, setMode] = useState("push"); // 'push', 'pull', 'local'
    const [sourcePath, setSourcePath] = useState("/home/user/data/");
    const [destinationPath, setDestinationPath] = useState("/backup/");
    const [remoteUser, setRemoteUser] = useState("remote_user");
    const [remoteHost, setRemoteHost] = useState("192.168.1.100");

    // Sync Flags
    const [useArchive, setUseArchive] = useState(true); // -a (recursive, permissions, times, group, owner)
    const [useVerbose, setUseVerbose] = useState(false); // -v
    const [useProgress, setUseProgress] = useState(true); // --progress
    const [useDelete, setUseDelete] = useState(false); // --delete

    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);

    // Auto-generate command when inputs change
    useEffect(() => {
        const flags = `${useArchive ? "a" : ""}${useVerbose ? "v" : ""}${useProgress ? " --progress" : ""}${useDelete ? " --delete" : ""}`;
        const archiveFlag = flags.includes('a') ? flags.replace('a', '') : flags;
        const baseFlags = `-r${flags ? archiveFlag : ' '}z`; // -r is essential if -a is off, z for compress

        let command = "rsync ";
        
        // Add SSH flags for remote modes
        if (mode !== 'local') {
            command += `-e ssh `;
        }
        
        // Add core flags
        command += flags.includes('a') ? `-avz ` : `${baseFlags} `;
        
        // Add delete flag
        if (useDelete) {
            command += `--delete `;
        }
        
        // Add progress flag
        if (useProgress) {
            command += `--progress `;
        }
        
        // Construct the source and destination based on mode
        const src = sourcePath.trim() || "/path/to/source/";
        const dest = destinationPath.trim() || "/path/to/destination/";
        const remoteTarget = `${remoteUser || "user"}@${remoteHost || "host"}`;

        if (mode === 'push') {
            command += `${src} ${remoteTarget}:${dest}`;
        } else if (mode === 'pull') {
            command += `${remoteTarget}:${src} ${dest}`;
        } else { // local
            command += `${src} ${dest}`;
        }
        
        // Add sudo suggestion for non-local syncs or if paths suggest root access is needed
        if (mode !== 'local' || src.startsWith('/') || dest.startsWith('/')) {
            command = `sudo ${command}`;
        }

        setGeneratedCommand(command.trim());
    }, [mode, sourcePath, destinationPath, remoteUser, remoteHost, useArchive, useVerbose, useProgress, useDelete]);

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
    
    // Determine header icon and title based on mode
    const header = {
        icon: mode === 'push' ? <ArrowRight className="w-7 h-7" /> : mode === 'pull' ? <ArrowLeft className="w-7 h-7" /> : <Server className="w-7 h-7" />,
        title: mode === 'push' ? 'Push Sync (Local → Remote)' : mode === 'pull' ? 'Pull Sync (Remote → Local)' : 'Local File Sync',
        color: mode === 'push' ? 'text-teal-400' : mode === 'pull' ? 'text-cyan-400' : 'text-blue-400',
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
                    className="flex items-center gap-4 mb-8 md:mb-10"
                >
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl shadow-lg">
                        <Cloud className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                        Rsync Synchronization Generator
                    </h1>
                </motion.div>

                {/* --- Mode Selection --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">1. Choose Synchronization Mode</h2>
                    <div className="flex space-x-4">
                        {['push', 'pull', 'local'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${mode === m 
                                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/50' 
                                    : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50'}`
                                }
                            >
                                {m === 'push' ? <ArrowRight size={20} /> : m === 'pull' ? <ArrowLeft size={20} /> : <Server size={20} />}
                                {m.charAt(0).toUpperCase() + m.slice(1)}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* --- Input Panel --- */}
                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    
                    {/* Path Inputs */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl lg:col-span-2"
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                            <span className={`font-mono text-2xl ${header.color}`}>[ {mode.toUpperCase()} ]</span>
                            {header.title}
                        </h2>
                        
                        {/* Remote Credentials (Visible if not local) */}
                        {mode !== 'local' && (
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-400">Remote User</label>
                                    <input
                                        type="text"
                                        placeholder="user"
                                        className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 transition-shadow"
                                        value={remoteUser}
                                        onChange={(e) => setRemoteUser(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-400">Remote Host/IP</label>
                                    <input
                                        type="text"
                                        placeholder="192.168.1.100"
                                        className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 transition-shadow"
                                        value={remoteHost}
                                        onChange={(e) => setRemoteHost(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        
                        {/* Source Path */}
                        <label className="block mb-1 text-sm font-medium text-gray-400">
                            Source Path {mode === 'pull' ? "(Remote)" : "(Local)"}
                        </label>
                        <input
                            type="text"
                            placeholder={mode === 'pull' ? "/home/data/" : "/var/www/project/"}
                            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 transition-shadow mb-4"
                            value={sourcePath}
                            onChange={(e) => setSourcePath(e.target.value)}
                        />
                        
                        {/* Destination Path */}
                        <label className="block mb-1 text-sm font-medium text-gray-400">
                            Destination Path {mode === 'push' ? "(Remote)" : "(Local)"}
                        </label>
                        <input
                            type="text"
                            placeholder={mode === 'push' ? "/backup/new-project/" : "/mnt/external-drive/dump/"}
                            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 transition-shadow"
                            value={destinationPath}
                            onChange={(e) => setDestinationPath(e.target.value)}
                        />

                    </motion.div>
                    
                    {/* Flags/Options Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl"
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">2. Synchronization Flags</h2>
                        
                        {/* Archive Toggle */}
                        <FlagToggle 
                            label="Archive Mode (-avz)" 
                            description="Recommended: Combines recursive, preserve permissions, times, links, groups, and compresses data."
                            checked={useArchive} 
                            onChange={setUseArchive} 
                            color="cyan"
                        />
                        
                        {/* Delete Toggle */}
                        <FlagToggle 
                            label="Delete (--delete)" 
                            description="Removes files from the DESTINATION that are missing from the SOURCE. USE WITH CAUTION."
                            checked={useDelete} 
                            onChange={setUseDelete} 
                            color="red"
                        />
                        
                        {/* Progress Toggle */}
                        <FlagToggle 
                            label="Show Progress (--progress)" 
                            description="Displays a transfer bar for larger files."
                            checked={useProgress} 
                            onChange={setUseProgress} 
                            color="green"
                        />
                        
                        {/* Verbose Toggle */}
                        <FlagToggle 
                            label="Verbose (-v)" 
                            description="Outputs more information about the files being transferred."
                            checked={useVerbose} 
                            onChange={setUseVerbose} 
                            color="blue"
                        />
                    </motion.div>
                </div>
                
                {/* --- Generated Output --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative bg-gradient-to-br from-black to-gray-900 rounded-2xl border border-cyan-700 shadow-2xl p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-3">3. Final Rsync Command</h2>
                    
                    <div className="relative group">
                        <pre className="bg-gray-800 p-4 rounded-xl font-mono text-sm md:text-base text-gray-100 border border-cyan-500 overflow-x-auto pr-16">
                            <span className="text-cyan-400 select-none">$ </span>
                            {generatedCommand}
                        </pre>

                        {/* Copy Button */}
                        <motion.button
                            onClick={() => copyToClipboard(generatedCommand)}
                            className={`absolute top-4 right-4 p-2 rounded-lg transition-all flex items-center gap-1 ${copied
                                ? "bg-emerald-600 text-white"
                                : "bg-cyan-600 text-white hover:bg-cyan-500"
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
                    
                    <p className="text-sm text-gray-400 mt-4">
                        **Important Note:** Pay attention to the **trailing slash** (e.g., `/home/user/data/`). A trailing slash means sync the **contents** of the source directory, while no trailing slash means sync the **directory itself**.
                    </p>
                    [Image illustrating the difference between rsync source/path and rsync source/path/ (with trailing slash)]

                </motion.div>
            </main>
        </div>
    );
}

// Helper Component for Flag Toggles
const FlagToggle: React.FC<{ label: string, description: string, checked: boolean, onChange: (checked: boolean) => void, color: string }> = ({ label, description, checked, onChange, color }) => (
    <div 
        onClick={() => onChange(!checked)}
        className={`flex flex-col p-3 rounded-xl cursor-pointer transition-colors mb-3 ${checked ? `bg-${color}-900/50 border border-${color}-600` : 'bg-gray-900 border border-gray-700 hover:bg-gray-700/50'}`}
    >
        <div className="flex items-center justify-between">
            <span className="text-base font-medium">{label}</span>
            <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${checked ? `bg-${color}-500` : 'bg-gray-600'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
        </div>
        <p className={`text-xs mt-1 ${checked ? 'text-gray-300' : 'text-gray-500'}`}>{description}</p>
    </div>
);