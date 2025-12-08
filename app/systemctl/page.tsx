"use client";

import { useState } from "react";
import Sidebar from "../components/SideBar";
import { Copy, Cog } from "lucide-react";

export default function SystemctlGenerator() {
  const [serviceName, setServiceName] = useState("");
  const [execStart, setExecStart] = useState("");
  const [description, setDescription] = useState("");
  const [generated, setGenerated] = useState("");

  const generateService = () => {
    if (!serviceName || !execStart) return;

    const serviceFile = `[Unit]
Description=${description || `${serviceName} service`}
After=network.target

[Service]
Type=simple
ExecStart=${execStart}
Restart=always
User=root

[Install]
WantedBy=multi-user.target`;

    setGenerated(serviceFile);
  };

  const copy = () => {
    if (generated) navigator.clipboard.writeText(generated);
  };

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-black">
      <Sidebar />

      {/* LEFT SPACING BECAUSE NAVBAR IS FIXED */}
      <main className="flex-1 pl-64 p-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Cog className="w-8 h-8 text-black dark:text-white" />
            <h1 className="text-3xl font-bold dark:text-white">
              Systemctl Service Generator
            </h1>
          </div>

          {/* FORM */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-xl">
            <input
              type="text"
              placeholder="Service Name (e.g., myapp)"
              className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent mb-4"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />

            <input
              type="text"
              placeholder="ExecStart command (e.g., /usr/bin/node /app/server.js)"
              className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent mb-4"
              value={execStart}
              onChange={(e) => setExecStart(e.target.value)}
            />

            <input
              type="text"
              placeholder="Description (optional)"
              className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent mb-6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              onClick={generateService}
              className="w-full py-3 bg-black text-white dark:bg-white dark:text-black rounded-lg font-semibold hover:opacity-80"
            >
              Generate Service File
            </button>
          </div>

          {/* GENERATED OUTPUT */}
          {generated && (
            <div className="relative mt-8 bg-zinc-100 dark:bg-zinc-900 p-6 rounded-xl font-mono text-sm whitespace-pre-wrap">
              <button
                onClick={copy}
                className="absolute top-2 right-2 bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-lg text-xs hover:opacity-80"
              >
                <Copy size={14} />
              </button>

              {generated}
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="mt-12 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-3 dark:text-white">
              How to Use This Service
            </h2>

            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              After generating your service file, save it in:
            </p>

            <pre className="bg-zinc-200 dark:bg-zinc-800 p-3 rounded-lg mb-4">
              /etc/systemd/system/{serviceName || "your-service"}.service
            </pre>

            <h3 className="text-lg font-semibold dark:text-white mb-2">
              Enable & Start the service:
            </h3>

            <pre className="bg-zinc-200 dark:bg-zinc-800 p-3 rounded-lg">
systemctl daemon-reload
systemctl enable {serviceName || "your-service"}
systemctl start {serviceName || "your-service"}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
