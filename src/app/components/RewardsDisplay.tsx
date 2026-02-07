import { motion } from "motion/react";
import { Trophy, Target, Zap } from "lucide-react";
import {
  calculateLevel,
  getProgressToNextLevel,
  getPointsToNextLevel
} from "../../lib/leveling";

interface RewardsDisplayProps {
  totalPoints: number;
  globalXp: number;
  totalStreak: number;
  completedToday: number;
  totalHabits: number;
}

export function RewardsDisplay({
  totalPoints,
  globalXp,
  totalStreak,
  completedToday,
  totalHabits,
}: RewardsDisplayProps) {
  const level = calculateLevel(totalPoints);
  const progressToNextLevel = getProgressToNextLevel(totalPoints);
  const pointsToNext = getPointsToNextLevel(totalPoints);

  const getLevelTitle = (lvl: number) => {
    if (lvl <= 5) return "Baby Bunny 👶";
    if (lvl <= 10) return "Agile Hare 🐇";
    if (lvl <= 20) return "Forest Runner 🌲";
    if (lvl <= 30) return "Jackrabbit ⚡";
    if (lvl <= 50) return "Golden Rabbit 🌟";
    return "Habit Hero 👑";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30 backdrop-blur-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Total Points</p>
            <p className="text-3xl font-bold text-white">{totalPoints}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-amber-300 text-[10px] font-bold tracking-wide uppercase">
                Level {level} • {getLevelTitle(level)}
              </p>
              {globalXp > 0 && (
                <span className="text-white/30 text-[9px] font-medium border border-white/10 px-1.5 rounded-full">
                  {globalXp} Consolidated
                </span>
              )}
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/50">
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel * 100}%` }}
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
            />
          </div>
          <p className="text-white/40 text-xs mt-1">
            {pointsToNext} pts to Level {level + 1}
          </p>
        </div>
      </motion.div>

      {/* Best Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-400/30 backdrop-blur-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Best Streak</p>
            <p className="text-3xl font-bold text-white">{totalStreak}</p>
            <p className="text-orange-300 text-xs mt-1">days</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center shadow-lg shadow-orange-500/50">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Today's Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Today</p>
            <p className="text-3xl font-bold text-white">
              {completedToday}/{totalHabits}
            </p>
            <p className="text-purple-300 text-xs mt-1">completed</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/50">
            <Target className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Progress circle */}
        {totalHabits > 0 && (
          <div className="mt-4">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedToday / totalHabits) * 100}%` }}
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
