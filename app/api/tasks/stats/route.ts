import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('task_stats')
    .select('task_id, completions')

  if (error) {
    return NextResponse.json({ stats: {} }, { status: 500 })
  }

  const stats: Record<string, number> = {}
  for (const row of data ?? []) {
    stats[row.task_id] = row.completions
  }

  return NextResponse.json({ stats })
}

export async function POST(req: NextRequest) {
  const { task_id } = await req.json()
  if (!task_id) return NextResponse.json({ error: 'Missing task_id' }, { status: 400 })

  const { error } = await supabase.rpc('increment_task_completion', { p_task_id: task_id })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
