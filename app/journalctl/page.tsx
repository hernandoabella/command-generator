"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar"; 
import { Copy, FileText, Check, ChevronDown, ChevronUp, Clock, Terminal, Filter, RefreshCw } from "lucide-react";
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

    // Color principal para Journalctl es Rojo/Carmín (Logging/Systemd)
    const primaryColorClass = "bg-red-700 hover:bg-red-600"; 

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className="text-red-400 select-none">$ </span>
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
export default function JournalctlCommandGenerator() {
    const [filterType, setFilterType] = useState<'service' | 'time' | 'boot' | 'priority'>('service');
    
    // Global State
    const [serviceName, setServiceName] = useState("nginx.service");
    const [timeSince, setTimeSince] = useState("today"); // today, yesterday, 2h, 30m, 2024-01-01
    const [bootOffset, setBootOffset] = useState("0"); // 0 (current), -1 (previous)
    const [priorityLevel, setPriorityLevel] = useState("3"); // err, warning, notice, info, debug

    // Display Options
    const [followOutput, setFollowOutput] = useState(false);
    const [reverseOrder, setReverseOrder] = useState(false);
    const [outputFormat, setOutputFormat] = useState("short"); // short, verbose, json, export
    
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        let cmd = 'journalctl';
        let options = '';
        let filters = '';

        // --- Filters ---
        if (filterType === 'service') {
            const service = serviceName.trim() || 'sshd.service';
            filters += ` -u ${service}`;
        } else if (filterType === 'time') {
            const time = timeSince.trim() || '1h';
            filters += ` -S "${time}"`; // -S --since
        } else if (filterType === 'boot') {
            const offset = bootOffset.trim() || '0';
            filters += ` -b ${offset}`; // -b --boot
        } else if (filterType === 'priority') {
            const level = priorityLevel.trim() || '3';
            filters += ` -p ${level}`; // -p --priority
        }

        // --- Output Options ---
        if (followOutput) {
            options += ' -f'; // --follow
        }
        if (reverseOrder) {
            options += ' -r'; // --reverse
        }
        if (outputFormat && outputFormat !== 'short') {
            options += ` -o ${outputFormat}`; // --output
        }
        
        // --- Final Command Assembly ---
        cmd += filters + options;
        
        setGeneratedCommand(cmd.trim().replace(/\s+/g, ' '));
    }, [filterType, serviceName, timeSince, bootOffset, priorityLevel, followOutput, reverseOrder, outputFormat]);

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

    const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 transition-shadow outline-none";
    const labelBaseClasses = "block mb-1 text-sm font-medium text-gray-400";
    const containerBaseClasses = "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";
    
    // Helper for filter selection
    const FilterButton: React.FC<{ label: string; value: 'service' | 'time' | 'boot' | 'priority'; icon: React.ReactNode }> = ({ label, value, icon }) => (
        <button
            onClick={() => setFilterType(value)}
            className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase ${filterType === value 
                ? 'bg-red-700 text-white shadow-xl shadow-red-900/50 transform scale-[1.01] ring-2 ring-red-500' 
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
                    <div className="p-3 bg-gradient-to-br from-red-600 to-rose-700 rounded-xl shadow-lg">
                        <FileText className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent leading-tight">
                        `journalctl` Log Viewer & Filter
                    </h1>
                </motion.div>

                {/* --- Filter Selection --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${containerBaseClasses} mb-8 border-red-700/30`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Select Log Filter Type</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <FilterButton label="By Service" value="service" icon={<Terminal className="w-5 h-5"/>} />
                        <FilterButton label="By Time" value="time" icon={<Clock className="w-5 h-5"/>} />
                        <FilterButton label="By Boot" value="boot" icon={<RefreshCw className="w-5 h-5"/>} />
                        <FilterButton label="By Priority" value="priority" icon={<Filter className="w-5 h-5"/>} />
                    </div>
                </motion.div>

                {/* --- Input Panel --- */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        key={filterType + 'input'}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${containerBaseClasses} h-full`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Filter Specifics</h2>

                        <div className="space-y-5">
                            <AnimatePresence mode="wait">
                                {/* Service Input */}
                                {filterType === 'service' && (
                                    <motion.div
                                        key="service-input"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <label className={labelBaseClasses}>Systemd Unit Name (`-u`)</label>
                                        <input type="text" placeholder="nginx.service, docker.service, sshd" value={serviceName} onChange={(e) => setServiceName(e.target.value)} className={inputBaseClasses} />
                                    </motion.div>
                                )}
                                
                                {/* Time Input */}
                                {filterType === 'time' && (
                                    <motion.div
                                        key="time-input"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <label className={labelBaseClasses}>Time Since (`--since`)</label>
                                        <input type="text" placeholder="yesterday, 2 hours ago, 2024-11-01" value={timeSince} onChange={(e) => setTimeSince(e.target.value)} className={inputBaseClasses} />
                                        <p className="text-xs text-gray-500 mt-1">Accepts relative (e.g., `2h`, `30m`) or absolute (e.g., `2024-12-01 10:30:00`) times.</p>
                                    </motion.div>
                                )}

                                {/* Boot Input */}
                                {filterType === 'boot' && (
                                    <motion.div
                                        key="boot-input"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <label className={labelBaseClasses}>Boot Offset (`-b`)</label>
                                        <input type="number" placeholder="0" min="-10" value={bootOffset} onChange={(e) => setBootOffset(e.target.value)} className={inputBaseClasses} />
                                        <p className="text-xs text-gray-500 mt-1">**0** es el arranque actual. **-1** es el arranque anterior. Usa `journalctl --list-boots` para ver todos los IDs.</p>
                                    </motion.div>
                                )}
                                
                                {/* Priority Input */}
                                {filterType === 'priority' && (
                                    <motion.div
                                        key="priority-input"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <label className={labelBaseClasses}>Minimum Priority Level (`-p`)</label>
                                        <select value={priorityLevel} onChange={(e) => setPriorityLevel(e.target.value)} className={inputBaseClasses}>
                                            <option value="0">0: emerg (System Unusable)</option>
                                            <option value="1">1: alert</option>
                                            <option value="2">2: crit</option>
                                            <option value="3">3: err (Error)</option>
                                            <option value="4">4: warning</option>
                                            <option value="5">5: notice</option>
                                            <option value="6">6: info</option>
                                            <option value="7">7: debug</option>
                                        </select>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Output & Options Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`${containerBaseClasses} h-full flex flex-col`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Output Options</h2>
                        
                        <div className="space-y-4">
                            
                            {/* Follow Output */}
                            <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                                <input type="checkbox" id="follow" checked={followOutput} onChange={(e) => setFollowOutput(e.target.checked)} className="h-5 w-5 text-red-600 rounded border-gray-700 focus:ring-red-500 bg-gray-900" />
                                <label htmlFor="follow" className="ml-3 text-sm font-medium text-gray-300">
                                    Live Follow Mode (`-f`)
                                </label>
                            </div>
                            
                            {/* Reverse Order */}
                            <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                                <input type="checkbox" id="reverse" checked={reverseOrder} onChange={(e) => setReverseOrder(e.target.checked)} className="h-5 w-5 text-red-600 rounded border-gray-700 focus:ring-red-500 bg-gray-900" />
                                <label htmlFor="reverse" className="ml-3 text-sm font-medium text-gray-300">
                                    Show Logs in Reverse Order (`-r`)
                                </label>
                            </div>
                            
                            {/* Output Format */}
                            <div>
                                <label className={labelBaseClasses}>Output Format (`-o`)</label>
                                <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className={inputBaseClasses}>
                                    <option value="short">short (Default, syslog style)</option>
                                    <option value="short-iso">short-iso (Includes ISO 8601 timestamps)</option>
                                    <option value="verbose">verbose (Show all metadata fields)</option>
                                    <option value="json">json (For parsing by programs)</option>
                                    <option value="export">export (Binary stream format)</option>
                                </select>
                            </div>
                        </div>

                        {/* Generated Command Output */}
                        <div className="mt-8 flex-1 flex flex-col justify-end">
                            <h3 className="text-lg font-semibold text-gray-200 mb-2">Resulting Command</h3>
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
                                        Configure the filters above.
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
                        <h2 className="text-xl font-bold text-red-400">📚 `journalctl` Key Features</h2>
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
                                
                                <h3 className="font-semibold text-lg text-white">Advanced Diagnostic Commands</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-red-700/50">
                                        <p className="font-medium text-red-300">Check Disk Usage</p>
                                        <p className="text-gray-400 mb-2">Muestra cuánto espacio ocupa el journal en el disco.</p>
                                        <CopyableCommand command="journalctl --disk-usage" onCopy={copyToClipboard} />
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-xl border border-red-700/50">
                                        <p className="font-medium text-red-300">Clean up Journal</p>
                                        <p className="text-gray-400 mb-2">Elimina logs antiguos, dejando solo los de los últimos 7 días.</p>
                                        <CopyableCommand command="sudo journalctl --vacuum-time=7d" onCopy={copyToClipboard} />
                                    </div>
                                </div>
                                
                                <h3 className="font-semibold text-lg text-white">Filtering by Executable or PID</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-400">
                                    <li>**By Executable:** Filtra por el nombre del programa, no el servicio (e.g., `journalctl /usr/bin/bash`).</li>
                                    <li>**By PID:** Filtra por un ID de proceso específico (e.g., `journalctl _PID=1234`).</li>
                                </ul>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}