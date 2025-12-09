"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { 
  Activity, 
  Search, 
  X, 
  AlertCircle, 
  Zap, 
  Pause, 
  Play,
  Trash2,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  Cpu,
  HardDrive,
  Clock
} from "lucide-react";
import { option } from "framer-motion/m";

/* ------------------------------
   TypeScript Interfaces
--------------------------------*/
interface Process {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  memory: number;
  status: "running" | "sleeping" | "stopped" | "zombie";
  startTime: string;
  command: string;
}

/* ------------------------------
   Process Row Component
--------------------------------*/
const ProcessRow: React.FC<{
  process: Process;
  onKill: (pid: number) => void;
  onPause: (pid: number) => void;
  onResume: (pid: number) => void;
}> = ({ process, onKill, onPause, onResume }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "sleeping":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "stopped":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "zombie":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getCpuColor = (cpu: number) => {
    if (cpu > 80) return "text-red-400";
    if (cpu > 50) return "text-yellow-400";
    return "text-green-400";
  };

  const getMemoryColor = (memory: number) => {
    if (memory > 80) return "text-red-400";
    if (memory > 50) return "text-yellow-400";
    return "text-blue-400";
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
              <div className="md:col-span-1">
                <span className="text-sm text-gray-500">PID</span>
                <p className="font-mono text-blue-400 font-semibold">{process.pid}</p>
              </div>

              <div className="md:col-span-2">
                <span className="text-sm text-gray-500">Process Name</span>
                <p className="font-medium text-white truncate">{process.name}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">User</span>
                <p className="text-gray-300">{process.user}</p>
              </div>

              <div>
                <span className="text-sm text-gray-500">CPU</span>
                <p className={`font-semibold ${getCpuColor(process.cpu)}`}>
                  {process.cpu.toFixed(1)}%
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Memory</span>
                <p className={`font-semibold ${getMemoryColor(process.memory)}`}>
                  {process.memory.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(process.status)}`}>
              {process.status}
            </span>

            <div className="flex gap-1">
              {process.status === "running" && (
                <button
                  onClick={() => onPause(process.pid)}
                  className="p-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg transition-all"
                  title="Pause Process"
                >
                  <Pause size={16} />
                </button>
              )}

              {process.status === "stopped" && (
                <button
                  onClick={() => onResume(process.pid)}
                  className="p-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-all"
                  title="Resume Process"
                >
                  <Play size={16} />
                </button>
              )}

              <button
                onClick={() => onKill(process.pid)}
                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all"
                title="Kill Process"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Start Time:</span>
                <span className="ml-2 text-gray-300">{process.startTime}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-500">Command:</span>
                <pre className="mt-1 p-2 bg-gray-900 rounded text-xs text-gray-300 overflow-x-auto">
                  {process.command}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------
   Main Component
--------------------------------*/
export default function ProcessManagement() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<Process[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"cpu" | "memory" | "pid" | "name">("cpu");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Generate mock processes
  const generateMockProcesses = (): Process[] => {
    const processNames = [
      "nginx", "apache2", "mysql", "postgres", "redis-server", "docker",
      "node", "python", "java", "chrome", "firefox", "systemd",
      "sshd", "cron", "bash", "vim", "code", "slack"
    ];

    const users = ["root", "www-data", "mysql", "postgres", "user", "admin"];
    const statuses: Process["status"][] = ["running", "sleeping", "stopped", "zombie"];

    return Array.from({ length: 25 }, (_, i) => ({
      pid: 1000 + i,
      name: processNames[Math.floor(Math.random() * processNames.length)],
      user: users[Math.floor(Math.random() * users.length)],
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      startTime: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
      command: `/usr/bin/${processNames[Math.floor(Math.random() * processNames.length)]} --config=/etc/config`
    }));
  };

  // Initialize processes
  useEffect(() => {
    setProcesses(generateMockProcesses());
  }, []);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: Math.max(0, p.cpu + (Math.random() - 0.5) * 20),
        memory: Math.max(0, p.memory + (Math.random() - 0.5) * 10)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter and sort processes
  useEffect(() => {
    let filtered = [...processes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.pid.toString().includes(searchTerm) ||
        p.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "cpu":
          comparison = a.cpu - b.cpu;
          break;
        case "memory":
          comparison = a.memory - b.memory;
          break;
        case "pid":
          comparison = a.pid - b.pid;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredProcesses(filtered);
  }, [processes, searchTerm, filterStatus, sortBy, sortOrder]);

  const handleKill = (pid: number) => {
    if (confirm(`Are you sure you want to kill process ${pid}?`)) {
      setProcesses(prev => prev.filter(p => p.pid !== pid));
    }
  };

  const handlePause = (pid: number) => {
    setProcesses(prev => prev.map(p =>
      p.pid === pid ? { ...p, status: "stopped" as const } : p
    ));
  };

  const handleResume = (pid: number) => {
    setProcesses(prev => prev.map(p =>
      p.pid === pid ? { ...p, status: "running" as const } : p
    ));
  };

  const handleRefresh = () => {
    setProcesses(generateMockProcesses());
  };

  const totalCpu = processes.reduce((acc, p) => acc + p.cpu, 0) / processes.length;
  const totalMemory = processes.reduce((acc, p) => acc + p.memory, 0) / processes.length;

  const containerBaseClasses = "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      <Sidebar />

      <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-7xl mx-auto pt-20 lg:pt-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 border-b border-gray-700/50 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl shadow-lg">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                Process Management
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {processes.length} active processes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all flex items-center gap-2"
            >
              <RefreshCw size={18} />
              <span className="hidden md:inline">Refresh</span>
            </button>

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-3 rounded-lg transition-all flex items-center gap-2 ${
                autoRefresh ? "bg-green-600 hover:bg-green-500" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {autoRefresh ? <Play size={18} /> : <Pause size={18} />}
              <span className="hidden md:inline">Auto</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={containerBaseClasses}>
            <div className="flex items-center gap-3 mb-2">
              <Cpu className="text-blue-400" size={24} />
              <h3 className="text-lg font-semibold text-gray-300">Average CPU</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">{totalCpu.toFixed(1)}%</p>
          </div>

          <div className={containerBaseClasses}>
            <div className="flex items-center gap-3 mb-2">
              <HardDrive className="text-purple-400" size={24} />
              <h3 className="text-lg font-semibold text-gray-300">Average Memory</h3>
            </div>
            <p className="text-3xl font-bold text-purple-400">{totalMemory.toFixed(1)}%</p>
          </div>

          <div className={containerBaseClasses}>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-green-400" size={24} />
              <h3 className="text-lg font-semibold text-gray-300">Running</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">
              {processes.filter(p => p.status === "running").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className={`${containerBaseClasses} mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by PID, name, or user..."
                  className="w-full pl-10 pr-10 p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="running">Running</option>
                <option value="sleeping">Sleeping</option>
                <option value="stopped">Stopped</option>
                <option value="zombie">Zombie</option>
              </select>
            </div>

            <div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split("-");
                  setSortBy(sort as any);
                  setSortOrder(order as any);
                }}
                className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="cpu-desc">CPU (High to Low)</option>
                <option value="cpu-asc">CPU (Low to High)</option>
                <option value="memory-desc">Memory (High to Low)</option>
                <option value="memory-asc">Memory (Low to High)</option>
                <option value="pid-asc">PID (Ascending)</option>
                <option value="pid-desc">PID (Descending)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Process List */}
        <div className="space-y-3">
          {filteredProcesses.length === 0 ? (
            <div className={`${containerBaseClasses} text-center py-12`}>
              <AlertCircle className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">No processes found matching your criteria</p>
            </div>
          ) : (
            filteredProcesses.map((process) => (
              <ProcessRow
                key={process.pid}
                process={process}
                onKill={handleKill}
                onPause={handlePause}
                onResume={handleResume}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}