import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Sparkles, LogOut } from "lucide-react";
import { Toaster, toast } from "sonner";
import { HabitCard } from "./components/HabitCard";
import { AddHabitModal } from "./components/AddHabitModal";
import { RewardsDisplay } from "./components/RewardsDisplay";
import { ConfettiEffect } from "./components/ConfettiEffect";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { Auth } from "./components/Auth";
import { supabase } from "../lib/supabase";
import { Habit, Profile } from "./types";
import { Session } from "@supabase/supabase-js";
import { calculateLevel } from "../lib/leveling";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const prevLevelRef = useRef<number | null>(null);

  // Listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentPage, setCurrentPage] = useState<"habits" | "dashboard">("habits");

  // Load habits and profile from Supabase
  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      let habitsToConsolidate: Habit[] = [];

      // 1. Fetch Habits
      const { data: habitData, error: habitError } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: true });

      if (habitError) {
        console.error("Failed to fetch habits:", habitError);
      } else if (habitData) {
        habitsToConsolidate = habitData.map((h: any) => ({
          id: h.id,
          name: h.name,
          icon: h.icon,
          recurrence: h.recurrence,
          targetCount: h.target_count || 1,
          targetPeriod: h.target_period || 'daily',
          streak: h.streak,
          points: h.points,
          lastCompleted: h.last_completed,
          completionHistory: h.completion_history || [],
          createdAt: h.created_at,
        }));
        setHabits(habitsToConsolidate);
      }

      // 2. Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error("Failed to fetch profile:", profileError);
      } else if (profileData) {
        setProfile(profileData);

        // 3. Weekly Consolidation Check
        const lastConsolidated = new Date(profileData.last_consolidated).getTime();
        const now = new Date().getTime();
        const daysSinceLast = (now - lastConsolidated) / (1000 * 60 * 60 * 24);

        if (daysSinceLast >= 7 && habitsToConsolidate.length > 0) {
          await consolidateXP(profileData, habitsToConsolidate);
        }
      }
    };

    fetchData();
  }, [session]);

  const consolidateXP = async (currentProfile: Profile, currentHabits: Habit[]) => {
    const totalHabitPoints = currentHabits.reduce((sum, h) => sum + h.points, 0);
    if (totalHabitPoints === 0) return;

    const newGlobalXP = currentProfile.global_xp + totalHabitPoints;
    const now = new Date().toISOString();

    // 1. Update Profile
    const { error: pError } = await supabase
      .from('profiles')
      .update({
        global_xp: newGlobalXP,
        last_consolidated: now
      })
      .eq('id', currentProfile.id);

    if (pError) {
      console.error("Consolidation error (profile):", pError);
      return;
    }

    // 2. Reset Habit Points
    const { error: hError } = await supabase
      .from('habits')
      .update({ points: 0 })
      .eq('user_id', currentProfile.id);

    if (hError) {
      console.error("Consolidation error (habits):", hError);
    } else {
      setProfile(prev => prev ? { ...prev, global_xp: newGlobalXP, last_consolidated: now } : null);
      setHabits(prev => prev.map(h => ({ ...h, points: 0 })));
      toast.info("Weekly XP Consolidation complete! 🌾✨ Your points are now permanent.");
    }
  };

  const activeHabitPoints = habits.reduce((sum, habit) => sum + habit.points, 0);
  const totalPoints = (profile?.global_xp || 0) + activeHabitPoints;
  const currentLevel = calculateLevel(totalPoints);

  // Level Up Notification
  useEffect(() => {
    if (prevLevelRef.current !== null && currentLevel > prevLevelRef.current) {
      toast.success(`LEVEL UP! You are now Level ${currentLevel} 🐰✨`, {
        duration: 5000,
        position: 'top-center',
        style: {
          background: 'rgba(168, 85, 247, 0.9)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
        }
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    prevLevelRef.current = currentLevel;
  }, [currentLevel]);

  const addHabit = async (name: string, icon: string, recurrence: string, targetCount: number, targetPeriod: "daily" | "weekly" | "monthly") => {
    if (!session) return;

    const { data, error } = await supabase
      .from('habits')
      .insert([
        {
          user_id: session.user.id,
          name,
          icon,
          recurrence,
          target_count: targetCount,
          target_period: targetPeriod,
          streak: 0,
          points: 0,
          completion_history: [],
        },
      ])
      .select();

    if (error) {
      console.error("Failed to add habit:", error);
    } else if (data) {
      const newHabit: Habit = {
        id: data[0].id,
        name: data[0].name,
        icon: data[0].icon,
        recurrence: data[0].recurrence,
        targetCount: data[0].target_count,
        targetPeriod: data[0].target_period,
        streak: data[0].streak,
        points: data[0].points,
        lastCompleted: data[0].last_completed,
        completionHistory: data[0].completion_history || [],
        createdAt: data[0].created_at,
      };
      setHabits([...habits, newHabit]);
    }
  };

  const toggleHabit = async (id: string) => {
    if (!session) return;
    const today = new Date().toDateString();

    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    // Helper to calculate current completions in period (same logic as HabitCard)
    const getCompletionsInPeriod = (h: Habit) => {
      const now = new Date();
      const history = h.completionHistory || [];
      if (h.targetPeriod === 'daily') return h.lastCompleted === today ? 1 : 0;
      if (h.targetPeriod === 'weekly') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return history.filter(d => new Date(d) >= startOfWeek).length;
      }
      if (h.targetPeriod === 'monthly') {
        return history.filter(d => {
          const dObj = new Date(d);
          return dObj.getMonth() === now.getMonth() && dObj.getFullYear() === now.getFullYear();
        }).length;
      }
      return 0;
    };

    const isAlreadyCompletedToday = habit.lastCompleted === today;

    let updates: any = {};

    if (isAlreadyCompletedToday) {
      // UNDO logic: Remove today's completion from history
      const newHistory = habit.completionHistory.filter(d => d !== today);
      const wasCompletedYesterday = habit.lastCompleted === new Date(Date.now() - 86400000).toDateString();

      updates = {
        last_completed: habit.completionHistory.length > 1 ? habit.completionHistory[habit.completionHistory.length - 2] : null,
        streak: habit.targetCount === 1 ? Math.max(0, habit.streak - 1) : habit.streak,
        points: Math.max(0, habit.points - 10),
        completion_history: newHistory,
      };
    } else {
      // COMPLETE logic: Add today's completion
      const wasCompletedYesterday = habit.lastCompleted === new Date(Date.now() - 86400000).toDateString();
      const newHistory = [...habit.completionHistory, today];

      updates = {
        last_completed: today,
        streak: habit.targetCount === 1 ? (wasCompletedYesterday ? habit.streak + 1 : 1) : habit.streak,
        points: habit.points + 10,
        completion_history: newHistory,
      };

      // Confetti only if target is met today
      const currentCount = getCompletionsInPeriod(habit);
      if (currentCount + 1 >= habit.targetCount) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }

    const { error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error("Failed to update habit:", error);
    } else {
      setHabits((prevHabits) =>
        prevHabits.map((h) => (h.id === id ? {
          ...h,
          lastCompleted: updates.last_completed,
          streak: updates.streak,
          points: updates.points,
          completionHistory: updates.completion_history
        } : h))
      );
    }
  };

  const deleteHabit = async (id: string) => {
    if (!session) return;

    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    // 7-Day Safety Rule
    const createdAt = new Date(habit.createdAt).getTime();
    const now = new Date().getTime();
    const ageInDays = (now - createdAt) / (1000 * 60 * 60 * 24);

    if (ageInDays >= 7 && habit.points > 0) {
      // Consolidate points to global_xp
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ global_xp: (profile?.global_xp || 0) + habit.points })
        .eq('id', session.user.id);

      if (profileError) {
        console.error("Failed to consolidate XP on deletion:", profileError);
      } else {
        setProfile(prev => prev ? { ...prev, global_xp: prev.global_xp + habit.points } : null);
        toast.info(`Habit consolidated! ${habit.points} XP added to your permanent pool. 🛡️`);
      }
    }

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Failed to delete habit:", error);
    } else {
      setHabits(habits.filter((h) => h.id !== id));
    }
  };
  const totalStreak = Math.max(...habits.map((h) => h.streak), 0);
  const completedToday = habits.filter((h) => h.lastCompleted === new Date().toDateString()).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Toaster closeButton expand richColors />
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

      {!session ? (
        <Auth />
      ) : (
        /* Main Content */
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="relative mb-8 pt-4 md:pt-0">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    Habit Tracker
                  </h1>
                  <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
                </div>
              </div>
              <p className="text-white/60 text-base md:text-lg px-4">
                Build better habits, one day at a time
              </p>
            </motion.div>

            <button
              onClick={() => supabase.auth.signOut()}
              className="absolute -top-2 right-0 md:top-0 p-2 text-white/40 hover:text-white transition-colors bg-white/5 md:bg-transparent rounded-xl"
              title="Logout"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

          {/* Page Content */}
          {currentPage === "habits" ? (
            <>
              {/* Rewards Display */}
              <RewardsDisplay
                totalPoints={totalPoints}
                globalXp={profile?.global_xp || 0}
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
      )}

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </div>
  );
}