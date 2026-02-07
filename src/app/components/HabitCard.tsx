import { useState } from "react";
import { motion } from "motion/react";
import { Trash2, Flame, Check, Plus, X } from "lucide-react";
import { Habit } from "../types";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}



export function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const today = new Date().toDateString();
  const isCompletedToday = habit.lastCompleted === today;

  // Calculate completions in current period
  const getCompletionsInPeriod = () => {
    const now = new Date();
    const history = habit.completionHistory || [];

    if (habit.targetPeriod === 'daily') {
      return isCompletedToday ? 1 : 0;
    }

    if (habit.targetPeriod === 'weekly') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start
      startOfWeek.setHours(0, 0, 0, 0);

      return history.filter(dateStr => {
        const d = new Date(dateStr);
        return d >= startOfWeek;
      }).length;
    }

    if (habit.targetPeriod === 'monthly') {
      return history.filter(dateStr => {
        const d = new Date(dateStr);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length;
    }

    return 0;
  };

  const currentCount = getCompletionsInPeriod();
  const isRelapsedToday = habit.type === 'negative' && habit.lastCompleted === today;
  const isTargetMet = habit.type === 'positive' ? currentCount >= habit.targetCount : !isRelapsedToday;

  const getCardTheme = () => {
    if (habit.type === 'negative') {
      return isRelapsedToday
        ? "bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-400/30"
        : "bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]";
    }
    return isTargetMet
      ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30"
      : "bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]";
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        whileHover={{ scale: 1.01 }}
        className={`relative overflow-hidden rounded-[2rem] p-6 backdrop-blur-lg transition-all ${getCardTheme()}`}
      >
        {/* Glow effect */}
        {isTargetMet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-teal-400/10 to-emerald-400/10 blur-2xl"
          />
        )}

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner transition-all ${habit.type === 'negative'
              ? (isRelapsedToday ? "bg-red-500/20 scale-110" : "bg-white/10")
              : (isTargetMet ? "bg-emerald-500/20 scale-110" : "bg-white/10")
              }`}>
              {habit.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl text-white font-bold truncate">{habit.name}</h3>
                <div className={`px-2 py-0.5 rounded-lg bg-white/5 border ${habit.type === 'negative' ? 'border-red-500/30' : 'border-white/10'}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${habit.type === 'negative' ? 'text-red-400/80' : 'text-white/40'}`}>
                    {habit.type === 'negative' ? 'Breaking' : (habit.targetCount > 1 ? `${habit.targetCount}x ${habit.targetPeriod}` : habit.targetPeriod)}
                  </span>
                </div>
              </div>

              {/* Progress Display for multi-count/period habits */}
              {habit.targetCount > 1 && (
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-white/40 font-bold uppercase">Progress</span>
                    <span className="text-xs text-white/60 font-medium">{currentCount} / {habit.targetCount}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (currentCount / habit.targetCount) * 100)}%` }}
                      className={`h-full transition-colors ${isTargetMet ? 'bg-emerald-400' : 'bg-purple-400'}`}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                {/* Streak */}
                <div className="flex items-center gap-1.5">
                  <Flame className={`w-4 h-4 ${habit.streak > 0 ? "text-orange-400" : "text-white/20"}`} />
                  <span className={`text-sm font-medium ${habit.streak > 0 ? "text-white/80" : "text-white/30"}`}>
                    {habit.streak} {habit.streak === 1 ? "day" : "days"}
                  </span>
                </div>

                {/* Points */}
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 text-sm">⭐</span>
                  <span className="text-white/80 text-sm font-semibold">
                    {habit.points} <span className="text-[10px] text-white/40 ml-0.5">PTS</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Delete button */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.25)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-red-400 transition-all"
              title="Delete Habit"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>

            {/* Daily Toggle / Relapse button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(habit.id)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${habit.type === 'negative'
                ? isRelapsedToday
                  ? "bg-red-500 shadow-[0_10px_20px_rgba(239,68,68,0.3)]"
                  : "bg-white/10 border border-white/20 hover:bg-white/20 text-white/40 hover:text-red-400"
                : isCompletedToday
                  ? "bg-gradient-to-br from-emerald-400 to-teal-400 shadow-[0_10px_20px_rgba(16,185,129,0.3)]"
                  : "bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_10px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_10px_25px_rgba(168,85,247,0.5)]"
                }`}
              title={habit.type === 'negative' ? (isRelapsedToday ? "Relapse reported" : "Report Relapse") : "Complete Habit"}
            >
              {habit.type === 'negative' ? (
                <X className={`w-7 h-7 ${isRelapsedToday ? "text-white" : "text-white/40"}`} />
              ) : isCompletedToday ? (
                <Check className="w-7 h-7 text-white" />
              ) : habit.targetCount > 1 ? (
                <Plus className="w-7 h-7 text-white" />
              ) : (
                <div className="w-7 h-7 rounded-lg border-2 border-white/30" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => onDelete(habit.id)}
        habitName={habit.name}
        createdAt={habit.createdAt}
      />
    </>
  );
}
