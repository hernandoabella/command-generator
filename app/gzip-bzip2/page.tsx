"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar"; 
import { Copy, Zap, Check, ChevronDown, ChevronUp, FileUp, FileDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Component for Copyable Command ---
/**
 * Componente que muestra un comando y un botón de copiado con feedback visual.
 */
const CopyableCommand: React.FC<{ command: string, onCopy: (text: string) => void, commandName: string }> = ({ command, onCopy, commandName }) => {
    const [localCopied, setLocalCopied] = useState(false);

    const handleCopy = () => {
        onCopy(command);
        setLocalCopied(true);
        setTimeout(() => setLocalCopied(false), 2000);
    };

    // Color principal para GZIP/BZIP2 es azul oscuro/gris (Compression)
    const primaryColorClass = "bg-slate-600 hover:bg-slate-500"; 

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className={`select-none ${commandName === 'gzip' ? 'text-blue-400' : 'text-slate-400'}`}>$ </span>
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
export default function GzipBzip2CommandGenerator() {
    const [commandType, setCommandType] = useState<'gzip' | 'bzip2'>('gzip');
    const [action, setAction] = useState<'compress' | 'decompress' | 'pipe'>('compress');
    
    // Global State
    const [fileName, setFileName] = useState("logfile.txt");
    const [keepOriginal, setKeepOriginal] = useState(false);
    const [compressionLevel, setCompressionLevel] = useState("default");
    
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        const cmdBase = commandType;
        let options = '';
        const file = fileName.trim() || "file.txt";
        
        // Compression Level
        if (compressionLevel === 'best') {
            options += '-9 ';
        } else if (compressionLevel === 'fastest') {
            options += '-1 ';
        }
        
        // Keep Original (-k)
        if (keepOriginal) {
            options += '-k ';
        }

        if (action === 'compress') {
            // gzip [options] file.txt
            // bzip2 [options] file.txt
            setGeneratedCommand(`${cmdBase} ${options}${file}`);
        } else if (action === 'decompress') {
            // gzip -d file.gz
            // bzip2 -d file.bz2
            options += '-d ';
            // Use .gz or .bz2 extension for decompression example
            const expectedExtension = commandType === 'gzip' ? '.gz' : '.bz2';
            const fileToDecompress = file.endsWith(expectedExtension) ? file : `${file}${expectedExtension}`;
            setGeneratedCommand(`${cmdBase} ${options}${fileToDecompress}`);
        } else if (action === 'pipe') {
            // cat file.txt | gzip > file.gz
            if (commandType === 'gzip') {
                setGeneratedCommand(`cat ${file} | gzip ${options.trim()} > ${file}.gz`);
            } else {
                setGeneratedCommand(`cat ${file} | bzip2 ${options.trim()} > ${file}.bz2`);
            }
        }
        
    }, [commandType, action, fileName, keepOriginal, compressionLevel]);

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

    const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-slate-500 transition-shadow outline-none";
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
                   
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent leading-tight">
                        `gzip` & `bzip2` Compression Generator
                    </h1>
                </motion.div>

                {/* --- Mode Selection (GZIP vs BZIP2) --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${containerBaseClasses} mb-8 border-slate-700/30`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Select Compression Utility</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {['gzip', 'bzip2'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setCommandType(m as 'gzip' | 'bzip2')}
                                className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase ${commandType === m 
                                    ? 'bg-slate-600 text-white shadow-xl shadow-slate-900/50 transform scale-[1.01] ring-2 ring-slate-500' 
                                    : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
                                }
                            >
                                <Zap className="w-5 h-5"/>
                                {m.toUpperCase()} ({m === 'gzip' ? 'Fast, Standard' : 'Better Compression, Slower'})
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* --- Input Panel --- */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        key={commandType + 'input'}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${containerBaseClasses} h-full`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">File & Operation Parameters</h2>

                        <div className="space-y-5">
                            
                            {/* File Name */}
                            <div>
                                <label className={labelBaseClasses}>Target File Name</label>
                                <input type="text" placeholder="file.txt or archive.tar" value={fileName} onChange={(e) => setFileName(e.target.value)} className={inputBaseClasses} />
                                <p className="text-xs text-gray-500 mt-1">If decompressing, use the compressed name (e.g., `file.gz`).</p>
                            </div>

                            {/* Action Selection */}
                            <div>
                                <label className={labelBaseClasses}>Operation Mode</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <OperationButton label="Compress" value="compress" current={action} setAction={setAction} icon={<FileUp size={18} />} />
                                    <OperationButton label="Decompress" value="decompress" current={action} setAction={setAction} icon={<FileDown size={18} />} />
                                    <OperationButton label="Pipe Output" value="pipe" current={action} setAction={setAction} icon={<Zap size={18} />} />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Pipe is often used when compressing the output of `tar` or other utilities.</p>
                            </div>

                            {/* General Options */}
                            <div className="border border-gray-700 p-4 rounded-lg">
                                <h3 className="font-semibold text-slate-300 mb-3">Optional Flags</h3>

                                {/* Compression Level */}
                                <div>
                                    <label className={labelBaseClasses}>Compression Level (1-9)</label>
                                    <select value={compressionLevel} onChange={(e) => setCompressionLevel(e.target.value)} className={inputBaseClasses}>
                                        <option value="default">Default (Optimal Balance)</option>
                                        <option value="fastest">Fastest (`-1`) - Largest file size</option>
                                        <option value="best">Best Compression (`-9`) - Slowest</option>
                                    </select>
                                </div>
                                
                                {/* Keep Original */}
                                <div className="flex items-center mt-4">
                                    <input type="checkbox" id="keepOriginal" checked={keepOriginal} onChange={(e) => setKeepOriginal(e.target.checked)} className="h-5 w-5 text-slate-600 rounded border-gray-700 focus:ring-slate-500 bg-gray-900" />
                                    <label htmlFor="keepOriginal" className="ml-3 text-sm font-medium text-gray-300">
                                        Keep Original File (`-k`)
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">By default, the original file is deleted after compression/decompression.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Output Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`${containerBaseClasses} h-full flex flex-col`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Generated Command</h2>
                        
                        <div className="flex-1 flex flex-col justify-end">
                            <AnimatePresence mode="wait">
                                {generatedCommand ? (
                                    <motion.div
                                        key="output-cmd"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative"
                                    >
                                        <CopyableCommand command={generatedCommand} onCopy={copyToClipboard} commandName={commandType} />
                                        
                                        <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
                                            <p className="text-sm text-gray-400 font-semibold mb-2">Key Differences:</p>
                                            <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                                                <li>**`gzip`** uses the **DEFLATE** algorithm and creates `.gz` files.</li>
                                                <li>**`bzip2`** uses the **Burrows-Wheeler Transform** and creates `.bz2` files.</li>
                                                <li>**Compression Ratio:** `bzip2` usually achieves **smaller file sizes** than `gzip`.</li>
                                                <li>**Speed:** `gzip` is typically **much faster** than `bzip2`.</li>
                                                <li>**Single File:** Both utilities only compress **single files** (not directories), which is why they are often used with `tar`.</li>
                                            </ul>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                                        Select an operation and fill in the file name to generate the command.
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
                        <h2 className="text-xl font-bold text-slate-400">📚 Compression Reference</h2>
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
                                
                                <h3 className="font-semibold text-lg text-white">Using with `tar` (The Standard)</h3>
                                <p className="text-gray-400">
                                    The most common use case is combining these compressors with `tar` to archive **directories** and compress the result.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-blue-700/50">
                                        <p className="font-medium text-blue-300">Create `.tar.gz`</p>
                                        <p className="text-gray-400 mb-2">(`tar` handles gzip compression with `-z`)</p>
                                        <CopyableCommand command="tar -czvf archive.tar.gz /path/to/directory" onCopy={copyToClipboard} commandName="gzip" />
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-xl border border-slate-700/50">
                                        <p className="font-medium text-slate-300">Create `.tar.bz2`</p>
                                        <p className="text-gray-400 mb-2">(`tar` handles bzip2 compression with `-j`)</p>
                                        <CopyableCommand command="tar -cjvf archive.tar.bz2 /path/to/directory" onCopy={copyToClipboard} commandName="bzip2" />
                                    </div>
                                </div>
                                
                                <h3 className="font-semibold text-lg text-white">Decompression Alternatives</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-400">
                                    <li>**`gunzip`:** Alias for `gzip -d`.</li>
                                    <li>**`bunzip2`:** Alias for `bzip2 -d`.</li>
                                    <li>**`zcat` / `bzcat`:** Used to view the contents of a compressed file without extracting it first (pipes output to standard output).</li>
                                </ul>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}

// Helper component for operation toggle buttons
const OperationButton: React.FC<{ label: string; value: 'compress' | 'decompress' | 'pipe'; current: string; setAction: (action: 'compress' | 'decompress' | 'pipe') => void; icon: React.ReactNode }> = ({ label, value, current, setAction, icon }) => {
    const isActive = current === value;
    return (
        <button
            onClick={() => setAction(value)}
            className={`py-2 px-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${isActive 
                ? 'bg-slate-700 text-white shadow-md ring-2 ring-slate-500' 
                : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
            }
        >
            {icon}
            {label}
        </button>
    );
};