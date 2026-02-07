import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Habit } from "../types";
import { CalendarView } from "./CalendarView";
import { MonthlyStats } from "./MonthlyStats";
import { HabitProgressList } from "./HabitProgressList";

interface DashboardProps {
  habits: Habit[];
}

export function Dashboard({ habits }: DashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-cyan-400" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Progress Dashboard
          </h2>
        </div>
        <p className="text-white/60">Track your monthly progress and achievements</p>
      </motion.div>

      {/* Monthly Stats */}
      <MonthlyStats habits={habits} selectedMonth={selectedMonth} />

      {/* Calendar and Progress Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CalendarView
            habits={habits}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </motion.div>

        {/* Habit Progress List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <HabitProgressList habits={habits} selectedMonth={selectedMonth} />
        </motion.div>
      </div>
    </div>
  );
}
