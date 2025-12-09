"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar"; 
import { Copy, Server, Check, ChevronDown, ChevronUp, RefreshCw, FileCheck } from "lucide-react";
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

    // Color principal para NGINX es rojo (Server/HTTP)
    const primaryColorClass = "bg-red-600 hover:bg-red-500"; 

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
export default function NginxCommandGenerator() {
    const [mode, setMode] = useState<'syntax' | 'reload' | 'stop' | 'status'>('syntax');
    const [useSystemctl, setUseSystemctl] = useState(true); // Toggle between `systemctl` and `nginx -s`
    
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        let cmd = "";
        
        if (useSystemctl) {
            // Commands using systemctl (Modern Linux systems)
            cmd = `sudo systemctl ${mode === 'syntax' ? 'status' : mode} nginx`;
            
            if (mode === 'syntax') {
                // systemctl doesn't directly check syntax, but status is the next best common check
                cmd = `sudo nginx -t`; 
            } else if (mode === 'stop') {
                 cmd = `sudo systemctl stop nginx`; 
            } else if (mode === 'reload') {
                 cmd = `sudo systemctl reload nginx`; 
            } else if (mode === 'status') {
                 cmd = `sudo systemctl status nginx`; 
            }
            
        } else {
            // Commands using nginx binary signals
            cmd = `sudo nginx`; // Base command, but we need arguments
            
            if (mode === 'syntax') {
                cmd = `sudo nginx -t`;
            } else if (mode === 'reload') {
                cmd = `sudo nginx -s reload`;
            } else if (mode === 'stop') {
                cmd = `sudo nginx -s stop`;
            } else if (mode === 'status') {
                // nginx -s doesn't have a status command, so we fall back to a useful check
                cmd = `ps aux | grep nginx`;
            }
        }
        
        setGeneratedCommand(cmd.trim().replace(/\s+/g, ' '));
    }, [mode, useSystemctl]);

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
                    <div className="p-3 bg-gradient-to-br from-red-600 to-pink-700 rounded-xl shadow-lg">
                        <Server className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent leading-tight">
                        `nginx` & `systemctl` Command Generator
                    </h1>
                </motion.div>

                {/* --- Mode Selection --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${containerBaseClasses} mb-8 border-red-700/30`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Select Task</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {['syntax', 'reload', 'stop', 'status'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m as 'syntax' | 'reload' | 'stop' | 'status')}
                                className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase ${mode === m 
                                    ? 'bg-red-600 text-white shadow-xl shadow-red-900/50 transform scale-[1.01] ring-2 ring-red-500' 
                                    : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
                                }
                            >
                                {m === 'syntax' ? <FileCheck className="w-5 h-5"/> : m === 'reload' ? <RefreshCw className="w-5 h-5"/> : m === 'stop' ? '🛑' : '📊'}
                                {m.toUpperCase()}
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
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Execution Context</h2>

                        <div className="space-y-5">
                            
                            {/* Command Type Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
                                <span className="text-sm font-medium text-gray-300">
                                    Use **`systemctl`** (Modern OS)
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={useSystemctl} onChange={(e) => setUseSystemctl(e.target.checked)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-500 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                </label>
                            </div>
                            
                            <p className="text-xs text-gray-500 pt-1">
                                **`systemctl`** es preferido para iniciar/detener servicios en sistemas modernos (CentOS 7+, Ubuntu 16+). **`nginx -s`** envía señales directamente al proceso principal.
                            </p>
                            
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
                                            <p className="text-sm text-gray-400 font-semibold mb-2">Operation Details:</p>
                                            <ul className="text-xs text-gray-500 list-disc list-inside">
                                                <li>**Sudo:** Se requiere `sudo` para la mayoría de las operaciones de NGINX, ya que vincula puertos privilegiados (como 80 y 443).</li>
                                                {mode === 'syntax' && <li>**`nginx -t`:** La forma más segura de verificar errores de sintaxis antes de recargar.</li>}
                                                {mode === 'reload' && <li>**Recarga (Reload):** Aplica la nueva configuración sin interrumpir las conexiones existentes (Zero Downtime).</li>}
                                                {mode === 'stop' && <li>**Detener (Stop):** Detiene el servidor inmediatamente. Utiliza `quit` si prefieres un apagado gradual (`nginx -s quit`).</li>}
                                                {mode === 'status' && <li>**Estado (Status):** Confirma si el servicio se está ejecutando y cuándo se inició.</li>}
                                            </ul>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                                        Select a task to generate the command.
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
                        <h2 className="text-xl font-bold text-red-400">📚 NGINX Management Reference</h2>
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
                                
                                <h3 className="font-semibold text-lg text-white">Core NGINX Binary Signals (`nginx -s`)</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-red-700/50">
                                        <p className="font-medium text-red-300">Graceful Restart</p>
                                        <p className="text-gray-400 mb-2">Actualiza NGINX con nueva configuración o binario sin perder conexiones.</p>
                                        <CopyableCommand command="sudo nginx -s reopen" onCopy={copyToClipboard} />
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-xl border border-red-700/50">
                                        <p className="font-medium text-red-300">Check Config File Location</p>
                                        <p className="text-gray-400 mb-2">Muestra la ruta del archivo de configuración principal.</p>
                                        <CopyableCommand command="nginx -V" onCopy={copyToClipboard} />
                                    </div>
                                </div>

                                <h3 className="font-semibold text-lg text-white">Systemctl Common Commands</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-400">
                                    <li>**Start:** `sudo systemctl start nginx`</li>
                                    <li>**Enable (Auto-start on boot):** `sudo systemctl enable nginx`</li>
                                    <li>**Restart (Stop + Start, causes brief downtime):** `sudo systemctl restart nginx`</li>
                                </ul>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}