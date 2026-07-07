# Daily Planner — PRD

## Original Problem Statement
> I want daily planner website with categories as shown in above image, it should be in sync with calendar and everyday data should be saved. For saving data we need to sign in first and each user's data per day saved based on user_id, so whoever is login can see his/her data.

Design reference: playful, pastel, notebook-like planner with 13 category cards (Top Priorities, Appointments, To-Do List, Daily Schedules, Personal To-Do, Life Balance, Meal Planning, Water Tracker, Notes, Calls/Email/Text, Notes for Tomorrow, Expense Tracker, Rate Your Day).

## Architecture
- **Backend**: FastAPI + Motor (MongoDB) + JWT + bcrypt. Routes under `/api`.
- **Frontend**: React + shadcn/ui + Tailwind + framer-motion + sonner.
- **Auth**: JWT httpOnly cookies (access 24h, refresh 7d), SameSite=None; Secure. Admin auto-seeded.
- **Data model**: `planners` collection uniquely keyed by `(user_id, date)`; PlannerData is a single JSON blob per day.

## User Personas
1. **The Everyday Planner** — wants a delightful daily rhythm tool that persists across days.
2. **The Life-Balance Seeker** — tracks health, family, fun, spiritual quadrants.
3. **The Budget-conscious** — logs expenses per day and sees totals.

## Core Requirements (Static)
- Sign-in required before saving.
- Per-user isolation of daily data.
- Calendar-based navigation between days.
- All 13 planner categories editable and persisted.

## Implemented (2026-02-07)
- JWT auth: `/api/auth/register`, `/login`, `/logout`, `/me`, `/refresh` with cookie + bcrypt + brute-force protection.
- Planner CRUD: `GET/PUT /api/planner/{YYYY-MM-DD}`, `GET /api/planner/dates`.
- Admin auto-seed (`admin@example.com` / `admin123`) + Mongo indexes on startup.
- React UI: Login/Register pages, protected Dashboard with header (brand, date picker, save, logout).
- 13 sticky-note cards with washi-tape decoration, Caveat/Nunito fonts, pastel palette, subtle rotations, staggered fade-in animations.
- Debounced autosave (~1.2s) + manual Save button.
- Calendar popover with dot markers on saved dates.
- Data-testids across all interactive elements.
- Testing agent iteration 1 issues fixed: empty-array merge bug in `loadDay`, explicit logout cookie clearing with matching attributes.

## Backlog (Priorities)
- **P1**: Move day / templates — copy today's plan to tomorrow.
- **P1**: Weekly / monthly views (aggregate charts of ratings, water, expense totals).
- **P2**: Recurring tasks / templates.
- **P2**: Export a day to PDF or shareable image.
- **P2**: Reminders via email (Resend / SendGrid) or push.
- **P2**: Dark-mode / theme picker (pastel variants).
- **P3**: Emergent Google social sign-in as alternative auth.

## Next Tasks
1. Weekly summary view showing 7-day water, expense trend, mood chart.
2. "Copy from yesterday" button on empty days.
3. PDF export of a day.
