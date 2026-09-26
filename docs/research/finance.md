# Finance Module Research

1. **"Safe-to-spend" single number (PocketGuard's "In My Pocket")** — Reduces the mental-accounting overhead behavioral economics flags as the reason budget apps can backfire (people rationalize overspending category-by-category); one number after bills/goals is easier to act on than 12 category balances. *Effort: low* (income minus recurring bills minus categorized spend, one calculation).

2. **Give-every-dollar-a-job monthly allocation (YNAB Rule 1)** — YNAB users consistently credit the "assign income to categories until zero" step, not transaction tracking, with the mindset shift that keeps them engaged long-term. *Effort: medium* (budget table: category, assigned, spent, remaining).

3. **Quick-add transaction entry with autofill from prior similar entries** — Entry friction is named as a direct cause of app abandonment within days; autofilling category/amount from the last matching payee is the highest-leverage low-effort fix. *Effort: low.*

4. **Category over-budget alerts** — Mint's budget-alert feature was one of its most-cited retention drivers; a red flag when a category exceeds its monthly assignment gives the "did I mess up" feedback loop users want. *Effort: low.*

5. **Recurring/subscription auto-detection** — Copilot Money's "Recurrings" view is repeatedly cited as the feature users didn't know they needed. *Effort: medium.*

6. **Rollover of unspent category balances (YNAB Rule 3, "roll with the punches")** — Teaches "aging your money" and reduces the anxiety of a hard monthly reset. *Effort: low.*

7. **Three-bucket categorization (Fixed / Flexible / Non-monthly)** — Monarch Money's "Flex Budgeting" cuts the category-setup effort that causes new users to quit before finishing onboarding. *Effort: low.*

## Folded into the spec
Items 1 and 3 (safe-to-spend number, quick-add autofill), plus item 4 folded into the existing budget-progress stretch item. Items 2, 5, 6, 7 were left out as medium effort or beyond one-day scope for a first pass.

## Sources
- YNAB Four Rules: https://overboredlife.com/ynab-method-explained/, https://en.wikipedia.org/wiki/YNAB
- Copilot Money: https://help.copilot.money/en/articles/11157550-quick-start-guide, https://moneywithkatie.com/copilot-review-a-budgeting-app-that-finally-gets-it-right/
- PocketGuard vs Monarch: https://pocketguard.com/blog/pocketguard-vs-monarch-money/, https://envelopebudgeting.com/articles/monarch-money-review
- Goodbudget: https://getfinny.app/blog/goodbudget-vs-ynab-2026
- Mint alerts: https://mint.intuit.com/how-mint-works/alerts, https://www.mintactivate.com/navigating-the-app-viewing-spending-trends
- Mental accounting: https://www.behavioraleconomics.com/the-budgeting-app-trap-when-spending-information-backfires/, https://thedecisionlab.com/biases/mental-accounting
- Entry friction: https://github.com/dmcgee2121/leftly/issues/64
