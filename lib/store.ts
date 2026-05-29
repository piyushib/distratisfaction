import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SEED_TASKS, generateTasksForGoals } from './seed'
import type { GoalId } from './goals'
import { COMMUNITY_POOLS, type CommunityPoolId } from './community'
export type { Category, Task, Session } from './types'
import type { AuthUser, Category, Task, Session } from './types'

interface DopaState {
  tasks: Task[]
  sessions: Session[]
  // Active session being built across pages
  pendingCategory: Category | null
  pendingTask: Task | null
  pendingStartedAt: number | null
  _hasHydrated: boolean
  // Onboarding
  hasOnboarded: boolean
  hasSeenWelcome: boolean
  selectedGoals: GoalId[]
  // Community pools
  addedCommunityPools: CommunityPoolId[]
  // Auth
  user: AuthUser | null
  authReady: boolean
  stayLoggedIn: boolean
  // Feed filter
  enabledCategories: Category[]
  // Productivity bank (seconds earned from completed tasks)
  productivitySeconds: number
  redeemedSeconds: number

  // Hydration
  setHasHydrated: (v: boolean) => void

  // Auth
  setUser: (user: AuthUser | null) => void
  setAuthReady: (v: boolean) => void
  setStayLoggedIn: (v: boolean) => void
  mergeTasks: (cloudTasks: Task[]) => void
  mergeSessions: (cloudSessions: Session[]) => void
  // Feed filter
  toggleCategory: (cat: Category) => void

  // Onboarding
  setHasSeenWelcome: (v: boolean) => void
  completeOnboarding: (goals: GoalId[]) => void
  resetOnboarding: () => void

  // Community pools
  addCommunityPool: (poolId: CommunityPoolId) => void
  removeCommunityPool: (poolId: CommunityPoolId) => void

  // Session flow
  setPendingCategory: (cat: Category) => void
  setPendingTask: (task: Task) => void
  setPendingStartedAt: (t: number) => void
  logSession: (completed: boolean, note?: string) => void
  clearPending: () => void

  // Task CRUD
  addTask: (cat: Category, text: string) => void
  updateTask: (id: string, text: string) => void
  deleteTask: (id: string) => void

  // Direct session logging (for inline feed flow)
  addSessionDirect: (session: Session) => void
  // Productivity bank
  addProductivitySeconds: (seconds: number) => void
  redeemSeconds: (seconds: number) => void
}

export const useStore = create<DopaState>()(
  persist(
    (set, get) => ({
      tasks: SEED_TASKS,
      sessions: [],
      pendingCategory: null,
      pendingTask: null,
      pendingStartedAt: null,
      _hasHydrated: false,
      hasOnboarded: false,
      hasSeenWelcome: false,
      selectedGoals: [],
      addedCommunityPools: [],
      user: null,
      authReady: false,
      stayLoggedIn: false,
      enabledCategories: ['learn', 'absorb', 'hustle', 'reset'],
      productivitySeconds: 0,
      redeemedSeconds: 0,

      setHasHydrated: (v) => set({ _hasHydrated: v }),

      setUser: (user) => set({ user }),
      setAuthReady: (v) => set({ authReady: v }),
      setStayLoggedIn: (v) => set({ stayLoggedIn: v }),

      mergeTasks: (cloudTasks) => {
        set((state) => {
          const existingIds = new Set(state.tasks.map((t) => t.id))
          const newTasks = cloudTasks.filter((t) => !existingIds.has(t.id))
          return { tasks: [...state.tasks, ...newTasks] }
        })
      },

      mergeSessions: (cloudSessions) => {
        set((state) => {
          const existingIds = new Set(state.sessions.map((s) => s.id))
          const newSessions = cloudSessions.filter((s) => !existingIds.has(s.id))
          return { sessions: [...state.sessions, ...newSessions] }
        })
      },

      setHasSeenWelcome: (v) => set({ hasSeenWelcome: v }),

      toggleCategory: (cat) =>
        set((state) => {
          const enabled = state.enabledCategories
          if (enabled.includes(cat)) {
            // Don't allow disabling the last one
            if (enabled.length === 1) return {}
            return { enabledCategories: enabled.filter((c) => c !== cat) }
          }
          return { enabledCategories: [...enabled, cat] }
        }),

      completeOnboarding: (goals) => {
        const goalTasks = generateTasksForGoals(goals)
        set({
          hasOnboarded: true,
          selectedGoals: goals,
          // Keep universal seeds + add goal-specific tasks (deduped)
          tasks: [...SEED_TASKS, ...goalTasks],
        })
      },

      resetOnboarding: () =>
        set({ hasOnboarded: false, selectedGoals: [], tasks: SEED_TASKS }),

      addCommunityPool: (poolId) => {
        const pool = COMMUNITY_POOLS.find((p) => p.id === poolId)
        if (!pool) return
        const newTasks = pool.tasks.map((t, i) => ({
          id: `community-${poolId}-${i}`,
          category: t.category,
          text: t.text,
          createdAt: 2, // 2 = community-sourced
        }))
        set((state) => ({
          addedCommunityPools: [...state.addedCommunityPools, poolId],
          tasks: [
            ...state.tasks.filter((t) => !t.id.startsWith(`community-${poolId}-`)),
            ...newTasks,
          ],
        }))
      },

      removeCommunityPool: (poolId) => {
        set((state) => ({
          addedCommunityPools: state.addedCommunityPools.filter((id) => id !== poolId),
          tasks: state.tasks.filter((t) => !t.id.startsWith(`community-${poolId}-`)),
        }))
      },

      setPendingCategory: (cat) => set({ pendingCategory: cat }),
      setPendingTask: (task) => set({ pendingTask: task }),
      setPendingStartedAt: (t) => set({ pendingStartedAt: t }),

      logSession: (completed, note) => {
        const { pendingTask, pendingCategory, pendingStartedAt } = get()
        if (!pendingTask || !pendingCategory) return

        const session: Session = {
          id: crypto.randomUUID(),
          taskId: pendingTask.id,
          taskText: pendingTask.text,
          category: pendingCategory,
          completed,
          note,
          startedAt: pendingStartedAt ?? Date.now() - 60000,
          endedAt: Date.now(),
        }

        set((state) => ({
          sessions: [session, ...state.sessions],
          pendingTask: null,
          pendingCategory: null,
          pendingStartedAt: null,
        }))
      },

      clearPending: () =>
        set({ pendingTask: null, pendingCategory: null, pendingStartedAt: null }),

      addTask: (cat, text) => {
        const task: Task = {
          id: crypto.randomUUID(),
          category: cat,
          text: text.trim(),
          createdAt: Date.now(),
        }
        set((state) => ({ tasks: [...state.tasks, task] }))
      },

      updateTask: (id, text) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, text: text.trim() } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      addSessionDirect: (session) =>
        set((state) => ({ sessions: [session, ...state.sessions] })),

      addProductivitySeconds: (seconds) =>
        set((state) => ({ productivitySeconds: state.productivitySeconds + seconds })),

      redeemSeconds: (seconds) =>
        set((state) => ({
          redeemedSeconds: state.redeemedSeconds + seconds,
          productivitySeconds: Math.max(0, state.productivitySeconds - seconds),
        })),
    }),
    {
      name: 'dopa-v1',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

// ── Computed helpers ────────────────────────────────────────────

export function getTasksForCategory(tasks: Task[], cat: Category) {
  return tasks.filter((t) => t.category === cat)
}

export function getRandomTask(tasks: Task[], cat: Category): Task | null {
  const pool = getTasksForCategory(tasks, cat)
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function dayKey(ts: number) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function getTodaySessions(sessions: Session[]) {
  const today = startOfDay(new Date())
  return sessions.filter((s) => s.startedAt >= today)
}

export function getStreak(sessions: Session[]) {
  const completedDays = new Set(
    sessions.filter((s) => s.completed).map((s) => dayKey(s.startedAt))
  )

  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = dayKey(d.getTime())
    if (completedDays.has(key)) {
      streak++
    } else if (i > 0) {
      // Gap found — but allow today to be empty (streak not broken until tomorrow)
      break
    }
  }
  return streak
}

export function getLast7DaysData(sessions: Session[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dayStart = startOfDay(d)
    const dayEnd = dayStart + 86_400_000
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count: sessions.filter((s) => s.startedAt >= dayStart && s.startedAt < dayEnd).length,
      completed: sessions.filter(
        (s) => s.startedAt >= dayStart && s.startedAt < dayEnd && s.completed
      ).length,
    }
  })
}

export const CATEGORY_META = {
  learn:  { label: 'Learn',  emoji: '📖', description: 'knowledge micro-task' },
  absorb: { label: 'Absorb', emoji: '📚', description: 'read · listen · watch' },
  hustle: { label: 'Hustle', emoji: '⚡', description: 'side-hustle micro-task' },
  reset:  { label: 'Reset',  emoji: '🌬️', description: 'breathing & grounding' },
} as const
