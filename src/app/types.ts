export interface Habit {
  id: string;
  name: string;
  icon: string;
  recurrence: string;
  type: 'positive' | 'negative';
  targetCount: number;
  targetPeriod: "daily" | "weekly" | "monthly";
  streak: number;
  points: number;
  lastCompleted: string | null;
  completionHistory: string[];
  createdAt: string;
}

export interface Profile {
  id: string;
  global_xp: number;
  last_consolidated: string;
}
