"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { Copy, Zap, Check, ChevronDown, ChevronUp, Network } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------------------------------------------------
   COPYABLE COMMAND COMPONENT
--------------------------------------------------------- */
const CopyableCommand: React.FC<{
    command: string;
    commandName: string;
    onCopy: (text: string) => void;
}> = ({ command, onCopy, commandName }) => {
    const [localCopied, setLocalCopied] = useState(false);

    const handleCopy = () => {
        onCopy(command);
        setLocalCopied(true);
        setTimeout(() => setLocalCopied(false), 2000);
    };

    const colorClass = commandName === "ss" ? "text-cyan-400" : "text-blue-400";

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className={`select-none ${colorClass}`}>$</span>
            <pre className="flex-1 overflow-x-auto mx-2">{command}</pre>

            <motion.button
                onClick={handleCopy}
                className={`p-1 rounded transition-all ${
                    localCopied ? "bg-emerald-600" : "bg-blue-600 hover:bg-blue-500"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Copy Command"
            >
                <AnimatePresence mode="wait">
                    {localCopied ? (
                        <motion.div
                            key="check"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                        >
                            <Check size={14} className="text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="copy"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                        >
                            <Copy size={14} className="text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

/* ---------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------- */
export default function NetstatSSCommandGenerator() {
    const [commandType, setCommandType] = useState<"ss" | "netstat">("ss");

    // State
    const [listening, setListening] = useState(true);
    const [all, setAll] = useState(false);
    const [numeric, setNumeric] = useState(true);
    const [process, setProcess] = useState(true);
    const [tcp, setTcp] = useState(true);
    const [udp, setUdp] = useState(false);

    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    /* ---------------------------------------------------------
       COMMAND GENERATOR LOGIC
    --------------------------------------------------------- */
    useEffect(() => {
        let options: string[] = [];

        if (commandType === "ss") {
            options.push("ss");
            if (listening) options.push("-l");
            if (all) options.push("-a");
            if (numeric) options.push("-n");
            if (process) options.push("-p");
            if (tcp) options.push("-t");
            if (udp) options.push("-u");

            if (!tcp && !udp) options.push("-t");

            const flags = [...new Set(options.filter(o => o.startsWith("-")))].join("");
            setGeneratedCommand(`ss ${flags}`);
        }

        if (commandType === "netstat") {
            let flags = "";
            if (listening) flags += "l";
            if (all) flags += "a";
            if (numeric) flags += "n";
            if (process) flags += "p";
            if (tcp) flags += "t";
            if (udp) flags += "u";

            if (!flags.includes("t") && !flags.includes("u")) flags += "t";

            const finalCmd = flags ? `netstat -${flags}` : "netstat";
            setGeneratedCommand(finalCmd);
        }
    }, [commandType, listening, all, numeric, process, tcp, udp]);

    /* ---------------------------------------------------------
       COPY HANDLER
    --------------------------------------------------------- */
    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    }, []);

    /* ---------------------------------------------------------
       TOGGLE COMPONENT
    --------------------------------------------------------- */
    const OptionToggle: React.FC<{
        label: string;
        option: string;
        enabled: boolean;
        setEnabled: (b: boolean) => void;
    }> = ({ label, option, enabled, setEnabled }) => (
        <button
            onClick={() => setEnabled(!enabled)}
            className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                enabled
                    ? "bg-blue-700 text-white ring-2 ring-blue-500"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-700 border border-gray-700"
            }`}
        >
            {label} (<span className="font-mono">{option}</span>)
        </button>
    );

    /* ---------------------------------------------------------
       RETURN UI
    --------------------------------------------------------- */
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
            <Sidebar />

            <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-6xl mx-auto pt-20 lg:pt-10">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-10 border-b border-gray-700 pb-6"
                >
                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                        <Network className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                        netstat / ss Command Generator
                    </h1>
                </motion.div>

                {/* COMMAND TYPE SWITCH */}
                <div className="bg-gray-800 p-6 rounded-xl border border-blue-700/30 mb-8">
                    <h2 className="text-xl mb-4 font-semibold">Select Command Type</h2>

                    <div className="grid grid-cols-2 gap-4">
                        {["ss", "netstat"].map(cmd => (
                            <button
                                key={cmd}
                                onClick={() => setCommandType(cmd as "ss" | "netstat")}
                                className={`py-3 rounded-xl font-semibold transition-all ${
                                    commandType === cmd
                                        ? "bg-blue-600 text-white ring-2 ring-blue-500"
                                        : "bg-gray-900 text-gray-400 border border-gray-700 hover:bg-gray-700"
                                }`}
                            >
                                <Zap className="inline-block w-5 h-5 mr-2" />
                                {cmd.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* OPTIONS + OUTPUT */}
                <div className="grid lg:grid-cols-2 gap-8">

                    {/* OPTIONS */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h2 className="text-xl mb-6 font-semibold">Common Options</h2>

                        <div className="space-y-6">
                            {/* State Filters */}
                            <div>
                                <h3 className="text-blue-400 mb-3 font-semibold">State Filters</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <OptionToggle label="Listening" option={commandType === "ss" ? "-l" : "l"} enabled={listening} setEnabled={setListening} />
                                    <OptionToggle label="All" option={commandType === "ss" ? "-a" : "a"} enabled={all} setEnabled={setAll} />
                                </div>
                            </div>

                            {/* Info Filters */}
                            <div>
                                <h3 className="text-blue-400 mb-3 font-semibold">Info Options</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <OptionToggle label="Numeric" option={commandType === "ss" ? "-n" : "n"} enabled={numeric} setEnabled={setNumeric} />
                                    <OptionToggle label="Process" option={commandType === "ss" ? "-p" : "p"} enabled={process} setEnabled={setProcess} />
                                </div>
                            </div>

                            {/* Protocol */}
                            <div>
                                <h3 className="text-blue-400 mb-3 font-semibold">Protocols</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <OptionToggle label="TCP" option={commandType === "ss" ? "-t" : "t"} enabled={tcp} setEnabled={setTcp} />
                                    <OptionToggle label="UDP" option={commandType === "ss" ? "-u" : "u"} enabled={udp} setEnabled={setUdp} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OUTPUT */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h2 className="text-xl mb-4 font-semibold">Generated Command</h2>

                        {generatedCommand ? (
                            <CopyableCommand
                                command={generatedCommand}
                                commandName={commandType}
                                onCopy={copyToClipboard}
                            />
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                Select options to generate a command.
                            </p>
                        )}
                    </div>
                </div>

                {/* GUIDE */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mt-10">
                    <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setIsGuideOpen(!isGuideOpen)}
                    >
                        <h2 className="text-xl font-bold text-blue-400">📚 ss vs netstat Guide</h2>
                        <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
                            {isGuideOpen ? <ChevronUp /> : <ChevronDown />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {isGuideOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 text-gray-300 space-y-4"
                            >
                                <p>
                                    <strong>ss</strong> is faster and more modern than <strong>netstat</strong>.
                                </p>

                                <h3 className="font-semibold text-white">Advanced ss Examples</h3>

                                <CopyableCommand
                                    command="ss -tun state established"
                                    commandName="ss"
                                    onCopy={copyToClipboard}
                                />

                                <CopyableCommand
                                    command="ss -tun sport = :80"
                                    commandName="ss"
                                    onCopy={copyToClipboard}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
