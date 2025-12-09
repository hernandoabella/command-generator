"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar"; 
import { Copy, Zap, Check, ChevronDown, ChevronUp, Network } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Component for Copyable Command ---
/**
 * Componente que muestra un comando y un botón de copiado con feedback visual.
 */
const CopyableCommand: React.FC<{ command: string, onCopy: (text: string) => void }> = ({ command, onCopy, commandName }) => {
    const [localCopied, setLocalCopied] = useState(false);

    const handleCopy = () => {
        onCopy(command);
        setLocalCopied(true);
        setTimeout(() => setLocalCopied(false), 2000);
    };

    // Color principal para Netstat/SS es azul (Network)
    const primaryColorClass = "bg-blue-600 hover:bg-blue-500"; 

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className={`select-none ${commandName === 'ss' ? 'text-cyan-400' : 'text-blue-400'}`}>$ </span>
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
export default function NetstatSSCommandGenerator() {
    const [commandType, setCommandType] = useState<'ss' | 'netstat'>('ss');
    
    // SS/NETSTAT State
    const [listening, setListening] = useState(true);
    const [all, setAll] = useState(false);
    const [numeric, setNumeric] = useState(true);
    const [process, setProcess] = useState(true);
    const [tcp, setTcp] = useState(true);
    const [udp, setUdp] = useState(false);

    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        let options = [];
        
        if (commandType === 'ss') {
            options.push('ss');
            // ss options: -l (listening), -a (all), -n (numeric), -p (process), -t (tcp), -u (udp)
            if (listening) options.push('-l');
            if (all) options.push('-a'); // -a includes -l if -l wasn't specified alone
            if (numeric) options.push('-n');
            if (process) options.push('-p');
            if (tcp) options.push('-t');
            if (udp) options.push('-u');
            
            // If neither tcp nor udp is selected, show both (default behavior often)
            if (!tcp && !udp) {
                 options.push('-t');
            }
            
            // Re-order options for standard appearance, then join
            const filteredOptions = options.filter(o => o.startsWith('-')).sort();
            const uniqueOptions = [...new Set(filteredOptions)]; // Remove duplicate options like -t if default was added
            
            setGeneratedCommand(options[0] + ' ' + uniqueOptions.join(''));

        } else if (commandType === 'netstat') {
            options.push('netstat');
            // netstat options: -l (listening), -a (all), -n (numeric), -p (process), -t (tcp), -u (udp)
            if (listening) options.push('l');
            if (all) options.push('a');
            if (numeric) options.push('n');
            if (process) options.push('p');
            if (tcp) options.push('t');
            if (udp) options.push('u');
            
            // netstat groups options under a single hyphen
            let netstatOptions = options.filter(o => o.length === 1).join('');
            
            // If -a is selected, it covers -l (listening and non-listening)
            if (netstatOptions.includes('a')) {
                netstatOptions = netstatOptions.replace('l', '');
            } else if (!netstatOptions.includes('l')) {
                 // netstat default shows connected sockets unless -l is specified
            }
            
            // netstat also needs protocol filters, default is usually all protocols
            if (!netstatOptions.includes('t') && !netstatOptions.includes('u') && !netstatOptions.includes('a')) {
                // If no protocol is selected, let's default to a common useful combination
                 netstatOptions += 't'; 
            }
            
            const finalNetstat = options[0] + (netstatOptions ? ` -${netstatOptions}` : '');
            setGeneratedCommand(finalNetstat);
        }

    }, [commandType, listening, all, numeric, process, tcp, udp]);

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

    const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-shadow outline-none";
    const labelBaseClasses = "block mb-1 text-sm font-medium text-gray-400";
    const containerBaseClasses = "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";
    

    const OptionToggle: React.FC<{ label: string; option: string; enabled: boolean; setEnabled: (value: boolean) => void }> = ({ label, option, enabled, setEnabled }) => (
        <button
            onClick={() => setEnabled(!enabled)}
            className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-1 ${enabled 
                ? 'bg-blue-700 text-white shadow-md ring-2 ring-blue-500' 
                : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
            }
        >
            {label} (<span className="font-mono">{option}</span>)
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
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl shadow-lg">
                        <Network className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent leading-tight">
                        `netstat` vs `ss` Command Generator
                    </h1>
                </motion.div>

                {/* --- Mode Selection --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${containerBaseClasses} mb-8 border-blue-700/30`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Select Command Type</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {['ss', 'netstat'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setCommandType(m as 'ss' | 'netstat')}
                                className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase ${commandType === m 
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/50 transform scale-[1.01] ring-2 ring-blue-500' 
                                    : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
                                }
                            >
                                <Zap className="w-5 h-5"/>
                                {m.toUpperCase()} ({m === 'ss' ? 'Modern' : 'Legacy'})
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* --- Input Panel & Output --- */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${containerBaseClasses} h-full`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Common Options</h2>

                        <div className="space-y-6">
                            
                            {/* State Filters */}
                            <div>
                                <h3 className="text-base font-semibold text-blue-400 mb-3">Connection State Filters</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <OptionToggle label="Listening Ports" option={commandType === 'ss' ? '-l' : 'l'} enabled={listening} setEnabled={setListening} />
                                    <OptionToggle label="All Ports (Connected & Listen)" option={commandType === 'ss' ? '-a' : 'a'} enabled={all} setEnabled={setAll} />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">`All` includes `Listening`. If both are selected, `All` usually takes precedence.</p>
                            </div>

                            {/* Info Filters */}
                            <div>
                                <h3 className="text-base font-semibold text-blue-400 mb-3">Detail Display Options</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <OptionToggle label="Show Numeric Ports/IPs" option={commandType === 'ss' ? '-n' : 'n'} enabled={numeric} setEnabled={setNumeric} />
                                    <OptionToggle label="Show Process/PID" option={commandType === 'ss' ? '-p' : 'p'} enabled={process} setEnabled={setProcess} />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Numeric (`-n`) avoids DNS lookups, making the command faster.</p>
                            </div>

                            {/* Protocol Filters */}
                            <div>
                                <h3 className="text-base font-semibold text-blue-400 mb-3">Protocol Filters</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <OptionToggle label="TCP Sockets" option={commandType === 'ss' ? '-t' : 't'} enabled={tcp} setEnabled={setTcp} />
                                    <OptionToggle label="UDP Sockets" option={commandType === 'ss' ? '-u' : 'u'} enabled={udp} setEnabled={setUdp} />
                                </div>
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
                                            <p className="text-sm text-gray-400 font-semibold mb-2">Most Common Use Case:</p>
                                            <p className="text-white font-mono text-sm mb-3">
                                                ss -tuln
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                This command is used to quickly check all **Listening** ports for **TCP** and **UDP**, showing only **Numeric** values.
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                                        Select options to generate the `netstat` or `ss` command.
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
                        <h2 className="text-xl font-bold text-blue-400">📚 `ss` vs `netstat` Guide</h2>
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
                                
                                <h3 className="font-semibold text-lg text-white">Why use `ss` over `netstat`?</h3>
                                <p className="text-gray-400">
                                    **`ss`** (Socket Statistics) is the modern replacement for `netstat`. It retrieves socket information directly from the kernel space (`/proc/net/tcp`, etc.) which is significantly faster, especially when dealing with a large number of connections.
                                </p>

                                <h3 className="font-semibold text-lg text-white">Advanced `ss` Filters</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-blue-700/50">
                                        <p className="font-medium text-cyan-300">Filter by Specific Port</p>
                                        <p className="text-gray-400 mb-2">Find all TCP connections on port 80:</p>
                                        <CopyableCommand command="ss -tun state established sport = :80" onCopy={copyToClipboard} commandName="ss" />
                                        <p className="text-gray-400 mb-2 mt-3">Find all connections to port 22:</p>
                                        <CopyableCommand command="ss -tun dport = :22" onCopy={copyToClipboard} commandName="ss" />
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-xl border border-blue-700/50">
                                        <p className="font-medium text-cyan-300">Filter by Connection State</p>
                                        <p className="text-gray-400 mb-2">Show all sockets in the TIME-WAIT state (common bottleneck):</p>
                                        <CopyableCommand command="ss -t state time-wait" onCopy={copyToClipboard} commandName="ss" />
                                        <p className="text-gray-400 mb-2 mt-3">Show all persistent TCP connections:</p>
                                        <CopyableCommand command="ss -t state established" onCopy={copyToClipboard} commandName="ss" />
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