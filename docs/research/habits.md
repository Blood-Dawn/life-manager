# Habits Module Research

1. **Grace/"skip" day instead of hard streak reset (low effort)** — Loop Habit Tracker's habit-strength algorithm deliberately avoids all-or-nothing scoring: a few missed days after a long streak will not completely destroy your progress (https://github.com/iSoron/uhabits/wiki/Habit-Strength). Way of Life pairs this with an explicit "Skip" log state (https://wayoflifeapp.com/).

2. **Visual streak/consistency grid (low effort)** — Streaks (Apple Design Award winner) is built around a tile grid that fills with color as habits are completed (https://thesweetsetup.com/apps/best-habit-tracking-app-ios/). A 7-day heatmap strip per habit is a render-only feature over existing check-in rows.

3. **One-tap check-off (low effort)** — Streaks' core interaction is a single tap to mark done (https://apps.apple.com/us/app/streaks-daily-habit-tracker/id6448960901), directly engineering Fogg's "Ability" variable: friction removal beats motivation for daily use (https://www.behaviormodel.org/).

4. **"Never miss twice" nudge (low effort)** — James Clear: missing once is an accident, missing twice is the start of a new habit (https://jamesclear.com/habit-stacking). A soft banner when a habit was missed yesterday prompts today's check-in.

5. **Habit-stacking cue field (low-medium effort)** — Fogg's Tiny Habits recipe ("After [anchor], I will [behavior]") and Clear's habit-stacking formula anchor new habits to existing routines rather than the clock (https://goalsandprogress.com/tiny-habits-fogg-behavior-model-explained/, https://jamesclear.com/habit-stacking).

6. **Best-streak record alongside current streak (low effort)** — Loss aversion: showing a personal-best streak next to the live one gives users something to protect even after a slip. Trivial aggregate query over existing check-in history.

7. **Flexible per-habit schedule, not just "every day" (medium effort)** — Way of Life's flexible scheduling is cited as why it survives real routines instead of being abandoned for non-daily habits (https://wayoflifeapp.com/).

## Folded into the spec
Items 1 (already partly covered by the existing "ending today or yesterday" streak rule, made explicit), 4, and 6. Item 2 was already the existing stretch item, kept as-is with attribution. Items 5 and 7 left out as medium effort / scope creep for a one-day build; item 3 was already the spec's checkbox interaction.

Habitica's XP/social-accountability loop was excluded as out of scope for a one-day, non-Habitica-clone build.
