"use client";

import { useState, useCallback } from "react";
import Sidebar from "../components/SideBar";
import { Copy, Check, Lock, User, Users, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Data & Logic ---

// Mapping octal digit to rwx representation
const OCTAL_TO_SYMBOLIC: Record<string, string> = {
    "7": "rwx", // Read (4) + Write (2) + Execute (1)
    "6": "rw-", // Read (4) + Write (2)
    "5": "r-x", // Read (4) + Execute (1)
    "4": "r--", // Read (4)
    "3": "-wx", // Write (2) + Execute (1)
    "2": "-w-", // Write (2)
    "1": "--x", // Execute (1)
    "0": "---", // None
};

const DESCRIPTIONS: Record<string, string> = {
    "7": "Read, Write, Execute (rwx)",
    "6": "Read and Write (rw-)",
    "5": "Read and Execute (r-x)",
    "4": "Read only (r--)",
    "3": "Write and Execute (-wx)",
    "2": "Write only (-w-)",
    "1": "Execute only (--x)",
    "0": "No permissions (---)"
};

// --- Component ---

export default function ChmodGenerator() {
    const [owner, setOwner] = useState("7");
    const [group, setGroup] = useState("5");
    const [other, setOther] = useState("5");
    const [copied, setCopied] = useState(false);

    const permissions = `${owner}${group}${other}`;
    const symbolicPermissions = `${OCTAL_TO_SYMBOLIC[owner]}${OCTAL_TO_SYMBOLIC[group]}${OCTAL_TO_SYMBOLIC[other]}`;
    const example = `chmod ${permissions} <file-or-folder>`;

    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(example);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }, [example]);

    const PermissionSelect = ({ label, value, setter, icon }: { label: string, value: string, setter: (v: string) => void, icon: React.ReactNode }) => (
        <div className="flex flex-col">
            <label className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                {icon}
                {label}
            </label>
            <select
                className="w-full p-3 rounded-xl border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-emerald-500 transition-shadow appearance-none"
                value={value}
                onChange={(e) => setter(e.target.value)}
            >
                {Object.keys(DESCRIPTIONS).map((p) => (
                    <option key={p} value={p}>
                        {p} ({DESCRIPTIONS[p].match(/\((.*?)\)/)?.[1] || '---'})
                    </option>
                ))}
            </select>
            <p className="mt-2 text-sm text-gray-400 h-10 overflow-hidden">
                {value} = {DESCRIPTIONS[value]}
            </p>
        </div>
    );

    return (
        // Dark Mode Base Styling
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
            <Sidebar />

            <main className="ml-0 lg:ml-64 p-4 md:p-8 w-full">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Lock className="w-8 h-8 text-emerald-400" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                            `chmod` Octal Generator
                        </h1>
                    </div>

                    {/* SELECTS SECTION */}
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 md:p-8 shadow-2xl mb-10">
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">1. Set Permissions (Octal Mode)</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <PermissionSelect 
                                label="Owner (u)" 
                                value={owner} 
                                setter={setOwner} 
                                icon={<User className="w-4 h-4 text-cyan-400" />}
                            />
                            <PermissionSelect 
                                label="Group (g)" 
                                value={group} 
                                setter={setGroup} 
                                icon={<Users className="w-4 h-4 text-purple-400" />}
                            />
                            <PermissionSelect 
                                label="Other (o)" 
                                value={other} 
                                setter={setOther} 
                                icon={<Globe className="w-4 h-4 text-red-400" />}
                            />
                        </div>
                    </div>

                    {/* OUTPUT SECTION */}
                    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 shadow-2xl">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">2. Generated Command</h2>
                        
                        {/* Command Display */}
                        <div className="relative group">
                            <div className="bg-gray-800 rounded-xl p-4 border border-emerald-600 shadow-lg shadow-emerald-900/40">
                                <code className="text-gray-100 font-mono text-lg block pr-16">
                                    <span className="text-emerald-400">$ </span>
                                    {example}
                                </code>
                            </div>

                            {/* Copy Button */}
                            <motion.button
                                onClick={copyToClipboard}
                                className={`absolute top-1/2 -translate-y-1/2 right-3 p-3 rounded-full transition-all flex items-center justify-center ${copied 
                                    ? "bg-emerald-600 text-white" 
                                    : "bg-gray-700 text-gray-300 hover:bg-emerald-500 hover:text-white"
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                title="Copy to clipboard"
                            >
                                <AnimatePresence mode="wait">
                                    {copied ? (
                                        <motion.div
                                            key="check"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                        >
                                            <Check size={20} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="copy"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                        >
                                            <Copy size={20} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>

                    {/* DETAILS/BREAKDOWN SECTION */}
                    <div className="mt-10 bg-gray-800 rounded-2xl border border-gray-700 p-6 md:p-8 shadow-xl">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">3. Permission Breakdown</h2>
                        
                        {/* Summary Display */}
                        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-700">
                            <div className="mb-2 md:mb-0">
                                <span className="text-4xl font-extrabold text-emerald-400 font-mono tracking-wider">
                                    {permissions}
                                </span>
                                <span className="text-lg text-gray-400 ml-3">
                                    (Octal Code)
                                </span>
                            </div>
                            <div className="text-2xl font-mono text-cyan-400">
                                {symbolicPermissions}
                                <span className="text-lg text-gray-400 ml-3">
                                    (Symbolic Mode)
                                </span>
                            </div>
                        </div>

                        {/* Detailed List */}
                        <div className="space-y-4">
                            <p className="text-gray-300">
                                The command sets the file permissions to:
                            </p>
                            <ul className="space-y-3 pl-0 border-l-4 border-gray-600 pl-4">
                                <li className="text-gray-300">
                                    <strong className="text-cyan-400">Owner ({owner}):</strong> {DESCRIPTIONS[owner]}
                                </li>
                                <li className="text-gray-300">
                                    <strong className="text-purple-400">Group ({group}):</strong> {DESCRIPTIONS[group]}
                                </li>
                                <li className="text-gray-300">
                                    <strong className="text-red-400">Other ({other}):</strong> {DESCRIPTIONS[other]}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}