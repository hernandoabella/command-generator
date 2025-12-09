"use client";

import Sidebar from "./SideBar";
import { motion } from "framer-motion";
import { FaTools, FaTerminal, FaCode, FaMagic, FaRocket, FaGithub } from "react-icons/fa";
import { SiDocker, SiLinux, SiGnubash } from "react-icons/si";

// --- Tool Data ---
const toolCards = [
    {
        title: "Bash Command Generator",
        description: "Generate Linux commands with descriptions and examples",
        icon: <SiGnubash className="text-4xl" />,
        href: "/bash",
        color: "from-emerald-500 to-green-600",
        bgColor: "bg-emerald-900/20",
        delay: 0.1,
    },
    {
        title: "User Management",
        description: "Create, modify, and manage Linux user accounts",
        icon: <FaTerminal className="text-4xl" />,
        href: "/linux-user-managment",
        color: "from-blue-500 to-cyan-600",
        bgColor: "bg-blue-900/20",
        delay: 0.2,
    },
    {
        title: "Dockerfile Generator",
        description: "Essential Docker commands and Dockerfile syntax",
        icon: <SiDocker className="text-4xl" />,
        href: "/dockerfile",
        color: "from-sky-500 to-blue-600",
        bgColor: "bg-sky-900/20",
        delay: 0.3,
    },
    {
        title: "SSH Key Command Builder",
        description: "Generate secure ssh-keygen commands for different key types",
        icon: <FaCode className="text-4xl" />,
        href: "/ssh",
        color: "from-orange-500 to-amber-600",
        bgColor: "bg-orange-900/20",
        delay: 0.4,
    },
    {
        title: "TMUX Command Assistant",
        description: "Quickly find and copy TMUX session and pane commands",
        icon: <FaMagic className="text-4xl" />,
        href: "/tmux",
        color: "from-purple-500 to-pink-600",
        bgColor: "bg-purple-900/20",
        delay: 0.5,
    },
    {
        title: "Cron Job Builder",
        description: "Create and validate cron schedule expressions for scheduling tasks",
        icon: <SiLinux className="text-4xl" />,
        href: "/cronjobs",
        color: "from-violet-500 to-indigo-600",
        bgColor: "bg-violet-900/20",
        delay: 0.6,
    },
];

// --- Component ---

export default function DashboardPage() {
    return (
        // 1. Full viewport height container
        <div className="flex w-full min-h-screen h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950">
            {/* Assuming Sidebar handles its own fixed position and z-index */}
            <Sidebar />

            {/* 2. Main content area - Takes remaining width, allows vertical scrolling */}
            <main className="ml-0 flex-1 w-full h-full overflow-y-auto p-4 md:p-8">

                {/* Content Wrapper */}
                <div className="max-w-7xl mx-auto">

                    {/* Hero Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 md:mb-10" // Reduced bottom margin
                    >
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 p-6 md:p-10">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                                <div className="lg:w-2/3">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg">
                                            <FaTools className="text-2xl md:text-3xl text-white" />
                                        </div>
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-teal-900/30 text-teal-300 rounded-full text-sm font-semibold mb-1">
                                                Developer Tools Suite
                                            </span>
                                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                                Command Toolkit
                                            </h1>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-base md:text-lg mb-6 max-w-3xl">
                                        A comprehensive collection of tools to generate, learn, and master command-line utilities.
                                        From Bash to Docker, we've got your development workflow covered.
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        <motion.a
                                            href="/bash"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold px-5 py-2 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:from-teal-600 hover:to-cyan-700 text-sm"
                                        >
                                            <FaRocket className="text-sm" />
                                            Start Generating
                                        </motion.a>

                                        <motion.a
                                            href="https://github.com/hernandoabella/command-generator"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center gap-2 bg-gray-700 text-white font-semibold px-5 py-2 md:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:bg-gray-600 text-sm"
                                        >
                                            <FaGithub className="text-sm" />
                                            Star on GitHub
                                        </motion.a>
                                    </div>
                                </div>

                                {/* Terminal Demo */}
                                <div className="lg:w-1/3 flex justify-center mt-6 lg:mt-0">
                                    <div className="relative">
                                        <div className="absolute -inset-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-3xl blur-md opacity-10"></div>
                                        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-2xl">
                                            <div className="text-center">
                                                <FaTerminal className="text-5xl text-emerald-400 mb-3" />
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 justify-center">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    </div>
                                                    <div className="text-left font-mono text-xs text-gray-300">
                                                        <p className="text-emerald-400">$ <span className="text-white">generate --all</span></p>
                                                        <p className="text-cyan-400">→ All tools loaded</p>
                                                        <p className="text-lime-400">✓ Ready to use!</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Tools Grid */}
                    <section className="mb-8 md:mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {toolCards.map((tool) => (
                                <motion.a
                                    key={tool.title}
                                    href={tool.href}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: tool.delay }}
                                    whileHover={{ y: -4, transition: { duration: 0.15 } }}
                                >
                                    <div className={`h-full ${tool.bgColor} rounded-xl border border-gray-700 p-5 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer backdrop-blur-sm`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color}`}>
                                                <div className="text-white">
                                                    {tool.icon}
                                                </div>
                                            </div>
                                            <div className="text-gray-500 group-hover:text-cyan-400 transition-colors mt-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-1">
                                            {tool.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-3">
                                            {tool.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-3">
                                            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-700 text-gray-300">
                                                Go to Tool
                                            </span>
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}