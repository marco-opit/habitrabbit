import { motion } from "motion/react";
import { Trash2, Flame, Check } from "lucide-react";
import { Habit } from "../types";

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const isCompletedToday = habit.lastCompleted === new Date().toDateString();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-lg transition-all ${
        isCompletedToday
          ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30"
          : "bg-gradient-to-br from-white/10 to-white/5 border border-white/20"
      }`}
    >
      {/* Glow effect */}
      {isCompletedToday && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-emerald-400/20 blur-xl"
        />
      )}

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{habit.icon}</span>
            <div>
              <h3 className="text-xl text-white font-semibold">{habit.name}</h3>
              <p className="text-sm text-white/60">{habit.recurrence}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            {/* Streak */}
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-white/80">
                {habit.streak} {habit.streak === 1 ? "day" : "days"}
              </span>
            </div>

            {/* Points */}
            <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30">
              <span className="text-amber-300 text-sm font-semibold">
                ⭐ {habit.points} pts
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* Complete button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(habit.id)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isCompletedToday
                ? "bg-gradient-to-br from-emerald-400 to-teal-400 shadow-lg shadow-emerald-500/50"
                : "bg-gradient-to-br from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50"
            }`}
          >
            {isCompletedToday ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Check className="w-7 h-7 text-white" />
              </motion.div>
            ) : (
              <div className="w-7 h-7 rounded-full border-2 border-white/50" />
            )}
          </motion.button>

          {/* Delete button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(habit.id)}
            className="w-10 h-10 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center hover:bg-red-500/30 transition-all"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
