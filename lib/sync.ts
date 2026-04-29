import { supabase } from './supabase'
import type { Task, Session } from './types'

// Only sync user-created tasks (not seeds createdAt=0, not community createdAt=2)
function isUserTask(t: Task) {
  return t.createdAt > 2 && !t.id.startsWith('community-')
}

export async function pushTasksToCloud(userId: string, tasks: Task[]) {
  const userTasks = tasks.filter(isUserTask)
  if (userTasks.length === 0) return

  await supabase.from('user_tasks').upsert(
    userTasks.map((t) => ({
      id: t.id,
      user_id: userId,
      category: t.category,
      text: t.text,
      created_at: t.createdAt,
    })),
    { onConflict: 'id' }
  )
}

export async function pullTasksFromCloud(userId: string): Promise<Task[]> {
  const { data } = await supabase
    .from('user_tasks')
    .select('id, category, text, created_at')
    .eq('user_id', userId)

  if (!data) return []
  return data.map((row) => ({
    id: row.id,
    category: row.category,
    text: row.text,
    createdAt: row.created_at,
  }))
}

export async function pushSessionsToCloud(userId: string, sessions: Session[]) {
  if (sessions.length === 0) return

  await supabase.from('user_sessions').upsert(
    sessions.map((s) => ({
      id: s.id,
      user_id: userId,
      task_text: s.taskText,
      category: s.category,
      completed: s.completed,
      note: s.note ?? null,
      started_at: s.startedAt,
      ended_at: s.endedAt,
    })),
    { onConflict: 'id' }
  )
}

export async function pullSessionsFromCloud(userId: string): Promise<Session[]> {
  const { data } = await supabase
    .from('user_sessions')
    .select('id, task_text, category, completed, note, started_at, ended_at')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(500)

  if (!data) return []
  return data.map((row) => ({
    id: row.id,
    taskId: '',
    taskText: row.task_text,
    category: row.category,
    completed: row.completed,
    note: row.note ?? undefined,
    startedAt: row.started_at,
    endedAt: row.ended_at,
  }))
}
