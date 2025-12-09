"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar"; 
import { Copy, Download, Check, ChevronDown, ChevronUp } from "lucide-react";
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

    // Color principal para cURL/WGET es amarillo/naranja (Web/API)
    const primaryColorClass = "bg-orange-600 hover:bg-orange-500"; 

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className={`select-none ${commandName === 'curl' ? 'text-amber-400' : 'text-orange-400'}`}>$ </span>
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
export default function CurlWgetCommandGenerator() {
    const [commandType, setCommandType] = useState<'curl' | 'wget'>('curl');
    const [url, setUrl] = useState("https://api.example.com/data");
    
    // cURL State
    const [method, setMethod] = useState("GET");
    const [header, setHeader] = useState("Content-Type: application/json");
    const [data, setData] = useState("");
    const [outputFile, setOutputFile] = useState(""); // -o or -O
    
    // WGET State
    const [recursive, setRecursive] = useState(false);
    const [limitRate, setLimitRate] = useState("");
    
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        let cmd = commandType;
        const targetUrl = url.trim() || "http://example.com";

        if (commandType === 'curl') {
            // Base URL
            cmd += ` ${targetUrl}`;
            
            // Method (-X)
            if (method !== 'GET') {
                cmd += ` -X ${method}`;
            }
            
            // Header (-H)
            if (header.trim()) {
                // Wrap header in quotes for safety
                cmd += ` -H '${header.trim().replace(/'/g, "\\'")}'`;
            }
            
            // Data (-d) for POST/PUT
            if (data.trim() && (method === 'POST' || method === 'PUT')) {
                // Wrap data in quotes for safety
                cmd += ` -d '${data.trim().replace(/'/g, "\\'")}'`;
            }

            // Output (-o or -O)
            if (outputFile.trim()) {
                // Use -o (specify filename) or -O (use remote filename)
                cmd += ` -o ${outputFile.trim()}`;
            } else if (method === 'GET') {
                 // For standard GET, show progress without saving to terminal
                 cmd = `curl -s ${targetUrl}`;
            }
            
        } else if (commandType === 'wget') {
            cmd = `wget`;
            
            // Recursive (-r)
            if (recursive) {
                cmd += ` -r -l 10`; // -l 10 is a reasonable depth limit
            }
            
            // Rate Limit (--limit-rate)
            if (limitRate.trim()) {
                cmd += ` --limit-rate=${limitRate.trim()}`;
            }
            
            // Output filename is usually automatic, but we can use -O
            if (outputFile.trim()) {
                 cmd += ` -O ${outputFile.trim()}`;
            }
            
            // Final URL
            cmd += ` ${targetUrl}`;
        }
        
        // Final command cleanup
        setGeneratedCommand(cmd.trim().replace(/\s+/g, ' '));
    }, [commandType, url, method, header, data, outputFile, recursive, limitRate]);

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

    const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 transition-shadow outline-none";
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
                    <div className="p-3 bg-gradient-to-br from-orange-600 to-amber-700 rounded-xl shadow-lg">
                        <Download className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent leading-tight">
                        `curl` & `wget` Command Generator
                    </h1>
                </motion.div>

                {/* --- Mode Selection --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${containerBaseClasses} mb-8 border-orange-700/30`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Select Command Type</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {['curl', 'wget'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setCommandType(m as 'curl' | 'wget')}
                                className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase ${commandType === m 
                                    ? 'bg-orange-600 text-white shadow-xl shadow-orange-900/50 transform scale-[1.01] ring-2 ring-orange-500' 
                                    : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
                                }
                            >
                                
                                {m.toUpperCase()} ({m === 'curl' ? 'API/Debug' : 'Downloading'})
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
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Parameters for <span className="text-orange-400">`{commandType}`</span></h2>

                        <div className="space-y-5">
                            
                            {/* URL */}
                            <div>
                                <label className={labelBaseClasses}>Target URL</label>
                                <input type="text" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} className={inputBaseClasses} />
                            </div>

                            {/* Output File */}
                            <div>
                                <label className={labelBaseClasses}>Save Output As (`-o`)</label>
                                <input type="text" placeholder="output.json or file.html" value={outputFile} onChange={(e) => setOutputFile(e.target.value)} className={inputBaseClasses} />
                                <p className="text-xs text-gray-500 mt-1">Leave empty to print output to terminal.</p>
                            </div>
                            
                            <AnimatePresence mode="wait">
                                {commandType === 'curl' && (
                                    <motion.div
                                        key="curl-opts"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-5 overflow-hidden border border-gray-700 p-4 rounded-lg"
                                    >
                                        <h3 className="font-semibold text-amber-300">cURL Options</h3>
                                        {/* Method */}
                                        <div>
                                            <label className={labelBaseClasses}>HTTP Method (`-X`)</label>
                                            <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputBaseClasses}>
                                                <option value="GET">GET (Retrieve Data)</option>
                                                <option value="POST">POST (Submit Data)</option>
                                                <option value="PUT">PUT (Update Data)</option>
                                                <option value="DELETE">DELETE (Remove Resource)</option>
                                            </select>
                                        </div>
                                        {/* Header */}
                                        <div>
                                            <label className={labelBaseClasses}>Header (`-H`)</label>
                                            <input type="text" placeholder="Authorization: Bearer XXX" value={header} onChange={(e) => setHeader(e.target.value)} className={inputBaseClasses} />
                                        </div>
                                        {/* Data (only for POST/PUT) */}
                                        {(method === 'POST' || method === 'PUT') && (
                                            <div>
                                                <label className={labelBaseClasses}>Data Payload (`-d`)</label>
                                                <textarea rows={2} placeholder='{"key": "value"}' value={data} onChange={(e) => setData(e.target.value)} className={inputBaseClasses} />
                                                <p className="text-xs text-gray-500 mt-1">URL-encoded or JSON payload.</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                                
                                {commandType === 'wget' && (
                                    <motion.div
                                        key="wget-opts"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-5 overflow-hidden border border-gray-700 p-4 rounded-lg"
                                    >
                                        <h3 className="font-semibold text-orange-300">Wget Options</h3>
                                        {/* Recursive */}
                                        <div className="flex items-center">
                                            <input type="checkbox" id="recursive" checked={recursive} onChange={(e) => setRecursive(e.target.checked)} className="h-5 w-5 text-orange-600 rounded border-gray-700 focus:ring-orange-500 bg-gray-900" />
                                            <label htmlFor="recursive" className="ml-3 text-sm font-medium text-gray-300">
                                                Recursive Download (`-r -l 10`)
                                            </label>
                                        </div>
                                        {/* Limit Rate */}
                                        <div>
                                            <label className={labelBaseClasses}>Rate Limit (`--limit-rate`)</label>
                                            <input type="text" placeholder="50k or 1m" value={limitRate} onChange={(e) => setLimitRate(e.target.value)} className={inputBaseClasses} />
                                            <p className="text-xs text-gray-500 mt-1">Example: `50k` (kilobytes) or `1m` (megabytes).</p>
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
                                        <CopyableCommand command={generatedCommand} onCopy={copyToClipboard} commandName={commandType} />
                                        
                                        <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
                                            <p className="text-sm text-gray-400 font-semibold mb-2">Summary:</p>
                                            <ul className="text-xs text-gray-500 list-disc list-inside">
                                                {commandType === 'curl' && (
                                                    <>
                                                        <li>**`curl`** es ideal para probar APIs y ver encabezados de respuesta (`-i`).</li>
                                                        <li>**Modo Silencioso (`-s`):** Se añade por defecto en comandos GET simples para evitar la barra de progreso de cURL.</li>
                                                    </>
                                                )}
                                                {commandType === 'wget' && (
                                                    <>
                                                        <li>**`wget`** se enfoca en descargas, reintentos y soporte de FTP/HTTP(S).</li>
                                                        <li>**Descarga en Background:** Añadir `-b` al inicio del comando permite que la descarga continúe en segundo plano.</li>
                                                    </>
                                                )}
                                                
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
                        <h2 className="text-xl font-bold text-orange-400">📚 `curl` and `wget` Reference</h2>
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
                                
                                <h3 className="font-semibold text-lg text-white">cURL: API Interaction & Debugging</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-amber-700/50">
                                        <p className="font-medium text-amber-300">View Headers Only</p>
                                        <p className="text-gray-400 mb-2">Fetches only the HTTP headers (`-I`).</p>
                                        <CopyableCommand command="curl -I https://google.com" onCopy={copyToClipboard} commandName="curl" />
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-xl border border-amber-700/50">
                                        <p className="font-medium text-amber-300">Download and Follow Redirects</p>
                                        <p className="text-gray-400 mb-2">Downloads file, uses remote filename (`-O`), follows redirects (`-L`).</p>
                                        <CopyableCommand command="curl -OL https://example.com/file.zip" onCopy={copyToClipboard} commandName="curl" />
                                    </div>
                                </div>

                                <h3 className="font-semibold text-lg text-white">Wget: Robust Downloads</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-orange-700/50">
                                        <p className="font-medium text-orange-300">Download and Resume</p>
                                        <p className="text-gray-400 mb-2">Continues a partially downloaded file (`-c`).</p>
                                        <CopyableCommand command="wget -c large_file.iso" onCopy={copyToClipboard} commandName="wget" />
                                    </div>
                                    
                                    <div className="bg-gray-900 p-4 rounded-xl border border-orange-700/50">
                                        <p className="font-medium text-orange-300">Download a full website mirror</p>
                                        <p className="text-gray-400 mb-2">Recursivo (`-r`), convierte enlaces a locales (`-k`), no va a padres (`-np`).</p>
                                        <CopyableCommand command="wget -r -k -np https://mysite.com" onCopy={copyToClipboard} commandName="wget" />
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