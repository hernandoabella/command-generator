"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
  FaChevronLeft,
  FaChevronRight,
  FaTools
} from "react-icons/fa";
import { useState } from "react";

// Simplified list of items without categories or custom colors
const sidebarItems = [
  { label: "192.168.1.1", href: "/", icon: <FaHome /> },
  { label: "Bash", href: "/bash", icon: <FaTerminal /> },
  { label: "chmod", href: "/chmod", icon: <FaShieldAlt /> },
  { label: "chown", href: "/chown", icon: <FaServer /> },
  { label: "Cronjobs", href: "/cronjobs", icon: <FaClock /> },
  { label: "Git", href: "/git", icon: <FaGit /> },
  { label: "Docker", href: "/docker", icon: <FaDocker /> },
  { label: "Dockerfile", href: "/dockerfile", icon: <FaCogs /> },
  { label: "User Management", href: "/linux-user-managment", icon: <FaUserCog /> },
  { label: "SSH", href: "/ssh", icon: <FaShieldAlt /> }, // Reusing FaShieldAlt for simplicity
  { label: "TMUX", href: "/tmux", icon: <FaColumns /> },
  { label: "systemctl", href: "/systemctl", icon: <FaServer /> },
  { label: "rsync", href: "/rsync", icon: <FaServer /> },
  { label: "grep", href: "/grep", icon: <FaServer /> },
  { label: "sed and awk", href: "/sed-and-awk", icon: <FaServer /> },
  { label: "nginx", href: "/nginx", icon: <FaServer /> },
];

export default function SimpleSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const linkVariants = {
    collapsed: { opacity: 0, width: 0, transition: { duration: 0.1 } },
    expanded: { opacity: 1, width: "auto", transition: { duration: 0.3 } }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isCollapsed ? "80px" : "240px",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full bg-gray-900 text-white z-50 flex flex-col border-r border-gray-800"
    >
      {/* Header with Logo and Toggle Button */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500 rounded-lg">
            <FaTools className="text-xl" />
          </div>
          <motion.h1
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={linkVariants}
            className="font-bold text-lg whitespace-nowrap overflow-hidden"
          >
            Tools
          </motion.h1>
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors absolute right-[-14px]"
        >
          {isCollapsed ? (
            <FaChevronRight className="text-gray-300 w-4 h-4" />
          ) : (
            <FaChevronLeft className="text-gray-300 w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
            >
              <div
                className={`flex items-center gap-4 py-3 rounded-xl transition-colors mx-2 cursor-pointer
                  ${isActive 
                    ? "bg-teal-500/20 text-teal-400 font-semibold" 
                    : "hover:bg-gray-800 text-gray-300 hover:text-white"
                  }
                  ${isCollapsed ? "justify-center px-0" : "px-4"}
                `}
              >
                {/* Icon */}
                <div className={`text-xl transition-transform ${isActive ? "scale-110" : ""}`}>
                  {item.icon}
                </div>

                {/* Label */}
                <motion.span
                  animate={isCollapsed ? "collapsed" : "expanded"}
                  variants={linkVariants}
                  className="font-medium whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}