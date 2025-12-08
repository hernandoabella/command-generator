"use client";

import { useState, useCallback, useEffect } from "react";
// Import the Sidebar from its relative location, as specified in the code.
// Assuming the component (SimpleSidebar) is located at this path.
import Sidebar from "../components/SideBar"; 
import { Copy, Search, FileText, Folder, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Component for Flag Toggles ---
const FlagToggle: React.FC<{ label: string, description: string, checked: boolean, onChange: (checked: boolean) => void, color: string }> = ({ label, description, checked, onChange, color }) => (
    <div 
        onClick={() => onChange(!checked)}
        className={`flex flex-col p-3 rounded-xl cursor-pointer transition-colors mb-3 ${checked ? `bg-${color}-900/50 border border-${color}-600` : 'bg-gray-900 border border-gray-700 hover:bg-gray-700/50'}`}
    >
        <div className="flex items-center justify-between">
            <span className="text-base font-medium">{label}</span>
            <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${checked ? `bg-${color}-500` : 'bg-gray-600'}`}>
                <motion.div 
                    layout 
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </div>
        </div>
        <p className={`text-xs mt-1 ${checked ? 'text-gray-300' : 'text-gray-500'}`}>{description}</p>
    </div>
);


// --- Main Component ---

export default function FileSearchGenerator() {
    const [searchMode, setSearchMode] = useState("content"); // 'content' (grep) or 'filename' (find)
    const [searchText, setSearchText] = useState("error|warning");
    const [filePath, setFilePath] = useState(".");
    
    // Grep Options
    const [ignoreCase, setIgnoreCase] = useState(true); // -i
    const [recursiveGrep, setRecursiveGrep] = useState(true); // -r
    const [showLineNumbers, setShowLineNumbers] = useState(false); // -n
    const [invertMatch, setInvertMatch] = useState(false); // -v

    // Find Options
    const [fileType, setFileType] = useState("all"); // 'f', 'd', 'all'
    const [fileNamePattern, setFileNamePattern] = useState("*.log"); // -name

    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);

    // Auto-generate command when inputs change
    useEffect(() => {
        let command = "";
        const targetPath = filePath.trim() || ".";
        const text = searchText.trim() || "search_term";

        if (searchMode === 'content') {
            // --- GREP Mode ---
            
            // Grep flags
            const grepFlags = `${ignoreCase ? "i" : ""}${showLineNumbers ? "n" : ""}${invertMatch ? "v" : ""}`;
            
            // Core command
            if (recursiveGrep) {
                // Use -r (recursive)
                command = `grep -r${grepFlags} "${text}" ${targetPath}`;
            } else {
                // Use find + xargs + grep for better control
                let findCommand = `find ${targetPath} -type f`;

                const grepOptions = grepFlags.length > 0 ? `-${grepFlags}` : '';
                
                // Pipe to grep using print0/xargs for safe handling of filenames with spaces
                command = `${findCommand} -print0 | xargs -0 grep ${grepOptions} "${text}"`;
            }

        } else {
            // --- FIND Mode ---

            let findCommand = `find ${targetPath}`;

            // Add file type option
            if (fileType === 'f') {
                findCommand += ` -type f`;
            } else if (fileType === 'd') {
                findCommand += ` -type d`;
            }
            
            // Add name pattern
            if (fileNamePattern.trim()) {
                // Add the -name flag only if there's a pattern
                findCommand += ` -name "${fileNamePattern.trim()}"`;
            }

            command = findCommand;
        }

        setGeneratedCommand(command.trim());
    }, [searchMode, searchText, filePath, ignoreCase, recursiveGrep, showLineNumbers, invertMatch, fileType, fileNamePattern]);

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
        icon: searchMode === 'content' ? <FileText className="w-7 h-7" /> : <Folder className="w-7 h-7" />,
        title: searchMode === 'content' ? 'Content Search (grep)' : 'Filename Search (find)',
        accent: searchMode === 'content' ? 'from-pink-600 to-red-700' : 'from-red-600 to-pink-700',
        ring: searchMode === 'content' ? 'ring-pink-500' : 'ring-red-500',
    };

    return (
        // Dark Mode Base Styling
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
            {/* 1. Sidebar Component Integrated */}
            {/* NOTE: The ml-64 class should match the expanded Sidebar width. */}
            <Sidebar />

            <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-6xl mx-auto">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-8 md:mb-10"
                >
                    <div className={`p-3 bg-gradient-to-br ${header.accent} rounded-xl shadow-lg`}>
                        <Search className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                        Grep / Find File Search Generator
                    </h1>
                </motion.div>

                {/* --- Mode Selection --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">1. Select Search Target</h2>
                    <div className="flex space-x-4">
                        {['content', 'filename'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setSearchMode(m)}
                                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${searchMode === m 
                                    ? 'bg-pink-600 text-white shadow-md shadow-pink-900/50' 
                                    : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50'}`
                                }
                            >
                                {m === 'content' ? <FileText size={20} /> : <Folder size={20} />}
                                {m === 'content' ? 'Content (Grep)' : 'Filename (Find)'}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    
                    {/* --- Input Panel --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl lg:col-span-2"
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                            {header.icon}
                            {header.title} Parameters
                        </h2>
                        
                        {/* Target Path */}
                        <label className="block mb-1 text-sm font-medium text-gray-400">
                            Starting Path
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., /var/log or ."
                            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 transition-shadow mb-4"
                            value={filePath}
                            onChange={(e) => setFilePath(e.target.value)}
                        />
                        
                        {/* Search Input (Dynamic) */}
                        {searchMode === 'content' ? (
                            <>
                                <label className="block mb-1 text-sm font-medium text-gray-400">
                                    Text Pattern (Supports RegEx, e.g., `(error|fail)`)
                                </label>
                                <input
                                    type="text"
                                    placeholder="search_term"
                                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 transition-shadow"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </>
                        ) : (
                            <>
                                <label className="block mb-1 text-sm font-medium text-gray-400">
                                    Filename Pattern (`find -name`)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., *.conf or access_log"
                                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 transition-shadow mb-4"
                                    value={fileNamePattern}
                                    onChange={(e) => setFileNamePattern(e.target.value)}
                                />
                                
                                <label className="block mb-2 text-sm font-medium text-gray-400">
                                    File Type (`find -type`)
                                </label>
                                <div className="flex space-x-4">
                                    {['all', 'f', 'd'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setFileType(type)}
                                            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${fileType === type ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                                        >
                                            {type === 'all' ? 'All' : type === 'f' ? 'Files Only' : 'Directories Only'}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                    </motion.div>
                    
                    {/* Flags/Options Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl"
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">2. Grep Options</h2>
                        
                        {searchMode === 'content' ? (
                            <>
                                {/* Ignore Case Toggle */}
                                <FlagToggle 
                                    label="Ignore Case (-i)" 
                                    description="Match case-insensitively."
                                    checked={ignoreCase} 
                                    onChange={setIgnoreCase} 
                                    color="pink"
                                />
                                
                                {/* Recursive Toggle */}
                                <FlagToggle 
                                    label="Recursive (-r)" 
                                    description="Search all files under the path."
                                    checked={recursiveGrep} 
                                    onChange={setRecursiveGrep} 
                                    color="pink"
                                />
                                
                                {/* Show Line Numbers Toggle */}
                                <FlagToggle 
                                    label="Show Line Numbers (-n)" 
                                    description="Prefix each match with its line number."
                                    checked={showLineNumbers} 
                                    onChange={setShowLineNumbers} 
                                    color="pink"
                                />
                                
                                {/* Invert Match Toggle */}
                                <FlagToggle 
                                    label="Invert Match (-v)" 
                                    description="Show lines that DO NOT contain the pattern."
                                    checked={invertMatch} 
                                    onChange={setInvertMatch} 
                                    color="red"
                                />
                            </>
                        ) : (
                            <p className="text-gray-400">
                                Options are only available in **Content Search (Grep) Mode**.
                            </p>
                        )}
                    </motion.div>
                </div>
                
                {/* --- Generated Output --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative bg-gradient-to-br from-black to-gray-900 rounded-2xl border border-red-700 shadow-2xl p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-3">3. Final Search Command</h2>
                    
                    <div className="relative group">
                        <pre className="bg-gray-800 p-4 rounded-xl font-mono text-sm md:text-base text-gray-100 border border-red-500 overflow-x-auto pr-16">
                            <span className="text-red-400 select-none">$ </span>
                            {generatedCommand}
                        </pre>

                        {/* Copy Button */}
                        <motion.button
                            onClick={() => copyToClipboard(generatedCommand)}
                            className={`absolute top-4 right-4 p-2 rounded-lg transition-all flex items-center gap-1 ${copied
                                ? "bg-emerald-600 text-white"
                                : "bg-red-600 text-white hover:bg-red-500"
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
                        **Pro Tip:** If you select **Content Search** and disable **Recursive**, the generated command will use a **`find` piped to `grep`** structure (`find . -type f -print0 | xargs -0 grep ...`) for safer handling of large file lists.
                    </p>
                    
                </motion.div>
            </main>
        </div>
    );
}