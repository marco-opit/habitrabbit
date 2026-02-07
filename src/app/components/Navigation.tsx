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
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-center gap-2 mb-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(item.id)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                currentPage === item.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden mb-6">
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2">
            {navItems.find((item) => item.id === currentPage)?.icon &&
              (() => {
                const Icon = navItems.find((item) => item.id === currentPage)!.icon;
                return <Icon className="w-5 h-5 text-white" />;
              })()}
            <span className="text-white font-semibold">
              {navItems.find((item) => item.id === currentPage)?.label}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full px-4 py-4 flex items-center gap-3 transition-all ${
                        currentPage === item.id
                          ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white"
                          : "text-white/80 hover:bg-white/10"
                      } ${index > 0 ? "border-t border-white/10" : ""}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
