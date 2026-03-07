# 🐰 Habit Rabbit: Technical Documentation & Project Report

## 📖 Project Overview
**Habit Rabbit** is a gamified productivity application designed to turn routine building into an engaging, RPG-like experience. Unlike traditional habit trackers that feel like chores, Habit Rabbit utilizes behavioral psychology, non-linear progression, and real-time focus tools to keep users motivated.

This project was developed as a comprehensive web application for a university assessment, focusing on full-stack integration, state management, and user-centric design.

---

## 🛠️ Tech Stack & Architecture
The application is built using a modern, performant stack:

- **Frontend**: React 18 with Vite for lightning-fast builds and HMR.
- **Styling**: Tailwind CSS for a premium, responsive glassmorphism UI.
- **Backend (BaaS)**: Supabase (PostgreSQL, Auth, and Real-time).
- **Animations**: Framer Motion for smooth, high-end interactions.
- **Database Logic**: Pl/pgSQL (Triggers and Stored Procedures) for server-side reliability.
- **Icons**: Lucide React.
- **Notifications**: Sonner for rich, interactive toast feedback.

---

## 🚀 Development Phases

### Phase 1: Foundations & Flexible Scheduling
The initial goal was to move beyond binary "did/didn't" tracking.
- **Flexible Targets**: Implemented support for multi-count habits (e.g., "Drink 3L water") and varying periods (Daily, Weekly, Monthly).
- **State Logic**: Developed a robust local-first state sync with Supabase to ensure no progress is lost on refresh.

### Phase 2: The Gamification Engine (XP & Leveling)
To drive engagement, we implemented a custom leveling system:
- **Geometric Scaling**: XP requirements grow by 10% per level, ensuring that higher ranks (e.g., "Agile Hare" to "Habit Hero") feel earned.
- **Character Ranks**: Dynamic rank titles that evolve with the user's progress.
- **The "Safety Net" (Global XP)**: One major flaw in habit trackers is losing all progress if a habit is deleted. We solved this with **Global XP Consolidation**—moving points into a permanent pool after a 7-day "maturity" period.

### Phase 3: High-Performance Focus (Pomodoro)
We integrated deep-work tools directly into the habits:
- **Global Persistence**: The Pomodoro timer state is lifted to the root `App.tsx`, allowing it to persist even while the user manages other habits or closes the modal.
- **Singleton Enforcement**: To prevent "multitasking" (which reduces focus), only one timer can be active at a time across the entire app.
- **Active Highlighting**: Using CSS filters and Framer Motion, active habits "glow," visually guiding the user's attention back to their primary task.

### Phase 4: Defensive Psychology (Negative Habits)
Tracking what you *avoid* is as hard as tracking what you *do*.
- **Success by Default**: Negative habits are visually "completed" at the start of each day. This provides a psychological "win" and rewards discipline.
- **Passive Rewards**: XP is automatically calculated based on the time since the last relapse or consolidation.
- **Relapse Reporting**: We replaced the "Complete" button with a "Report Relapse" trigger, which applies an XP penalty and resets the streak.

### Phase 5: Reliability & Automation
To make the app "zero-maintenance" and robust:
- **SQL Triggers**: Automating profile creation for new users at the database level.
- **Sunday XP Consolidation**: A server-side cron job (`pg_cron`) that automatically "harvests" all habit points every Sunday at midnight, banking them into the user's permanent `global_xp`.

---

## 🧩 Key Technical Deep Dives

### 1. The Global XP Consolidation Logic
To handle the "Sunday Sync," we developed a PostgreSQL stored procedure that ensures atomic updates:
```sql
update public.profiles p
set global_xp = p.global_xp + coalesce((select sum(points) from habits where user_id = p.id), 0),
    last_consolidated = now();
```
This ensures that even if a user hasn't logged in for weeks, their points are safely moved to their permanent level.

### 2. Singleton Timer Management
The timer logic uses a centralized `useEffect` in `App.tsx` that acts as a heartbeat. By managing the timer at the highest level:
- There is no "clock drift" between components.
- The UI remains reactive to a single source of truth.

---

## 📈 Challenges & Solutions
- **Challenge**: Users "cheating" by creating and deleting habits for quick XP.
- **Solution**: Implemented the **7-Day Maturity Rule**. Points only move to the permanent "Global XP" pool if the habit has existed for at least a week.
- **Challenge**: High-latency feeling during database sync.
- **Solution**: Implemented **Optimistic UI updates**—updating the React state instantly while syncing to Supabase in the background.

---

## 🔮 Future Roadmap
1. **Habit Stacking**: Ability to link a "Trigger" habit to a "Routine."
2. **Social Warrens**: Group challenges with shared target pools.
3. **AI Coach**: Analyzing completion patterns to suggest better schedules.

---

**Habit Rabbit** represents more than just a list; it is a behavioral ecosystem built on the principle that small, consistent gains lead to massive transformations.
