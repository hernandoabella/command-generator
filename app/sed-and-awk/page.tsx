"use client";

import { useState, useCallback, useEffect } from "react";
import { Copy, FileSearch, Check, Code, Menu, Database, Zap, Settings, X, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SimpleSidebar from "@/app/components/SideBar"; // Assuming the component is exported as SimpleSidebar

// --- Uniform Base Classes (Tailwind) ---
const inputBaseClasses = "w-full p-3 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-fuchsia-500 transition-shadow outline-none";
const labelBaseClasses = "block mb-1 text-sm font-medium text-gray-400";
const containerBaseClasses = "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";

// --- Helper Component for Flag Toggles (Refactored with more color) ---
interface FlagToggleProps {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    color: 'fuchsia' | 'red';
}

const FlagToggle: React.FC<FlagToggleProps> = ({ label, description, checked, onChange, color }) => {
    const activeBg = color === 'fuchsia' ? 'bg-fuchsia-600' : 'bg-red-600';
    const activeBorder = color === 'fuchsia' ? 'border-fuchsia-600' : 'border-red-600';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onChange(!checked)}
            className={`flex flex-col p-4 rounded-xl cursor-pointer transition-all mb-3 ${checked ? `bg-${color}-900/40 ${activeBorder} border-2` : 'bg-gray-900 border border-gray-700 hover:bg-gray-700/50'}`}
        >
            <div className="flex items-center justify-between">
                <span className="text-base font-semibold">{label}</span>
                <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${checked ? activeBg : 'bg-gray-600'}`}>
                    <motion.div
                        layout
                        className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
                    ></motion.div>
                </div>
            </div>
            <p className={`text-xs mt-1 ${checked ? 'text-gray-300' : 'text-gray-500'}`}>{description}</p>
        </motion.div>
    );
};


// --- Main Component ---
export default function SedAwkGenerator() {
    const [toolMode, setToolMode] = useState<"sed" | "awk">("sed"); // 'sed' or 'awk'

    // --- SED State ---
    const [sedPattern, setSedPattern] = useState("old_text");
    const [sedReplacement, setSedReplacement] = useState("new_text");
    const [sedFileName, setSedFileName] = useState("log_file.txt");
    const [globalReplace, setGlobalReplace] = useState(true); // g
    const [inPlaceEdit, setInPlaceEdit] = useState(false); // -i
    const [ignoreCase, setIgnoreCase] = useState(false); // i

    // --- AWK State ---
    const [awkFileName, setAwkFileName] = useState("data.csv");
    const [fieldSeparator, setFieldSeparator] = useState(","); // -F
    const [printFields, setPrintFields] = useState("1,3");
    const [filterCondition, setFilterCondition] = useState('$2 > 100');

    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        let command = "";
        
        if (toolMode === 'sed') {
            const flags = `${globalReplace ? "g" : ""}${ignoreCase ? "i" : ""}`;
            const pattern = sedPattern.trim() || "PATTERN";
            const replacement = sedReplacement.trim() || "REPLACEMENT";
            const file = sedFileName.trim() || "filename.txt";
            
            // Escape single quotes in pattern and replacement
            const escapedPattern = pattern.replace(/'/g, "'\\''");
            const escapedReplacement = replacement.replace(/'/g, "'\\''");

            const sedCmd = `s/${escapedPattern}/${escapedReplacement}/${flags}`;
            
            if (inPlaceEdit) {
                command = `sed -i.bak '${sedCmd}' ${file}`;
            } else {
                command = `sed '${sedCmd}' ${file}`;
            }

        } else {
            const file = awkFileName.trim() || "filename.txt";
            // Ensure separator is correctly escaped for the shell
            const separator = fieldSeparator.trim().replace(/'/g, "'\\''"); 
            
            const fields = printFields.trim()
                .split(',')
                .map(f => f.trim())
                .filter(f => f)
                .map(f => f.startsWith('$') ? f : `\$${f}`) // Add $ if it doesn't exist
                .join(', ');
            
            const printAction = `{ print ${fields || '$0'} }`;

            const condition = filterCondition.trim();

            let awkScript = condition
                ? `awk -F'${separator}' '${condition} ${printAction}' ${file}`
                : `awk -F'${separator}' '${printAction}' ${file}`;

            command = awkScript;
        }

        setGeneratedCommand(command.trim());
    }, [toolMode, sedPattern, sedReplacement, sedFileName, globalReplace, inPlaceEdit, ignoreCase, awkFileName, fieldSeparator, printFields, filterCondition]);

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
    
    const isSed = toolMode === 'sed';

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
            
            {/* 1. Sidebar */}
            <SimpleSidebar />

            {/* 2. Main Content */}
            <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-7xl mx-auto pt-20 lg:pt-10"> 
                
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10 border-b border-gray-700/50 pb-6"
                >
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-fuchsia-700 rounded-xl shadow-lg flex-shrink-0">
                        <Code className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-fuchsia-400 bg-clip-text text-transparent leading-tight">
                            Sed & Awk Command Generator
                        </h1>
                        <p className="text-gray-400 mt-1">Generate text processing commands for Linux/Unix in seconds.</p>
                    </div>
                </motion.div>

                {/* --- Mode Selection --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${containerBaseClasses} mb-10 border-fuchsia-700/30`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-fuchsia-400" /> Select Utility
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {['sed', 'awk'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setToolMode(m as "sed" | "awk")}
                                className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-lg uppercase ${toolMode === m 
                                    ? 'bg-fuchsia-600 text-white shadow-xl shadow-fuchsia-900/50 transform scale-[1.01] ring-2 ring-fuchsia-500' 
                                    : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
                                }
                            >
                                {m.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </motion.div>
                
                {/* --- Input and Flags Panel (Main Content) --- */}
                <div className="grid lg:grid-cols-3 gap-8 mb-10">
                    
                    {/* --- Input Panel (Dynamic) --- */}
                    <motion.div
                        key={toolMode + 'input'}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${containerBaseClasses} lg:col-span-2`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                            <Database className="w-5 h-5 text-fuchsia-400" /> {isSed ? 'Substitution Parameters (`sed`)' : 'Extraction and Filtering Parameters (`awk`)'}
                        </h2>

                        {isSed ? (
                            // --- SED INPUTS ---
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <label className={labelBaseClasses}>Search Pattern (RegEx allowed)</label>
                                        <input type="text" placeholder="old_text" value={sedPattern} onChange={(e) => setSedPattern(e.target.value)} className={inputBaseClasses} />
                                    </div>
                                    <div className="relative">
                                        <label className={labelBaseClasses}>Replacement Text</label>
                                        <input type="text" placeholder="new_text" value={sedReplacement} onChange={(e) => setSedReplacement(e.target.value)} className={inputBaseClasses} />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className={labelBaseClasses}>Target File</label>
                                    <input type="text" placeholder="log_file.txt" value={sedFileName} onChange={(e) => setSedFileName(e.target.value)} className={inputBaseClasses} />
                                </div>
                            </div>
                        ) : (
                            // --- AWK INPUTS ---
                            <div className="space-y-5">
                                <div className="relative">
                                    <label className={labelBaseClasses}>Target File</label>
                                    <input type="text" placeholder="data.csv" value={awkFileName} onChange={(e) => setAwkFileName(e.target.value)} className={inputBaseClasses} />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <label className={labelBaseClasses}>Field Separator (`-F`)</label>
                                        <input type="text" placeholder="," value={fieldSeparator} onChange={(e) => setFieldSeparator(e.target.value)} className={inputBaseClasses} />
                                    </div>
                                    <div className="relative">
                                        <label className={labelBaseClasses}>Fields to Print (e.g., `1,3`, `$NF`)</label>
                                        <input type="text" placeholder="1,3" value={printFields} onChange={(e) => setPrintFields(e.target.value)} className={inputBaseClasses} />
                                        <p className="text-xs text-gray-500 mt-1">Leave empty to print the entire line ($0).</p>
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <label className={labelBaseClasses}>Filtering Condition (Optional, e.g., `$2 &gt; 100` or `/DEBUG/`)</label>
                                    <input type="text" placeholder="NF > 5 || $1 == 'DEBUG'" value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)} className={inputBaseClasses} />
                                    <p className="text-xs text-gray-500 mt-1">If empty, prints all records after processing.</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                    
                    {/* --- Flags/Options Panel --- */}
                    <motion.div
                        key={toolMode + 'flags'}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${containerBaseClasses} space-y-3`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-fuchsia-400" /> Options / Flags
                        </h2>
                        
                        {isSed ? (
                            // --- SED FLAGS ---
                            <div className="divide-y divide-gray-700/50">
                                <FlagToggle 
                                    label="Global Replace (`g`)" 
                                    description="Replace ALL occurrences of the pattern per line."
                                    checked={globalReplace} 
                                    onChange={setGlobalReplace} 
                                    color="fuchsia"
                                />
                                <FlagToggle 
                                    label="Ignore Case (`i`)" 
                                    description="Pattern search is case-insensitive."
                                    checked={ignoreCase} 
                                    onChange={setIgnoreCase} 
                                    color="fuchsia"
                                />
                                <FlagToggle 
                                    label="In-Place Edit (`-i.bak`)" 
                                    description="Modifies the original file. **Creates a .bak backup!**"
                                    checked={inPlaceEdit} 
                                    onChange={setInPlaceEdit} 
                                    color="red"
                                />
                            </div>
                        ) : (
                            // --- AWK INFO ---
                            <div className="text-gray-400 space-y-4 pt-2">
                                <p className="text-sm font-semibold">Awk uses these internal variables in filtering conditions (Step 2):</p>
                                
                                <div className="space-y-2">
                                    <div className="bg-gray-900 p-3 rounded-lg text-sm border-l-4 border-fuchsia-500/80">
                                        <span className="font-bold text-white">FS</span>: **Field Separator**. Controlled by the `-F` input.
                                    </div>
                                    <div className="bg-gray-900 p-3 rounded-lg text-sm border-l-4 border-emerald-500/80">
                                        <span className="font-bold text-white">NR</span>: **Record Number** (current line). E.g., <code className="text-emerald-300">NR &gt; 1</code> to skip headers.
                                    </div>
                                    <div className="bg-gray-900 p-3 rounded-lg text-sm border-l-4 border-yellow-500/80">
                                        <span className="font-bold text-white">NF</span>: **Number of Fields** in the current line. E.g., <code className="text-yellow-300">NF == 4</code> for lines with 4 columns.
                                    </div>
                                    <div className="bg-gray-900 p-3 rounded-lg text-sm border-l-4 border-fuchsia-500/80">
                                        <span className="font-bold text-white">$N</span>: **Value of Field N**. E.g., <code className="text-fuchsia-300">$2 &gt; 100</code> for values greater than 100 in the second column.
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
                
                {/* --- Generated Output --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative bg-gradient-to-br from-black to-gray-900 rounded-2xl border border-fuchsia-700 shadow-2xl p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-3 flex items-center gap-2">
                        <Code className="w-5 h-5 text-fuchsia-400" /> Final Command
                    </h2>
                    
                    <div className="relative group">
                        <pre className="bg-gray-900 p-4 rounded-xl font-mono text-sm md:text-base text-gray-100 border border-fuchsia-500 overflow-x-auto pr-16 shadow-inner">
                            <span className="text-emerald-400 select-none font-bold">$ </span>
                            {generatedCommand}
                        </pre>

                        {/* Copy Button */}
                        <motion.button
                            onClick={() => copyToClipboard(generatedCommand)}
                            className={`absolute top-0 right-0 m-1 p-2 rounded-lg transition-all flex items-center gap-1 ${copied
                                ? "bg-emerald-600 text-white"
                                : "bg-fuchsia-600 text-white hover:bg-fuchsia-500"
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Copy Command"
                        >
                            <AnimatePresence mode="wait">
                                {copied ? (
                                    <motion.div key="check" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                        <Check size={16} /> Copied
                                    </motion.div>
                                ) : (
                                    <motion.div key="copy" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                        <Copy size={16} /> Copy
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                    
                    <p className="text-sm text-gray-400 mt-4 p-3 bg-gray-800 rounded-lg border-l-4 border-red-500">
                        **🚨 Safety Tip:** Always run the command **without** the `in-place` option (`-i`) first to ensure the output is correct before modifying the original file.
                    </p>
                    
                </motion.div>
            </main>
        </div>
    );
}