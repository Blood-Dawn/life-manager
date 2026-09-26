# Life Manager

A single web app for tracking personal finances, daily habits, and household chores, built with AI coding tools for FAU's ED2 Hootcamp assignment.

## Live app
[https://life-manager-bloodawn.netlify.app](https://life-manager-bloodawn.netlify.app)

## What it does
- Sign up and log in with email and password
- Finance: log income and expenses, see a monthly summary and safe-to-spend figure, set per-category budgets
- Habits: track daily habits, streaks, and best-streak records
- House: manage chores by zone with due-date flags and a shopping list

## Tech stack
- React (Vite) and Tailwind CSS for the frontend
- Supabase for the database and authentication (Postgres with row level security)
- Netlify for hosting and deployment

## Setup instructions
1. Clone this repo
2. Run `npm install`
3. Create a Supabase project, then copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your project's API settings
4. Run the SQL in `schema.sql` against your Supabase project (SQL editor, or `psql` against your connection string)
5. Run `npm run dev`

## Deployment
1. Push this repo to GitHub
2. In Netlify, "Add new site" → "Import an existing project" from this repo
3. Build command `npm run build`, publish directory `dist` (see `netlify.toml`)
4. In Site settings → Environment variables, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
5. Deploy, then open the live URL in a private window and walk through signup, login, and one CRUD action in each module

## Demo video
[Watch the demo](https://www.loom.com/share/da29cbf3c0444418a97864e4a9fe4f47)

## Project structure
- `src/pages` — Login, Signup, Dashboard, Finance, Habits, House
- `src/context` — auth session state
- `src/lib/supabase.js` — Supabase client setup
- `src/components/ui` — shared Button, Input, Card, EmptyState components
- `src/components/finance`, `src/components/habits`, `src/components/house` — module-specific components
- `docs/roadmap.md` — the full build roadmap this app was built from
- `docs/research` — the research behind each module's feature choices
- `schema.sql` — database schema and row level security policies
