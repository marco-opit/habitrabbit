import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Sparkles, LogOut } from "lucide-react";
import { Toaster, toast } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/react";
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
import { PomodoroOverlay } from "./components/PomodoroOverlay";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const prevLevelRef = useRef<number | null>(null);

  // --- Global Pomodoro State ---
  const [activeTimerHabitId, setActiveTimerHabitId] = useState<string | null>(null);
  const [timerTimeLeft, setTimerTimeLeft] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState<"focus" | "break">("focus");
  const [timerSessionCount, setTimerSessionCount] = useState(0);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  // ---

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

  // --- Pomodoro Ticking Logic ---
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timerTimeLeft > 0) {
      interval = setInterval(() => {
        setTimerTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerTimeLeft === 0 && activeTimerHabitId) {
      setIsTimerActive(false);
      if (timerMode === "focus") {
        setTimerSessionCount(prev => prev + 1);
        addGlobalXP(5);
        setTimerMode("break");
        setTimerTimeLeft(5 * 60);
        toast.success("Focus session complete! Time for a short break. ☕");
      } else {
        setTimerMode("focus");
        setTimerTimeLeft(25 * 60);
        toast.success("Break over! Ready for another focus session? 🎯");
      }
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerTimeLeft, timerMode, activeTimerHabitId]);
  // ---

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
          type: h.type || 'positive',
          targetCount: h.target_count || 1,
          targetPeriod: h.target_period || 'daily',
          streak: h.streak,
          points: h.points,
          lastCompleted: h.last_completed,
          completionHistory: h.completion_history || [],
          hasTimer: h.has_timer || false,
          createdAt: h.created_at,
        }));
        setHabits(habitsToConsolidate);
      }

      // 2. Fetch Profile
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profileData) {
        console.log("Profile not found, creating a new one...");
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ id: session.user.id, global_xp: 0, last_consolidated: new Date().toISOString() }])
          .select()
          .single();

        if (createError) {
          console.error("Failed to create fallback profile:", createError);
        } else {
          profileData = newProfile;
        }
      }

      if (profileData) {
        setProfile(profileData);

        // 3. Server-Side Sync Awareness
        // Check if consolidation happened in the last hour
        const lastConsolidated = new Date(profileData.last_consolidated).getTime();
        const now = new Date().getTime();
        const diffMinutes = (now - lastConsolidated) / (1000 * 60);

        if (diffMinutes < 60) {
          toast.info("Your points have been harvested! 🌾✨ Sunday sync complete.", {
            icon: "🏆",
            style: { background: 'rgba(52, 211, 153, 0.9)', color: '#fff', borderRadius: '1rem' }
          });
        }

        // 4. Sync Negative Habit Streaks
        await syncNegativeStreaks(habitsToConsolidate, profileData.last_consolidated);
      }
    };

    fetchData();
  }, [session]);

  const syncNegativeStreaks = async (currentHabits: Habit[], lastConsolidated: string) => {
    const negativeHabits = currentHabits.filter(h => h.type === 'negative');
    if (negativeHabits.length === 0) return;

    const now = new Date();
    const today = new Date().toDateString();
    const lastConsolidatedDate = new Date(lastConsolidated);
    let updated = false;

    const updatedHabits = currentHabits.map(h => {
      if (h.type === 'negative') {
        const lastRelapse = h.lastCompleted ? new Date(h.lastCompleted) : new Date(h.createdAt);

        // Streak is always since the last relapse (or creation)
        const diffTimeStreak = Math.max(0, now.getTime() - lastRelapse.getTime());
        const targetStreak = h.lastCompleted === today ? 0 : Math.floor(diffTimeStreak / (1000 * 60 * 60 * 24));

        // Points are since the last relapse OR the last consolidation (whichever is more recent)
        const pointsBaseline = lastRelapse > lastConsolidatedDate ? lastRelapse : lastConsolidatedDate;
        const diffTimePoints = Math.max(0, now.getTime() - pointsBaseline.getTime());
        const targetPoints = Math.floor(diffTimePoints / (1000 * 60 * 60 * 24)) * 10;

        if (h.streak !== targetStreak || h.points !== targetPoints) {
          updated = true;
          return { ...h, streak: targetStreak, points: targetPoints };
        }
      }
      return h;
    });

    if (updated) {
      setHabits(updatedHabits);
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

  const addHabit = async (name: string, icon: string, recurrence: string, targetCount: number, targetPeriod: string, type: 'positive' | 'negative', hasTimer: boolean) => {
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
          type,
          has_timer: hasTimer,
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
        type: data[0].type || 'positive',
        targetCount: data[0].target_count,
        targetPeriod: data[0].target_period,
        streak: data[0].streak,
        points: data[0].points,
        lastCompleted: data[0].last_completed,
        completionHistory: data[0].completion_history || [],
        hasTimer: data[0].has_timer,
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

    // --- CASE A: NEGATIVE HABIT (Breaking) ---
    if (habit.type === 'negative') {
      const isAlreadyRelapsed = habit.lastCompleted === today;
      let updates: any = {};

      if (isAlreadyRelapsed) {
        // UNDO RELAPSE: Restore points and previous streak
        // (Wait, restoring prev streak is hard without history. Let's just set to 0 for now)
        updates = {
          last_completed: habit.completionHistory.length > 1 ? habit.completionHistory[habit.completionHistory.length - 2] : null,
          points: habit.points + 20,
          completion_history: habit.completionHistory.filter(d => d !== today)
        };
      } else {
        // REPORT RELAPSE: Deduct points and reset streak
        updates = {
          last_completed: today,
          streak: 0,
          points: Math.max(0, habit.points - 20),
          completion_history: [...(habit.completionHistory || []), today]
        };
        toast.error(`Relapse reported. Keep going! You'll get back on track. 👊`, {
          style: { background: '#ef4444', color: '#fff', border: 'none' }
        });
      }

      const { data, error } = await supabase.from('habits').update(updates).eq('id', id).select();
      if (!error && data) {
        setHabits(habits.map(h => h.id === id ? {
          ...h,
          lastCompleted: updates.last_completed,
          streak: updates.streak ?? h.streak,
          points: updates.points,
          completionHistory: updates.completion_history
        } : h));
      }
      return;
    }

    // --- CASE B: POSITIVE HABIT (Building) ---
    const isAlreadyCompletedToday = habit.lastCompleted === today;
    let updates: any = {};

    if (isAlreadyCompletedToday) {
      // UNDO COMPLETION
      const newHistory = habit.completionHistory.filter(d => d !== today);
      updates = {
        last_completed: habit.completionHistory.length > 1 ? habit.completionHistory[habit.completionHistory.length - 2] : null,
        streak: habit.targetCount === 1 ? Math.max(0, habit.streak - 1) : habit.streak,
        points: Math.max(0, habit.points - 10),
        completion_history: newHistory,
      };
    } else {
      // COMPLETE HABIT
      const wasCompletedYesterday = habit.lastCompleted === new Date(Date.now() - 86400000).toDateString();
      const newHistory = [...(habit.completionHistory || []), today];

      // Calculate if this completion meets the target
      const now = new Date();
      let currentPeriodCount = 0;
      if (habit.targetPeriod === 'weekly') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        currentPeriodCount = newHistory.filter(d => new Date(d) >= startOfWeek).length;
      } else if (habit.targetPeriod === 'monthly') {
        currentPeriodCount = newHistory.filter(d => {
          const dObj = new Date(d);
          return dObj.getMonth() === now.getMonth() && dObj.getFullYear() === now.getFullYear();
        }).length;
      } else {
        currentPeriodCount = 1;
      }

      const isTargetMet = currentPeriodCount >= habit.targetCount;

      updates = {
        last_completed: today,
        streak: habit.targetCount === 1 ? (wasCompletedYesterday ? habit.streak + 1 : 1) : habit.streak,
        points: habit.points + 10,
        completion_history: newHistory,
      };

      if (isTargetMet) {
        toast.success(`Target met! +10 XP earned. 🏆`, {
          icon: '✨',
          style: { background: 'rgba(168, 85, 247, 0.9)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '1rem' }
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }

    const { data, error } = await supabase.from('habits').update(updates).eq('id', id).select();
    if (!error && data) {
      setHabits(habits.map(h => h.id === id ? {
        ...h,
        lastCompleted: updates.last_completed,
        streak: updates.streak,
        points: updates.points,
        completionHistory: updates.completion_history
      } : h));
    }
  };

  const addGlobalXP = async (amount: number) => {
    if (!session || !profile) return;
    const newXP = profile.global_xp + amount;

    // Update locally
    setProfile({ ...profile, global_xp: newXP });

    // Update Supabase
    await supabase
      .from('profiles')
      .update({ global_xp: newXP })
      .eq('id', session.user.id);

    toast.success(`Focus session complete! +${amount} XP secured. ✨`, {
      style: { background: 'rgba(168, 85, 247, 0.9)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '1rem' }
    });
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

  const handleStartTimer = (habitId: string) => {
    if (activeTimerHabitId && activeTimerHabitId !== habitId) {
      toast.warning("Another habit is already being focused! Finish that session first.", {
        icon: "⏳",
        style: { background: 'rgba(234, 179, 8, 0.9)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '1rem' }
      });
      return;
    }

    if (activeTimerHabitId === habitId) {
      setIsPomodoroOpen(true);
      return;
    }

    // Start NEW timer
    setActiveTimerHabitId(habitId);
    setTimerTimeLeft(25 * 60);
    setTimerMode("focus");
    setIsTimerActive(true);
    setIsPomodoroOpen(true);
  };

  const handleToggleTimer = () => setIsTimerActive(!isTimerActive);
  const handleResetTimer = () => setTimerTimeLeft(timerMode === "focus" ? 25 * 60 : 5 * 60);

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
                        onXPGain={addGlobalXP}
                        isActiveTimer={activeTimerHabitId === habit.id}
                        onStartTimer={() => handleStartTimer(habit.id)}
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

      {/* Global Pomodoro Overlay */}
      <PomodoroOverlay
        isOpen={isPomodoroOpen}
        habitName={habits.find(h => h.id === activeTimerHabitId)?.name || "Focus Session"}
        timeLeft={timerTimeLeft}
        isActive={isTimerActive}
        mode={timerMode}
        sessionCount={timerSessionCount}
        onClose={() => setIsPomodoroOpen(false)}
        onToggle={handleToggleTimer}
        onReset={handleResetTimer}
      />

      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </div>
  );
}