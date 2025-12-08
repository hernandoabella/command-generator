"use client";

import { useState } from "react";
import Sidebar from "../components/SideBar";
import { Copy } from "lucide-react";

const dockerCommands = {
  "Build Image": {
    command: "docker build -t <name> .",
    description: "Builds a Docker image from a Dockerfile.",
    example: "docker build -t myapp .",
  },
  "Run Container": {
    command: "docker run -d -p <port>:<port> <image>",
    description: "Runs a container in detached mode with port mapping.",
    example: "docker run -d -p 3000:3000 myapp",
  },
  "List Containers": {
    command: "docker ps -a",
    description: "Shows all running and stopped containers.",
    example: "docker ps -a",
  },
  "Stop Container": {
    command: "docker stop <container>",
    description: "Stops a running container by name or ID.",
    example: "docker stop myapp",
  },
  "Remove Image": {
    command: "docker rmi <image>",
    description: "Deletes a Docker image by name or ID.",
    example: "docker rmi myapp",
  },
};

export default function DockerGenerator() {
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState<any>(null);

  const generate = () => {
    setResult(dockerCommands[selected]);
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="p-10 w-full">
        <h1 className="text-3xl font-bold mb-6">Docker Command Generator</h1>

        <select
          className="p-3 border rounded-lg w-full mb-6 bg-white dark:bg-zinc-900"
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select a Docker Command</option>
          {Object.keys(dockerCommands).map((cmd) => (
            <option key={cmd}>{cmd}</option>
          ))}
        </select>

        <button
          onClick={generate}
          className="py-3 px-6 bg-black text-white rounded-xl hover:opacity-80"
        >
          Generate
        </button>

        {result && (
          <div className="mt-8 bg-zinc-100 dark:bg-zinc-800 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="mb-4">{result.description}</p>

            <h2 className="text-xl font-bold mb-2">Usage Example</h2>
            <pre className="bg-black text-white p-4 rounded mb-4 text-sm">{result.example}</pre>

            <h2 className="text-xl font-bold mb-2">Generated Command</h2>
            <div className="relative">
              <pre className="p-4 bg-zinc-900 text-white rounded text-sm">{result.command}</pre>
              <button
                className="absolute top-2 right-2 bg-white text-black p-2 rounded"
                onClick={() => navigator.clipboard.writeText(result.command)}
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
