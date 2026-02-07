import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Home, BarChart3 } from "lucide-react";

interface NavigationProps {
  currentPage: "habits" | "dashboard";
  onNavigate: (page: "habits" | "dashboard") => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "habits" as const, label: "Habits", icon: Home },
    { id: "dashboard" as const, label: "Dashboard", icon: BarChart3 },
  ];

  return (
    <nav className="flex items-center justify-center gap-2 mb-8 px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 md:flex-none px-4 md:px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all border ${isActive
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_10px_20px_rgba(168,85,247,0.3)] border-purple-400/30"
                : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80"
              }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white/40"}`} />
            <span className="text-sm md:text-base">{item.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
