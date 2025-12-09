"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar"; 
import { Copy, HardDrive, Check, ChevronDown, ChevronUp, PieChart, Folder } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// Helper icons
const FileText = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const Tags = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.5 4.5l-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2"/><path d="M19 18H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z"/></svg>;
const List = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const Zap = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const Columns = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="4" y="4" width="7" height="16" rx="2"/><rect x="13" y="4" width="7" height="16" rx="2"/></svg>;
const Layers = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
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

    // Color principal para DF/DU es Índigo (Filesystem/Storage)
    const primaryColorClass = "bg-indigo-600 hover:bg-indigo-500"; 

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className={`select-none ${commandName === 'df' ? 'text-blue-400' : 'text-indigo-400'}`}>$ </span>
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
export default function DfDuCommandGenerator() {
    const [commandType, setCommandType] = useState<'df' | 'du'>('df');
    const [action, setAction] = useState<'default' | 'total' | 'human' | 'specific'>('human');
    
    // Global State
    const [targetPath, setTargetPath] = useState("/home/user/logs");
    
    // df specific
    const [showInodes, setShowInodes] = useState(false);
    
    // du specific
    const [maxDepth, setMaxDepth] = useState("1");
    
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        let cmd = commandType;
        let options = '';
        const path = targetPath.trim() || ".";

        // Human-readable format is highly recommended for both
        if (action === 'human' || action === 'specific' || action === 'total') {
             // -h is standard for human-readable
            options += ' -h';
        }

        if (commandType === 'df') {
            
            if (showInodes) {
                options += ' -i'; // Show inode information
            }
            
            if (action === 'default' || action === 'human') {
                cmd += options; // df -h
            } else if (action === 'total') {
                cmd += ' -t ext4'; // Not directly summing, but filtering by type is a common df usage
            } else if (action === 'specific') {
                 cmd += `${options} ${path}`; // df -h /path
            } else {
                 cmd += options;
            }
            
        } else if (commandType === 'du') {
            
            if (action === 'total') {
                options += ' -s'; // Summarize total usage (crucial for du)
            }
            
            cmd += options;
            
            // Max Depth (Only useful if not summarizing total)
            if (action !== 'total' && action !== 'default' && maxDepth.trim() && parseInt(maxDepth.trim()) > 0) {
                cmd += ` --max-depth=${maxDepth.trim()}`;
            }

            // Path always comes last
            if (action !== 'default') {
                 cmd += ` ${path}`; 
            } else {
                 cmd += ` -sh .`; // Default du command should be concise for current dir
            }

            // Cleanup for du: always ensure human-readable summary for default
            if (action === 'default') {
                cmd = 'du -sh .';
            }
        }
        
        setGeneratedCommand(cmd.trim().replace(/\s+/g, ' '));
    }, [commandType, action, targetPath, showInodes, maxDepth]);

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

    const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-shadow outline-none";
    const labelBaseClasses = "block mb-1 text-sm font-medium text-gray-400";
    const containerBaseClasses = "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";
    
    // Helper for command mode selection
    const CommandButton: React.FC<{ label: string; value: 'df' | 'du'; icon: React.ReactNode }> = ({ label, value, icon }) => (
        <button
            onClick={() => setCommandType(value)}
            className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase ${commandType === value 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/50 transform scale-[1.01] ring-2 ring-indigo-500' 
                : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
            }
        >
            {icon}
            {label.toUpperCase()}
        </button>
    );
    
    // Helper for action selection
    const ActionButton: React.FC<{ label: string; value: 'default' | 'total' | 'human' | 'specific'; icon: React.ReactNode }> = ({ label, value, icon }) => {
        const isActive = action === value;
        return (
            <button
                onClick={() => setAction(value)}
                className={`py-2 px-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${isActive 
                    ? 'bg-indigo-700 text-white shadow-md ring-2 ring-indigo-500' 
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
                }
            >
                {icon}
                {label}
            </button>
        );
    };

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
                    <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-lg">
                        <HardDrive className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent leading-tight">
                        `df` & `du` Disk Usage Generator
                    </h1>
                </motion.div>

                {/* --- Command Selection (DF vs DU) --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${containerBaseClasses} mb-8 border-indigo-700/30`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Select Focus Tool</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <CommandButton label="df (Free Space)" value="df" icon={<PieChart className="w-5 h-5"/>} />
                        <CommandButton label="du (Directory Size)" value="du" icon={<Folder className="w-5 h-5"/>} />
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
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Action & Parameters</h2>

                        <div className="space-y-5">
                            
                            {/* Action Selection DF */}
                            {commandType === 'df' && (
                                <div>
                                    <label className={labelBaseClasses}>`df` Query Type (Disk Free)</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <ActionButton label="All Filesystems" value="human" icon={<HardDrive size={18} />} />
                                        <ActionButton label="Specific Mount Point" value="specific" icon={<FileText size={18} />} />
                                        <ActionButton label="Filter by Type" value="total" icon={<Tags size={18} />} />
                                        <ActionButton label="Default (KB)" value="default" icon={<List size={18} />} />
                                    </div>
                                </div>
                            )}

                            {/* Action Selection DU */}
                            {commandType === 'du' && (
                                <div>
                                    <label className={labelBaseClasses}>`du` Query Type (Disk Usage)</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <ActionButton label="Current Directory Total" value="default" icon={<Zap size={18} />} />
                                        <ActionButton label="Total for Specific Path" value="total" icon={<Folder size={18} />} />
                                        <ActionButton label="Detailed Report (Depth)" value="specific" icon={<Columns size={18} />} />
                                        <ActionButton label="All Subdirectories" value="human" icon={<Layers size={18} />} />
                                    </div>
                                </div>
                            )}
                            
                            <AnimatePresence mode="wait">
                                {/* Path Input (Used for specific/total in both) */}
                                {(commandType === 'df' && action === 'specific') || (commandType === 'du' && (action === 'total' || action === 'specific' || action === 'human')) ? (
                                    <motion.div
                                        key="path-input"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <label className={labelBaseClasses}>{commandType === 'df' ? 'Mount Point or File System' : 'Directory Path'}</label>
                                        <input type="text" placeholder="/var/log or ." value={targetPath} onChange={(e) => setTargetPath(e.target.value)} className={inputBaseClasses} />
                                    </motion.div>
                                ) : null}
                                
                                {/* DF Specific Inodes */}
                                {commandType === 'df' && (action === 'human' || action === 'specific') && (
                                    <motion.div
                                        key="df-inodes"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                                            <input type="checkbox" id="inodes" checked={showInodes} onChange={(e) => setShowInodes(e.target.checked)} className="h-5 w-5 text-indigo-600 rounded border-gray-700 focus:ring-indigo-500 bg-gray-900" />
                                            <label htmlFor="inodes" className="ml-3 text-sm font-medium text-gray-300">
                                                Show Inode Usage (`-i`)
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Inodes son necesarios para la estructura de archivos; si están agotados, no se pueden crear archivos nuevos.</p>
                                    </motion.div>
                                )}
                                
                                {/* DU Specific Max Depth */}
                                {commandType === 'du' && (action === 'specific' || action === 'human') && (
                                    <motion.div
                                        key="du-depth"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <label className={labelBaseClasses}>Max Directory Depth (`--max-depth=N`)</label>
                                        <input type="number" placeholder="1" min="0" value={maxDepth} onChange={(e) => setMaxDepth(e.target.value)} className={inputBaseClasses} />
                                        <p className="text-xs text-gray-500 mt-1">**1** muestra el directorio actual y sus subdirectorios de primer nivel. **0** muestra solo el total.</p>
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
                                        <CopyableCommand command={generatedCommand} onCopy={copyToClipboard} commandName={commandType} />
                                        
                                        <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
                                            <p className="text-sm text-gray-400 font-semibold mb-2">Key Differences:</p>
                                            <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                                                <li>**`df`** (Disk Free) te dice el espacio libre a nivel de **sistema de archivos** (partición/montaje).</li>
                                                <li>**`du`** (Disk Usage) te dice el espacio ocupado por **archivos y directorios**.</li>
                                                <li>**Discrepancia:** `df` y `du` pueden no coincidir si hay archivos abiertos que han sido eliminados (su espacio es retenido por el proceso hasta que se cierra).</li>
                                                <li>**`-h`:** (Human-readable) Es la bandera más importante para ambos, muestra tamaños en G, M, K.</li>
                                            </ul>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                                        Select a tool and an action to generate the command.
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
                        <h2 className="text-xl font-bold text-indigo-400">📚 `df` & `du` Reference</h2>
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
                                
                                <h3 className="font-semibold text-lg text-white">Advanced `df` Usage</h3>
                                <div className="bg-gray-900 p-4 rounded-xl border border-blue-700/50">
                                    <p className="font-medium text-blue-300">Filter by Type (`-t`)</p>
                                    <p className="text-gray-400 mb-2">Muestra solo sistemas de archivos de un tipo específico (ej: ext4).</p>
                                    <CopyableCommand command="df -h -t ext4" onCopy={copyToClipboard} commandName="df" />
                                </div>

                                <h3 className="font-semibold text-lg text-white">Advanced `du` Usage</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-indigo-700/50">
                                        <p className="font-medium text-indigo-300">Sort and View Largest</p>
                                        <p className="text-gray-400 mb-2">Busca los 10 archivos/directorios más grandes en el directorio actual.</p>
                                        <CopyableCommand command="du -a . | sort -nr | head -n 10" onCopy={copyToClipboard} commandName="du" />
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-xl border border-indigo-700/50">
                                        <p className="font-medium text-indigo-300">Exclude Paths</p>
                                        <p className="text-gray-400 mb-2">Calcula el uso del disco excluyendo directorios específicos.</p>
                                        <CopyableCommand command="du -sch --exclude='cache' --exclude='log' /var" onCopy={copyToClipboard} commandName="du" />
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

