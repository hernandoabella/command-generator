"use client";

import { useState } from "react";
import Sidebar from "../components/SideBar"; // your existing sidebar
import { Copy, User } from "lucide-react";

const commands = {
  "Create User": {
    command: (target: string) => `sudo useradd ${target}`,
    description: "Creates a new user without a home directory or password.",
    example: "sudo useradd john",
  },
  "Create User + Home": {
    command: (target: string) => `sudo useradd -m ${target}`,
    description: "Creates a new user with a default home directory.",
    example: "sudo useradd -m john",
  },
  "Delete User": {
    command: (target: string) => `sudo userdel ${target}`,
    description: "Deletes a user (does NOT remove the home directory).",
    example: "sudo userdel john",
  },
  "Delete User + Home": {
    command: (target: string) => `sudo userdel -r ${target}`,
    description: "Deletes a user and removes their home directory.",
    example: "sudo userdel -r john",
  },
  "Set User Password": {
    command: (target: string) => `sudo passwd ${target}`,
    description: "Sets or updates the user's password.",
    example: "sudo passwd john",
  },
  "Lock User": {
    command: (target: string) => `sudo usermod -L ${target}`,
    description: "Disables a user account (password locked).",
    example: "sudo usermod -L john",
  },
  "Unlock User": {
    command: (target: string) => `sudo usermod -U ${target}`,
    description: "Re-enables a locked user account.",
    example: "sudo usermod -U john",
  },
  "Add to Group": {
    command: (target: string) => `sudo usermod -aG sudo ${target}`,
    description: "Adds user to sudo group (or modify group manually).",
    example: "sudo usermod -aG sudo john",
  },
};

export default function UserManagement() {
  const [selected, setSelected] = useState<string>("");
  const [target, setTarget] = useState("");
  const [output, setOutput] = useState("");
  const [desc, setDesc] = useState("");
  const [example, setExample] = useState("");

  const generate = () => {
    if (!selected || !target) return;

    const cmd = commands[selected].command(target);
    setOutput(cmd);
    setDesc(commands[selected].description);
    setExample(commands[selected].example);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-black">
      <Sidebar />

      {/* LEFT SPACE because sidebar is fixed */}
      <div className="flex-1 ml-64 p-10">
        <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 p-10 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-black dark:text-white" />
            <h1 className="text-3xl font-bold">Linux User Management Generator</h1>
          </div>

          {/* Select command */}
          <select
            className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent mb-6"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select a User Command</option>
            {Object.keys(commands).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>

          {/* Target input */}
          <input
            type="text"
            placeholder="Username (e.g., john)"
            className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent mb-6"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />

          {/* Generate Button */}
          <button
            onClick={generate}
            className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-xl font-semibold hover:opacity-80"
          >
            Generate Command
          </button>

          {/* Output */}
          {output && (
            <div className="mt-8 p-5 bg-zinc-200 dark:bg-zinc-800 rounded-xl relative font-mono text-sm">
              <button
                onClick={copy}
                className="absolute top-2 right-2 bg-black text-white dark:bg-white dark:text-black p-2 rounded-lg hover:scale-105 transition"
              >
                <Copy size={14} />
              </button>

              <pre>{output}</pre>
            </div>
          )}

          {/* Description */}
          {desc && (
            <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-700 rounded-xl">
              <h2 className="font-semibold text-lg mb-2">Description</h2>
              <p className="text-zinc-700 dark:text-zinc-300">{desc}</p>
            </div>
          )}

          {/* Example */}
          {example && (
            <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-700 rounded-xl">
              <h2 className="font-semibold text-lg mb-2">Example Usage</h2>
              <pre className="font-mono text-sm">{example}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
