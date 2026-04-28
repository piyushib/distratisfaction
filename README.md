# Hijack

> Turn scroll urges into 60-second wins.

A mobile-first web app for people with ADHD that intercepts the impulse to open social media and redirects it into a micro-task — a one-minute burst of learning, hustle, or grounding.

---

## Setup

```bash
cd hijack
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (or on mobile via your local IP).

## Build & deploy

```bash
npm run build   # production build
npm run start   # serve production build locally
```

Deploy to Vercel: push to GitHub, import the repo in Vercel, deploy. Zero config needed — it's a standard Next.js 14 app.

---

## Architecture

```
hijack/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout, fonts, nav
│   ├── page.tsx            # Home — CTA + daily stats
│   ├── picker/page.tsx     # Category selector
│   ├── task/page.tsx       # 60s countdown timer
│   ├── done/page.tsx       # Reflection + log entry
│   ├── log/page.tsx        # Session history + chart
│   └── settings/page.tsx   # Task pool manager
├── components/
│   ├── nav.tsx             # Bottom nav bar
│   ├── stats-chart.tsx     # Recharts 7-day bar chart
│   └── ui/                 # Minimal design-system components
│       ├── button.tsx
│       ├── badge.tsx
│       ├── progress.tsx
│       ├── input.tsx
│       └── textarea.tsx
└── lib/
    ├── store.ts            # Zustand store + computed helpers
    ├── seed.ts             # Default task pools (15 tasks)
    └── utils.ts            # cn(), formatTime(), formatDate()
```

### State management

All state lives in a single Zustand store (`lib/store.ts`) with the `persist` middleware writing to `localStorage` under the key `hijack-store-v1`. There is no backend.

**Session flow state** — three fields carry context across the picker → task → done screens:
- `pendingCategory` — set on picker, read by task
- `pendingTask` — picked randomly on task screen, read by done
- `pendingStartedAt` — timestamp, used to compute session duration

**Data is append-only** — sessions are never mutated after logging, only prepended to the array.

### Design tokens

| Token | Value | Use |
|---|---|---|
| `parchment` | `#f4ede2` | Page background |
| `ink` | `#2a2620` | Body text |
| `terra` | `#c97b5e` | Primary actions, accent |
| `sage` | `#6b8f71` | Success, completion states |
| Fraunces | serif | Display headings, body |
| JetBrains Mono | mono | Labels, metadata, badges |

---

## v2 ideas

### Integrations
- **Gmail** — scan inbox for "quick reply" emails and surface them as Hustle tasks
- **Google Calendar** — suggest Hustle tasks based on upcoming meetings ("prep 3 talking points for 2pm call")
- **iOS Shortcuts / Android intents** — add a share-sheet shortcut so "Share → Hijack" works from any app

### UX
- **Custom timer lengths** — 30s / 60s / 90s slider on the task screen
- **Snooze mode** — "remind me in 10 minutes" instead of always-on
- **Task tagging** — tag tasks with projects so hustles stay contextual
- **Streak repair** — one "grace day" token per week to protect streaks guilt-free

### Social
- **Community task pools** — browse/import task packs from other users
- **Accountability buddy** — share your daily log with one trusted person
- **Anonymous stats** — opt-in aggregate data ("people like you hijacked 3.2 distractions today")

### Accessibility & polish
- Haptic feedback on timer completion (Web Vibration API)
- Reduced-motion mode (respects `prefers-reduced-motion`)
- PWA manifest + service worker for offline use and home-screen install
