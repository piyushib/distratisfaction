import { supabase } from './supabase'
import type { AuthUser } from './types'

export async function signUp(
  email: string,
  password: string,
  username: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  const trimmedUsername = username.trim().toLowerCase()

  // Check username uniqueness first
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', trimmedUsername)
    .maybeSingle()

  if (existing) {
    return { user: null, error: 'Username already taken — try another' }
  }

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error || !data.user) {
    return { user: null, error: error?.message ?? 'Sign up failed' }
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: data.user.id, username: trimmedUsername })

  if (profileError) {
    return { user: null, error: profileError.message }
  }

  return {
    user: { id: data.user.id, email: data.user.email!, username: trimmedUsername },
    error: null,
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    return { user: null, error: error?.message ?? 'Sign in failed' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', data.user.id)
    .single()

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      username: profile?.username ?? '',
    },
    error: null,
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', session.user.id)
    .single()

  return {
    id: session.user.id,
    email: session.user.email!,
    username: profile?.username ?? '',
  }
}

export async function getAccessToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token ?? null
}
