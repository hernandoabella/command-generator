"use client";

import { useState } from "react";
import Sidebar from "../components/SideBar"; 
import { Copy, Terminal } from "lucide-react";

type TmuxCommand = {
  command: string;
  description: string;
  example: string;
};

const TMUX_COMMANDS: Record<string, TmuxCommand> = {
  "Create Session": {
    command: "tmux new -s session_name",
    description: "Creates a new TMUX session with a custom name.",
    example: "tmux new -s myapp",
  },
  "List Sessions": {
    command: "tmux ls",
    description: "Displays all active TMUX sessions.",
    example: "tmux ls",
  },
  "Attach Session": {
    command: "tmux attach -t session_name",
    description: "Attach to an existing TMUX session.",
    example: "tmux attach -t myapp",
  },
  "Detach": {
    command: "Ctrl+b d",
    description: "Detaches from the current session and returns to the shell.",
    example: "Press Ctrl+b then press d",
  },
  "Rename Session": {
    command: "tmux rename-session -t old_name new_name",
    description: "Renames a TMUX session.",
    example: "tmux rename-session -t myapp main_session",
  },
  "Kill Session": {
    command: "tmux kill-session -t session_name",
    description: "Terminates a TMUX session.",
    example: "tmux kill-session -t myapp",
  },
  "Split Pane (Horizontal)": {
    command: "tmux split-window -h",
    description: "Splits the current pane horizontally.",
    example: "tmux split-window -h",
  },
  "Split Pane (Vertical)": {
    command: "tmux split-window -v",
    description: "Splits the current pane vertically.",
    example: "tmux split-window -v",
  },
  "List Key Bindings": {
    command: "tmux list-keys",
    description: "Shows all TMUX key bindings.",
    example: "tmux list-keys",
  },
};

export default function TmuxGenerator() {
  const [selected, setSelected] = useState<string>("");
  const [generatedCommand, setGeneratedCommand] = useState<string>("");

  const handleSelect = (value: string) => {
    setSelected(value);
    setGeneratedCommand(TMUX_COMMANDS[value].command);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCommand);
  };

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-black text-black dark:text-white">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex flex-col flex-1 p-10">
        <div className="flex items-center gap-3 mb-8">
          <Terminal className="w-6 h-6" />
          <h1 className="text-3xl font-bold tracking-tight">
            TMUX Command Generator
          </h1>
        </div>

        {/* SELECTOR */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Choose a TMUX action:</label>
          <select
            className="w-full p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
            value={selected}
            onChange={(e) => handleSelect(e.target.value)}
          >
            <option value="">Select an action</option>
            {Object.keys(TMUX_COMMANDS).map((cmd) => (
              <option key={cmd} value={cmd}>
                {cmd}
              </option>
            ))}
          </select>
        </div>

        {/* DESCRIPTION */}
        {selected && (
          <div className="mb-6 p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700">
            <h2 className="text-xl font-bold mb-2">{selected}</h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              {TMUX_COMMANDS[selected].description}
            </p>

            <div className="mt-4 bg-zinc-200 dark:bg-zinc-800 p-4 rounded-lg font-mono text-sm">
              <span className="font-semibold">Example:</span>
              <pre className="mt-2">{TMUX_COMMANDS[selected].example}</pre>
            </div>
          </div>
        )}

        {/* COMMAND BOX */}
        {generatedCommand && (
          <div className="relative bg-zinc-900 text-white p-5 rounded-xl font-mono text-sm">
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-2 bg-white text-black rounded-lg hover:scale-105 transition"
            >
              <Copy size={16} />
            </button>

            <pre>{generatedCommand}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
