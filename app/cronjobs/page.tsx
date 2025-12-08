"use client";

import { useState } from "react";
import { Copy, Clock } from "lucide-react";
import Sidebar from "../components/SideBar";

export default function CronGenerator() {
  const [interval, setInterval] = useState("");
  const [command, setCommand] = useState("");
  const [cron, setCron] = useState("");

  const cronPresets: Record<
    string,
    { value: string; description: string; example: string }
  > = {
    "every-minute": {
      value: "* * * * *",
      description: "Runs every minute.",
      example: "*/1 * * * * /usr/bin/php /var/www/artisan schedule:run",
    },
    "every-5-min": {
      value: "*/5 * * * *",
      description: "Runs every 5 minutes.",
      example: "*/5 * * * * curl https://yourapi.com/ping",
    },
    hourly: {
      value: "0 * * * *",
      description: "Runs at the start of every hour.",
      example: "0 * * * * systemctl restart nginx",
    },
    daily: {
      value: "0 0 * * *",
      description: "Runs every day at midnight.",
      example: "0 0 * * * backup.sh",
    },
    weekly: {
      value: "0 0 * * 0",
      description: "Runs every Sunday at midnight.",
      example: "0 0 * * 0 certbot renew --quiet",
    },
    monthly: {
      value: "0 0 1 * *",
      description: "Runs on the 1st day of every month.",
      example: "0 0 1 * * logrotate /etc/logrotate.conf",
    },
    yearly: {
      value: "0 0 1 1 *",
      description: "Runs every January 1st at midnight.",
      example: "0 0 1 1 * echo 'Happy New Year!'",
    },
    "@reboot": {
      value: "@reboot",
      description: "Runs once at system startup.",
      example: "@reboot docker start my_container",
    },
  };

  const generate = () => {
    if (!interval || !command) return;
    setCron(`${cronPresets[interval].value} ${command}`);
  };

  const copy = () => navigator.clipboard.writeText(cron);

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">

      {/* Sidebar Fijo */}
      <div className="fixed left-0 top-0 h-full">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <main className="ml-[260px] w-full p-10 max-w-3xl">

        <div className="flex items-center gap-3 mb-8">
          <Clock className="w-6 h-6 text-black dark:text-white" />
          <h1 className="text-3xl font-bold">Cronjob Generator</h1>
        </div>

        {/* INTERVAL SELECT */}
        <label className="block mb-2 font-semibold text-sm">Interval</label>
        <select
          className="w-full p-3 rounded-lg border mb-4 dark:bg-zinc-900 dark:border-zinc-700"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        >
          <option value="">Select interval</option>
          <option value="every-minute">Every minute</option>
          <option value="every-5-min">Every 5 minutes</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="@reboot">On system startup (@reboot)</option>
        </select>

        {/* DESCRIPTION + EXAMPLE */}
        {interval && (
          <div className="mb-6 bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl">
            <p className="text-sm text-zinc-700 dark:text-zinc-400 mb-2 font-semibold">
              {cronPresets[interval].description}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                Example:
              </span>
              <br />
              <code className="text-xs">{cronPresets[interval].example}</code>
            </p>
          </div>
        )}

        {/* COMMAND INPUT */}
        <label className="block mb-2 font-semibold text-sm">
          Command to execute
        </label>
        <input
          type="text"
          placeholder="e.g., php artisan schedule:run"
          className="w-full p-3 rounded-lg border mb-6 dark:bg-zinc-900 dark:border-zinc-700"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />

        {/* GENERATE BUTTON */}
        <button
          onClick={generate}
          className="w-full py-3 mb-6 bg-black text-white dark:bg-white dark:text-black rounded-xl font-semibold hover:opacity-80 transition"
        >
          Generate Cronjob ✅
        </button>

        {/* OUTPUT */}
        {cron && (
          <div className="relative bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl font-mono text-sm">
            <button
              onClick={copy}
              className="absolute top-2 right-2 p-2 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:scale-105 transition"
            >
              <Copy size={16} />
            </button>
            <pre>{cron}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
