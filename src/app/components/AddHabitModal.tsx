import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Sparkles, Timer } from "lucide-react";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, icon: string, recurrence: string, targetCount: number, targetPeriod: "daily" | "weekly" | "monthly", type: "positive" | "negative", hasTimer: boolean) => void;
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
  const [habitType, setHabitType] = useState<"positive" | "negative">("positive");
  const [targetCount, setTargetCount] = useState(1);
  const [hasTimer, setHasTimer] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const count = targetPeriod === 'daily' ? 1 : targetCount;
      onAdd(name.trim(), selectedIcon, targetPeriod, count, targetPeriod, habitType, hasTimer);
      setName("");
      setSelectedIcon("💪");
      setTargetPeriod("daily");
      setHabitType("positive");
      setTargetCount(1);
      setHasTimer(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

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
                <div>
                  <label className="block text-sm text-white/80 mb-2">Goal Type</label>
                  <div className="flex gap-2 p-1 bg-slate-700/50 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setHabitType("positive")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${habitType === "positive"
                        ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                        : "text-white/40 hover:text-white/60"
                        }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">Building</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHabitType("negative")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${habitType === "negative"
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                        : "text-white/40 hover:text-white/60"
                        }`}
                    >
                      <X className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">Breaking</span>
                    </button>
                  </div>
                </div>

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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/80 mb-2">Period</label>
                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                      {PERIOD_OPTIONS.map((period) => (
                        <button
                          key={period.id}
                          type="button"
                          onClick={() => setTargetPeriod(period.id as any)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${targetPeriod === period.id
                            ? "bg-white/20 text-white shadow-sm"
                            : "text-white/40 hover:text-white/60"
                            }`}
                        >
                          {period.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/80 mb-2">Goal</label>
                    <select
                      value={targetCount}
                      disabled={targetPeriod === 'daily'}
                      onChange={(e) => setTargetCount(parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 appearance-none"
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

                {/* Pomodoro Timer Toggle */}
                <AnimatePresence>
                  {habitType === "positive" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="block text-sm text-white/80 mb-2">Advanced Tools</label>
                      <button
                        type="button"
                        onClick={() => setHasTimer(!hasTimer)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${hasTimer
                          ? "bg-purple-500/20 border-purple-500/50 text-white shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                          : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/20"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${hasTimer ? "bg-purple-500 text-white" : "bg-white/10"
                            }`}>
                            <Timer className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold">Enable Focus Timer</p>
                            <p className="text-[10px] opacity-60">Pomodoro mode (+5 XP reward)</p>
                          </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative transition-colors ${hasTimer ? "bg-purple-500" : "bg-white/10"}`}>
                          <motion.div
                            animate={{ x: hasTimer ? 24 : 4 }}
                            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                          />
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Create Habit
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
