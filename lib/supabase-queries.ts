/**
 * Direct Supabase client calls — replaces the /api/tasks/* routes
 * Used in the static/Capacitor build where server API routes don't exist.
 */
import { supabase } from './supabase'
import type { Category } from './types'

// ── Content safety ────────────────────────────────────────────────
const BLOCKED_PATTERNS = [
  /https?:\/\//i,
  /\S+@\S+\.\S+/,
  /\b(fuck|shit|bitch|asshole|cunt|dick|pussy|cock|bastard|whore|nigger|faggot)\b/i,
  /\b(kill|murder|suicide|self.harm|rape)\b/i,
  /\b(buy now|click here|discount code|promo|affiliate)\b/i,
]

function isSafe(text: string): { safe: boolean; reason?: string } {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) return { safe: false, reason: 'Content not allowed' }
  }
  if (text.trim().length < 10) return { safe: false, reason: 'Too short' }
  if (text.length > 500) return { safe: false, reason: 'Too long' }
  return { safe: true }
}

// ── Task stats ────────────────────────────────────────────────────
export async function fetchTaskStats(): Promise<Record<string, number>> {
  const { data } = await supabase
    .from('task_stats')
    .select('task_id, completions')
  const stats: Record<string, number> = {}
  for (const row of data ?? []) {
    stats[row.task_id] = row.completions
  }
  return stats
}

export async function incrementTaskCompletion(taskId: string): Promise<void> {
  await supabase.rpc('increment_task_completion', { p_task_id: taskId })
}

// ── Community tasks ───────────────────────────────────────────────
export type CommunityTask = {
  id: string
  text: string
  category: Category
  username: string | null
  submitted_at: string
}

export async function fetchCommunityTasks(): Promise<CommunityTask[]> {
  const { data } = await supabase
    .from('community_tasks')
    .select('id, text, category, username, submitted_at')
    .eq('status', 'approved')
    .eq('is_public', true)
    .order('submitted_at', { ascending: false })
    .limit(200)
  return (data ?? []) as CommunityTask[]
}

// ── Submit task ───────────────────────────────────────────────────
export async function submitTask(params: {
  text: string
  category: Category
  isPublic: boolean
  anonymousUserId: string
  note?: string
  username?: string
}): Promise<{ ok: boolean; error?: string }> {
  const { text, category, isPublic, anonymousUserId, note, username } = params

  if (isPublic) {
    const check = isSafe(text)
    if (!check.safe) return { ok: false, error: `Task can't be shared: ${check.reason}` }
    if (note) {
      const noteCheck = isSafe(note)
      if (!noteCheck.safe) return { ok: false, error: `Note can't be shared: ${noteCheck.reason}` }
    }
  }

  const { error } = await supabase.from('community_tasks').insert({
    text: text.trim().slice(0, 500),
    category,
    is_public: isPublic,
    status: isPublic ? 'approved' : 'private',
    anonymous_user_id: anonymousUserId,
    username: isPublic ? (username ?? null) : null,
    note: note?.trim().slice(0, 200) ?? null,
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
