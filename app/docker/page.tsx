"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/SideBar";
import { Copy, Dock, Server, Check, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDocker } from "react-icons/fa";

// --- Data Constants ---
interface DockerCommand {
    command: string;
    description: string;
    example: string;
}

const DOCKER_COMMANDS: Record<string, DockerCommand> = {
    "Build Image": {
        command: "docker build -t <name> .",
        description: "Builds a Docker image from a local Dockerfile in the current directory.",
        example: "docker build -t my-web-app:1.0 .",
    },
    "Run Container": {
        command: "docker run -d -p <host-port>:<container-port> <image>",
        description: "Runs a container in detached mode (-d) and maps a host port to a container port (-p).",
        example: "docker run -d -p 8080:80 my-web-app:1.0",
    },
    "List Containers": {
        command: "docker ps -a",
        description: "Shows all containers, including running and stopped ones.",
        example: "docker ps -a",
    },
    "Stop Container": {
        command: "docker stop <container>",
        description: "Stops a running container gracefully.",
        example: "docker stop 1a2b3c4d",
    },
    "Remove Container": {
        command: "docker rm <container>",
        description: "Removes a stopped container.",
        example: "docker rm my-old-container",
    },
    "Remove Image": {
        command: "docker rmi <image>",
        description: "Deletes a Docker image by name or ID.",
        example: "docker rmi my-web-app:1.0",
    },
    "Log Container": {
        command: "docker logs -f <container>",
        description: "Fetches and follows (-f) the logs of a container.",
        example: "docker logs -f my-web-app",
    },
};

// --- Component ---

export default function DockerGenerator() {
    const [selectedCommandKey, setSelectedCommandKey] = useState<string>("");
    const [result, setResult] = useState<DockerCommand | null>(null);
    const [copied, setCopied] = useState(false);

    // Auto-generate result when selection changes
    useEffect(() => {
        if (selectedCommandKey) {
            setResult(DOCKER_COMMANDS[selectedCommandKey]);
        } else {
            setResult(null);
        }
    }, [selectedCommandKey]);

    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }, []);

    return (
        // Dark Mode Base Styling
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
            <Sidebar />

            <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-6xl mx-auto">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-8 md:mb-12"
                >
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl shadow-lg">
                        <Server className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                        Docker Command Generator
                    </h1>
                </motion.div>

                {/* --- 1. Command Selection --- */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                        <FaDocker className="w-5 h-5 text-cyan-400" /> 
                        Select Core Workflow
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Object.keys(DOCKER_COMMANDS).map((key) => (
                            <motion.button
                                key={key}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCommandKey(key)}
                                className={`p-4 text-center rounded-xl border transition-all duration-200 text-sm font-medium ${selectedCommandKey === key
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent shadow-lg shadow-blue-500/30"
                                    : "bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-700/50 hover:border-cyan-500"
                                    }`}
                            >
                                {key}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* --- 2. Output and Details --- */}
                <AnimatePresence mode="wait">
                    {result && (
                        <motion.div
                            key={selectedCommandKey}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="p-6 bg-gradient-to-br from-black to-gray-900 rounded-2xl border border-blue-700 shadow-2xl relative"
                        >
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">Command Details</h2>
                            
                            {/* Description */}
                            <p className="text-gray-300 mb-6 border-b border-gray-700 pb-4">
                                **Description:** {result.description}
                            </p>

                            {/* Generated Command */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-lg mb-2 text-cyan-400">Generic Command Syntax:</h3>
                                <div className="relative group">
                                    <pre className="bg-gray-800 p-4 rounded-xl font-mono text-sm text-gray-100 border border-gray-700 overflow-x-auto pr-16">
                                        <span className="text-gray-500 select-none">$ </span>
                                        {result.command}
                                    </pre>
                                </div>
                            </div>

                            {/* Example Usage */}
                            <div className="mb-2">
                                <h3 className="font-semibold text-lg mb-2 text-blue-400">Example Usage:</h3>
                                <div className="relative group">
                                    <pre className="bg-gray-900 p-4 rounded-xl font-mono text-sm text-gray-100 border border-blue-700 overflow-x-auto pr-16">
                                        <span className="text-blue-400 select-none">$ </span>
                                        {result.example}
                                    </pre>

                                    {/* Copy Button */}
                                    <motion.button
                                        onClick={() => copyToClipboard(result.example)}
                                        className={`absolute top-4 right-4 p-2 rounded-lg transition-all flex items-center gap-1 ${copied
                                            ? "bg-emerald-600 text-white"
                                            : "bg-blue-600 text-white hover:bg-blue-500"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Copy Example"
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
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!result && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-10 text-center bg-gray-800 rounded-2xl border border-gray-700 text-gray-400 shadow-xl"
                    >
                        <Terminal className="w-10 h-10 mx-auto mb-3 text-cyan-500" />
                        <p className="text-lg font-medium">Select a command above to see its detailed description and usage example.</p>
                        
                    </motion.div>
                )}
            </main>
        </div>
    );
}