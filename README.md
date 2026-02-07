# Habit Rabbit 🐰

A premium habit tracking application built with React, Tailwind CSS, and Supabase. Features include real-time cloud sync, authentication, and a gamified experience with points and streaks.

## Features
- **Cloud Sync**: Access your habits from any device.
- **Authentication**: Secure login and signup with Supabase.
- **Gamification**: Earn points and maintain streaks for your habits.
- **Responsive Design**: Beautiful glassmorphism UI that works on mobile and desktop.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- A Supabase project (Free tier is fine).

### Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.

### Environment Setup
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup
Run the following SQL in your Supabase SQL Editor to create the necessary table and enable security policies:

```sql
-- Create Habits Table
create table habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  icon text not null,
  recurrence text not null,
  streak integer default 0,
  points integer default 0,
  last_completed text,
  completion_history text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table habits enable row level security;

-- Policies
create policy "Users can only access their own habits" 
  on habits for all 
  using (auth.uid() = user_id);
```

### Running Locally
Run the development server:
```bash
npm run dev
```

## License
MIT