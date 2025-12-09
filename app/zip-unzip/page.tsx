"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar"; 
import { Copy, Archive, Check, ChevronDown, ChevronUp, FileUp, FileDown } from "lucide-react";
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

    // Color principal para ZIP/UNZIP es verde lima (Universal/Compatible)
    const primaryColorClass = "bg-lime-600 hover:bg-lime-500"; 

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className={`select-none ${commandName === 'zip' ? 'text-lime-400' : 'text-green-400'}`}>$ </span>
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
export default function ZipUnzipCommandGenerator() {
    const [action, setAction] = useState<'zip' | 'unzip'>('zip');
    
    // Global State
    const [archiveName, setArchiveName] = useState("my_archive.zip");
    const [targetPaths, setTargetPaths] = useState("documents/ folder.txt");
    const [password, setPassword] = useState("");
    const [verbose, setVerbose] = useState(false);
    
    // Zip Specific
    const [recursive, setRecursive] = useState(true);
    
    // Unzip Specific
    const [extractDir, setExtractDir] = useState("extracted_data");
    const [overwrite, setOverwrite] = useState(false);
    
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        let cmd = action;
        let options = '';
        const archive = archiveName.trim() || "archive.zip";
        const targets = targetPaths.trim() || ".";

        if (verbose) options += ' -v';
        if (password.trim()) options += ` -e`; // -e flag for encryption

        if (action === 'zip') {
            // zip [options] archive.zip files...
            cmd += options;
            if (recursive) cmd += ` -r`; // -r is crucial for directories
            
            cmd += ` ${archive} ${targets}`;
            
        } else if (action === 'unzip') {
            // unzip [options] archive.zip -d target_dir
            cmd += options;
            
            // Overwrite (-o)
            if (overwrite) options += ` -o`;
            
            cmd += ` ${archive}`;
            
            // Directory (-d)
            if (extractDir.trim()) {
                cmd += ` -d ${extractDir.trim()}`;
            }
        }
        
        setGeneratedCommand(cmd.trim().replace(/\s+/g, ' '));
    }, [action, archiveName, targetPaths, password, verbose, recursive, extractDir, overwrite]);

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

    const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-lime-500 transition-shadow outline-none";
    const labelBaseClasses = "block mb-1 text-sm font-medium text-gray-400";
    const containerBaseClasses = "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";
    
    // Helper for action selection
    const ActionButton: React.FC<{ label: string; value: 'zip' | 'unzip'; icon: React.ReactNode }> = ({ label, value, icon }) => (
        <button
            onClick={() => setAction(value)}
            className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase ${action === value 
                ? 'bg-lime-600 text-white shadow-xl shadow-lime-900/50 transform scale-[1.01] ring-2 ring-lime-500' 
                : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
            }
        >
            {icon}
            {label}
        </button>
    );

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
                    <div className="p-3 bg-gradient-to-br from-lime-600 to-green-700 rounded-xl shadow-lg">
                        <Archive className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-lime-400 bg-clip-text text-transparent leading-tight">
                        `zip` & `unzip` Command Generator
                    </h1>
                </motion.div>

                {/* --- Mode Selection --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${containerBaseClasses} mb-8 border-lime-700/30`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Select Operation</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <ActionButton label="Create ZIP (`zip`)" value="zip" icon={<FileUp className="w-5 h-5"/>} />
                        <ActionButton label="Extract ZIP (`unzip`)" value="unzip" icon={<FileDown className="w-5 h-5"/>} />
                    </div>
                </motion.div>

                {/* --- Input Panel --- */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        key={action + 'input'}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${containerBaseClasses} h-full`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Parameters for <span className="text-lime-400">`{action}`</span></h2>

                        <div className="space-y-5">
                            
                            {/* Archive Name */}
                            <div>
                                <label className={labelBaseClasses}>{action === 'zip' ? 'Output Archive Name' : 'Input Archive Name'}</label>
                                <input type="text" placeholder="my_archive.zip" value={archiveName} onChange={(e) => setArchiveName(e.target.value)} className={inputBaseClasses} />
                            </div>
                            
                            {/* Target Paths (Only for ZIP/List) */}
                            {action === 'zip' && (
                                <motion.div
                                    key="target-paths"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <label className={labelBaseClasses}>Files/Directories to Include</label>
                                    <input type="text" placeholder="documents/ folder.txt" value={targetPaths} onChange={(e) => setTargetPaths(e.target.value)} className={inputBaseClasses} />
                                    <p className="text-xs text-gray-500 mt-1">Separate paths with spaces. Use a single path to include everything recursively.</p>
                                </motion.div>
                            )}

                            {/* Password */}
                            <div>
                                <label className={labelBaseClasses}>Password (Uses `-e` flag)</label>
                                <input type="text" placeholder="Optional password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputBaseClasses} />
                                <p className="text-xs text-gray-500 mt-1">You will be prompted to enter the password on the command line.</p>
                            </div>
                            
                            {/* ZIP Specific Options */}
                            {action === 'zip' && (
                                <motion.div
                                    key="zip-opts"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="border border-gray-700 p-4 rounded-lg bg-gray-900"
                                >
                                    <h3 className="font-semibold text-lime-300 mb-3">ZIP Options</h3>
                                    
                                    <div className="flex items-center">
                                        <input type="checkbox" id="recursive" checked={recursive} onChange={(e) => setRecursive(e.target.checked)} className="h-5 w-5 text-lime-600 rounded border-gray-700 focus:ring-lime-500 bg-gray-900" />
                                        <label htmlFor="recursive" className="ml-3 text-sm font-medium text-gray-300">
                                            Include Subdirectories Recursively (`-r`)
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Crucial when zipping a directory path (e.g., `folder/`).</p>
                                </motion.div>
                            )}
                            
                            {/* UNZIP Specific Options */}
                            {action === 'unzip' && (
                                <motion.div
                                    key="unzip-opts"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="border border-gray-700 p-4 rounded-lg bg-gray-900"
                                >
                                    <h3 className="font-semibold text-green-300 mb-3">UNZIP Options</h3>
                                    
                                    <div>
                                        <label className={labelBaseClasses}>Extraction Directory (`-d`)</label>
                                        <input type="text" placeholder="extracted_data" value={extractDir} onChange={(e) => setExtractDir(e.target.value)} className={inputBaseClasses} />
                                        <p className="text-xs text-gray-500 mt-1">Extracted contents go here. Creates the directory if it doesn't exist.</p>
                                    </div>
                                    
                                    <div className="flex items-center mt-4">
                                        <input type="checkbox" id="overwrite" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} className="h-5 w-5 text-lime-600 rounded border-gray-700 focus:ring-lime-500 bg-gray-900" />
                                        <label htmlFor="overwrite" className="ml-3 text-sm font-medium text-gray-300">
                                            Overwrite Existing Files (`-o`)
                                        </label>
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* Verbose Toggle (Universal) */}
                            <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                                <input type="checkbox" id="verbose" checked={verbose} onChange={(e) => setVerbose(e.target.checked)} className="h-5 w-5 text-lime-600 rounded border-gray-700 focus:ring-lime-500 bg-gray-900" />
                                <label htmlFor="verbose" className="ml-3 text-sm font-medium text-gray-300">
                                    Show File List / Verbose Output (`-v`)
                                </label>
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
                                        <CopyableCommand command={generatedCommand} onCopy={copyToClipboard} commandName={action} />
                                        
                                        <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
                                            <p className="text-sm text-gray-400 font-semibold mb-2">Summary:</p>
                                            <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                                                <li>**Universal:** El formato ZIP es el más compatible con todos los sistemas operativos (Windows, macOS, Linux).</li>
                                                <li>**`zip` Sintaxis:** El primer argumento después de las opciones es el **nombre del archivo ZIP**, seguido de los archivos/directorios a incluir.</li>
                                                <li>**`unzip` Sintaxis:** El primer argumento después de las opciones es el **archivo ZIP** a extraer.</li>
                                                <li>**`unzip -l`:** Para listar el contenido de un archivo ZIP sin extraerlo.</li>
                                            </ul>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                                        Select an operation and fill in the parameters to generate the command.
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
                        <h2 className="text-xl font-bold text-lime-400">📚 `zip` & `unzip` Reference</h2>
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
                                
                                <h3 className="font-semibold text-lg text-white">ZIP Advanced Usage</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-lime-700/50">
                                        <p className="font-medium text-lime-300">Update Existing ZIP (`-u`)</p>
                                        <p className="text-gray-400 mb-2">Solo añade archivos nuevos o modificados.</p>
                                        <CopyableCommand command="zip -u my_archive.zip new_file.txt" onCopy={copyToClipboard} commandName="zip" />
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-xl border border-lime-700/50">
                                        <p className="font-medium text-lime-300">Exclude Files (`-x`)</p>
                                        <p className="text-gray-400 mb-2">Comprime todo excepto los archivos que coinciden con el patrón.</p>
                                        <CopyableCommand command="zip -r project.zip project/ -x '*.log' '*.tmp'" onCopy={copyToClipboard} commandName="zip" />
                                    </div>
                                </div>
                                
                                <h3 className="font-semibold text-lg text-white">UNZIP Advanced Usage</h3>
                                <div className="bg-gray-900 p-4 rounded-xl border border-green-700/50">
                                    <p className="font-medium text-green-300">Test Archive Integrity (`-t`)</p>
                                    <p className="text-gray-400 mb-2">Verifica si el archivo ZIP no está dañado.</p>
                                    <CopyableCommand command="unzip -t my_archive.zip" onCopy={copyToClipboard} commandName="unzip" />
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}