# Session handoff

Written 2026-09-26 morning, for whichever session picks this project back up. Deadline is Sep 27, 11:59 PM Eastern.

## Where things stand

- All 11 roadmap phases (0 through 9) are built, committed, and pushed to `claude/festive-ritchie-tbtvlu`.
- PR: https://github.com/Blood-Dawn/life-manager/pull/1 — open, marked ready for review (not a draft), not yet merged.
- `docs/roadmap.md` and `docs/research/` carry the full spec and the research behind each module's feature choices.
- Two review bots (Sourcery, Codex) left findings on the PR — all real bugs, no nitpicks. All are fixed and replied to as of commit `9e963d9`: timezone bugs in date handling, habit streak grace-day logic, a lost post-login redirect, a monthly-snooze date drift, and — the last one — every add/edit form across Finance/Habits/House now waits for the mutation to actually succeed before clearing itself, and every page surfaces load/mutation errors via a retryable banner instead of swallowing them.

## Why this handoff exists

The user is adding three Supabase environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_DB_URL`) via this environment's settings. Env vars added that way only take effect in a *new* session — the session that wrote this doc could not see them. If you're reading this, you're probably that new session.

## Do this first

1. Check `env | grep -i SUPABASE` (or just try using them). If `SUPABASE_DB_URL` is set, apply the schema:
   ```
   psql "$SUPABASE_DB_URL" -f schema.sql
   ```
   Verify with `psql "$SUPABASE_DB_URL" -c '\dt'` — you should see `transactions`, `budgets`, `habits`, `habit_logs`, `chores`, `shopping_items`, all with RLS enabled.
2. For local smoke-testing only (never commit this), you can write a local `.env` from `SUPABASE_URL`/`SUPABASE_ANON_KEY` and run `npm run dev` to sign up a real test account and click through each module once. Delete or leave `.env` untracked when done — it's already gitignored.
3. Re-subscribe to PR activity for this session: `subscribe_pr_activity` on `Blood-Dawn/life-manager#1`. Subscriptions don't carry over between sessions.

## Review findings: all resolved

No open review findings as of commit `9e963d9`. If a bot posts a new review round, check it same as before: verify the claim, fix genuine bugs, reply on the thread naming the fix commit.

## Still needs the human (not fixable from a session without dashboard access)

- Netlify: connect the repo, set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` env vars, deploy.
- Record the demo video, paste the link into `README.md`.
- Fill in the live Netlify URL in `README.md`.
- Merge the PR to `main` (user said they'd do this once, at the end).

## Build/lint check before any push

```
npm run build && npx oxlint
```
Both were clean as of `3c25b8e`. `rm -rf dist` after building — it's gitignored but no need to leave it lying around.
