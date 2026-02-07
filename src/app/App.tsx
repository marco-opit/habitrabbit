import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Sparkles } from "lucide-react";
import { HabitCard } from "./components/HabitCard";
import { AddHabitModal } from "./components/AddHabitModal";
import { RewardsDisplay } from "./components/RewardsDisplay";
import { ConfettiEffect } from "./components/ConfettiEffect";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { Habit } from "./types";

const STORAGE_KEY = "habit-tracker-data";

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentPage, setCurrentPage] = useState<"habits" | "dashboard">("habits");

  // Load habits from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHabits(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse habits:", e);
      }
    }
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    }
  }, [habits]);

  const addHabit = (name: string, icon: string, recurrence: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      icon,
      recurrence,
      streak: 0,
      points: 0,
      lastCompleted: null,
      completionHistory: [],
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toDateString();
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === id) {
          const isAlreadyCompleted = habit.lastCompleted === today;

          if (isAlreadyCompleted) {
            // Uncomplete
            return {
              ...habit,
              lastCompleted: null,
              streak: Math.max(0, habit.streak - 1),
              points: Math.max(0, habit.points - 10),
              completionHistory: habit.completionHistory.filter((date) => date !== today),
            };
          } else {
            // Complete
            const wasCompletedYesterday = habit.lastCompleted === new Date(Date.now() - 86400000).toDateString();
            const newStreak = wasCompletedYesterday ? habit.streak + 1 : 1;
            
            // Show confetti on completion
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);

            return {
              ...habit,
              lastCompleted: today,
              streak: newStreak,
              points: habit.points + 10,
              completionHistory: [...habit.completionHistory, today],
            };
          }
        }
        return habit;
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  const totalPoints = habits.reduce((sum, habit) => sum + habit.points, 0);
  const totalStreak = Math.max(...habits.map((h) => h.streak), 0);
  const completedToday = habits.filter((h) => h.lastCompleted === new Date().toDateString()).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Confetti */}
      {showConfetti && <ConfettiEffect />}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-yellow-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Habit Tracker
            </h1>
            <Sparkles className="w-10 h-10 text-yellow-400" />
          </div>
          <p className="text-white/60 text-lg">
            Build better habits, one day at a time
          </p>
        </motion.div>

        {/* Navigation */}
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

        {/* Page Content */}
        {currentPage === "habits" ? (
          <>
            {/* Rewards Display */}
            <RewardsDisplay
              totalPoints={totalPoints}
              totalStreak={totalStreak}
              completedToday={completedToday}
              totalHabits={habits.length}
            />

            {/* Add Habit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="w-full mb-6 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-shadow"
            >
              <Plus className="w-6 h-6" />
              Add New Habit
            </motion.button>

            {/* Habits List */}
            <div className="space-y-4">
              <AnimatePresence>
                {habits.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-white/60 text-lg">
                      No habits yet. Start building your routine!
                    </p>
                  </motion.div>
                ) : (
                  habits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onToggle={toggleHabit}
                      onDelete={deleteHabit}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <Dashboard habits={habits} />
        )}
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </div>
  );
}