"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaTerminal, 
    FaClock, 
    FaHome, 
    FaGit, 
    FaDocker, 
    FaShieldAlt,
    FaColumns,
    FaCogs,
    FaServer,
    FaUserCog,
    FaTools,
    FaFolderOpen,
    FaExchangeAlt,
    FaNetworkWired,
    FaFileArchive,
    FaChartBar,
    FaChevronDown
} from "react-icons/fa";
import { JSX } from "react";

interface SidebarItem {
    label: string;
    href: string;
    icon: JSX.Element;
}

interface SidebarCategory {
    name: string;
    icon: JSX.Element;
    items: SidebarItem[];
}

import { 
 FaCloud 
} from "react-icons/fa";
import { IoSettings, IoStatsChart } from "react-icons/io5";

export const categorizedItems: SidebarCategory[] = [
  {
    name: "Essentials",
    icon: <FaHome />,
    items: [{ label: "Home", href: "/", icon: <FaHome /> }],
  },
  {
    name: "Core Linux/Unix",
    icon: <FaTerminal />,
    items: [
      { label: "Bash", href: "/bash", icon: <FaTerminal /> },
      { label: "TMUX", href: "/tmux", icon: <FaColumns /> },
      { label: "Cronjobs", href: "/cronjobs", icon: <FaClock /> },
      { label: "systemctl", href: "/systemctl", icon: <FaServer /> },
      { label: "cat / echo", href: "/cat-echo", icon: <FaTerminal /> },
      { label: "find", href: "/find", icon: <FaFolderOpen /> },
      { label: "Process Management", href: "/processes", icon: <IoSettings /> },
    ],
  },
  {
    name: "Text/File Processing",
    icon: <FaExchangeAlt />,
    items: [
      { label: "grep", href: "/grep", icon: <FaExchangeAlt /> },
      { label: "sed / awk", href: "/sed-and-awk", icon: <FaExchangeAlt /> },
      { label: "cut / paste", href: "/cut-paste", icon: <FaColumns /> },
      { label: "sort / uniq", href: "/sort-uniq", icon: <FaExchangeAlt /> },
    ],
  },
  {
    name: "Networking",
    icon: <FaNetworkWired />,
    items: [
      { label: "netstat / ss", href: "/netstat-ss", icon: <FaNetworkWired /> },
      { label: "curl / wget", href: "/curl-wget", icon: <FaServer /> },
      { label: "ip / ifconfig", href: "/ip-ifconfig", icon: <FaNetworkWired /> },
      { label: "Ping / Traceroute", href: "/ping-traceroute", icon: <IoStatsChart /> },
      { label: "DNS Tools", href: "/dns-tools", icon: <IoStatsChart /> },
    ],
  },
  {
    name: "Permissions & Users",
    icon: <FaShieldAlt />,
    items: [
      { label: "chmod", href: "/chmod", icon: <FaShieldAlt /> },
      { label: "chown", href: "/chown", icon: <FaShieldAlt /> },
      { label: "User Management", href: "/linux-user-management", icon: <FaUserCog /> },
      { label: "SSH", href: "/ssh", icon: <FaShieldAlt /> },
    ],
  },
  {
    name: "Package Management",
    icon: <FaCogs />,
    items: [
      { label: "apt / dpkg", href: "/apt-dpkg", icon: <FaCogs /> },
      { label: "yum / rpm", href: "/yum-rpm", icon: <FaCogs /> },
    ],
  },
  {
    name: "Archiving & Compression",
    icon: <FaFileArchive />,
    items: [
      { label: "tar", href: "/tar", icon: <FaFileArchive /> },
      { label: "gzip / bzip2", href: "/gzip-bzip2", icon: <FaFileArchive /> },
      { label: "zip / unzip", href: "/zip-unzip", icon: <FaFileArchive /> },
    ],
  },
  {
    name: "Monitoring & Utilities",
    icon: <FaChartBar />,
    items: [
      { label: "top / htop", href: "/top-htop", icon: <FaChartBar /> },
      { label: "df / du", href: "/df-du", icon: <FaFolderOpen /> },
      { label: "journalctl", href: "/journalctl", icon: <FaClock /> },
      { label: "Logs & Debugging", href: "/logs-debugging", icon: <IoStatsChart /> },
      { label: "System Info", href: "/system-info", icon: <IoStatsChart /> },
    ],
  },
  {
    name: "DevOps / Containers",
    icon: <FaDocker />,
    items: [
      { label: "Git", href: "/git", icon: <FaGit /> },
      { label: "Docker CLI", href: "/docker", icon: <FaDocker /> },
      { label: "Dockerfile", href: "/dockerfile", icon: <FaCogs /> },
      { label: "Docker Compose", href: "/docker-compose", icon: <FaCogs /> },
      { label: "nginx", href: "/nginx", icon: <FaServer /> },
      { label: "Kubernetes", href: "/kubernetes", icon: <FaCloud /> },
    ],
  },
];


export default function SimpleSidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState<Record<string, boolean>>({});

    // 👉 Auto-abrir categoría correcta según URL activa
    useEffect(() => {
        categorizedItems.forEach((cat) => {
            const shouldOpen = cat.items.some((item) => item.href === pathname);

            if (shouldOpen) {
                setOpen((prev) => ({ ...prev, [cat.name]: true }));
            }
        });
    }, [pathname]);

    const toggleOpen = (category: string) => {
        setOpen((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    return (
        <>
            <aside className="fixed left-0 top-0 h-full z-50 flex flex-col bg-gray-900 w-72 border-r border-gray-800">

                {/* Header */}
                <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gray-800 rounded-lg">
                            <FaTools className="text-xl text-gray-300" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-gray-100">
                                Command Toolbox
                            </h1>
                            <p className="text-xs text-gray-400 font-medium">
                                Useful for command nerds
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                    {categorizedItems.map((category) => {
                        const isOpen = open[category.name];

                        return (
                            <div key={category.name}>
                                
                                {/* Category Header */}
                                <button
                                    onClick={() => toggleOpen(category.name)}
                                    className="w-full flex items-center justify-between px-1 mb-1 text-gray-400 hover:text-gray-200 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        {category.icon}
                                        <span className="text-sm font-semibold">{category.name}</span>
                                    </div>

                                    <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <FaChevronDown className="text-xs" />
                                    </motion.div>
                                </button>

                                {/* Collapsible Items */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden space-y-0.5"
                                        >
                                            {category.items.map((item) => {
                                                const isActive = pathname === item.href;

                                                return (
                                                    <Link key={item.href} href={item.href}>
                                                        <div
                                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                                                isActive
                                                                    ? "bg-blue-900/30 text-blue-400 border-l-2 border-blue-500"
                                                                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                                                            }`}
                                                        >
                                                            <div
                                                                className={
                                                                    isActive
                                                                        ? "text-blue-400"
                                                                        : "text-gray-400"
                                                                }
                                                            >
                                                                {item.icon}
                                                            </div>

                                                            <span className="text-sm font-medium truncate">
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </aside>

            <div className="hidden lg:block w-72" />
        </>
    );
}
