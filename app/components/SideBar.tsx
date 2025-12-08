"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FaTerminal, FaClock, FaHome } from "react-icons/fa";

const sidebarItems = [
  { label: "Bash Command Generator", href: "/bash-command-generator", icon: <FaTerminal /> },
  { label: "Cronjobs Generator", href: "/cronjobs-generator", icon: <FaClock /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6 shadow-2xl flex flex-col gap-6 z-50">
      <nav className="flex flex-col gap-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer shadow-sm
                ${isActive ? "bg-teal-500 text-black font-semibold" : "bg-gray-800 hover:bg-gray-700"}`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}