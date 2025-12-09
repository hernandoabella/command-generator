"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar"; 
import { Copy, FileText, Check, ChevronDown, ChevronUp } from "lucide-react";
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

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className="text-teal-400 select-none">$ </span>
            <pre className="flex-1 overflow-x-auto mx-2">{command}</pre>
            <motion.button
                onClick={handleCopy}
                className={`p-1 rounded transition-all ${localCopied ? "bg-emerald-600" : "bg-teal-600 hover:bg-teal-500"}`}
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
export default function CatEchoGenerator() {
    const [mode, setMode] = useState<'create' | 'append' | 'concatenate'>('create');
    const [targetFileName, setTargetFileName] = useState("config.txt");
    const [textInput, setTextInput] = useState("Key=Value");
    const [sourceFiles, setSourceFiles] = useState("part1.txt part2.txt");
    
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        let command = "";
        const targetFile = targetFileName.trim() || "output.txt";
        
        // Escape internal quotes for shell safety
        const text = textInput.trim().replace(/"/g, '\\"'); 

        if (mode === 'create') {
            // Using echo to overwrite/create the file
            // Check if -e is needed for newlines
            const usesNewline = text.includes('\\n');
            const echoCmd = usesNewline ? `echo -e "${text}"` : `echo "${text}"`;
            command = `${echoCmd} > ${targetFile}`;
        } else if (mode === 'append') {
            // Using echo to append to the file
            const usesNewline = text.includes('\\n');
            const echoCmd = usesNewline ? `echo -e "${text}"` : `echo "${text}"`;
            command = `${echoCmd} >> ${targetFile}`;
        } else if (mode === 'concatenate') {
            // Using cat to combine multiple files
            const files = sourceFiles.trim() || "file1.txt file2.txt";
            command = `cat ${files} > ${targetFile}`;
        }

        setGeneratedCommand(command.trim());
    }, [mode, targetFileName, textInput, sourceFiles]);

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
    
    // --- Manual Cat/Echo Guide State ---
    const [isGuideOpen, setIsGuideOpen] = useState(false);

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
                        <FileText className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-teal-400 bg-clip-text text-transparent leading-tight">
                        `cat` & `echo` Command Generator
                    </h1>
                </motion.div>

                {/* --- Mode Selection --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${containerBaseClasses} mb-8 border-teal-700/30`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Select Operation</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {['create', 'append', 'concatenate'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m as 'create' | 'append' | 'concatenate')}
                                className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase ${mode === m 
                                    ? 'bg-teal-600 text-white shadow-xl shadow-teal-900/50 transform scale-[1.01] ring-2 ring-teal-500' 
                                    : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
                                }
                            >
                                {m === 'create' ? 'Overwrite/Create' : m === 'append' ? 'Append Line' : 'Concatenate Files'}
                            </button>
                        ))}
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
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Parameters</h2>

                        <div className="space-y-5">
                            <div className="relative">
                                <label className={labelBaseClasses}>Target File Name</label>
                                <input type="text" placeholder="config.txt" value={targetFileName} onChange={(e) => setTargetFileName(e.target.value)} className={inputBaseClasses} />
                            </div>
                            
                            {(mode === 'create' || mode === 'append') && (
                                <motion.div
                                    key="text-input"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="relative"
                                >
                                    <label className={labelBaseClasses}>Text to {mode === 'create' ? 'Write' : 'Append'} (`echo`)</label>
                                    <input type="text" placeholder="ServerName=web01" value={textInput} onChange={(e) => setTextInput(e.target.value)} className={inputBaseClasses} />
                                    <p className="text-xs text-gray-500 mt-1">Use **`\n`** for a newline (Esto añade automáticamente `echo -e`).</p>
                                </motion.div>
                            )}
                            
                            {mode === 'concatenate' && (
                                <motion.div
                                    key="file-input"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="relative"
                                >
                                    <label className={labelBaseClasses}>Source Files (`cat`)</label>
                                    <input type="text" placeholder="part1.txt part2.txt license.md" value={sourceFiles} onChange={(e) => setSourceFiles(e.target.value)} className={inputBaseClasses} />
                                    <p className="text-xs text-gray-500 mt-1">Separate file names with spaces.</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Output Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`${containerBaseClasses} h-full`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Generated Command</h2>
                        
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
                                        <p className="text-sm text-gray-400 font-semibold mb-2">Operation Summary:</p>
                                        <ul className="text-xs text-gray-500 list-disc list-inside">
                                            {mode === 'create' && <li>Utiliza el operador **`&gt;`** (chevron simple) para **sobrescribir** o crear `{targetFileName || 'output.txt'}`.</li>}
                                            {mode === 'append' && <li>Utiliza el operador **`&gt;&gt;`** (chevron doble) para **anexar** la línea a `{targetFileName || 'output.txt'}`.</li>}
                                            {mode === 'concatenate' && <li>Utiliza **`cat`** para combinar el contenido de los archivos fuente antes de redirigir la salida a `{targetFileName || 'output.txt'}`.</li>}
                                        </ul>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="p-10 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                                    Select an **Operation** and fill in the parameters to generate the command.
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
                
                {/* --- Guide for Reading/Interactive Use --- */}
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
                        <h2 className="text-xl font-bold text-teal-400">📖 Manual `cat` & `echo` Reference</h2>
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
                                className="mt-4 pt-4 border-t border-gray-700 overflow-hidden space-y-4"
                            >
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-teal-700/50">
                                        <h3 className="font-semibold text-lg text-white mb-2">Display File Contents (`cat`)</h3>
                                        <p className="text-sm text-gray-400 mb-2">Use **`cat`** to quickly view a file's contents or add line numbers.</p>
                                        <CopyableCommand command="cat /etc/passwd" onCopy={copyToClipboard} />
                                        <CopyableCommand command="cat -n script.sh" onCopy={copyToClipboard} />
                                    </div>
                                    
                                    <div className="bg-gray-900 p-4 rounded-xl border border-teal-700/50">
                                        <h3 className="font-semibold text-lg text-white mb-2">Interactive File Creation (`cat`)</h3>
                                        <p className="text-sm text-gray-400 mb-2">Use **`cat &gt;`** para ingresar manualmente múltiples líneas de texto en un archivo nuevo.</p>
                                        <CopyableCommand command="cat > interactive_file.txt" onCopy={copyToClipboard} />
                                        <p className="text-xs text-red-400 mt-2">**Nota:** Presiona **Ctrl + D** para guardar el archivo y salir.</p>
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