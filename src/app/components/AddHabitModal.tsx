import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus } from "lucide-react";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, icon: string, recurrence: string, targetCount: number, targetPeriod: "daily" | "weekly" | "monthly") => void;
}

const EMOJI_OPTIONS = ["💪", "📚", "🧘", "🏃", "💧", "🎯", "✍️", "🎨", "🎵", "🧠", "🥗", "😴"];
const PERIOD_OPTIONS = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];
const GOAL_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 10, 15, 20, 30];

export function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("💪");
  const [targetPeriod, setTargetPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [targetCount, setTargetCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Ensure daily is always 1
      const count = targetPeriod === 'daily' ? 1 : targetCount;
      onAdd(name.trim(), selectedIcon, targetPeriod, count, targetPeriod);
      setName("");
      setSelectedIcon("💪");
      setTargetPeriod("daily");
      setTargetCount(1);
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
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
                        className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${selectedIcon === emoji
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg scale-110"
                          : "bg-white/10 hover:bg-white/20"
                          }`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* target Period & target Count */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/80 mb-2">Period</label>
                    <select
                      value={targetPeriod}
                      onChange={(e) => {
                        const newPeriod = e.target.value as any;
                        setTargetPeriod(newPeriod);
                        if (newPeriod === 'daily') setTargetCount(1);
                        if (newPeriod === 'weekly' && targetCount > 6) setTargetCount(6);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      {PERIOD_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id} className="bg-slate-800 text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/80 mb-2">Goal (Times)</label>
                    <select
                      value={targetCount}
                      disabled={targetPeriod === 'daily'}
                      onChange={(e) => setTargetCount(parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {targetPeriod === 'daily' ? (
                        <option value="1" className="bg-slate-800 text-white">1 time</option>
                      ) : targetPeriod === 'weekly' ? (
                        [1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num} className="bg-slate-800 text-white">
                            {num} {num === 1 ? 'time' : 'times'}
                          </option>
                        ))
                      ) : (
                        GOAL_OPTIONS.map((num) => (
                          <option key={num} value={num} className="bg-slate-800 text-white">
                            {num} {num === 1 ? 'time' : 'times'}
                          </option>
                        ))
                      )}
                    </select>
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
