# Life Manager — Full Build Roadmap

Sep 26, 2026 · @Kheiven Dhaiti

## Concept and Scope

Life Manager is a single-user web app that replaces three separate habits, a budget spreadsheet, a habit tracker, and a chores list, with one login. Every signed-in user sees only their own data, split across three modules: Finance, Habits, and House.

**MVP, must ship for full rubric credit:**

- Email and password signup, login, and logout through Supabase Auth
- Finance: add, edit, delete transactions, with monthly income and expense totals
- Habits: add, edit, delete habits, check off a habit for today
- House: add, edit, delete chores with a due date and a done checkbox
- Deployed live on Netlify, not localhost
- A public GitHub repo with commits spread across the build, not one upload
- README and a 3 to 5 minute demo video

**Stretch, cut first if the clock runs out before Sep 27, 11:59 PM:**

1. Streak counts for habits, fall back to a plain checked or not checked per day
2. Budget limits per category with a progress bar
3. A combined Dashboard page, fall back to three separate pages reachable from the navbar
4. A shopping list inside House, chores alone already satisfy the module

Cutting a stretch item never removes a table from the schema or a page from navigation, it only removes the extra logic layered on top, so the app never looks unfinished.

## Tech Stack and Architecture

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | React and Vite, Tailwind CSS, React Router | Fast scaffold, Claude Code writes React well, Tailwind skips a separate CSS pass |
| Database and Auth | Supabase, Postgres with built-in email and password auth and row level security | One free service covers both assignment requirements, real relational tables instead of a NoSQL blob |
| Hosting | Netlify | The assignment's own recommendation, free tier, connects straight to the GitHub repo, redeploys on every push |

This is a plain Jamstack setup, there is no custom backend server to write or host. The React app talks to Supabase directly from the browser with the public anon key. Security is not about hiding that key, it comes from row level security in Postgres: every table only returns or accepts rows where user\_id matches the signed-in user, so the anon key alone can never read or edit someone else's data. This drops an entire backend layer out of the one-day timeline, and it is also exactly how the assignment expects Firebase or Supabase to be used.

## Database Schema

Six tables in the `public` schema, all with row level security turned on. Run this once in the Supabase SQL editor before writing any frontend code.

```sql
-- Finance
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  description text,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  monthly_limit numeric not null,
  created_at timestamptz not null default now(),
  unique (user_id, category)
);

-- Habits
create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text default '✅',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

-- House
create table chores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  zone text,
  frequency text not null default 'one_time' check (frequency in ('one_time', 'daily', 'weekly', 'monthly')),
  due_date date,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

create table shopping_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_name text not null,
  quantity text,
  is_purchased boolean not null default false,
  created_at timestamptz not null default now()
);
```

Row level security follows the same pattern on every table, shown here for `transactions`:

```sql
alter table transactions enable row level security;

create policy "Users manage their own transactions"
  on transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

Repeat the `enable row level security` and `create policy` pair for `budgets`, `habits`, `habit_logs`, `chores`, and `shopping_items`, swapping the table name each time. Skipping this step leaves a table either fully locked or fully public, so it is not optional.

## Authentication Flow

Supabase Auth handles registration, login, and session storage, there is no custom password logic to write.

- Signup: `supabase.auth.signUp({ email, password })` from a Signup page. Keep email confirmation on. Supabase sends the confirmation email itself, no custom email service needed. On success, show a "check your email to confirm" message, then let them log in once they click the link.
- Login: `supabase.auth.signInWithPassword({ email, password })` from a Login page. On success redirect to the Dashboard.
- Logout: `supabase.``auth.signOut()`, wired to a button in the navbar, only shown when a session exists.
- Session state: an `AuthContext` wraps the app, subscribes with `supabase.auth.onAuthStateChange`, and exposes the current user to every page.
- Route protection: a `ProtectedRoute` component checks the context for a user and redirects to `/login` when there isn't one. Every Finance, Habits, House, and Dashboard route is wrapped in it.

No CRUD call ever fires for a logged-out user, both in the UI through the route guard, and in the database through row level security. That two-layer check is exactly what the grading rubric's authentication requirement is looking for.

## Feature Spec: Finance Module

Route: `/finance`

- Add transaction form: amount (number), type (income or expense), category (dropdown: Food, Rent, Utilities, Transport, Entertainment, Income, Other), description (optional), date (defaults to today).
- Transaction list: newest first, each row shows date, category, description, and a signed amount (green for income, red for expense), with edit and delete actions.
- Monthly summary above the list: total income, total expenses, and net for the selected month, computed client-side from the transactions already loaded.
- Month filter: a dropdown or arrows to move between months.
- Safe-to-spend number: one headline figure above the summary, income minus already-logged expenses for the selected month, so there's a single number to react to instead of scanning every category.
- Quick-add autofill: when the description field matches a prior transaction, pre-fill that transaction's category and amount, cutting entry to a couple of taps for repeat expenses.
- Stretch: budgets. A small panel to set a monthly limit per category, with a progress bar showing spent versus limit, and the row flagged when spent exceeds the limit.

**Inspired by:** PocketGuard's "In My Pocket" single safe-to-spend figure and Mint's over-limit category alerts, both cited as retention drivers; behavioral-economics research on mental accounting explains why one number beats many category balances for everyday decisions; entry friction is repeatedly named as the top reason people abandon a budgeting app within days, hence the autofill. Sources: https://pocketguard.com/blog/pocketguard-vs-monarch-money/, https://mint.intuit.com/how-mint-works/alerts, https://www.behavioraleconomics.com/the-budgeting-app-trap-when-spending-information-backfires/, https://github.com/dmcgee2121/leftly/issues/64

## Feature Spec: Habits Module

Route: `/habits`

- Add habit form: name and an optional emoji icon, defaulting to a check mark.
- Habit list: one row per active habit, each with a checkbox for today. Checking it inserts a row into `habit_logs` for today, unchecking deletes that row.
- Edit and delete on each habit, delete cascades its logs automatically through the foreign key.
- Streak display next to each habit: count consecutive days with a log ending today or yesterday, shown as "5 day streak", tolerating one missed day before the streak resets rather than punishing it instantly. Compute this client-side from the habit's logs, no stored counter needed.
- Best-streak record shown next to the current streak, e.g. "5 day streak · best 12", computed client-side as the longest run in the habit's log history.
- A soft "you missed yesterday, check in today to keep going" nudge on a habit whose streak is at risk, rather than a shaming red badge.
- Stretch: a 7-day heatmap strip per habit, seven small squares filled in if logged that day, in place of just a number.

**Inspired by:** Loop Habit Tracker's habit-strength algorithm explicitly avoids all-or-nothing scoring so a single missed day doesn't erase a long streak; Streaks' tile grid is the direct model for the heatmap stretch item; James Clear's "missing once is an accident, missing twice is the start of a new habit" is the basis for the nudge instead of a punitive miss indicator. Sources: https://github.com/iSoron/uhabits/wiki/Habit-Strength, https://thesweetsetup.com/apps/best-habit-tracking-app-ios/, https://jamesclear.com/habit-stacking

## Feature Spec: House Module

Route: `/house`

- Chores tab: add chore (title, zone, frequency, due date), list sorted by due date. A due-date color scale instead of a single overdue flag: green when not due soon, amber inside 1 day of the due date, red once overdue. A checkbox marks it done, edit and delete on each.
- One-tap snooze button on each chore row that bumps the due date by a day (or by its frequency's interval) without opening the edit form, for clearing a pile-up fast.
- Zone filter chips above the list (Kitchen, Bathroom, Bedroom, Common Areas, Outdoor, Other) to narrow focus to one area at a time instead of the whole house at once.
- Shopping list tab: add item (name, quantity), checkbox marks purchased, a "clear purchased" button deletes every purchased row at once, edit and delete on each item.
- If time gets tight, ship chores only and drop the shopping tab, per the scope note above. The route and page shell stay either way, only the second tab's content is cut.

**Inspired by:** Tody's "dirtiness" scheduling (a gradient rather than a binary overdue flag) is scaled down here to a simple 3-color due-soon/overdue indicator; a 2026 comparison of ADHD-friendly chore apps found brittle streaks and shaming red badges lose users within three weeks, hence the softer color scale and the one-tap snooze over an edit-to-defer flow; FlyLady's zone-cleaning method (and its app port HomeRoutines) is the basis for the zone field and filter, narrowing focus to reduce overwhelm. Sources: https://todyapp.com/method, https://tidywell-app.com/blog/top-adhd-chore-apps-2026, https://organizingmoms.com/flylady-zones/

## UI Pages and Navigation

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Email and password login |
| `/signup` | Public | Email and password registration |
| `/` (Dashboard) | Protected | This month's balance, today's habits, next due chores, stretch item, see Concept and Scope |
| `/finance` | Protected | Transaction CRUD and monthly summary |
| `/habits` | Protected | Habit CRUD and daily check-off |
| `/house` | Protected | Chore CRUD, shopping list |

A persistent navbar (Dashboard, Finance, Habits, House, Logout) renders only when a user is signed in, replaced by plain Login and Signup links when signed out. There is no separate settings page in the MVP, logout lives in the navbar itself.

## Visual Design System

A sleek, modern look, dark by default, done through Tailwind config so every page inherits it automatically rather than being styled one-off.

- **Palette**: near-black background (`#0B0F14`), slightly lighter surface for cards (`#141A21`), one accent color used sparingly for buttons, active nav links, and streak or done states, an indigo or teal (`#6366F1` or `#14B8A6`) reads as modern without looking like a template. Green and red stay reserved for income and expense signals in Finance, not used anywhere else.
- **Typography**: Inter or the system font stack, one weight scale (400 body, 600 headings), no more than two sizes per page besides the page title.
- **Shape and depth**: rounded-xl corners on cards and inputs, soft low-opacity shadows instead of borders, thin 1px dividers only where a border is truly needed.
- **Layout**: a fixed left sidebar nav on desktop (Dashboard, Finance, Habits, House, Logout) collapsing to a bottom tab bar on mobile, content in a centered max-width column so lists and forms never stretch edge to edge on a wide screen.
- **Motion**: small, fast transitions only, 150 to 200ms on hover and on checkbox toggles, no page-load animations that would look slow on camera during the demo video.
- **Components**: consistent button, input, and card components built once in `src/components/ui` and reused everywhere, so all six pages look like one app instead of six separate ones.
- **Icons**: a small icon set like `lucide-react` for nav items and empty states, no emoji in the interface itself outside the habit icons the user picks.

Build this as its own early step, right after Phase 0's scaffold and before any feature work, so every later phase is styled from the start instead of getting a separate polish pass at the end.

## Research-Driven Refinement (Run in Parallel, Before Building)

Do this once, right after Phase 0's scaffold and before touching Phase 1. Plan the whole app around what already works in real, well-loved single-purpose apps, instead of guessing at a feature list from scratch, then build.

Spawn three research agents in parallel, one per module, each researching and reading at the same time rather than one after another:

- **Finance agent**: research established budgeting apps and methods, YNAB's zero-based and envelope budgeting, Copilot Money, Monarch Money, PocketGuard, Goodbudget, Mint's category insights. Search Reddit (r/ynab, r/personalfinance, r/povertyfinance) for what keeps people using a budgeting app versus abandoning it after a week. Pull in any solid behavioral-economics or HCI research on budgeting UX or envelope budgeting if it turns up in a paper search.
- **Habits agent**: research Habitica, Streaks, Loop Habit Tracker (its algorithm has a public writeup), Way of Life, plus the behavioral science behind them: BJ Fogg's Behavior Model, James Clear's habit stacking and "don't break the chain." Search Reddit (r/getdisciplined, r/productivity, r/DecidingToBeBetter) for what actually keeps people checking in daily.
- **House agent**: research Tody's dirtiness-based scheduling, OurHome, Sweepy, HomeRoutines, and organizing methods like FlyLady's zone cleaning. Search Reddit (r/CleaningTips, r/UnfuckYourHabitat, r/ADHD) for what helps people actually finish recurring chores instead of letting the list pile up.

Each agent comes back with a short ranked list, 5 to 8 concrete features, one line each on why it matters and a rough build-effort estimate (low or medium), plus the real URLs it read, papers included where they exist.

Before writing any feature code, fold the strongest low-effort, high-impact findings from each report directly into that module's Feature Spec section above, editing this doc in place, and add a short "Inspired by" line with sources under each updated section. Pull in only what a normal user would actually notice and want, resist adding something just because a bigger app has it, this is a one-day build, not a clone of YNAB.

## Phased Build Roadmap

Give each phase to Claude Code as its own instruction and have it commit and push at the end of that phase. That is what produces the progress-over-time history the GitHub rubric line is grading. Eleven phases, spread across today (Sep 26) and tomorrow (Sep 27, due 11:59 PM).

| Phase | Target time | Commit message | What ships |
| --- | --- | --- | --- |
| 0 | Sep 26, morning | Initial project setup with Vite, React, Tailwind, and the design system | Empty scaffold styled per the Visual Design System, repo created and pushed |
| 0.5 | Sep 26, morning | Research-driven refinement of Finance, Habits, and House specs | Feature Spec sections updated with researched, validated patterns before any feature code is written |
| 1 | Sep 26, morning | Add Supabase schema with row level security | Six tables live in Supabase, schema.sql committed |
| 2 | Sep 26, afternoon | Add signup, login, and logout with Supabase Auth | Working auth, protected routes redirect correctly |
| 3 | Sep 26, afternoon | Add finance module: transaction CRUD and monthly summary | Finance page fully working end to end |
| 4 | Sep 26, evening | Add habits module: habit CRUD, daily check-off, streaks | Habits page fully working end to end |
| 5 | Sep 27, morning | Add house module: chores and shopping list CRUD | House page fully working end to end |
| 6 | Sep 27, midday | Add dashboard summarizing finance, habits, and chores | Dashboard page, or skip per the scope note |
| 7 | Sep 27, afternoon | Polish UI, loading and empty states, form validation | No broken states left, responsive at mobile width |
| 8 | Sep 27, afternoon | Add Netlify deployment config | Live URL, real signup and CRUD tested against it |
| 9 | Sep 27, evening | Add README and link the demo video | Final commit before the Canvas submission |

Build every phase against Supabase directly, never a local mock, so nothing behaves differently once deployed. If Sep 27 afternoon arrives and phases 6 through 9 are not done, cut the Dashboard first (phase 6), then any stretch items inside phases 3 through 5, but never phases 8 and 9. A working deploy and a real README are worth more rubric points than any extra feature.

## Deployment

1. Push the repo to GitHub (already public, per the assignment's requirement).
2. In Supabase, grab the Project URL and anon public key from Project Settings, API.
3. In Netlify, choose "Add new site" then "Import an existing project" from the GitHub repo.
4. Build settings: build command `npm run build`, publish directory `dist` (Vite's default).
5. In Netlify's Site settings, Environment variables, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` using the values from step 2. These are safe to expose publicly, the anon key only works within the row level security rules already set up.
6. Deploy. Netlify gives a live `*.netlify.app` URL.
7. Open the live URL in a private or incognito window and walk through signup, login, and one CRUD action in each module, to confirm nothing was accidentally left pointed at localhost.
8. Every push to the GitHub repo's main branch auto-redeploys, so later fixes just need a normal commit and push.

## README Template

Copy this into `README.md` at the repo root and fill in the bracketed parts once the app is live.

```markdown
# Life Manager

A single web app for tracking personal finances, daily habits, and household chores, built with AI coding tools for FAU's ED2 Hootcamp assignment.

## Live app
[https://YOUR-SITE.netlify.app](https://YOUR-SITE.netlify.app)

## What it does
- Sign up and log in with email and password
- Finance: log income and expenses, see a monthly summary
- Habits: track daily habits and streaks
- House: manage chores and a shopping list

## Tech stack
- React (Vite) and Tailwind CSS for the frontend
- Supabase for the database and authentication (Postgres with row level security)
- Netlify for hosting and deployment

## Setup instructions
1. Clone this repo
2. Run `npm install`
3. Create a `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your own Supabase project
4. Run the SQL in `schema.sql` against your Supabase project
5. Run `npm run dev`

## Demo video
[link to unlisted YouTube video]

## Project structure
- `src/pages` — Login, Signup, Dashboard, Finance, Habits, House
- `src/context` — auth session state
- `src/lib/supabase.js` — Supabase client setup
- `schema.sql` — database schema and row level security policies
```

## Demo Video Script (aim for 4 minutes, cap at 5)

1. 0:00, open the live Netlify URL, not localhost, say the app's name and what it does in one sentence
2. 0:20, sign up with a new test account, then log out and log back in with it, to show registration and login both work
3. 0:50, Finance page: add an income and an expense, show the monthly summary update, edit one transaction, delete another
4. 1:50, Habits page: add a habit, check it off for today, point out the streak count
5. 2:30, House page: add a chore with a due date, mark one complete, add and check off a shopping item
6. 3:10, open the GitHub repo in a browser tab, scroll the commit history to show it built up over two days, not one upload
7. 3:40, open two or three source files (the Supabase client setup, one page component) and narrate in a sentence or two what each does
8. 4:10, log out, close, done

Record at 1080p, upload to YouTube as unlisted, and paste the link into the README before submitting.

## Grading Rubric Checklist

| Rubric line | Points | Covered by |
| --- | --- | --- |
| Hootcamp material | 10 | Watching the lecture recordings, outside this doc |
| GitHub repo | 15 | Public repo, ten commits across two days, see Phased Build Roadmap |
| Application functionality | 40 | Auth, database, and CRUD across Finance, Habits, House, see the three Feature Spec sections |
| Documentation (README) | 10 | The README Template section |
| Demo video | 25 | The Demo Video Script section |

Every point value in the rubric maps to a section already in this doc. If a phase gets cut for time, cut from Application functionality's stretch items first, since that is the only line with any slack, the other four lines are pass or fail.
