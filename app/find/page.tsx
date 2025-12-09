"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar"; 
import { Copy, FolderSearch, Check, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Component for Copyable Command ---
const CopyableCommand: React.FC<{ command: string, onCopy: (text: string) => void }> = ({ command, onCopy }) => {
    const [localCopied, setLocalCopied] = useState(false);

    const handleCopy = () => {
        onCopy(command);
        setLocalCopied(true);
        setTimeout(() => setLocalCopied(false), 2000);
    };

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className="text-fuchsia-400 select-none">$ </span>
            <pre className="flex-1 overflow-x-auto mx-2">{command}</pre>
            <motion.button
                onClick={handleCopy}
                className={`p-1 rounded transition-all ${localCopied ? "bg-emerald-600" : "bg-fuchsia-600 hover:bg-fuchsia-500"}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Copiar Comando"
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

// --- Main Component ---
export default function FindCommandGenerator() {
    const [directory, setDirectory] = useState(".");
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState("");
    const [timeType, setTimeType] = useState(""); // mtime (modificación) | ctime (cambio) | atime (acceso)
    const [timeValue, setTimeValue] = useState("");
    const [action, setAction] = useState(""); // -print | -delete | -exec
    const [execCommand, setExecCommand] = useState("");

    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        let cmd = `find ${directory.trim() || "."}`;

        // 1. Name Filter
        if (fileName.trim()) {
            // Using -iname for case-insensitivity, common preference
            cmd += ` -iname '${fileName.trim().replace(/'/g, "\\'")}'`;
        }

        // 2. Type Filter
        if (fileType) {
            cmd += ` -type ${fileType}`;
        }
        
        // 3. Time Filter
        if (timeType && timeValue.trim()) {
            // Assumes a numerical value for days ago (e.g., +7, -3)
            const operator = timeValue.trim().startsWith('+') || timeValue.trim().startsWith('-') ? '' : '+';
            cmd += ` -${timeType} ${operator}${timeValue.trim()}`;
        }

        // 4. Action
        if (action === '-exec' && execCommand.trim()) {
            // Standard format for -exec
            cmd += ` ${action} ${execCommand.trim().replace(/'/g, "\\'")} {} \\;`;
        } else if (action === '-delete' || action === '-print') {
            cmd += ` ${action}`;
        } else {
             // Default to print if no specific action is selected and not using -exec
            if (!action) {
                 cmd += ` -print`;
            }
        }
        
        // Final command cleanup
        setGeneratedCommand(cmd.trim().replace(/\s+/g, ' '));
    }, [directory, fileName, fileType, timeType, timeValue, action, execCommand]);

    // Copy to Clipboard logic
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

    const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-fuchsia-500 transition-shadow outline-none";
    const labelBaseClasses = "block mb-1 text-sm font-medium text-gray-400";
    const containerBaseClasses = "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";
    const selectBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-fuchsia-500 transition-shadow outline-none appearance-none cursor-pointer";
    const optionBaseClasses = "bg-gray-900 text-white";
    

    return (
        // Dark Mode Base Styling
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
            <Sidebar />

            <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-6xl mx-auto pt-20 lg:pt-10">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-8 md:mb-10 border-b border-gray-700/50 pb-6"
                >
                    <div className="p-3 bg-gradient-to-br from-fuchsia-600 to-purple-700 rounded-xl shadow-lg">
                        <FolderSearch className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-fuchsia-400 bg-clip-text text-transparent leading-tight">
                        `find` Command Generator
                    </h1>
                </motion.div>

                {/* --- Input Panel --- */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${containerBaseClasses} h-full`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Search Parameters</h2>

                        <div className="space-y-5">
                            {/* Directory */}
                            <div>
                                <label className={labelBaseClasses}>Start Directory (Path)</label>
                                <input type="text" placeholder="./" value={directory} onChange={(e) => setDirectory(e.target.value)} className={inputBaseClasses} />
                                <p className="text-xs text-gray-500 mt-1">Example: `/var/log` or `~`</p>
                            </div>

                            {/* File Name */}
                            <div>
                                <label className={labelBaseClasses}>File Name Pattern (`-iname`)</label>
                                <input type="text" placeholder="*.log or index.html" value={fileName} onChange={(e) => setFileName(e.target.value)} className={inputBaseClasses} />
                                <p className="text-xs text-gray-500 mt-1">Case-insensitive. Use `*` for wildcards.</p>
                            </div>
                            
                            {/* File Type */}
                            <div>
                                <label className={labelBaseClasses}>File Type (`-type`)</label>
                                <div className="relative">
                                    <select value={fileType} onChange={(e) => setFileType(e.target.value)} className={selectBaseClasses}>
                                        <option value="" className={optionBaseClasses}>Any Type (Default)</option>
                                        <option value="f" className={optionBaseClasses}>Regular File (`f`)</option>
                                        <option value="d" className={optionBaseClasses}>Directory (`d`)</option>
                                        <option value="l" className={optionBaseClasses}>Symbolic Link (`l`)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                            
                            {/* Time Filters */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className={labelBaseClasses}>Time Criterion</label>
                                    <div className="relative">
                                        <select value={timeType} onChange={(e) => setTimeType(e.target.value)} className={selectBaseClasses}>
                                            <option value="">None</option>
                                            <option value="mtime">Modified (`mtime`)</option>
                                            <option value="ctime">Changed (`ctime`)</option>
                                            <option value="atime">Accessed (`atime`)</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className={labelBaseClasses}>Days Ago (e.g., -3, +7)</label>
                                    <input type="text" placeholder="-3 or +7" value={timeValue} onChange={(e) => setTimeValue(e.target.value.replace(/[^0-9+-]/g, ''))} className={inputBaseClasses} />
                                    <p className="text-xs text-gray-500 mt-1">`-3`: within 3 days. `+7`: older than 7 days.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Output Panel & Action */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`${containerBaseClasses} h-full flex flex-col`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Action & Command</h2>
                        
                        {/* Action Selection */}
                        <div className="mb-6">
                            <label className={labelBaseClasses}>Action to Perform on Match</label>
                            <div className="relative">
                                <select value={action} onChange={(e) => setAction(e.target.value)} className={selectBaseClasses}>
                                    <option value="" className={optionBaseClasses}>Default: Print results (-print)</option>
                                    <option value="-print" className={optionBaseClasses}>Print Full Path (`-print`)</option>
                                    <option value="-delete" className="bg-red-900 text-white">Delete Found Files (`-delete`)</option>
                                    <option value="-exec" className={optionBaseClasses}>Execute Command (`-exec`)</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Exec Command Input */}
                        {action === '-exec' && (
                            <motion.div
                                key="exec-input"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative mb-6"
                            >
                                <label className={labelBaseClasses}>Command to Execute (`-exec`)</label>
                                <input 
                                    type="text" 
                                    placeholder="chmod 777 {}" 
                                    value={execCommand} 
                                    onChange={(e) => setExecCommand(e.target.value)} 
                                    className={inputBaseClasses} 
                                />
                                <p className="text-xs text-gray-500 mt-1">Use **`{}`** as a placeholder for the found filename.</p>
                            </motion.div>
                        )}

                        <div className="flex-1 flex flex-col justify-end">
                            <h3 className="text-lg font-semibold text-white mb-2">Generated Command:</h3>
                            <AnimatePresence mode="wait">
                                {generatedCommand ? (
                                    <motion.div
                                        key="output-cmd"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative"
                                    >
                                        <CopyableCommand command={generatedCommand} onCopy={copyToClipboard} />
                                    </motion.div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                                        Configure your search to generate the `find` command.
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
                
                {/* --- Reference Guide --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`${containerBaseClasses}`}
                >
                    <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setIsGuideOpen(!isGuideOpen)}
                    >
                        <h2 className="text-xl font-bold text-fuchsia-400">📚 `find` Reference and Best Practices</h2>
                        <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                            {isGuideOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {isGuideOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-gray-700 overflow-hidden space-y-4 text-sm text-gray-300"
                            >
                                
                                <h3 className="font-semibold text-lg text-white mt-4">Key Syntax and Actions</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-fuchsia-700/50">
                                        <p className="font-medium text-fuchsia-300">Filtering by Size (`-size`)</p>
                                        <p className="text-gray-400 mb-2">Find files larger than 50MB (k/M/G):</p>
                                        <CopyableCommand command="find . -size +50M" onCopy={copyToClipboard} />
                                        <p className="text-gray-400 mb-2 mt-3">Find files exactly 1024 bytes:</p>
                                        <CopyableCommand command="find . -size 1024c" onCopy={copyToClipboard} />
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-xl border border-fuchsia-700/50">
                                        <p className="font-medium text-fuchsia-300">Executing Commands (`-exec`)</p>
                                        <p className="text-gray-400 mb-2">Find all `.bak` files and safely remove them:</p>
                                        <CopyableCommand command="find . -name '*.bak' -exec rm {} \\;" onCopy={copyToClipboard} />
                                        <p className="text-gray-400 mb-2 mt-3">Find directories and change permissions:</p>
                                        <CopyableCommand command="find . -type d -exec chmod 755 {} \\;" onCopy={copyToClipboard} />
                                    </div>
                                    
                                    <div className="bg-gray-900 p-4 rounded-xl border border-fuchsia-700/50 md:col-span-2">
                                        <p className="font-medium text-fuchsia-300">Safety & Logic (`-o`, `!`, `-maxdepth`)</p>
                                        <p className="text-gray-400 mb-2">Find files older than 30 days (`+30`) but ignore a specific sub-directory (`-path`).</p>
                                        <CopyableCommand command="find /var/log/ -mtime +30 ! -path '/var/log/nginx/*' -delete" onCopy={copyToClipboard} />
                                        <p className="text-gray-400 mb-2 mt-3">Find files named `foo` OR `bar` (using the OR operator, `-o`).</p>
                                        <CopyableCommand command="find . -name 'foo.txt' -o -name 'bar.txt' -print" onCopy={copyToClipboard} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}