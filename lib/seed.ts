import type { Task, Category } from './types'
import { GOAL_TASKS, type GoalId } from './goals'

export function generateTasksForGoals(goals: GoalId[]): Task[] {
  const tasks: Task[] = []
  const categories: Category[] = ['learn', 'absorb', 'hustle', 'reset']

  goals.forEach((goal) => {
    categories.forEach((cat) => {
      const texts = GOAL_TASKS[goal]?.[cat] ?? []
      texts.forEach((text, i) => {
        tasks.push({
          id: `goal-${goal}-${cat}-${i}`,
          category: cat,
          text,
          createdAt: 1,
        })
      })
    })
  })

  return tasks.filter((t, idx, arr) => arr.findIndex((x) => x.id === t.id) === idx)
}

export const SEED_TASKS: Task[] = [
  // ── Learn ──────────────────────────────────────────────────────
  {
    id: 'learn-1',
    category: 'learn',
    text: 'Pick one word from your environment and look up its etymology on Etymonline. Surprise yourself.',
    createdAt: 0,
    duration: 90,
  },
  {
    id: 'learn-2',
    category: 'learn',
    text: 'Open Wikipedia to a random article. Read the first two paragraphs only — absorb one interesting fact.',
    createdAt: 0,
    duration: 90,
  },
  {
    id: 'learn-3',
    category: 'learn',
    text: 'Think of a skill you want to learn. Write one sentence describing the very first micro-step to start.',
    createdAt: 0,
    duration: 60,
  },
  {
    id: 'learn-4',
    category: 'learn',
    text: `Name a keyboard shortcut you've always seen but never used. Look it up, try it once right now.`,
    createdAt: 0,
    duration: 60,
  },
  {
    id: 'learn-5',
    category: 'learn',
    text: 'Say one thing out loud that you learned this week — even something tiny. Hearing it cements it.',
    createdAt: 0,
    duration: 45,
  },

  // ── Absorb ─────────────────────────────────────────────────────
  {
    id: 'absorb-1',
    category: 'absorb',
    text: `Open your reading app and read for 60 seconds. Just the words — nothing else.`,
    createdAt: 0,
    duration: 60,
  },
  {
    id: 'absorb-2',
    category: 'absorb',
    text: `Put on an audiobook or podcast and listen for 60 seconds with your eyes closed.`,
    createdAt: 0,
    duration: 60,
  },
  {
    id: 'absorb-3',
    category: 'absorb',
    text: `Open Libby and browse your library's available books. Find one you want to borrow.`,
    createdAt: 0,
    duration: 120,
  },
  {
    id: 'absorb-4',
    category: 'absorb',
    text: `Resume the book you've been neglecting. One page. That's all.`,
    createdAt: 0,
    duration: 120,
  },
  {
    id: 'absorb-5',
    category: 'absorb',
    text: `Read the first page of a book you haven't opened yet. Just the first page.`,
    createdAt: 0,
    duration: 90,
  },

  // ── Hustle ─────────────────────────────────────────────────────
  {
    id: 'hustle-1',
    category: 'hustle',
    text: `Write three bullet points: what problem you're solving, who has that problem, and why you're the one to solve it.`,
    createdAt: 0,
    duration: 120,
  },
  {
    id: 'hustle-2',
    category: 'hustle',
    text: `Reply to one message you've been putting off — even just "On it, more soon." Sent is better than perfect.`,
    createdAt: 0,
    duration: 90,
  },
  {
    id: 'hustle-3',
    category: 'hustle',
    text: `Block 20 minutes on tomorrow's calendar for the one task you keep delaying. Name it something honest.`,
    createdAt: 0,
    duration: 90,
  },
  {
    id: 'hustle-4',
    category: 'hustle',
    text: 'Write one honest sentence describing your current project to a stranger at a coffee shop.',
    createdAt: 0,
    duration: 60,
  },
  {
    id: 'hustle-5',
    category: 'hustle',
    text: 'Open your notes and delete or archive three things that are no longer relevant. Clear space, clear mind.',
    createdAt: 0,
    duration: 90,
  },

  // ── Reset ──────────────────────────────────────────────────────
  {
    id: 'reset-1',
    category: 'reset',
    text: 'Box breathe: inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat four times. Eyes closed if you can.',
    createdAt: 0,
    duration: 64,
  },
  {
    id: 'reset-2',
    category: 'reset',
    text: `Stand up. Roll your shoulders back five slow times. Name three things within arm's reach out loud.`,
    createdAt: 0,
    duration: 60,
  },
  {
    id: 'reset-3',
    category: 'reset',
    text: 'Close your eyes. Feel your feet flat on the floor. Take five slow belly breaths. Count them.',
    createdAt: 0,
    duration: 60,
  },
  {
    id: 'reset-4',
    category: 'reset',
    text: `Write down one thing you're anxious about right now. Under it, write the one smallest possible next step.`,
    createdAt: 0,
    duration: 90,
  },
  {
    id: 'reset-5',
    category: 'reset',
    text: 'Look out the nearest window for 60 seconds. No phone. No task. Just let your eyes go soft and rest.',
    createdAt: 0,
    duration: 60,
  },
]
