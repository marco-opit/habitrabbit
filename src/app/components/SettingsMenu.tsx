import { motion } from "motion/react";
import {
  Info,
  LogOut,
  RotateCcw,
  Settings,
  Trophy,
  UserRound,
  Zap,
} from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { calculateLevel, getLevelTitle } from "../../lib/leveling";

interface SettingsMenuProps {
  session: Session;
  totalHabits: number;
  totalStreak: number;
  completionRate: number;
  totalPoints: number;
  onClearAllData: () => void;
  onLogout: () => void;
}

function SettingsStatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export function SettingsMenu({
  session,
  totalHabits,
  totalStreak,
  completionRate,
  totalPoints,
  onClearAllData,
  onLogout,
}: SettingsMenuProps) {
  const level = calculateLevel(totalPoints);
  const userName =
    session.user.user_metadata?.full_name ||
    session.user.user_metadata?.name ||
    session.user.email ||
    "Signed-in user";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute -top-2 right-0 md:top-0 rounded-2xl border border-white/10 bg-white/5 p-3 text-white/60 transition-colors hover:text-white"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-[min(92vw,26rem)] rounded-[1.75rem] border-white/10 bg-slate-950/95 p-0 text-white shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-2xl"
      >
        <div className="space-y-5 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Settings</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Your Habit Hub</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <SettingsStatCard label="Total habits" value={String(totalHabits)} />
            <SettingsStatCard label="Best streak" value={`${totalStreak} days`} />
            <SettingsStatCard label="Completion" value={`${completionRate}%`} />
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <UserRound className="h-4 w-4 text-cyan-300" />
              <p className="text-sm font-semibold text-white">Profile</p>
            </div>
            <div className="space-y-3 text-sm text-white/80">
              <div>
                <p className="text-white/40">Name</p>
                <p className="font-medium text-white">{userName}</p>
                <p className="text-white/60">{session.user.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <p className="text-white/40">Level</p>
                  <p className="mt-1 font-medium text-white">{getLevelTitle(level)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <p className="text-white/40">Points</p>
                  <p className="mt-1 font-medium text-white">{totalPoints}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-purple-300" />
              <p className="text-sm font-semibold text-white">About</p>
            </div>
            <div className="space-y-2 text-sm text-white/75">
              <p>Habit Tracker App</p>
              <p>Built by: Habit Tracker Team</p>
              <p>Course: Web Development COMP_2002</p>
              <p>Version: 1.0.0</p>
            </div>
          </div>

          <div className="grid gap-3">
            <button
              onClick={onClearAllData}
              className="flex items-center justify-between rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-left text-sm text-red-100 transition-colors hover:bg-red-500/15"
            >
              <div>
                <p className="font-semibold">Reset / Clear all data</p>
                <p className="mt-1 text-xs text-red-200/70">Delete habits and reset your points for this account.</p>
              </div>
              <RotateCcw className="h-4 w-4 shrink-0" />
            </button>

            <button
              onClick={onLogout}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition-colors hover:bg-white/10"
            >
              <div>
                <p className="font-semibold">Log out</p>
                <p className="mt-1 text-xs text-white/50">Sign out of the current account.</p>
              </div>
              <LogOut className="h-4 w-4 shrink-0" />
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
