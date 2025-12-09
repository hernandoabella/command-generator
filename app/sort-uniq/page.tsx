"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar"; 
import { Copy, ListOrdered, Check, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Component for Copyable Command ---
/**
 * Componente que muestra un comando y un botón de copiado con feedback visual.
 */
const CopyableCommand: React.FC<{ command: string, onCopy: (text: string) => void }> = ({ command, onCopy }) => {
    const [localCopied, setLocalCopied] = useState(false);

    const handleCopy = () => {
        onCopy(command);
        setLocalCopied(true);
        setTimeout(() => setLocalCopied(false), 2000);
    };

    // Color principal para sort/uniq es verde (Data Processing)
    const primaryColorClass = "bg-green-600 hover:bg-green-500"; 

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className="text-green-400 select-none">$ </span>
            <pre className="flex-1 overflow-x-auto mx-2">{command}</pre>
            <motion.button
                onClick={handleCopy}
                className={`p-1 rounded transition-all ${localCopied ? "bg-emerald-600" : primaryColorClass}`}
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
export default function SortUniqCommandGenerator() {
    const [fileName, setFileName] = useState("data.txt");
    
    // SORT State
    const [sortOptions, setSortOptions] = useState<string[]>([]); // Array of options like -r, -n, -k
    const [keyField, setKeyField] = useState(""); // For -k (key) option
    
    // UNIQ State
    const [uniqAction, setUniqAction] = useState(""); // "" (default), -u (unique), -d (duplicates), -c (count)
    
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Toggle for sort options
    const handleSortOptionToggle = (option: string) => {
        setSortOptions(prev => 
            prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option]
        );
    };

    // Auto-generate command logic
    useEffect(() => {
        const file = fileName.trim() || "input.txt";
        
        let sortCmd = `sort`;
        
        // Add general sort options
        const optionsStr = sortOptions.join('');
        if (optionsStr) {
            sortCmd += ` ${optionsStr}`;
        }
        
        // Add key field (-k)
        if (keyField.trim()) {
            sortCmd += ` -k ${keyField.trim()}`;
        }
        
        // Final sort command (including input file)
        sortCmd += ` ${file}`;
        
        // UNIQ part
        let cmd = sortCmd;
        
        if (uniqAction) {
            // Pipe sort output to uniq
            cmd += ` | uniq ${uniqAction}`;
        }

        setGeneratedCommand(cmd.trim().replace(/\s+/g, ' '));
    }, [fileName, sortOptions, keyField, uniqAction]);

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

    const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 transition-shadow outline-none";
    const labelBaseClasses = "block mb-1 text-sm font-medium text-gray-400";
    const containerBaseClasses = "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";
    

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
                    <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl shadow-lg">
                        <ListOrdered className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent leading-tight">
                        `sort` & `uniq` Command Generator
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
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">File and Sorting Parameters</h2>

                        <div className="space-y-5">
                            {/* File Name */}
                            <div>
                                <label className={labelBaseClasses}>Target File Name</label>
                                <input type="text" placeholder="data.txt" value={fileName} onChange={(e) => setFileName(e.target.value)} className={inputBaseClasses} />
                                <p className="text-xs text-gray-500 mt-1">Example: `access.log` or `data.csv`</p>
                            </div>
                            
                            {/* Sort Options */}
                            <div className="border border-gray-700 p-4 rounded-lg">
                                <h3 className="text-base font-semibold text-green-400 mb-3">Sort Options (`sort`)</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <SortOptionButton 
                                        label="Reverse Order (-r)" 
                                        option="-r" 
                                        currentOptions={sortOptions} 
                                        onToggle={handleSortOptionToggle} 
                                    />
                                    <SortOptionButton 
                                        label="Numeric Sort (-n)" 
                                        option="-n" 
                                        currentOptions={sortOptions} 
                                        onToggle={handleSortOptionToggle} 
                                    />
                                    <SortOptionButton 
                                        label="Case-Insensitive (-f)" 
                                        option="-f" 
                                        currentOptions={sortOptions} 
                                        onToggle={handleSortOptionToggle} 
                                    />
                                    <SortOptionButton 
                                        label="Human Numeric (-h)" 
                                        option="-h" 
                                        currentOptions={sortOptions} 
                                        onToggle={handleSortOptionToggle} 
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className={labelBaseClasses}>Sort Key Field (`-k`)</label>
                                    <input type="text" placeholder="2 or 3,4" value={keyField} onChange={(e) => setKeyField(e.target.value)} className={inputBaseClasses} />
                                    <p className="text-xs text-gray-500 mt-1">Specify field number (e.g., `2` for the second column). Assumes space/tab delimiter.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Output Panel & UNIQ Action */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`${containerBaseClasses} h-full flex flex-col`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Unique Filtering (`uniq`)</h2>
                        
                        {/* UNIQ Action Selection */}
                        <div className="mb-6">
                            <label className={labelBaseClasses}>Action on Duplicates (Requires Sorting)</label>
                            <div className="relative">
                                <select value={uniqAction} onChange={(e) => setUniqAction(e.target.value)} className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-green-500 transition-shadow outline-none appearance-none cursor-pointer">
                                    <option value="" className="bg-gray-900 text-white">No Uniq (Just Sort)</option>
                                    <option value="" className="bg-gray-900 text-white">Remove Duplicates (Default `uniq`)</option>
                                    <option value="-u" className="bg-gray-900 text-white">Only Show Unique Lines (`-u`)</option>
                                    <option value="-d" className="bg-gray-900 text-white">Only Show Duplicated Lines (`-d`)</option>
                                    <option value="-c" className="bg-gray-900 text-white">Show Count of Occurrences (`-c`)</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-500 pointer-events-none" />
                            </div>
                            {uniqAction && (
                                <p className="text-xs text-yellow-400 mt-2">**Attention:** `uniq` only filters adjacent duplicate lines, hence the use of `sort` first.</p>
                            )}
                        </div>

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
                                        Configure your sort and uniq options to generate the command.
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
                        <h2 className="text-xl font-bold text-green-400">📚 `sort` and `uniq` Reference</h2>
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
                                className="mt-4 pt-4 border-t border-gray-700 overflow-hidden space-y-6 text-sm text-gray-300"
                            >
                                
                                <h3 className="font-semibold text-lg text-white">Common Use Cases</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-green-700/50">
                                        <p className="font-medium text-green-300">Find the Top 10 Most Common Items</p>
                                        <p className="text-gray-400 mb-2">Count all unique lines, sort by count (numeric reverse), and show the top 10.</p>
                                        <CopyableCommand command="sort data.txt | uniq -c | sort -nr | head -n 10" onCopy={copyToClipboard} />
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-xl border border-green-700/50">
                                        <p className="font-medium text-green-300">Sort by a Specific Numeric Column</p>
                                        <p className="text-gray-400 mb-2">Sort the file by the second column (field 2) numerically (`-n`).</p>
                                        <CopyableCommand command="sort -k2 -n numbers.txt" onCopy={copyToClipboard} />
                                    </div>
                                </div>
                                
                                <h3 className="font-semibold text-lg text-white">Key Concepts</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-400">
                                    <li>**Pipe (`|`):** The output of `sort` is passed directly as the input to `uniq`. This is the standard pattern.</li>
                                    <li>**`sort -k`:** Defines the **key** (column) to sort on. Columns are delimited by spaces or tabs by default.</li>
                                    <li>**`uniq` Prerequisite:** `uniq` **MUST** receive sorted input to correctly find *all* duplicate lines, otherwise it only detects lines that are immediately adjacent.</li>
                                </ul>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}

// Helper component for toggle buttons
const SortOptionButton: React.FC<{ 
    label: string; 
    option: string; 
    currentOptions: string[]; 
    onToggle: (option: string) => void; 
}> = ({ label, option, currentOptions, onToggle }) => {
    const isActive = currentOptions.includes(option);
    return (
        <button
            onClick={() => onToggle(option)}
            className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-1 ${isActive 
                ? 'bg-green-700 text-white shadow-md ring-2 ring-green-500' 
                : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
            }
        >
            <Filter size={14} />
            {label}
        </button>
    );
};