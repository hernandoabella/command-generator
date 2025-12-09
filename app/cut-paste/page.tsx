"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar";
import { Copy, Scissors, Check, ChevronDown, ChevronUp, Columns } from "lucide-react";
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

    // Color principal para cut/paste es verde/azul (Text/File Processing)
    const primaryColorClass = "bg-fuchsia-600 hover:bg-fuchsia-500";

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className="text-fuchsia-400 select-none">$ </span>
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
export default function CutPasteCommandGenerator() {
    const [mode, setMode] = useState<'cut' | 'paste'>('cut');
    const [delimiter, setDelimiter] = useState(",");

    // CUT State
    const [cutFields, setCutFields] = useState("1,3"); // e.g., 1,3 or 1-3 or 1-
    const [cutFile, setCutFile] = useState("data.csv");

    // PASTE State
    const [pasteFiles, setPasteFiles] = useState("file_col1.txt file_col2.txt");
    const [pasteDelimiter, setPasteDelimiter] = useState(",");

    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        let cmd = "";
        const file = cutFile.trim() || "input.txt";
        const delim = delimiter.trim() || "\\t"; // Default to tab for paste examples if empty

        if (mode === 'cut') {
            const fields = cutFields.trim() || "1";
            // -d 'delimiter' -f 'fields' file
            cmd = `cut -d '${delim}' -f ${fields} ${file}`;
        } else if (mode === 'paste') {
            const files = pasteFiles.trim() || "file1.txt file2.txt";
            // paste -d 'delimiter' file1 file2...
            cmd = `paste -d '${pasteDelimiter.trim()}' ${files}`;
        }

        setGeneratedCommand(cmd.trim().replace(/\s+/g, ' '));
    }, [mode, delimiter, cutFields, cutFile, pasteFiles, pasteDelimiter]);

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

    const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-fuchsia-500 transition-shadow outline-none";
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
                    <div className="p-3 bg-gradient-to-br from-fuchsia-600 to-pink-700 rounded-xl shadow-lg">
                        <Scissors className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-fuchsia-400 bg-clip-text text-transparent leading-tight">
                        `cut` & `paste` Command Generator
                    </h1>
                </motion.div>

                {/* --- Mode Selection --- */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${containerBaseClasses} mb-8 border-fuchsia-700/30`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Select Operation</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {['cut', 'paste'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m as 'cut' | 'paste')}
                                className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase ${mode === m
                                    ? 'bg-fuchsia-600 text-white shadow-xl shadow-fuchsia-900/50 transform scale-[1.01] ring-2 ring-fuchsia-500'
                                    : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
                                }
                            >
                                {m === 'cut' ? <Scissors className="w-5 h-5" /> : <Columns className="w-5 h-5" />}
                                {m === 'cut' ? 'Extract Columns (cut)' : 'Combine Files (paste)'}
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
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Parameters for <span className="text-fuchsia-400">`{mode}`</span></h2>

                        <div className="space-y-5">

                            {/* CUT Inputs */}
                            {mode === 'cut' && (
                                <motion.div
                                    key="cut-inputs"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-5"
                                >
                                    <div>
                                        <label className={labelBaseClasses}>Field Delimiter (`-d`)</label>
                                        <input type="text" placeholder="," maxLength={1} value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className={inputBaseClasses} />
                                        <p className="text-xs text-gray-500 mt-1">Example: `,` for CSV, `:` for /etc/passwd. Use `\t` for tab.</p>
                                    </div>
                                    <div>
                                        <label className={labelBaseClasses}>Fields to Extract (`-f`)</label>
                                        <input type="text" placeholder="1,3 or 2-4 or 5-" value={cutFields} onChange={(e) => setCutFields(e.target.value)} className={inputBaseClasses} />
                                        <p className="text-xs text-gray-500 mt-1">Specify fields by number. Use comma (`,`) for non-consecutive fields, and hyphen (`-`) for ranges.</p>
                                    </div>
                                    <div>
                                        <label className={labelBaseClasses}>Target File Name</label>
                                        <input type="text" placeholder="data.csv" value={cutFile} onChange={(e) => setCutFile(e.target.value)} className={inputBaseClasses} />
                                    </div>
                                </motion.div>
                            )}

                            {/* PASTE Inputs */}
                            {mode === 'paste' && (
                                <motion.div
                                    key="paste-inputs"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-5"
                                >
                                    <div>
                                        <label className={labelBaseClasses}>Files to Combine</label>
                                        <input type="text" placeholder="names.txt emails.txt" value={pasteFiles} onChange={(e) => setPasteFiles(e.target.value)} className={inputBaseClasses} />
                                        <p className="text-xs text-gray-500 mt-1">Separate file names with spaces.</p>
                                    </div>
                                    <div>
                                        <label className={labelBaseClasses}>Output Delimiter (`-d`)</label>
                                        <input type="text" placeholder="," maxLength={1} value={pasteDelimiter} onChange={(e) => setPasteDelimiter(e.target.value)} className={inputBaseClasses} />
                                        <p className="text-xs text-gray-500 mt-1">Delimiter to place between fields from the combined files.</p>
                                    </div>
                                </motion.div>
                            )}
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
                                                {mode === 'cut' && (
                                                    <>
                                                        <li>Utiliza **`cut`** para extraer campos.</li>
                                                        <li>Delimitador: **`{delimiter || 'TAB (default)'}`** (`-d`).</li>
                                                        <li>Campos extraídos: **`{cutFields || '1'}`** (`-f`).</li>
                                                    </>
                                                )}
                                                {mode === 'paste' && (
                                                    <>
                                                        <li>Utiliza **`paste`** para fusionar líneas de archivos.</li>
                                                        <li>Archivos fusionados: **`{pasteFiles || 'file1.txt file2.txt'}`**.</li>
                                                        <li>Delimitador de salida: **`{pasteDelimiter || 'TAB (default)'}`** (`-d`).</li>
                                                    </>
                                                )}
                                                <li>**Redirección:** Agrega `&gt; output.txt` al final si deseas guardar el resultado en un archivo.</li>
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
                        <h2 className="text-xl font-bold text-fuchsia-400">📚 `cut` and `paste` Reference</h2>
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

                                <h3 className="font-semibold text-lg text-white">`cut` (Extracting Columns)</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-fuchsia-700/50">
                                        <p className="font-medium text-fuchsia-300">Extract Username from `passwd`</p>
                                        <p className="text-gray-400 mb-2">(`-d:` specifies the delimiter, `-f1` specifies the first field)</p>
                                        <CopyableCommand command="cut -d: -f1 /etc/passwd" onCopy={copyToClipboard} />
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-xl border border-fuchsia-700/50">
                                        <p className="font-medium text-fuchsia-300">Extract Fields 2 through 4 (CSV)</p>
                                        <p className="text-gray-400 mb-2">(`-d,` uses comma, `-f2-4` specifies the range)</p>
                                        <CopyableCommand command="cut -d, -f2-4 data.csv" onCopy={copyToClipboard} />
                                    </div>
                                </div>

                                <h3 className="font-semibold text-lg text-white">`paste` (Merging Files)</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-fuchsia-700/50">
                                        <p className="font-medium text-fuchsia-300">Merge two files using a pipe (`|`)</p>
                                        <p className="text-gray-400 mb-2">(`paste` by default uses TAB as delimiter)</p>
                                        <CopyableCommand command="paste names.txt emails.txt" onCopy={copyToClipboard} />
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-xl border border-fuchsia-700/50">
                                        <p className="font-medium text-fuchsia-300">Merge files with custom delimiter</p>
                                        <p className="text-gray-400 mb-2">(`-d=` specifies the equals sign as delimiter)</p>
                                        <CopyableCommand command="paste -d= users.txt passwords.txt" onCopy={copyToClipboard} />
                                    </div>
                                </div>

                                <div className="bg-gray-900 p-4 rounded-xl border border-fuchsia-700/50 md:col-span-2">
                                    <h3 className="font-semibold text-lg text-white">Advanced Combination (`cut` + `paste`)</h3>
                                    <p className="text-gray-400 mb-2">Extrae una columna de un archivo y la combina con otro archivo:</p>
                                    <CopyableCommand command="paste file1.txt <(cut -d, -f3 file2.csv)" onCopy={copyToClipboard} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}