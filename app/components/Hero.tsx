"use client";

import Sidebar from "./SideBar";
import { motion } from "framer-motion";
import { FaTools, FaTerminal, FaCode, FaMagic, FaRocket, FaGithub } from "react-icons/fa";
import { SiDocker, SiLinux, SiGnubash } from "react-icons/si";

const toolCards = [
  {
    title: "Bash Command Generator",
    description: "Generate Linux commands with descriptions and examples",
    icon: <SiGnubash className="text-4xl" />,
    href: "/bash-command-generator",
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    delay: 0.1,
  },
  {
    title: "User Management",
    description: "Create, modify, and manage Linux user accounts",
    icon: <FaTerminal className="text-4xl" />,
    href: "/linux-user-management",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    delay: 0.2,
  },
  {
    title: "Docker Commands",
    description: "Essential Docker commands and Dockerfile syntax",
    icon: <SiDocker className="text-4xl" />,
    href: "/docker",
    color: "from-sky-500 to-blue-600",
    bgColor: "bg-sky-50 dark:bg-sky-900/20",
    delay: 0.3,
  },
  {
    title: "Git Wizard",
    description: "Git commands, workflows, and best practices",
    icon: <FaCode className="text-4xl" />,
    href: "/git",
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    delay: 0.4,
  },
  {
    title: "Cron Job Builder",
    description: "Create and validate cron schedule expressions",
    icon: <FaMagic className="text-4xl" />,
    href: "/cronjobs",
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    delay: 0.5,
  },
  {
    title: "System Management",
    description: "systemctl, chmod, SSH, and TMUX commands",
    icon: <SiLinux className="text-4xl" />,
    href: "/systemctl",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    delay: 0.6,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Sidebar />

      <main className="ml-0 lg:ml-64 w-full min-h-screen p-4 md:p-8 lg:p-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mb-12 lg:mb-16"
        >
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 lg:p-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="lg:w-2/3">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg">
                    <FaTools className="text-3xl md:text-4xl text-white" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-full text-sm font-semibold mb-2">
                      Developer Tools Suite
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Command Generator
                    </h1>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl mb-8 max-w-3xl">
                  A comprehensive collection of tools to generate, learn, and master command-line utilities. 
                  From Bash to Docker, we've got your development workflow covered.
                </p>

                <div className="flex flex-wrap gap-4">
                  <motion.a
                    href="/bash"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:from-teal-600 hover:to-cyan-700"
                  >
                    <FaRocket className="text-lg" />
                    Get Started
                  </motion.a>
                  
                  <motion.a
                    href="https://github.com/hernandoabella/command-generator"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 bg-gray-800 dark:bg-gray-700 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:bg-gray-900 dark:hover:bg-gray-600"
                  >
                    <FaGithub className="text-lg" />
                    Star on GitHub
                  </motion.a>
                </div>
              </div>

              <div className="lg:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-3xl blur-xl opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl">
                    <div className="text-center">
                      <FaTerminal className="text-6xl text-emerald-400 mb-4" />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="text-left font-mono text-sm text-gray-300">
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
        <section className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Explore Our Tools
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Select a tool to start generating commands and learning best practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolCards.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: tool.delay }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <a href={tool.href}>
                  <div className={`h-full ${tool.bgColor} rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color}`}>
                        <div className="text-white">
                          {tool.icon}
                        </div>
                      </div>
                      <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-gray-700 dark:text-gray-300">
                        Click to open
                      </span>
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="max-w-7xl mx-auto mt-16"
        >
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Commands", value: "500+", suffix: "" },
                { label: "Tools", value: "10", suffix: "+" },
                { label: "Categories", value: "6", suffix: "" },
                { label: "Examples", value: "1k", suffix: "+" },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    {stat.value}<span className="text-white/50">{stat.suffix}</span>
                  </div>
                  <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}