# Kegel Trainer

A private, on-device Kegel exercise trainer built with React, Tailwind CSS, and Framer Motion.

## Features
- Customizable hold/rest timer with drift-free wall-clock-based countdown
- Quick Flicks mode (rapid 1-per-second contractions)
- Voice guidance (SpeechSynthesis) and beep sound cues (WebAudio)
- Streak system (2 sessions/day goal), calendar heatmap, achievements
- Workout history with delete, and Recharts-powered statistics
- Reminders via browser Notifications
- Dark / light / system theme, glassmorphism UI, keyboard shortcuts (Space/R/Esc)
- Everything persists to localStorage by default — works fully offline, no account needed
- Optional: sign in with Google (via Supabase Auth) to sync history, streaks, settings, and reminders across devices

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # production build to /dist
npm run preview   # preview the production build
```

## Cross-device sync (optional, via Supabase)

By default the app is fully local — nothing leaves your browser. If you want your
history/streaks/settings to follow you between your laptop and your phone, you
can wire up a free Supabase project:

1. **Create a project** at [supabase.com](https://supabase.com) (free tier is enough).
2. **Enable Google sign-in**: in the dashboard go to Authentication -> Providers -> Google,
   turn it on, and fill in a Google OAuth Client ID/Secret (create one in the
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials) — "Web application"
   type; add the Supabase callback URL shown on that provider settings page as an
   Authorized redirect URI).
3. **Create the sync table**: open the SQL editor in Supabase and run everything in
   `supabase_schema.sql` (included in this repo). This creates a `kegel_sync` table with
   Row Level Security so each user can only ever read/write their own rows, and turns
   on Realtime for it.
4. **Add your API keys**: copy `.env.example` to `.env.local` and fill in
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Project Settings -> API.
5. **Install the new dependency**: `npm install` (this pulls in `@supabase/supabase-js`).
6. **Run it**: `npm run dev`, open Settings -> "Sync across devices", and sign in with Google.
   Do the same on your phone's browser pointed at the same deployed URL (or run
   `npm run dev -- --host` and open your laptop's LAN IP from your phone while testing).
   Sign in with the same Google account on both, and your data will sync automatically —
   changes on one device push up to Supabase and appear on the other within a second or two.

If `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are left unset, the app behaves exactly
as before (local-only, no sign-in prompt shown as available).

## Project structure

```
src/
  components/   Reusable UI (Button, TimerCircle, ProgressBar, Countdown, Navbar, Sidebar, ...)
  pages/        Dashboard, Workout, QuickFlicks, History, Statistics, Settings
  hooks/        useWorkoutTimer, useStreak, useLocalStorage, useCloudSync
  utils/        dateHelpers, storageHelpers, notifications, audioCues
  context/      SettingsContext (theme, voice, sound, reminders), AuthContext (Google sign-in)
  lib/          supabaseClient (Supabase project connection)
```

## Notes
- Uses HashRouter so it works when opened from a static file host without server-side routing config.
- Sound cues are synthesized with WebAudio (no audio files needed); voice guidance uses the browser's built-in SpeechSynthesis.
- Browser notification reminders require the user to grant permission — enable it in Settings → Reminders.
