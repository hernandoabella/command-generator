"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/SideBar";
import { Copy, Check, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Copyable command component
const CopyableCommand: React.FC<{ command: string; onCopy: (text: string) => void }> = ({ command, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
      <pre className="flex-1 overflow-x-auto">{command}</pre>
      <motion.button
        onClick={handleCopy}
        className={`p-1 rounded transition-all ${copied ? "bg-emerald-600" : "bg-teal-600 hover:bg-teal-500"}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Copy command"
      >
        <AnimatePresence mode="wait">
          {copied ? (
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

type CommandType = 'uname' | 'hostname' | 'uptime' | 'lsb_release' | 'df';

export default function SystemInfoPage() {
  const [commandType, setCommandType] = useState<CommandType>('uname');
  const [option, setOption] = useState<string>('');
  const [generatedCommand, setGeneratedCommand] = useState<string>('');

  // Dynamically generate the command
  useEffect(() => {
    let cmd = commandType;

    if (commandType !== 'uptime' && option.trim() !== '') {
      cmd += ` ${option.trim()}`;
    }

    setGeneratedCommand(cmd);
  }, [commandType, option]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }, []);

  const buttonClass = (active: boolean) =>
    `py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex-1 text-center ${
      active ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-500' : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'
    }`;

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />

      <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-5xl mx-auto pt-20 lg:pt-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8 border-b border-gray-700/50 pb-6">
          <div className="p-3 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl shadow-lg">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-teal-400 bg-clip-text text-transparent leading-tight">
            System Info Commands
          </h1>
        </motion.div>

        {/* Command Type Selection */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          <button className={buttonClass(commandType === 'uname')} onClick={() => setCommandType('uname')}>uname</button>
          <button className={buttonClass(commandType === 'hostname')} onClick={() => setCommandType('hostname')}>hostname</button>
          <button className={buttonClass(commandType === 'uptime')} onClick={() => setCommandType('uptime')}>uptime</button>
          <button className={buttonClass(commandType === 'lsb_release')} onClick={() => setCommandType('lsb_release')}>lsb_release</button>
          <button className={buttonClass(commandType === 'df')} onClick={() => setCommandType('df')}>df</button>
        </motion.div>

        {/* Options Input */}
        {commandType !== 'uptime' && (
          <div className="mb-6">
            <label className="block mb-2 text-gray-400 font-medium">Command Option</label>
            <input
              type="text"
              placeholder="e.g. -a, -h, -T"
              value={option}
              onChange={(e) => setOption(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        )}

        {/* Generated Command */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-2">Generated Command</h2>
          <CopyableCommand command={generatedCommand} onCopy={copyToClipboard} />
        </div>

        {/* Notes */}
        <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 text-sm text-gray-400">
          <ul className="list-disc list-inside space-y-1">
            <li><code>uname</code>: shows kernel and system information.</li>
            <li><code>hostname</code>: shows the system hostname.</li>
            <li><code>uptime</code>: shows how long the system has been running.</li>
            <li><code>lsb_release</code>: shows Linux distribution information.</li>
            <li><code>df</code>: shows disk usage and available space.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
