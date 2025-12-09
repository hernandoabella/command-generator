"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar"; 
import { Copy, Archive, Check, ChevronDown, ChevronUp, FolderArchive, FileSymlink, FileText } from "lucide-react";
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

    // Color principal para TAR es marrón/gris (Archiving/File System)
    const primaryColorClass = "bg-amber-700 hover:bg-amber-600"; 

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className="text-amber-400 select-none">$ </span>
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
export default function TarCommandGenerator() {
    const [mode, setMode] = useState<'create' | 'extract' | 'list'>('create');
    
    // Global State
    const [archiveName, setArchiveName] = useState("backup.tar.gz");
    const [targetPaths, setTargetPaths] = useState("src/ config/");
    const [verbose, setVerbose] = useState(true);
    
    // Create/Extract Compression Type
    const [compression, setCompression] = useState("gzip"); // gzip, bzip2, xz, none
    
    // Create Specific
    const [excludePath, setExcludePath] = useState("node_modules");

    // Extract Specific
    const [extractDir, setExtractDir] = useState("data/");
    
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        let options = '';
        let cmd = 'tar ';
        const archive = archiveName.trim() || "archive.tar";
        const targets = targetPaths.trim() || ".";

        // Verbosity is standard for most operations
        if (verbose) options += 'v';

        // Compression flags
        let compressionFlag = '';
        if (compression === 'gzip') {
            compressionFlag = 'z';
        } else if (compression === 'bzip2') {
            compressionFlag = 'j';
        } else if (compression === 'xz') {
            compressionFlag = 'J';
        }
        options += compressionFlag;

        if (mode === 'create') {
            // tar -czvf archive.tar.gz files...
            options = `c${options}f`;
            cmd += options + ` ${archive} ${targets}`;
            
            // Exclude
            if (excludePath.trim()) {
                cmd += ` --exclude='${excludePath.trim()}'`;
            }

        } else if (mode === 'extract') {
            // tar -xzvf archive.tar.gz
            options = `x${options}f`;
            cmd += options + ` ${archive}`;
            
            // Directory (-C)
            if (extractDir.trim()) {
                cmd += ` -C ${extractDir.trim()}`;
            }

        } else if (mode === 'list') {
            // tar -tzf archive.tar.gz
            options = `t${compressionFlag}f`;
            cmd += options + ` ${archive}`;
        }
        
        setGeneratedCommand(cmd.trim().replace(/\s+/g, ' '));
    }, [mode, archiveName, targetPaths, verbose, compression, excludePath, extractDir]);

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

    const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 transition-shadow outline-none";
    const labelBaseClasses = "block mb-1 text-sm font-medium text-gray-400";
    const containerBaseClasses = "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";
    
    // Helper for command mode selection
    const ModeButton: React.FC<{ label: string; value: 'create' | 'extract' | 'list'; icon: React.ReactNode }> = ({ label, value, icon }) => (
        <button
            onClick={() => setMode(value)}
            className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase ${mode === value 
                ? 'bg-amber-600 text-white shadow-xl shadow-amber-900/50 transform scale-[1.01] ring-2 ring-amber-500' 
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
                    <div className="p-3 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-xl shadow-lg">
                        <Archive className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-amber-400 bg-clip-text text-transparent leading-tight">
                        `tar` Command Generator
                    </h1>
                </motion.div>

                {/* --- Mode Selection --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${containerBaseClasses} mb-8 border-amber-700/30`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Select Operation</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <ModeButton label="Create Archive" value="create" icon={<FolderArchive className="w-5 h-5"/>} />
                        <ModeButton label="Extract Files" value="extract" icon={<FileSymlink className="w-5 h-5"/>} />
                        <ModeButton label="List Contents" value="list" icon={<FileText className="w-5 h-5"/>} />
                    </div>
                </motion.div>

                {/* --- Input Panel --- */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        key={mode + 'input'}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${containerBaseClasses} h-full`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Parameters for <span className="text-amber-400">`{mode}`</span></h2>

                        <div className="space-y-5">
                            
                            {/* Archive Name */}
                            <div>
                                <label className={labelBaseClasses}>Archive File Name (`-f`)</label>
                                <input type="text" placeholder="backup.tar.gz" value={archiveName} onChange={(e) => setArchiveName(e.target.value)} className={inputBaseClasses} />
                                <p className="text-xs text-gray-500 mt-1">
                                    Use extension: `.tar` (none), `.tar.gz` (gzip), `.tar.bz2` (bzip2), `.tar.xz` (xz).
                                </p>
                            </div>

                            {/* Compression Type */}
                            <div>
                                <label className={labelBaseClasses}>Compression Type</label>
                                <select value={compression} onChange={(e) => setCompression(e.target.value)} className={inputBaseClasses}>
                                    <option value="gzip">Gzip (`-z`) - Fast, common</option>
                                    <option value="bzip2">Bzip2 (`-j`) - Better compression, slower</option>
                                    <option value="xz">XZ (`-J`) - Best compression, slowest</option>
                                    <option value="none">None (just `.tar`)</option>
                                </select>
                            </div>

                            {/* Verbose Toggle */}
                            <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                                <input type="checkbox" id="verbose" checked={verbose} onChange={(e) => setVerbose(e.target.checked)} className="h-5 w-5 text-amber-600 rounded border-gray-700 focus:ring-amber-500 bg-gray-900" />
                                <label htmlFor="verbose" className="ml-3 text-sm font-medium text-gray-300">
                                    Show Progress/File List (`-v`)
                                </label>
                            </div>
                            
                            <AnimatePresence mode="wait">
                                {/* Create Specific Inputs */}
                                {(mode === 'create' || mode === 'list') && (
                                    <motion.div
                                        key="create-list-opts"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-5 overflow-hidden border border-gray-700 p-4 rounded-lg bg-gray-900"
                                    >
                                        <h3 className="font-semibold text-amber-300">{mode === 'create' ? 'Creation' : 'List'} Targets</h3>
                                        <div>
                                            <label className={labelBaseClasses}>Files/Directories to Target</label>
                                            <input type="text" placeholder="public/ files.txt" value={targetPaths} onChange={(e) => setTargetPaths(e.target.value)} className={inputBaseClasses} />
                                            <p className="text-xs text-gray-500 mt-1">Separate paths with spaces.</p>
                                        </div>
                                        {mode === 'create' && (
                                            <div>
                                                <label className={labelBaseClasses}>Path to Exclude (`--exclude`)</label>
                                                <input type="text" placeholder="tmp/" value={excludePath} onChange={(e) => setExcludePath(e.target.value)} className={inputBaseClasses} />
                                                <p className="text-xs text-gray-500 mt-1">Useful for excluding large log or cache directories.</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                                
                                {/* Extract Specific Inputs */}
                                {mode === 'extract' && (
                                    <motion.div
                                        key="extract-opts"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-5 overflow-hidden border border-gray-700 p-4 rounded-lg bg-gray-900"
                                    >
                                        <h3 className="font-semibold text-amber-300">Extraction Options</h3>
                                        <div>
                                            <label className={labelBaseClasses}>Extraction Directory (`-C`)</label>
                                            <input type="text" placeholder="data/" value={extractDir} onChange={(e) => setExtractDir(e.target.value)} className={inputBaseClasses} />
                                            <p className="text-xs text-gray-500 mt-1">Directory where files will be extracted (must exist).</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
                                        <CopyableCommand command={generatedCommand} onCopy={copyToClipboard} />
                                        
                                        <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
                                            <p className="text-sm text-gray-400 font-semibold mb-2">Summary:</p>
                                            <ul className="text-xs text-gray-500 list-disc list-inside">
                                                <li>**`tar`** requiere la opción de función (`c`, `x`, `t`) y la opción de archivo (`f`).</li>
                                                <li>**Common Flags:**
                                                    <ul>
                                                        <li>**c:** Create (Crear)</li>
                                                        <li>**x:** Extract (Extraer)</li>
                                                        <li>**t:** List (Listar)</li>
                                                        <li>**f:** File (Archivo - especifica el nombre del archivo tar)</li>
                                                        <li>**v:** Verbose (Detallado)</li>
                                                        <li>**z, j, J:** Compression (Compresión)</li>
                                                    </ul>
                                                </li>
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
                        <h2 className="text-xl font-bold text-amber-400">📚 `tar` Command Reference</h2>
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
                                
                                <h3 className="font-semibold text-lg text-white">Common `tar` Options</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-amber-700/50">
                                        <p className="font-medium text-amber-300">Extract a Single File</p>
                                        <p className="text-gray-400 mb-2">Extraer solo un archivo específico de un archivo grande.</p>
                                        <CopyableCommand command="tar -xvf backup.tar.gz file/path/to/extract.txt" onCopy={copyToClipboard} />
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-xl border border-amber-700/50">
                                        <p className="font-medium text-amber-300">Create an Archive via Pipe</p>
                                        <p className="text-gray-400 mb-2">Crear archivo usando compresión pipe (mejor para scripts).</p>
                                        <CopyableCommand command="tar -cf - /data | gzip > data_backup.tar.gz" onCopy={copyToClipboard} />
                                    </div>
                                </div>

                                <h3 className="font-semibold text-lg text-white">Modern Options (GNU tar)</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-400">
                                    <li>**Automatic Compression (`-a`):** Usa `-a` en lugar de `-z`, `-j`, o `-J`. `tar -caf backup.tar.xz /data` infiere la compresión de la extensión.</li>
                                    <li>**Preserve Permissions/Ownership:** Utiliza `p` (p.ej., `tar -cvpf`) para conservar permisos de archivos originales durante la creación/extracción (útil para backups de sistema).</li>
                                </ul>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}