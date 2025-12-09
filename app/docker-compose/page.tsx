"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/SideBar";
import { Copy, Check, Server } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDocker } from "react-icons/fa";

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

type DockerComposeCommand = 'up' | 'down' | 'build' | 'logs';

export default function DockerComposePage() {
  const [commandType, setCommandType] = useState<DockerComposeCommand>('up');
  const [service, setService] = useState('');
  const [detached, setDetached] = useState(true);
  const [lines, setLines] = useState('50');
  const [generatedCommand, setGeneratedCommand] = useState('');

  useEffect(() => {
    let cmd = 'docker-compose';

    switch (commandType) {
      case 'up':
        cmd += ' up';
        if (detached) cmd += ' -d';
        if (service) cmd += ` ${service}`;
        break;
      case 'down':
        cmd += ' down';
        if (service) cmd += ` ${service}`;
        break;
      case 'build':
        cmd += ' build';
        if (service) cmd += ` ${service}`;
        break;
      case 'logs':
        cmd += ' logs';
        if (lines) cmd += ` --tail=${lines}`;
        if (service) cmd += ` ${service}`;
        break;
    }

    setGeneratedCommand(cmd.trim());
  }, [commandType, service, detached, lines]);

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
            <FaDocker className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-teal-400 bg-clip-text text-transparent leading-tight">
            Docker Compose Commands
          </h1>
        </motion.div>

        {/* Command Type Selection */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-4 gap-3 mb-6">
          <button className={buttonClass(commandType === 'up')} onClick={() => setCommandType('up')}>up</button>
          <button className={buttonClass(commandType === 'down')} onClick={() => setCommandType('down')}>down</button>
          <button className={buttonClass(commandType === 'build')} onClick={() => setCommandType('build')}>build</button>
          <button className={buttonClass(commandType === 'logs')} onClick={() => setCommandType('logs')}>logs</button>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {(commandType !== 'logs') && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={detached}
                onChange={() => setDetached(!detached)}
                id="detached"
                className="w-5 h-5 text-teal-600 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-teal-500"
              />
              <label htmlFor="detached" className="text-gray-400 font-medium">Run detached (-d)</label>
            </div>
          )}
          <div>
            <label className="block mb-2 text-gray-400 font-medium">Service (optional)</label>
            <input
              type="text"
              placeholder="web, db..."
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          {commandType === 'logs' && (
            <div>
              <label className="block mb-2 text-gray-400 font-medium">Lines (--tail)</label>
              <input
                type="text"
                placeholder="50"
                value={lines}
                onChange={(e) => setLines(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          )}
        </div>

        {/* Generated Command */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-2">Generated Command</h2>
          <CopyableCommand command={generatedCommand} onCopy={copyToClipboard} />
        </div>

        {/* Notes */}
        <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 text-sm text-gray-400">
          <ul className="list-disc list-inside space-y-1">
            <li><code>docker-compose up</code>: start services. Use <code>-d</code> for detached mode.</li>
            <li><code>docker-compose down</code>: stop and remove services.</li>
            <li><code>docker-compose build</code>: build or rebuild services.</li>
            <li><code>docker-compose logs</code>: show logs. Use <code>--tail</code> for last N lines.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
