"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar"; 
import { Copy, Activity, Check, ChevronDown, ChevronUp, Cpu, ListOrdered } from "lucide-react";
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

    // Color principal para TOP/HTOP es Teal/Cyan (Monitoring/Diagnostics)
    const primaryColorClass = "bg-teal-600 hover:bg-teal-500"; 

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className={`select-none ${commandName === 'top' ? 'text-cyan-400' : 'text-teal-400'}`}>$ </span>
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
export default function TopHtopCommandGenerator() {
    const [commandType, setCommandType] = useState<'top' | 'htop'>('htop');
    const [action, setAction] = useState<'default' | 'user' | 'cpu_cores' | 'delay'>('default');
    
    // Global State
    const [targetUser, setTargetUser] = useState("www-data");
    const [delaySeconds, setDelaySeconds] = useState("5");
    
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        let cmd = commandType;
        const user = targetUser.trim() || "root";
        const delay = delaySeconds.trim() || "3";

        if (commandType === 'top') {
            cmd = 'top ';
            
            if (action === 'user') {
                // top -u username
                cmd += `-u ${user}`;
            } else if (action === 'cpu_cores') {
                // top -H (Shows individual threads, then press '1' inside top)
                // A better approach is often simply running top and pressing '1', but -H shows threads immediately.
                cmd += `-H`; 
            } else if (action === 'delay') {
                // top -d seconds
                cmd += `-d ${delay}`;
            } else {
                cmd = 'top';
            }

        } else if (commandType === 'htop') {
            cmd = 'htop ';
            
            if (action === 'user') {
                // htop -u username
                cmd += `-u ${user}`;
            } else if (action === 'cpu_cores') {
                // htop's default is often cleaner. -t or -H shows threads/trees
                cmd += `-t`; // Display as a tree (useful when combining with CPU cores view)
            } else if (action === 'delay') {
                // htop -d ticks (ticks is typically 100ms)
                // We convert seconds to approximate ticks (1s = 10 ticks)
                const ticks = (parseFloat(delay) * 10).toFixed(0);
                cmd += `-d ${ticks}`;
            } else {
                cmd = 'htop';
            }
        }
        
        setGeneratedCommand(cmd.trim().replace(/\s+/g, ' '));
    }, [commandType, action, targetUser, delaySeconds]);

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

    const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-teal-500 transition-shadow outline-none";
    const labelBaseClasses = "block mb-1 text-sm font-medium text-gray-400";
    const containerBaseClasses = "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";
    
    // Helper for command mode selection
    const CommandButton: React.FC<{ label: string; value: 'top' | 'htop'; icon: React.ReactNode }> = ({ label, value, icon }) => (
        <button
            onClick={() => setCommandType(value)}
            className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase ${commandType === value 
                ? 'bg-teal-600 text-white shadow-xl shadow-teal-900/50 transform scale-[1.01] ring-2 ring-teal-500' 
                : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
            }
        >
            {icon}
            {label.toUpperCase()}
        </button>
    );
    
    // Helper for action selection
    const ActionButton: React.FC<{ label: string; value: 'default' | 'user' | 'cpu_cores' | 'delay'; icon: React.ReactNode }> = ({ label, value, icon }) => {
        const isActive = action === value;
        return (
            <button
                onClick={() => setAction(value)}
                className={`py-2 px-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${isActive 
                    ? 'bg-teal-700 text-white shadow-md ring-2 ring-teal-500' 
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
                    <div className="p-3 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl shadow-lg">
                        <Activity className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-teal-400 bg-clip-text text-transparent leading-tight">
                        `top` vs `htop` System Monitor
                    </h1>
                </motion.div>

                {/* --- Command Selection (TOP vs HTOP) --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${containerBaseClasses} mb-8 border-teal-700/30`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Select Monitoring Tool</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <CommandButton label="top (Classic)" value="top" icon={<Cpu className="w-5 h-5"/>} />
                        <CommandButton label="htop (Interactive)" value="htop" icon={<ListOrdered className="w-5 h-5"/>} />
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
                            
                            {/* Action Selection */}
                            <div>
                                <label className={labelBaseClasses}>Monitoring Focus</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <ActionButton label="Default View" value="default" icon={<Activity size={18} />} />
                                    <ActionButton label="Filter by User" value="user" icon={<User size={18} />} />
                                    <ActionButton label="Show Cores/Threads" value="cpu_cores" icon={<Cpu size={18} />} />
                                    <ActionButton label="Custom Delay" value="delay" icon={<Clock size={18} />} />
                                </div>
                            </div>
                            
                            <AnimatePresence mode="wait">
                                {/* User Input */}
                                {(action === 'user') && (
                                    <motion.div
                                        key="user-input"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <label className={labelBaseClasses}>Target User Name (`-u`)</label>
                                        <input type="text" placeholder="www-data, postgres, root" value={targetUser} onChange={(e) => setTargetUser(e.target.value)} className={inputBaseClasses} />
                                    </motion.div>
                                )}
                                
                                {/* Delay Input */}
                                {(action === 'delay') && (
                                    <motion.div
                                        key="delay-input"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <label className={labelBaseClasses}>Update Interval (Seconds)</label>
                                        <input type="text" placeholder="3" value={delaySeconds} onChange={(e) => setDelaySeconds(e.target.value)} className={inputBaseClasses} />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {commandType === 'top' ? 'Uses -d flag for seconds.' : 'Uses -d flag for ticks (10 ticks/second).'}
                                        </p>
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
                                                <li>**`htop`** es interactivo, permite **scroll horizontal/vertical** y el uso del ratón.</li>
                                                <li>**`top`** es más ligero y se instala por defecto en todos los sistemas Linux.</li>
                                                <li>**Terminar Procesos:** Dentro de `htop`, puedes usar la tecla **`F9`** (Kill). Dentro de `top`, usa la tecla **`k`**.</li>
                                                <li>**CPU Cores:** En `top`, presiona **`1`** después de iniciar para expandir la vista de CPU. En `htop`, puedes alternar la vista de CPU/Threads con **`Shift + H`**.</li>
                                            </ul>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                                        Select an action to generate the monitoring command.
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
                        <h2 className="text-xl font-bold text-teal-400">📚 `top` & `htop` Interactive Keys</h2>
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
                                
                                <h3 className="font-semibold text-lg text-white">`top` Keybinds</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-gray-900 p-3 rounded-xl border border-cyan-700/50">
                                        <p className="font-medium text-cyan-300">**`k`**</p>
                                        <p className="text-gray-400">Kill a process (prompt for PID and signal).</p>
                                    </div>
                                    <div className="bg-gray-900 p-3 rounded-xl border border-cyan-700/50">
                                        <p className="font-medium text-cyan-300">**`r`**</p>
                                        <p className="text-gray-400">Renice a process (change priority).</p>
                                    </div>
                                    <div className="bg-gray-900 p-3 rounded-xl border border-cyan-700/50">
                                        <p className="font-medium text-cyan-300">**`M`**</p>
                                        <p className="text-gray-400">Sort by memory usage.</p>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-lg text-white">`htop` Function Keys</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-gray-900 p-3 rounded-xl border border-teal-700/50">
                                        <p className="font-medium text-teal-300">**`F4` (Filter)**</p>
                                        <p className="text-gray-400">Interactive search/filter by name.</p>
                                    </div>
                                    <div className="bg-gray-900 p-3 rounded-xl border border-teal-700/50">
                                        <p className="font-medium text-teal-300">**`F5` (Tree)**</p>
                                        <p className="text-gray-400">Toggle hierarchical (parent/child) process view.</p>
                                    </div>
                                    <div className="bg-gray-900 p-3 rounded-xl border border-teal-700/50">
                                        <p className="font-medium text-teal-300">**`F9` (Kill)**</p>
                                        <p className="text-gray-400">Select and send signal to a process.</p>
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

// Ensure you have these icons defined or imported, or replace them with suitable icons/placeholders
const User = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const Clock = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;