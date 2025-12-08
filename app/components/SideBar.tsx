"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTerminal, 
  FaClock, 
  FaHome, 
  FaGit, 
  FaDocker, 
  FaLinux, 
  FaFingerprint,
  FaColumns,
  FaCogs,
  FaServer,
  FaUserCog,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTools
} from "react-icons/fa";
import { useState, useEffect } from "react";

// Group items by category for better organization
const sidebarCategories = [
  {
    title: "Essentials",
    items: [
      { label: "Home", href: "/", icon: <FaHome />, color: "text-blue-400" },
      { label: "Bash", href: "/bash", icon: <FaTerminal />, color: "text-emerald-400" },
      { label: "chmod", href: "/chmod", icon: <FaShieldAlt />, color: "text-amber-400" },
      { label: "Cronjobs", href: "/cronjobs", icon: <FaClock />, color: "text-purple-400" },
    ]
  },
  {
    title: "Development",
    items: [
      { label: "Git", href: "/git", icon: <FaGit />, color: "text-orange-400" },
      { label: "Docker", href: "/docker", icon: <FaDocker />, color: "text-cyan-400" },
      { label: "Dockerfile", href: "/dockerfile", icon: <FaCogs />, color: "text-sky-400" },
    ]
  },
  {
    title: "System & Admin",
    items: [
      { label: "User Management", href: "/linux-user-management", icon: <FaUserCog />, color: "text-pink-400" },
      { label: "SSH", href: "/ssh", icon: <FaFingerprint />, color: "text-green-400" },
      { label: "TMUX", href: "/tmux", icon: <FaColumns />, color: "text-violet-400" },
      { label: "systemctl", href: "/systemctl", icon: <FaServer />, color: "text-red-400" },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile, pathname]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!isCollapsed && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCollapsed(true)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? "80px" : "280px",
          x: isMobile && isCollapsed ? "-280px" : "0px"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-950 text-white z-50 flex flex-col border-r border-gray-800 shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 relative">
          <motion.div
            initial={false}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
              <FaTools className="text-xl" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Command Generator
              </h1>
              <p className="text-xs text-gray-400">Tools & References</p>
            </div>
          </motion.div>
          
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full p-2 transition-colors shadow-lg"
          >
            {isCollapsed ? (
              <FaChevronRight className="text-gray-300" />
            ) : (
              <FaChevronLeft className="text-gray-300" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          {sidebarCategories.map((category, categoryIndex) => (
            <div key={category.title} className="mb-8">
              {/* Category Title */}
              <motion.div
                initial={false}
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                className="px-3 mb-3"
              >
                <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  {category.title}
                </h2>
              </motion.div>

              {/* Category Items */}
              <div className="space-y-1">
                {category.items.map((item) => {
                  const isActive = pathname === item.href;
                  const isExternal = item.href.startsWith('http');
                  
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                    >
                      <motion.div
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer mx-2
                          ${isActive 
                            ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/10 text-teal-300 border-l-4 border-teal-500" 
                            : "hover:bg-gray-800/50 text-gray-300 hover:text-white"
                          }`}
                      >
                        {/* Active indicator */}
                        {isActive && !isCollapsed && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r"
                          />
                        )}

                        {/* Icon */}
                        <div className={`text-xl ${item.color} ${isActive ? "scale-110" : ""}`}>
                          {item.icon}
                        </div>

                        {/* Label */}
                        <motion.span
                          initial={false}
                          animate={{ 
                            opacity: isCollapsed ? 0 : 1,
                            x: isCollapsed ? -10 : 0
                          }}
                          className={`font-medium whitespace-nowrap overflow-hidden
                            ${isActive ? "font-semibold" : ""}`}
                        >
                          {item.label}
                        </motion.span>

                        {/* Active badge */}
                        {isActive && isCollapsed && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full" />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </motion.aside>

      {/* Mobile toggle button (when collapsed) */}
      {isMobile && isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-full p-3 shadow-lg transition-colors"
        >
          <FaChevronRight className="text-gray-300" />
        </button>
      )}

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4B5563 transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4B5563;
          border-radius: 20px;
        }
      `}</style>
    </>
  );
}