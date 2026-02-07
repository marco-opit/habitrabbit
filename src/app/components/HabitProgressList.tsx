import { motion } from "motion/react";
import { Habit } from "../types";
import { startOfMonth, endOfMonth } from "date-fns";

interface HabitProgressListProps {
  habits: Habit[];
  selectedMonth: Date;
}

export function HabitProgressList({ habits, selectedMonth }: HabitProgressListProps) {
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const daysInMonth = monthEnd.getDate();

  const habitProgress = habits.map((habit) => {
    const monthCompletions = habit.completionHistory.filter((dateStr) => {
      const date = new Date(dateStr);
      return date >= monthStart && date <= monthEnd;
    }).length;

    const completionRate = (monthCompletions / daysInMonth) * 100;

    return {
      habit,
      completions: monthCompletions,
      rate: completionRate,
    };
  });

  // Sort by completion rate
  habitProgress.sort((a, b) => b.rate - a.rate);

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-lg">
      <h3 className="text-xl font-bold text-white mb-6">Habit Progress</h3>

      {habits.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/60">No habits tracked yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {habitProgress.map((item, index) => (
            <motion.div
              key={item.habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.habit.icon}</span>
                  <div>
                    <h4 className="text-white font-semibold">{item.habit.name}</h4>
                    <p className="text-white/60 text-sm">{item.habit.recurrence}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{Math.round(item.rate)}%</p>
                  <p className="text-white/60 text-sm">
                    {item.completions}/{daysInMonth}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.rate}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className={`h-full ${
                    item.rate >= 80
                      ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                      : item.rate >= 50
                      ? "bg-gradient-to-r from-amber-400 to-orange-400"
                      : "bg-gradient-to-r from-red-400 to-pink-400"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
