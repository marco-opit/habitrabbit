export interface Habit {
  id: string;
  name: string;
  icon: string;
  recurrence: string;
  streak: number;
  points: number;
  lastCompleted: string | null;
  completionHistory: string[];
  createdAt: string;
}
