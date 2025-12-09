"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { 
  Network, 
  Play, 
  Square, 
  RefreshCw, 
  Globe,
  Clock,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Wifi,
  Server
} from "lucide-react";

/* ------------------------------
   TypeScript Interfaces
--------------------------------*/
interface PingResult {
  seq: number;
  time: number;
  ttl: number;
  status: "success" | "timeout" | "error";
  timestamp: string;
}

interface TracerouteHop {
  hop: number;
  ip: string;
  hostname: string;
  time1: number;
  time2: number;
  time3: number;
  status: "success" | "timeout";
}

interface PingStats {
  sent: number;
  received: number;
  lost: number;
  lossPercent: number;
  minTime: number;
  maxTime: number;
  avgTime: number;
}

/* ------------------------------
   Main Component
--------------------------------*/
export default function PingTraceroute() {
  const [activeTab, setActiveTab] = useState<"ping" | "traceroute">("ping");
  
  // Ping State
  const [pingTarget, setPingTarget] = useState("google.com");
  const [pingCount, setPingCount] = useState(4);
  const [pingInterval, setPingInterval] = useState(1000);
  const [pingResults, setPingResults] = useState<PingResult[]>([]);
  const [isPinging, setIsPinging] = useState(false);
  const [pingStats, setPingStats] = useState<PingStats | null>(null);

  // Traceroute State
  const [traceTarget, setTraceTarget] = useState("google.com");
  const [traceMaxHops, setTraceMaxHops] = useState(30);
  const [traceResults, setTraceResults] = useState<TracerouteHop[]>([]);
  const [isTracing, setIsTracing] = useState(false);

  /* -------- Ping Logic -------- */
  const startPing = () => {
    setIsPinging(true);
    setPingResults([]);
    setPingStats(null);

    let count = 0;
    const results: PingResult[] = [];

    const interval = setInterval(() => {
      if (count >= pingCount) {
        clearInterval(interval);
        setIsPinging(false);
        calculatePingStats(results);
        return;
      }

      count++;
      const time = Math.random() * 100 + 10; // 10-110ms
      const success = Math.random() > 0.1; // 90% success rate

      const result: PingResult = {
        seq: count,
        time: success ? time : 0,
        ttl: 64,
        status: success ? "success" : "timeout",
        timestamp: new Date().toLocaleTimeString()
      };

      results.push(result);
      setPingResults([...results]);
    }, pingInterval);
  };

  const stopPing = () => {
    setIsPinging(false);
    if (pingResults.length > 0) {
      calculatePingStats(pingResults);
    }
  };

  const calculatePingStats = (results: PingResult[]) => {
    const successResults = results.filter(r => r.status === "success");
    const times = successResults.map(r => r.time);

    const stats: PingStats = {
      sent: results.length,
      received: successResults.length,
      lost: results.length - successResults.length,
      lossPercent: ((results.length - successResults.length) / results.length) * 100,
      minTime: times.length > 0 ? Math.min(...times) : 0,
      maxTime: times.length > 0 ? Math.max(...times) : 0,
      avgTime: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
    };

    setPingStats(stats);
  };

  /* -------- Traceroute Logic -------- */
  const startTraceroute = () => {
    setIsTracing(true);
    setTraceResults([]);

    const hops: TracerouteHop[] = [];
    const totalHops = Math.floor(Math.random() * 10) + 8; // 8-18 hops

    let currentHop = 0;

    const interval = setInterval(() => {
      if (currentHop >= totalHops || currentHop >= traceMaxHops) {
        clearInterval(interval);
        setIsTracing(false);
        return;
      }

      currentHop++;
      const timeout = Math.random() > 0.9; // 10% timeout rate

      const hop: TracerouteHop = {
        hop: currentHop,
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        hostname: timeout ? "*" : `router-${currentHop}.isp.net`,
        time1: timeout ? 0 : Math.random() * 50 + 10,
        time2: timeout ? 0 : Math.random() * 50 + 10,
        time3: timeout ? 0 : Math.random() * 50 + 10,
        status: timeout ? "timeout" : "success"
      };

      hops.push(hop);
      setTraceResults([...hops]);
    }, 500);
  };

  const stopTraceroute = () => {
    setIsTracing(false);
  };

  const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  const labelBaseClasses = "block mb-1 text-sm font-medium text-gray-400";
  const containerBaseClasses = "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      <Sidebar />

      <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-7xl mx-auto pt-20 lg:pt-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 border-b border-gray-700/50 pb-6">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl shadow-lg">
            <Network className="w-7 h-7 text-white" />
          </div>

          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              Network Diagnostics
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Ping and Traceroute Tools
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className={`${containerBaseClasses} mb-8`}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "ping", label: "Ping", icon: Activity },
              { key: "traceroute", label: "Traceroute", icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === key
                    ? "bg-blue-600 text-white ring-2 ring-blue-500 shadow"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-700/50 border border-gray-700"
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Ping Tab */}
        {activeTab === "ping" && (
          <div className="space-y-6">
            {/* Ping Configuration */}
            <div className={containerBaseClasses}>
              <h2 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                <Globe className="text-blue-400" size={24} />
                Ping Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className={labelBaseClasses}>Target Host or IP</label>
                  <input
                    type="text"
                    value={pingTarget}
                    onChange={(e) => setPingTarget(e.target.value)}
                    className={inputBaseClasses}
                    placeholder="google.com or 8.8.8.8"
                    disabled={isPinging}
                  />
                </div>

                <div>
                  <label className={labelBaseClasses}>Count</label>
                  <input
                    type="number"
                    value={pingCount}
                    onChange={(e) => setPingCount(Number(e.target.value))}
                    className={inputBaseClasses}
                    min="1"
                    max="100"
                    disabled={isPinging}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className={labelBaseClasses}>
                    Interval (ms): {pingInterval}ms
                  </label>
                  <input
                    type="range"
                    value={pingInterval}
                    onChange={(e) => setPingInterval(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    min="100"
                    max="5000"
                    step="100"
                    disabled={isPinging}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {!isPinging ? (
                  <button
                    onClick={startPing}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Play size={20} />
                    Start Ping
                  </button>
                ) : (
                  <button
                    onClick={stopPing}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Square size={20} />
                    Stop Ping
                  </button>
                )}

                <button
                  onClick={() => {
                    setPingResults([]);
                    setPingStats(null);
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all flex items-center gap-2"
                  disabled={isPinging}
                >
                  <RefreshCw size={20} />
                  Clear
                </button>
              </div>
            </div>

            {/* Ping Statistics */}
            {pingStats && (
              <div className={containerBaseClasses}>
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Activity className="text-green-400" size={20} />
                  Statistics
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Packets Sent</div>
                    <div className="text-2xl font-bold text-blue-400">{pingStats.sent}</div>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Received</div>
                    <div className="text-2xl font-bold text-green-400">{pingStats.received}</div>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Lost</div>
                    <div className="text-2xl font-bold text-red-400">{pingStats.lost}</div>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Loss Rate</div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {pingStats.lossPercent.toFixed(1)}%
                    </div>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Min Time</div>
                    <div className="text-2xl font-bold text-cyan-400">
                      {pingStats.minTime.toFixed(1)}ms
                    </div>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Max Time</div>
                    <div className="text-2xl font-bold text-orange-400">
                      {pingStats.maxTime.toFixed(1)}ms
                    </div>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg md:col-span-2">
                    <div className="text-sm text-gray-500 mb-1">Average Time</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {pingStats.avgTime.toFixed(1)}ms
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ping Results */}
            <div className={containerBaseClasses}>
              <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <Server className="text-blue-400" size={20} />
                Results
              </h3>

              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
                {pingResults.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No ping results yet. Configure and start ping above.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pingResults.map((result) => (
                      <div
                        key={result.seq}
                        className={`p-2 rounded flex items-center gap-3 ${
                          result.status === "success"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {result.status === "success" ? (
                          <CheckCircle size={16} className="flex-shrink-0" />
                        ) : (
                          <XCircle size={16} className="flex-shrink-0" />
                        )}

                        <span className="text-gray-400">[{result.timestamp}]</span>
                        <span>seq={result.seq}</span>

                        {result.status === "success" ? (
                          <>
                            <span>ttl={result.ttl}</span>
                            <span>time={result.time.toFixed(2)}ms</span>
                          </>
                        ) : (
                          <span>Request timeout</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Traceroute Tab */}
        {activeTab === "traceroute" && (
          <div className="space-y-6">
            {/* Traceroute Configuration */}
            <div className={containerBaseClasses}>
              <h2 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                <TrendingUp className="text-purple-400" size={24} />
                Traceroute Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelBaseClasses}>Target Host or IP</label>
                  <input
                    type="text"
                    value={traceTarget}
                    onChange={(e) => setTraceTarget(e.target.value)}
                    className={inputBaseClasses}
                    placeholder="google.com or 8.8.8.8"
                    disabled={isTracing}
                  />
                </div>

                <div>
                  <label className={labelBaseClasses}>Max Hops</label>
                  <input
                    type="number"
                    value={traceMaxHops}
                    onChange={(e) => setTraceMaxHops(Number(e.target.value))}
                    className={inputBaseClasses}
                    min="1"
                    max="64"
                    disabled={isTracing}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {!isTracing ? (
                  <button
                    onClick={startTraceroute}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Play size={20} />
                    Start Traceroute
                  </button>
                ) : (
                  <button
                    onClick={stopTraceroute}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Square size={20} />
                    Stop Traceroute
                  </button>
                )}

                <button
                  onClick={() => setTraceResults([])}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all flex items-center gap-2"
                  disabled={isTracing}
                >
                  <RefreshCw size={20} />
                  Clear
                </button>
              </div>
            </div>

            {/* Traceroute Results */}
            <div className={containerBaseClasses}>
              <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <Wifi className="text-purple-400" size={20} />
                Route Trace
              </h3>

              <div className="bg-gray-900 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                {traceResults.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No traceroute results yet. Configure and start traceroute above.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {traceResults.map((hop) => (
                      <div
                        key={hop.hop}
                        className={`p-4 rounded-lg border ${
                          hop.status === "success"
                            ? "bg-gray-800 border-gray-700"
                            : "bg-red-500/5 border-red-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <ChevronRight size={16} className="text-purple-400" />
                            <span className="font-semibold text-purple-400">
                              Hop {hop.hop}
                            </span>
                          </div>

                          {hop.status === "success" ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : (
                            <AlertCircle size={16} className="text-red-400" />
                          )}
                        </div>

                        {hop.status === "success" ? (
                          <>
                            <div className="text-sm text-gray-400 mb-1">
                              <span className="text-blue-400">{hop.ip}</span>
                              {hop.hostname !== "*" && (
                                <span className="ml-2">({hop.hostname})</span>
                              )}
                            </div>

                            <div className="flex gap-4 text-sm font-mono">
                              <span className="text-cyan-400">
                                {hop.time1.toFixed(2)}ms
                              </span>
                              <span className="text-cyan-400">
                                {hop.time2.toFixed(2)}ms
                              </span>
                              <span className="text-cyan-400">
                                {hop.time3.toFixed(2)}ms
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-red-400">
                            * * * Request timed out
                          </div>
                        )}
                      </div>
                    ))}

                    {isTracing && (
                      <div className="text-center text-gray-500 py-4">
                        <RefreshCw className="inline-block animate-spin mr-2" size={16} />
                        Tracing route...
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}