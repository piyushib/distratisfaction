import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

export type CommunityTaskRow = {
  id: string
  text: string
  category: 'learn' | 'absorb' | 'hustle' | 'reset'
  status: 'pending' | 'approved' | 'rejected'
  is_public: boolean
  anonymous_user_id: string
  note: string | null
  submitted_at: string
}
