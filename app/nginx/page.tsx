// NginxConfigGenerator.tsx (o tu page.tsx)

"use client";

import { useState, useCallback, useEffect } from "react";
import { Copy, Server, Cloud, Check, Code, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import  Sidebar  from "../components/SideBar"; 

// --- ⚙️ Helper Component for Copy Button ---
// ... (El componente CopyButton se mantiene igual)
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = useCallback(async () => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }, [text]);

    return (
        <motion.button
            onClick={copyToClipboard}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all flex items-center gap-1 ${copied
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-500"
                }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Copiar Comando"
        >
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.div key="check" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                        <Check size={16} />
                    </motion.div>
                ) : (
                    <motion.div key="copy" initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                        <Copy size={16} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};


// --- 📦 Main Nginx Config Generator Component ---

export default function NginxConfigGenerator() {
    // ... (El estado y el useEffect para la lógica se mantienen iguales)
    const [configType, setConfigType] = useState<'proxy' | 'static'>("proxy");
    const [listenPort, setListenPort] = useState("80");
    const [serverName, setServerName] = useState("tudominio.com www.tudominio.com");
    const [proxyPass, setProxyPass] = useState("http://127.0.0.1:3000");
    const [rootPath, setRootPath] = useState("/var/www/html");
    const [indexFile, setIndexFile] = useState("index.html");
    const [enableSecurityHeaders, setEnableSecurityHeaders] = useState(true);
    const [generatedConfig, setGeneratedConfig] = useState("");

    const isProxy = configType === 'proxy';

    useEffect(() => {
        let config = `
server {
    listen ${listenPort};
    server_name ${serverName.trim() || '_'} ;
    
    # Enable HTTP/2 for modern browsers
    # listen ${listenPort} ssl http2; 
    
    ${enableSecurityHeaders ? `
    # Bloque de Seguridad Recomendado
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    ` : ''}

    location / {`;

        if (isProxy) {
            config += `
        # Configuración de Proxy Inverso (Reverse Proxy)
        proxy_pass ${proxyPass.trim()};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
            `;
        } else {
            config += `
        # Servidor de Archivos Estáticos
        root ${rootPath.trim()};
        index ${indexFile.trim()};
        
        # Intentar servir el archivo directamente, si falla, 404
        try_files $uri $uri/ =404;

        # Optimización de caché para activos estáticos (opcional)
        location ~* \\.(css|js|gif|jpe?g|png)$ {
            expires 30d;
            add_header Pragma public;
            add_header Cache-Control "public";
        }
            `;
        }

        config += `
    }
}
        `;

        setGeneratedConfig(config.trim());
    }, [configType, listenPort, serverName, proxyPass, rootPath, indexFile, enableSecurityHeaders, isProxy]);


    return (
        <div className="flex min-h-screen bg-gray-900 text-gray-100">
            {/* Sidebar Componente Agregado Aquí */}
            <Sidebar /> 
            
            {/* Contenido Principal: Agregamos lg:ml-64 y padding para el botón de menú móvil */}
            <main className="w-full max-w-4xl mx-auto p-6 md:p-10 lg:ml-64 pt-20 lg:pt-10">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-8 md:mb-10 border-b border-indigo-700 pb-4"
                >
                    <div className={`p-3 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg`}>
                        <Code className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
                        Generador de Configuración Nginx 🌐
                    </h1>
                </motion.div>

                {/* --- Mode Selection --- */}
                {/* ... (El resto del contenido se mantiene igual) */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">1. Seleccionar Tipo de Configuración</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Proxy Mode */}
                        <button
                            onClick={() => setConfigType('proxy')}
                            className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-1 ${isProxy 
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' 
                                : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50'}`
                            }
                        >
                            <Server size={20} />
                            Proxy Inverso (Backend)
                        </button>
                        
                        {/* Static Mode */}
                        <button
                            onClick={() => setConfigType('static')}
                            className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-1 ${!isProxy 
                                ? 'bg-red-600 text-white shadow-md shadow-red-900/50' 
                                : 'bg-gray-900 text-gray-400 hover:bg-gray-700/50'}`
                            }
                        >
                            <Cloud size={20} />
                            Servir Archivos Estáticos
                        </button>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    
                    {/* --- Input Panel (General) --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl"
                    >
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">2. Configuración Base</h2>
                        
                        {/* Listen Port */}
                        <label className="block mb-1 text-sm font-medium text-gray-400">Puerto de Escucha (listen)</label>
                        <input
                            type="text"
                            placeholder="e.g., 80 o 443"
                            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-shadow mb-4 font-mono"
                            value={listenPort}
                            onChange={(e) => setListenPort(e.target.value)}
                        />

                        {/* Server Name */}
                        <label className="block mb-1 text-sm font-medium text-gray-400">Nombre del Servidor (server_name)</label>
                        <input
                            type="text"
                            placeholder="e.g., tudominio.com"
                            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-shadow mb-4 font-mono"
                            value={serverName}
                            onChange={(e) => setServerName(e.target.value)}
                        />

                        {/* Security Toggle */}
                        <div 
                            onClick={() => setEnableSecurityHeaders(!enableSecurityHeaders)}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors mt-4 ${enableSecurityHeaders ? 'bg-emerald-900/50 border border-emerald-600' : 'bg-gray-900 border border-gray-700 hover:bg-gray-700/50'}`}
                        >
                            <Globe size={20} className={`mr-3 ${enableSecurityHeaders ? 'text-emerald-400' : 'text-gray-500'}`} />
                            <div className="flex-1">
                                <span className="text-base font-medium">Cabeceras de Seguridad (XSS, Frames)</span>
                                <p className="text-xs mt-1 text-gray-400">Recomendado para protección básica contra ataques.</p>
                            </div>
                            <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${enableSecurityHeaders ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                                <motion.div 
                                    layout 
                                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${enableSecurityHeaders ? 'translate-x-5' : 'translate-x-0'}`}
                                />
                            </div>
                        </div>

                    </motion.div>

                    {/* --- Input Panel (Specific to Type) --- */}
                    <motion.div
                        key={configType} // Key change forces re-animation
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl ${isProxy ? 'border-indigo-600' : 'border-red-600'}`}
                    >
                        <h2 className={`text-xl font-semibold mb-4 ${isProxy ? 'text-indigo-400' : 'text-red-400'}`}>
                            {isProxy ? '3. Opciones de Proxy Inverso' : '3. Opciones de Estáticos'}
                        </h2>

                        {isProxy ? (
                            <>
                                {/* Proxy Pass */}
                                <label className="block mb-1 text-sm font-medium text-gray-400">Destino del Backend (proxy_pass)</label>
                                <input
                                    type="text"
                                    placeholder="e.g., http://localhost:8080"
                                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-shadow mb-4 font-mono"
                                    value={proxyPass}
                                    onChange={(e) => setProxyPass(e.target.value)}
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Esta URL es el destino real, normalmente una aplicación Node, Python o Java.
                                </p>
                            </>
                        ) : (
                            <>
                                {/* Root Path */}
                                <label className="block mb-1 text-sm font-medium text-gray-400">Ruta Raíz (root)</label>
                                <input
                                    type="text"
                                    placeholder="e.g., /var/www/my-app/build"
                                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 transition-shadow mb-4 font-mono"
                                    value={rootPath}
                                    onChange={(e) => setRootPath(e.target.value)}
                                />
                                
                                {/* Index File */}
                                <label className="block mb-1 text-sm font-medium text-gray-400">Archivos Índice (index)</label>
                                <input
                                    type="text"
                                    placeholder="e.g., index.html"
                                    className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 transition-shadow mb-4 font-mono"
                                    value={indexFile}
                                    onChange={(e) => setIndexFile(e.target.value)}
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    El comando `try_files` asegura que la URL funcione (sirve el archivo, el directorio o retorna 404).
                                </p>
                            </>
                        )}
                    </motion.div>
                </div>
                
                {/* --- Generated Output --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`relative bg-gradient-to-br from-black to-gray-900 rounded-xl border border-indigo-700 shadow-2xl p-6`}
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-3">4. Bloque de Configuración Nginx</h2>
                    
                    <div className="relative group">
                        <pre className="bg-gray-800 p-4 rounded-xl font-mono text-sm md:text-base text-gray-100 border border-indigo-500 overflow-x-auto pr-16">
                            {generatedConfig}
                        </pre>

                        <CopyButton text={generatedConfig} />
                    </div>
                    
                    <p className="text-sm text-gray-400 mt-4">
                        Guarda este bloque en un archivo `.conf` (ej. `/etc/nginx/conf.d/tudominio.conf`) y recarga Nginx (`sudo nginx -s reload`).
                    </p>
                    
                </motion.div>
            </main>
        </div>
    );
}