"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { Copy, Key, Shield, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Data Constants ---
interface KeyTypeData {
    name: string;
    description: string;
    commandTemplate: (email: string) => string;
    icon: React.ReactNode;
}

const KEY_TYPES: Record<string, KeyTypeData> = {
    rsa: {
        name: "RSA (Traditional, 4096 bits)",
        description: "The traditional and most widely supported key type. Use a large bit size (4096) for better security.",
        commandTemplate: (email) => `ssh-keygen -t rsa -b 4096 -C "${email}"`,
        icon: <Shield className="w-5 h-5 text-orange-400" />,
    },
    ed25519: {
        name: "ED25519 (Recommended)",
        description: "Modern, faster, and highly secure elliptic curve cryptography. Recommended for most new deployments.",
        commandTemplate: (email) => `ssh-keygen -t ed25519 -C "${email}"`,
        icon: <Shield className="w-5 h-5 text-lime-400" />,
    },
    ecdsa: {
        name: "ECDSA (Performance)",
        description: "Elliptic Curve Digital Signature Algorithm. Offers good performance but compatibility can vary.",
        commandTemplate: (email) => `ssh-keygen -t ecdsa -b 521 -C "${email}"`,
        icon: <Shield className="w-5 h-5 text-amber-400" />,
    }
};

// --- Component ---

export default function SSHKeyGenerator() {
    const [type, setType] = useState("ed25519"); // Default to recommended
    const [email, setEmail] = useState("user@example.com");
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);

    // Auto-generate command whenever type or email changes
    useEffect(() => {
        const selectedType = KEY_TYPES[type];
        if (selectedType && email) {
            setGeneratedCommand(selectedType.commandTemplate(email.trim()));
        } else {
            setGeneratedCommand("");
        }
    }, [type, email]);

    const copyToClipboard = useCallback(async () => {
        if (!generatedCommand) return;
        try {
            await navigator.clipboard.writeText(generatedCommand);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }, [generatedCommand]);

    const currentTypeData = KEY_TYPES[type];

    return (
        // Dark Mode Base Styling
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
            <Sidebar />

            <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-4xl mx-auto">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-8 md:mb-12"
                >
                    <div className="p-3 bg-gradient-to-br from-orange-600 to-yellow-700 rounded-xl shadow-lg">
                        <Key className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
                        SSH Key Command Builder
                    </h1>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    
                    {/* LEFT COLUMN: Key Type Selector */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl h-full"
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                            {currentTypeData.icon} 1. Select Key Algorithm
                        </h2>
                        
                        <label className="block mb-2 font-medium text-gray-400">Key Type</label>
                        <select
                            className="w-full p-3 rounded-xl border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-orange-500 transition-shadow appearance-none"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            {Object.entries(KEY_TYPES).map(([key, data]) => (
                                <option key={key} value={key}>
                                    {data.name}
                                </option>
                            ))}
                        </select>
                        
                        {/* Description */}
                        <motion.div
                            key={type}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-gray-900 border border-gray-700 rounded-xl"
                        >
                            <p className="text-sm text-gray-400">
                                {currentTypeData.description}
                            </p>
                             
                        </motion.div>
                    </motion.div>

                    {/* RIGHT COLUMN: Email Input */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl h-full"
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                            <Key className="w-5 h-5 text-yellow-400" /> 2. Set Key Comment
                        </h2>
                        
                        <label className="block mb-2 font-medium text-gray-400">
                            Email / Comment (-C flag)
                        </label>
                        <input
                            type="email"
                            placeholder="your-email@example.com"
                            className="w-full p-4 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 transition-shadow"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        
                        <p className="text-xs text-gray-500 mt-2">
                            This comment helps identify the key after it's generated.
                        </p>
                    </motion.div>
                </div>

                {/* --- 3. Output Command --- */}
                <AnimatePresence mode="wait">
                    {generatedCommand && (
                        <motion.div
                            key={generatedCommand}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="p-6 bg-gradient-to-br from-black to-gray-900 rounded-2xl border border-orange-700 shadow-2xl relative"
                        >
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">3. Final SSH Keygen Command</h2>
                            
                            {/* Command Output Box */}
                            <div className="relative group">
                                <pre className="bg-gray-800 p-4 rounded-xl font-mono text-sm md:text-base text-gray-100 border border-orange-500 overflow-x-auto pr-16">
                                    <span className="text-orange-400 select-none">$ </span>
                                    {generatedCommand}
                                </pre>

                                {/* Copy Button */}
                                <motion.button
                                    onClick={copyToClipboard}
                                    className={`absolute top-4 right-4 p-2 rounded-lg transition-all flex items-center gap-1 ${copied
                                        ? "bg-emerald-600 text-white"
                                        : "bg-orange-600 text-white hover:bg-orange-500"
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Copy Command"
                                >
                                    <AnimatePresence mode="wait">
                                        {copied ? (
                                            <motion.div key="check" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                                <Check size={16} />
                                            </motion.div>
                                        ) : (
                                            <motion.div key="copy" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                                                <Copy size={16} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </div>
                            
                            <p className="text-sm text-gray-400 mt-4">
                                Run this command in your **Terminal** (macOS/Linux) or **Git Bash** (Windows) to generate the private and public key files (`id_{type}` and `id_{type}.pub`).
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}