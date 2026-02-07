import { useState } from "react";
import { motion } from "motion/react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, startOfWeek, endOfWeek, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Habit } from "../types";

interface CalendarViewProps {
  habits: Habit[];
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function CalendarView({ habits, selectedMonth, onMonthChange }: CalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDayData = (day: Date) => {
    const dayStr = day.toDateString();
    const building = habits.filter(h => h.type === 'positive' && h.completionHistory.includes(dayStr));
    const relapses = habits.filter(h => h.type === 'negative' && h.completionHistory.includes(dayStr));
    return { building, relapses };
  };

  const isCurrentMonth = (day: Date) => {
    return day.getMonth() === selectedMonth.getMonth();
  };

  const isToday = (day: Date) => {
    return isSameDay(day, new Date());
  };

  const selectedDayData = getDayData(selectedDay);

  return (
    <div className="space-y-6">
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
            const { building, relapses } = getDayData(day);
            const isInCurrentMonth = isCurrentMonth(day);
            const isTodayDate = isToday(day);
            const isSelected = isSameDay(day, selectedDay);

            return (
              <motion.button
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all border-2 ${isSelected
                  ? "border-cyan-400 bg-white/10"
                  : isTodayDate
                    ? "bg-gradient-to-br from-purple-500/40 to-pink-500/40 border-purple-400/50"
                    : isInCurrentMonth
                      ? "bg-white/5 hover:bg-white/10 border-transparent"
                      : "bg-transparent border-transparent"
                  }`}
              >
                <span
                  className={`text-sm font-medium mb-1 ${isInCurrentMonth ? "text-white" : "text-white/30"
                    }`}
                >
                  {format(day, "d")}
                </span>

                {/* Completion dots */}
                {(building.length > 0 || relapses.length > 0) && isInCurrentMonth && (
                  <div className="flex gap-0.5 flex-wrap justify-center px-0.5">
                    {building.slice(0, 3).map((habit) => (
                      <div
                        key={habit.id}
                        className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400"
                      />
                    ))}
                    {relapses.slice(0, 3).map((habit) => (
                      <div
                        key={habit.id}
                        className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-red-500 to-orange-500"
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400" />
            <span>Building</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-red-500 to-orange-500" />
            <span>Relapse</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm border border-cyan-400" />
            <span>Selected</span>
          </div>
        </div>
      </div>

      {/* Daily Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={selectedDay.toISOString()}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-white">
            {isSameDay(selectedDay, new Date()) ? "Today - " : ""}
            {format(selectedDay, "EEEE, MMMM do")}
          </h4>
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">
            Activity Log
          </span>
        </div>

        <div className="space-y-3">
          {selectedDayData.building.length === 0 && selectedDayData.relapses.length === 0 ? (
            <p className="text-sm text-white/40 italic">No activity reported for this day.</p>
          ) : (
            <>
              {selectedDayData.building.map(habit => (
                <div key={habit.id} className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <span className="text-2xl">{habit.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-emerald-400">Completed: {habit.name}</p>
                    <p className="text-[10px] text-emerald-400/60 uppercase font-bold">+10 XP Earned</p>
                  </div>
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
              ))}
              {selectedDayData.relapses.map(habit => (
                <div key={habit.id} className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <span className="text-2xl">{habit.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-400">Relapsed: {habit.name}</p>
                    <p className="text-[10px] text-red-400/60 uppercase font-bold">-20 XP Penalty</p>
                  </div>
                  <X className="w-4 h-4 text-red-400" />
                </div>
              ))}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
