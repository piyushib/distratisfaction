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

  // Don't use .select().single() after insert — RLS may block the read-back
  const { error } = await supabase
    .from('community_tasks')
    .insert({
      text: text.trim().slice(0, 500),
      category,
      is_public: !!is_public,
      status: is_public ? 'pending' : 'private',
      anonymous_user_id,
      note: note?.trim().slice(0, 200) || null,
    })

  if (error) {
    // Return the actual error so we can diagnose it
    return NextResponse.json(
      { error: error.message, code: error.code, details: error.details },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
