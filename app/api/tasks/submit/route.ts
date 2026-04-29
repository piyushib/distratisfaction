import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { text, category, is_public, anonymous_user_id, note } = body

  if (!text || !category || !anonymous_user_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!['learn', 'absorb', 'hustle', 'reset'].includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('community_tasks')
    .insert({
      text: text.trim().slice(0, 500), // cap length
      category,
      is_public: !!is_public,
      status: is_public ? 'pending' : 'private',
      anonymous_user_id,
      note: note?.trim().slice(0, 200) || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Failed to submit task' }, { status: 500 })
  }

  return NextResponse.json({ task: data }, { status: 201 })
}
