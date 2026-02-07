import { motion } from "motion/react";
import { Trophy, Target, Zap } from "lucide-react";

interface RewardsDisplayProps {
  totalPoints: number;
  totalStreak: number;
  completedToday: number;
  totalHabits: number;
}

export function RewardsDisplay({
  totalPoints,
  totalStreak,
  completedToday,
  totalHabits,
}: RewardsDisplayProps) {
  const level = Math.floor(totalPoints / 100) + 1;
  const progressToNextLevel = (totalPoints % 100) / 100;

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
            <p className="text-amber-300 text-xs mt-1">Level {level}</p>
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
            {100 - (totalPoints % 100)} pts to Level {level + 1}
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
