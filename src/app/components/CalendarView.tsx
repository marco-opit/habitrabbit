import { motion } from "motion/react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, startOfWeek, endOfWeek, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Habit } from "../types";

interface CalendarViewProps {
  habits: Habit[];
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function CalendarView({ habits, selectedMonth, onMonthChange }: CalendarViewProps) {
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getCompletionsForDay = (day: Date) => {
    const dayStr = day.toDateString();
    return habits.filter((habit) => habit.completionHistory.includes(dayStr));
  };

  const isCurrentMonth = (day: Date) => {
    return day.getMonth() === selectedMonth.getMonth();
  };

  const isToday = (day: Date) => {
    return isSameDay(day, new Date());
  };

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-lg">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onMonthChange(subMonths(selectedMonth, 1))}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.button>

        <h3 className="text-2xl font-bold text-white">
          {format(selectedMonth, "MMMM yyyy")}
        </h3>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onMonthChange(addMonths(selectedMonth, 1))}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-white/60 text-sm font-semibold py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const completions = getCompletionsForDay(day);
          const completionCount = completions.length;
          const isInCurrentMonth = isCurrentMonth(day);
          const isTodayDate = isToday(day);

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                isTodayDate
                  ? "bg-gradient-to-br from-purple-500/40 to-pink-500/40 border-2 border-purple-400"
                  : isInCurrentMonth
                  ? "bg-white/5 hover:bg-white/10"
                  : "bg-transparent"
              }`}
            >
              <span
                className={`text-sm font-medium mb-1 ${
                  isInCurrentMonth ? "text-white" : "text-white/30"
                }`}
              >
                {format(day, "d")}
              </span>

              {/* Completion dots */}
              {completionCount > 0 && isInCurrentMonth && (
                <div className="flex gap-0.5 flex-wrap justify-center px-1">
                  {completions.slice(0, 3).map((habit, idx) => (
                    <div
                      key={habit.id}
                      className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400"
                      title={habit.name}
                    />
                  ))}
                  {completionCount > 3 && (
                    <span className="text-[8px] text-emerald-400 font-bold">
                      +{completionCount - 3}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400" />
          <span>Completed habits</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
