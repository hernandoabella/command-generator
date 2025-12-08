"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { Copy, Cog, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Component ---

export default function SystemctlGenerator() {
    const [serviceName, setServiceName] = useState("");
    const [execStart, setExecStart] = useState("");
    const [description, setDescription] = useState("");
    const [generated, setGenerated] = useState("");
    const [copied, setCopied] = useState(false);

    // Auto-generate service file when inputs change
    useEffect(() => {
        if (!serviceName || !execStart) {
            setGenerated("");
            return;
        }

        // Clean up service name for use in the file path
        const cleanServiceName = serviceName.trim().toLowerCase().replace(/\s+/g, '-');

        const serviceFile = `[Unit]
Description=${description || `Service for ${serviceName}`}
After=network.target

[Service]
# User/Group to run the service as (strongly recommended not to use root)
# User=youruser
# Group=yourgroup
Type=simple
ExecStart=${execStart}
# Set environment variables if needed:
# Environment="PORT=8080"
WorkingDirectory=/opt/${cleanServiceName}
Restart=always
# RestartSec=5 # Optional: wait 5 seconds before restarting
# StandardOutput=journal
# StandardError=journal

[Install]
WantedBy=multi-user.target`;

        setGenerated(serviceFile);
    }, [serviceName, execStart, description]);

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
    
    // Commands used in the installation guide
    const installCommands = {
        savePath: `/etc/systemd/system/${serviceName || "my-app"}.service`,
        daemon: `sudo systemctl daemon-reload`,
        enable: `sudo systemctl enable ${serviceName || "my-app"}`,
        start: `sudo systemctl start ${serviceName || "my-app"}`,
        status: `sudo systemctl status ${serviceName || "my-app"}`,
    };

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
                    <div className="p-3 bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl shadow-lg">
                        <Cog className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-amber-400 bg-clip-text text-transparent">
                        Systemd Service File Builder
                    </h1>
                </motion.div>

                {/* FORM AND OUTPUT */}
                <div className="grid lg:grid-cols-2 gap-8">
                    
                    {/* Input Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl h-full"
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Service Details</h2>
                        
                        <label className="block mb-1 text-sm font-medium text-gray-400">Service Name (e.g., myapp)</label>
                        <input
                            type="text"
                            placeholder="myapp"
                            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 transition-shadow mb-4"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                        />
                        
                        <label className="block mb-1 text-sm font-medium text-gray-400">ExecStart Command (Full path)</label>
                        <input
                            type="text"
                            placeholder="/usr/bin/node /opt/myapp/server.js"
                            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 transition-shadow mb-4"
                            value={execStart}
                            onChange={(e) => setExecStart(e.target.value)}
                        />
                        
                        <label className="block mb-1 text-sm font-medium text-gray-400">Description (Optional)</label>
                        <input
                            type="text"
                            placeholder="A simple Node.js application"
                            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 transition-shadow mb-6"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                    </motion.div>

                    {/* Output Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl h-full"
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Generated Service File</h2>
                        
                        <AnimatePresence mode="wait">
                            {generated ? (
                                <motion.div
                                    key="output"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative bg-gray-900 p-4 rounded-xl font-mono text-xs md:text-sm text-gray-300 border border-orange-600"
                                >
                                    <button
                                        onClick={() => copyToClipboard(generated)}
                                        className={`absolute top-2 right-2 p-2 rounded-lg transition-all flex items-center gap-1 ${copied
                                            ? "bg-emerald-600 text-white"
                                            : "bg-orange-600 text-white hover:bg-orange-500"
                                            }`}
                                        
                                       
                                        title="Copy File Content"
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
                                    </button>
                                    
                                    <pre className="whitespace-pre-wrap break-all">{generated}</pre>
                                </motion.div>
                            ) : (
                                <div className="p-10 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                                    Fill in the **Service Name** and **ExecStart Command** to generate the service file.
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* --- Installation Guide --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-10 p-6 bg-gray-800 rounded-2xl shadow-xl border border-gray-700"
                >
                    <h2 className="text-2xl font-bold mb-4 text-amber-400">🚀 Deployment Instructions</h2>
                    
                    <ol className="space-y-6">
                        {/* Step 1: Save File */}
                        <li className="flex items-start">
                            <span className="p-2 bg-amber-600 rounded-full text-white font-bold mr-4 flex-shrink-0">1</span>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Save the file:</h3>
                                <p className="text-gray-400 mb-2">
                                    Create and paste the content above into the service file using `nano` or `vi`.
                                </p>
                                <CopyableCommand command={`sudo nano ${installCommands.savePath}`} onCopy={copyToClipboard} />
                            </div>
                        </li>
                        
                        {/* Step 2: Reload Daemon */}
                        <li className="flex items-start">
                            <span className="p-2 bg-amber-600 rounded-full text-white font-bold mr-4 flex-shrink-0">2</span>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Reload Systemd:</h3>
                                <p className="text-gray-400 mb-2">
                                    Inform systemd about the new or modified service file.
                                </p>
                                <CopyableCommand command={installCommands.daemon} onCopy={copyToClipboard} />
                            </div>
                        </li>
                        
                        {/* Step 3: Enable and Start */}
                        <li className="flex items-start">
                            <span className="p-2 bg-amber-600 rounded-full text-white font-bold mr-4 flex-shrink-0">3</span>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Enable & Start:</h3>
                                <p className="text-gray-400 mb-2">
                                    **Enable** the service to start automatically at boot, then **start** it immediately.
                                </p>
                                <CopyableCommand command={installCommands.enable} onCopy={copyToClipboard} />
                                <CopyableCommand command={installCommands.start} onCopy={copyToClipboard} />
                            </div>
                        </li>
                        
                        {/* Step 4: Check Status */}
                        <li className="flex items-start">
                            <span className="p-2 bg-amber-600 rounded-full text-white font-bold mr-4 flex-shrink-0">4</span>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Check Status:</h3>
                                <p className="text-gray-400 mb-2">
                                    Verify the service is running correctly and check logs for errors.
                                </p>
                                <CopyableCommand command={installCommands.status} onCopy={copyToClipboard} />
                            </div>
                        </li>
                    </ol>
                </motion.div>
                
            </main>
        </div>
    );
}

// Helper component for commands with copy button
const CopyableCommand: React.FC<{ command: string, onCopy: (text: string) => void }> = ({ command, onCopy }) => {
    const [localCopied, setLocalCopied] = useState(false);

    const handleCopy = () => {
        onCopy(command);
        setLocalCopied(true);
        setTimeout(() => setLocalCopied(false), 2000);
    };

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className="text-amber-400 select-none">$ </span>
            <pre className="flex-1 overflow-x-auto mx-2">{command}</pre>
            <motion.button
                onClick={handleCopy}
                className={`p-1 rounded transition-all ${localCopied ? "bg-emerald-600" : "bg-orange-600 hover:bg-orange-500"}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Copy Command"
            >
                <AnimatePresence mode="wait">
                    {localCopied ? (
                        <motion.div key="check" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                            <Check size={14} className="text-white" />
                        </motion.div>
                    ) : (
                        <motion.div key="copy" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                            <Copy size={14} className="text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};