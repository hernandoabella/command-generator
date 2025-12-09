"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from "../components/SideBar"; 
import { Copy, Activity, Check, ChevronDown, ChevronUp, Cpu, ListOrdered } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Copyable Command Component ---
interface CopyableCommandProps {
  command: string;
  onCopy: (text: string) => void;
  commandName: "top" | "htop";
}

const CopyableCommand: React.FC<CopyableCommandProps> = ({ command, onCopy, commandName }) => {
  const [localCopied, setLocalCopied] = useState(false);

  const handleCopy = () => {
    onCopy(command);
    setLocalCopied(true);
    setTimeout(() => setLocalCopied(false), 2000);
  };

  const primaryColorClass = "bg-teal-600 hover:bg-teal-500"; 

  return (
    <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
      <span className={`select-none ${commandName === 'top' ? 'text-cyan-400' : 'text-teal-400'}`}>$</span>
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
export default function TopHtopCommandGenerator() {
  const [commandType, setCommandType] = useState<"top" | "htop">("htop");
  const [action, setAction] = useState<"default" | "user" | "cpu_cores" | "delay">("default");

  const [targetUser, setTargetUser] = useState("www-data");
  const [delaySeconds, setDelaySeconds] = useState("5");

  const [generatedCommand, setGeneratedCommand] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    let cmd = commandType; // no trailing space
    const user = targetUser.trim() || "root";
    const delay = delaySeconds.trim() || "3";

    if (commandType === "top") {
      if (action === "user") cmd += ` -u ${user}`;
      else if (action === "cpu_cores") cmd += ` -H`;
      else if (action === "delay") cmd += ` -d ${delay}`;
    } else if (commandType === "htop") {
      if (action === "user") cmd += ` -u ${user}`;
      else if (action === "cpu_cores") cmd += ` -t`;
      else if (action === "delay") cmd += ` -d ${Math.round(parseFloat(delay) * 10)}`;
    }

    setGeneratedCommand(cmd);
  }, [commandType, action, targetUser, delaySeconds]);

  const copyToClipboard = useCallback(async (text: string) => {
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

  // --- Command Buttons ---
  const CommandButton: React.FC<{ label: string; value: "top" | "htop"; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <button
      onClick={() => setCommandType(value)}
      className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase ${commandType === value
        ? 'bg-teal-600 text-white shadow-xl shadow-teal-900/50 transform scale-[1.01] ring-2 ring-teal-500'
        : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
      }
    >
      {icon}
      {label.toUpperCase()}
    </button>
  );

  // --- Action Buttons ---
  const ActionButton: React.FC<{ label: string; value: "default" | "user" | "cpu_cores" | "delay"; icon: React.ReactNode }> = ({ label, value, icon }) => {
    const isActive = action === value;
    return (
      <button
        onClick={() => setAction(value)}
        className={`py-2 px-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${isActive
          ? 'bg-teal-700 text-white shadow-md ring-2 ring-teal-500'
          : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
        }
      >
        {icon}
        {label}
      </button>
    );
  };

  // --- Icons ---
  const User: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );

  const Clock: React.FC<{ size?: number; className?: string }> = ({ size = 18, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      <Sidebar />

      <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-6xl mx-auto pt-20 lg:pt-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8 md:mb-10 border-b border-gray-700/50 pb-6">
          <div className="p-3 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl shadow-lg">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-teal-400 bg-clip-text text-transparent leading-tight">
            `top` vs `htop` System Monitor
          </h1>
        </motion.div>

        {/* Command Selection */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`${containerBaseClasses} mb-8 border-teal-700/30`}>
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Select Monitoring Tool</h2>
          <div className="grid grid-cols-2 gap-4">
            <CommandButton label="top (Classic)" value="top" icon={<Cpu className="w-5 h-5" />} />
            <CommandButton label="htop (Interactive)" value="htop" icon={<ListOrdered className="w-5 h-5" />} />
          </div>
        </motion.div>

        {/* Input + Output Panels */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input Panel */}
          <motion.div key={commandType + 'input'} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className={`${containerBaseClasses} h-full`}>
            <h2 className="text-xl font-semibold text-gray-200 mb-6">Action & Parameters</h2>
            <div className="space-y-5">
              <div>
                <label className={labelBaseClasses}>Monitoring Focus</label>
                <div className="grid grid-cols-2 gap-3">
                  <ActionButton label="Default View" value="default" icon={<Activity size={18} />} />
                  <ActionButton label="Filter by User" value="user" icon={<User size={18} />} />
                  <ActionButton label="Show Cores/Threads" value="cpu_cores" icon={<Cpu size={18} />} />
                  <ActionButton label="Custom Delay" value="delay" icon={<Clock size={18} />} />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {action === "user" && (
                  <motion.div key="user-input" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <label className={labelBaseClasses}>Target User Name (`-u`)</label>
                    <input type="text" placeholder="www-data, postgres, root" value={targetUser} onChange={(e) => setTargetUser(e.target.value)} className={inputBaseClasses} />
                  </motion.div>
                )}
                {action === "delay" && (
                  <motion.div key="delay-input" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <label className={labelBaseClasses}>Update Interval (Seconds)</label>
                    <input type="text" placeholder="3" value={delaySeconds} onChange={(e) => setDelaySeconds(e.target.value)} className={inputBaseClasses} />
                    <p className="text-xs text-gray-500 mt-1">{commandType === 'top' ? 'Uses -d flag for seconds.' : 'Uses -d flag for ticks (10 ticks/second).'}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Output Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className={`${containerBaseClasses} h-full flex flex-col`}>
            <h2 className="text-xl font-semibold text-gray-200 mb-4">Generated Command</h2>
            <div className="flex-1 flex flex-col justify-end">
              <AnimatePresence mode="wait">
                {generatedCommand ? (
                  <motion.div key="output-cmd" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative">
                    <CopyableCommand command={generatedCommand} onCopy={copyToClipboard} commandName={commandType} />
                  </motion.div>
                ) : (
                  <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                    Select an action to generate the monitoring command.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
