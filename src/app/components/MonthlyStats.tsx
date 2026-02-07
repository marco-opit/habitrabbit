import { motion } from "motion/react";
import { TrendingUp, Award, Calendar as CalendarIcon } from "lucide-react";
import { Habit } from "../types";
import { format, startOfMonth, endOfMonth } from "date-fns";

interface MonthlyStatsProps {
  habits: Habit[];
  selectedMonth: Date;
}

export function MonthlyStats({ habits, selectedMonth }: MonthlyStatsProps) {
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  
  // Calculate stats for selected month
  const completionsThisMonth = habits.reduce((total, habit) => {
    const monthCompletions = habit.completionHistory.filter((dateStr) => {
      const date = new Date(dateStr);
      return date >= monthStart && date <= monthEnd;
    });
    return total + monthCompletions.length;
  }, 0);

  const daysInMonth = monthEnd.getDate();
  const possibleCompletions = habits.length * daysInMonth;
  const completionRate = possibleCompletions > 0 
    ? Math.round((completionsThisMonth / possibleCompletions) * 100) 
    : 0;

  // Find most consistent habit this month
  const habitStats = habits.map((habit) => {
    const monthCompletions = habit.completionHistory.filter((dateStr) => {
      const date = new Date(dateStr);
      return date >= monthStart && date <= monthEnd;
    });
    return {
      habit,
      completions: monthCompletions.length,
      rate: (monthCompletions.length / daysInMonth) * 100,
    };
  });

  const mostConsistent = habitStats.sort((a, b) => b.completions - a.completions)[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Completions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-2xl p-6 backdrop-blur-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Total Completions</p>
            <p className="text-3xl font-bold text-white">{completionsThisMonth}</p>
            <p className="text-blue-300 text-xs mt-1">
              {format(selectedMonth, "MMMM yyyy")}
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/50">
            <CalendarIcon className="w-7 h-7 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Completion Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Completion Rate</p>
            <p className="text-3xl font-bold text-white">{completionRate}%</p>
            <p className="text-purple-300 text-xs mt-1">
              {completionsThisMonth} of {possibleCompletions}
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/50">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
            />
          </div>
        </div>
      </motion.div>

      {/* Most Consistent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-2xl p-6 backdrop-blur-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Most Consistent</p>
            {mostConsistent ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{mostConsistent.habit.icon}</span>
                  <p className="text-lg font-bold text-white line-clamp-1">
                    {mostConsistent.habit.name}
                  </p>
                </div>
                <p className="text-emerald-300 text-xs">
                  {mostConsistent.completions} {mostConsistent.completions === 1 ? "day" : "days"}
                </p>
              </>
            ) : (
              <p className="text-white/60">No data yet</p>
            )}
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/50">
            <Award className="w-7 h-7 text-white" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
