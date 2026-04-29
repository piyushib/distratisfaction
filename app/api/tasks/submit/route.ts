import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// ── Content safety ───────────────────────────────────────────────
// Basic server-side checks before anything hits the database.
// Not a replacement for moderation, but stops obvious abuse.

const BLOCKED_PATTERNS = [
  // URLs / links
  /https?:\/\//i,
  /www\.\S+\.\S+/i,
  // Phone numbers
  /\b\d{3}[\s.-]\d{3}[\s.-]\d{4}\b/,
  // Emails
  /\S+@\S+\.\S+/,
  // Slurs and explicit terms (extend as needed)
  /\b(fuck|shit|cunt|nigger|faggot|retard)\b/i,
  // Self-harm / crisis trigger phrases
  /\b(kill yourself|kys|end your life|commit suicide)\b/i,
  // Spam patterns
  /\b(buy now|click here|free money|make \$|onlyfans)\b/i,
]

const MAX_REPEATED_CHARS = 8 // e.g. "aaaaaaaaaa" = spam

function isSafe(text: string): { safe: boolean; reason?: string } {
  if (text.length < 10) return { safe: false, reason: 'Too short' }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) {
      return { safe: false, reason: 'Contains disallowed content' }
    }
  }

  // Check for excessive repeated characters
  if (/(.)\1{8,}/.test(text)) {
    return { safe: false, reason: 'Contains spam-like patterns' }
  }

  // Check ratio of non-alpha characters (catches gibberish/symbol spam)
  const alphaCount = (text.match(/[a-zA-Z\s]/g) || []).length
  if (alphaCount / text.length < 0.5) {
    return { safe: false, reason: 'Too many non-text characters' }
  }

  return { safe: true }
}

// ── Rate limiting (in-memory, resets on cold start) ──────────────
// Simple per-user cap: max 10 submissions per hour
const submissionLog = new Map<string, number[]>()

function isRateLimited(userId: string): boolean {
  const now = Date.now()
  const hour = 60 * 60 * 1000
  const timestamps = (submissionLog.get(userId) || []).filter((t) => now - t < hour)
  if (timestamps.length >= 10) return true
  submissionLog.set(userId, [...timestamps, now])
  return false
}

// ── Handler ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { text, category, is_public, anonymous_user_id, note } = body

  if (!text || !category || !anonymous_user_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!['learn', 'absorb', 'hustle', 'reset'].includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  // Rate limit
  if (isRateLimited(anonymous_user_id)) {
    return NextResponse.json(
      { error: 'Too many submissions — try again later' },
      { status: 429 }
    )
  }

  // Public submissions require a valid auth token + username
  let username: string | null = null
  if (is_public) {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Sign in required to share publicly' },
        { status: 401 }
      )
    }
    const token = authHeader.slice(7)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid session — please sign in again' },
        { status: 401 }
      )
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
    username = profile?.username ?? null

    // Content safety
    const check = isSafe(text)
    if (!check.safe) {
      return NextResponse.json(
        { error: `Task can't be shared publicly: ${check.reason}` },
        { status: 422 }
      )
    }
    if (note) {
      const noteCheck = isSafe(note)
      if (!noteCheck.safe) {
        return NextResponse.json(
          { error: `Note can't be shared publicly: ${noteCheck.reason}` },
          { status: 422 }
        )
      }
    }
  }

  const { error } = await supabase
    .from('community_tasks')
    .insert({
      text: text.trim().slice(0, 500),
      category,
      is_public: !!is_public,
      status: is_public ? 'approved' : 'private',
      anonymous_user_id,
      username,
      note: note?.trim().slice(0, 200) || null,
    })

  if (error) {
    return NextResponse.json(
      { error: error.message, code: error.code, details: error.details },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
