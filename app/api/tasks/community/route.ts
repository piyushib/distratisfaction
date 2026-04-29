import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('community_tasks')
    .select('id, text, category, anonymous_user_id, submitted_at')
    .eq('status', 'approved')
    .eq('is_public', true)
    .order('submitted_at', { ascending: false })
    .limit(200)

  if (error) {
    console.error('Supabase fetch error:', error)
    return NextResponse.json({ tasks: [] }, { status: 500 })
  }

  return NextResponse.json({ tasks: data ?? [] })
}
