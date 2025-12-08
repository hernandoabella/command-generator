"use client";

import { useState } from "react";
import Sidebar from "../components/SideBar";
import { Copy } from "lucide-react";

export default function SSHKeyGenerator() {
  const [type, setType] = useState("rsa");
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");

  const generateKey = () => {
    const timestamp = Date.now().toString(36);
    const fakeKey = `ssh-${type} AAAAB3NzaC1yc2${timestamp}== ${email}`;
    setKey(fakeKey);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(key);
  };

  // === DESCRIPTIONS ===
  const descriptions: Record<string, string> = {
    rsa: "RSA keys are the traditional and widely supported SSH key type. Good compatibility.",
    ed25519: "ED25519 keys are modern, more secure, and recommended for most cases.",
    ecdsa: "ECDSA keys offer good performance, but compatibility may vary depending on systems."
  };

  // === USAGE EXAMPLES ===
  const usageExamples: Record<string, string> = {
    rsa: `ssh-keygen -t rsa -b 4096 -C "${email}"`,
    ed25519: `ssh-keygen -t ed25519 -C "${email}"`,
    ecdsa: `ssh-keygen -t ecdsa -b 521 -C "${email}"`,
  };

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-black">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">
          SSH Key Generator
        </h1>

        <div className="max-w-xl bg-white dark:bg-zinc-900 p-8 rounded-xl shadow">
          {/* TYPE SELECTOR */}
          <label className="font-semibold text-sm dark:text-white">Key Type</label>
          <select
            className="w-full p-3 mt-1 mb-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 dark:text-white"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="rsa">RSA (4096 bits)</option>
            <option value="ed25519">ED25519 (recommended)</option>
            <option value="ecdsa">ECDSA (521 bits)</option>
          </select>

          {/* EMAIL INPUT */}
          <label className="font-semibold text-sm dark:text-white">
            Email (comment)
          </label>

          <input
            type="email"
            placeholder="your-email@example.com"
            className="w-full p-3 mt-1 mb-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* GENERATE BUTTON */}
          <button
            onClick={generateKey}
            className="w-full py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-semibold hover:opacity-80"
          >
            Generate SSH Key
          </button>

          {/* DESCRIPTION */}
          {email && (
            <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              <h2 className="font-semibold text-lg mb-2 dark:text-white">Description</h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                {descriptions[type]}
              </p>

              <h3 className="font-semibold mt-4 dark:text-white">Usage Example:</h3>
              <pre className="mt-2 p-3 bg-black text-white rounded-lg text-sm overflow-auto">
                {usageExamples[type]}
              </pre>
            </div>
          )}

          {/* OUTPUT */}
          {key && (
            <div className="mt-6 relative">
              <label className="font-semibold text-sm dark:text-white">
                Generated Public Key
              </label>

              <div className="mt-2 p-4 bg-zinc-200 dark:bg-zinc-800 rounded-xl font-mono text-sm">
                <button
                  onClick={copyToClipboard}
                  className="absolute right-3 top-3 p-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:scale-105"
                >
                  <Copy size={16} />
                </button>
                <pre className="whitespace-pre-wrap break-all">{key}</pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
