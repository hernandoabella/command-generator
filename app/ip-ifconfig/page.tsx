"use client";

import { useState, useCallback, useEffect } from "react";
// Asegúrate de que la ruta al Sidebar sea correcta según tu estructura de archivos
import Sidebar from "../components/SideBar"; 
import { Copy, Wifi, Check, ChevronDown, ChevronUp, Network, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Component for Copyable Command ---
/**
 * Componente que muestra un comando y un botón de copiado con feedback visual.
 */
const CopyableCommand: React.FC<{ command: string, onCopy: (text: string) => void, commandName: string }> = ({ command, onCopy, commandName }) => {
    const [localCopied, setLocalCopied] = useState(false);

    const handleCopy = () => {
        onCopy(command);
        setLocalCopied(true);
        setTimeout(() => setLocalCopied(false), 2000);
    };

    // Color principal para IP/IFCONFIG es púrpura (Networking/OS)
    const primaryColorClass = "bg-purple-600 hover:bg-purple-500"; 

    return (
        <div className="relative bg-gray-900 p-3 rounded-lg font-mono text-sm text-gray-300 border border-gray-700 mb-2 flex items-center justify-between">
            <span className={`select-none ${commandName === 'ip' ? 'text-violet-400' : 'text-purple-400'}`}>$ </span>
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
export default function IpIfconfigCommandGenerator() {
    const [commandType, setCommandType] = useState<'ip' | 'ifconfig'>('ip');
    
    const [action, setAction] = useState('addr_show'); // ip: addr_show, route_show, link_up/down | ifconfig: show, up/down
    const [interfaceName, setInterfaceName] = useState("eth0");
    const [ipAddress, setIpAddress] = useState("");
    
    const [generatedCommand, setGeneratedCommand] = useState("");
    const [copied, setCopied] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Auto-generate command logic
    useEffect(() => {
        let cmd = "sudo ";
        const iface = interfaceName.trim() || "eth0";

        if (commandType === 'ip') {
            cmd += 'ip ';
            
            if (action === 'addr_show') {
                cmd += `addr show ${iface}`;
            } else if (action === 'route_show') {
                cmd = 'ip route show';
            } else if (action === 'link_up') {
                cmd += `link set dev ${iface} up`;
            } else if (action === 'link_down') {
                cmd += `link set dev ${iface} down`;
            } else if (action === 'addr_add' && ipAddress.trim()) {
                cmd += `addr add ${ipAddress.trim()}/24 dev ${iface}`; // Defaulting to /24 for example
            } else {
                 // Default to show all interfaces
                cmd = 'ip addr show';
            }

        } else if (commandType === 'ifconfig') {
            cmd += 'ifconfig ';
            
            if (action === 'addr_show') {
                cmd = `ifconfig ${iface}`;
            } else if (action === 'route_show') {
                cmd = 'route -n'; // ifconfig doesn't handle routing, must use `route`
            } else if (action === 'link_up') {
                cmd += `${iface} up`;
            } else if (action === 'link_down') {
                cmd += `${iface} down`;
            } else if (action === 'addr_add' && ipAddress.trim()) {
                cmd += `${iface} ${ipAddress.trim()} netmask 255.255.255.0`; // Defaulting to /24 (netmask)
            } else {
                // Default to show all interfaces
                cmd = 'ifconfig';
            }
        }
        
        setGeneratedCommand(cmd.trim().replace(/\s+/g, ' '));
    }, [commandType, action, interfaceName, ipAddress]);

    // Copy to Clipboard logic
    const copyToClipboard = useCallback(async (text: string) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }, []);

    const inputBaseClasses = "w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 transition-shadow outline-none";
    const labelBaseClasses = "block mb-1 text-sm font-medium text-gray-400";
    const containerBaseClasses = "bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-xl";
    

    return (
        // Dark Mode Base Styling
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
            <Sidebar />

            <main className="ml-0 lg:ml-64 p-6 md:p-10 w-full max-w-6xl mx-auto pt-20 lg:pt-10">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-8 md:mb-10 border-b border-gray-700/50 pb-6"
                >
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-lg">
                        <Globe className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent leading-tight">
                        `ip` vs `ifconfig` Command Generator
                    </h1>
                </motion.div>

                {/* --- Command Selection --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${containerBaseClasses} mb-8 border-purple-700/30`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Select Command Type</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {['ip', 'ifconfig'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setCommandType(m as 'ip' | 'ifconfig')}
                                className={`py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase ${commandType === m 
                                    ? 'bg-purple-600 text-white shadow-xl shadow-purple-900/50 transform scale-[1.01] ring-2 ring-purple-500' 
                                    : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700'}`
                                }
                            >
                                <Network className="w-5 h-5"/>
                                {m.toUpperCase()} ({m === 'ip' ? 'Modern' : 'Legacy'})
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* --- Action and Interface Inputs --- */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${containerBaseClasses} h-full`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-6">Action & Interface</h2>

                        <div className="space-y-5">
                            
                            {/* Action Selection */}
                            <div>
                                <label className={labelBaseClasses}>Network Action</label>
                                <div className="relative">
                                    <select value={action} onChange={(e) => setAction(e.target.value)} className={inputBaseClasses}>
                                        <option value="addr_show">Show IP Address (interface)</option>
                                        <option value="route_show">Show Routing Table</option>
                                        <option value="link_up">Bring Interface UP</option>
                                        <option value="link_down">Bring Interface DOWN</option>
                                        <option value="addr_add">Add IP Address</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Interface Name */}
                            {(action !== 'route_show') && (
                                <motion.div
                                    key="interface-input"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <label className={labelBaseClasses}>Interface Name</label>
                                    <input type="text" placeholder="eth0, enp0s3, lo" value={interfaceName} onChange={(e) => setInterfaceName(e.target.value)} className={inputBaseClasses} />
                                </motion.div>
                            )}
                            
                            {/* IP Address Input */}
                            {(action === 'addr_add') && (
                                <motion.div
                                    key="ip-input"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <label className={labelBaseClasses}>New IP Address</label>
                                    <input type="text" placeholder="192.168.1.100/24" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} className={inputBaseClasses} />
                                    <p className="text-xs text-gray-500 mt-1">For `ifconfig`, enter `IP` and the command uses a `255.255.255.0` mask.</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Output Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`${containerBaseClasses} h-full flex flex-col`}
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Generated Command</h2>
                        
                        <div className="flex-1 flex flex-col justify-end">
                            <AnimatePresence mode="wait">
                                {generatedCommand ? (
                                    <motion.div
                                        key="output-cmd"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative"
                                    >
                                        <CopyableCommand command={generatedCommand} onCopy={copyToClipboard} commandName={commandType} />
                                        
                                        <div className="mt-4 p-4 bg-gray-900 rounded-xl border border-gray-700">
                                            <p className="text-sm text-gray-400 font-semibold mb-2">Note:</p>
                                            <ul className="text-xs text-gray-500 list-disc list-inside">
                                                <li>**Sudo:** La mayoría de las acciones de configuración (cambiar estado, añadir IP) requieren privilegios de superusuario (`sudo`).</li>
                                                <li>**`ip` vs `ifconfig`:** **`ip`** maneja direcciones (`addr`), enlaces (`link`) y rutas (`route`) en comandos separados, mientras que **`ifconfig`** intenta agrupar todo en un solo comando.</li>
                                                {action === 'route_show' && commandType === 'ifconfig' && <li>**Nota de `ifconfig`:** No puede mostrar la tabla de enrutamiento; se sustituye por `route -n`.</li>}
                                            </ul>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                                        Select an action to generate the command.
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
                
                {/* --- Reference Guide --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`${containerBaseClasses}`}
                >
                    <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setIsGuideOpen(!isGuideOpen)}
                    >
                        <h2 className="text-xl font-bold text-purple-400">📚 `ip` vs `ifconfig` Reference</h2>
                        <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                            {isGuideOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {isGuideOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-gray-700 overflow-hidden space-y-6 text-sm text-gray-300"
                            >
                                
                                <h3 className="font-semibold text-lg text-white">Why use `ip`?</h3>
                                <p className="text-gray-400">
                                    **`ip`** (parte del paquete iproute2) es el comando de red estándar en Linux moderno. Es más potente, más rápido, y reemplaza a `ifconfig`, `route`, `arp` y `netstat` (aunque `ss` es la alternativa preferida para `netstat`).
                                </p>

                                <h3 className="font-semibold text-lg text-white">Key `ip` Commands</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-900 p-4 rounded-xl border border-violet-700/50">
                                        <p className="font-medium text-violet-300">Add Default Gateway</p>
                                        <p className="text-gray-400 mb-2">Establece la ruta predeterminada de salida de tráfico.</p>
                                        <CopyableCommand command="sudo ip route add default via 192.168.1.1" onCopy={copyToClipboard} commandName="ip" />
                                    </div>

                                    <div className="bg-gray-900 p-4 rounded-xl border border-violet-700/50">
                                        <p className="font-medium text-violet-300">Change MAC Address</p>
                                        <p className="text-gray-400 mb-2">Primero baja la interfaz, cambia la MAC, luego sube la interfaz.</p>
                                        <CopyableCommand command="sudo ip link set dev eth0 address 00:11:22:33:44:55" onCopy={copyToClipboard} commandName="ip" />
                                    </div>
                                </div>
                                
                                <h3 className="font-semibold text-lg text-white">Ifconfig Usage (Legacy)</h3>
                                <div className="bg-gray-900 p-4 rounded-xl border border-purple-700/50">
                                    <p className="font-medium text-purple-300">Remove an IP Address</p>
                                    <p className="text-gray-400 mb-2">Quita una dirección IP existente. (En `ip` se usa `ip addr del`).</p>
                                    <CopyableCommand command="sudo ifconfig eth0 192.168.1.100 down" onCopy={copyToClipboard} commandName="ifconfig" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>
        </div>
    );
}