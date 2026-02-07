import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus } from "lucide-react";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, icon: string, recurrence: string) => void;
}

const EMOJI_OPTIONS = ["💪", "📚", "🧘", "🏃", "💧", "🎯", "✍️", "🎨", "🎵", "🧠", "🥗", "😴"];
const RECURRENCE_OPTIONS = ["Daily", "Weekly", "Monthly"];

export function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("💪");
  const [recurrence, setRecurrence] = useState("Daily");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), selectedIcon, recurrence);
      setName("");
      setSelectedIcon("💪");
      setRecurrence("Daily");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Add New Habit</h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Habit Name */}
                <div>
                  <label className="block text-sm text-white/80 mb-2">Habit Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Morning Exercise"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    autoFocus
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm text-white/80 mb-3">Choose an Icon</label>
                  <div className="grid grid-cols-6 gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <motion.button
                        key={emoji}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedIcon(emoji)}
                        className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all ${
                          selectedIcon === emoji
                            ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg scale-110"
                            : "bg-white/10 hover:bg-white/20"
                        }`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Recurrence */}
                <div>
                  <label className="block text-sm text-white/80 mb-3">Recurrence</label>
                  <div className="grid grid-cols-3 gap-2">
                    {RECURRENCE_OPTIONS.map((option) => (
                      <motion.button
                        key={option}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setRecurrence(option)}
                        className={`py-3 rounded-xl transition-all ${
                          recurrence === option
                            ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
                            : "bg-white/10 text-white/80 hover:bg-white/20"
                        }`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!name.trim()}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                  Add Habit
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
