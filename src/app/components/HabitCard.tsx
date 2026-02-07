import { useState } from "react";
import { motion } from "motion/react";
import { Trash2, Flame, Check } from "lucide-react";
import { Habit } from "../types";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isCompletedToday = habit.lastCompleted === new Date().toDateString();

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        whileHover={{ scale: 1.01 }}
        className={`relative overflow-hidden rounded-[2rem] p-6 backdrop-blur-lg transition-all ${isCompletedToday
          ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30"
          : "bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
          }`}
      >
        {/* Glow effect */}
        {isCompletedToday && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-teal-400/10 to-emerald-400/10 blur-2xl"
          />
        )}

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner transition-all ${isCompletedToday ? "bg-emerald-500/20 scale-110" : "bg-white/10"
              }`}>
              {habit.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl text-white font-bold truncate">{habit.name}</h3>
                <div className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{habit.recurrence}</span>
                </div>
              </div>

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
            {/* Delete button (fixed UI) */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.25)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-red-400 transition-all"
              title="Delete Habit"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>

            {/* Complete button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(habit.id)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isCompletedToday
                ? "bg-gradient-to-br from-emerald-400 to-teal-400 shadow-[0_10px_20px_rgba(16,185,129,0.3)]"
                : "bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_10px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_10px_25px_rgba(168,85,247,0.5)]"
                }`}
            >
              {isCompletedToday ? (
                <Check className="w-7 h-7 text-white" />
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
      />
    </>
  );
}
