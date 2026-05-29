'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { pullTasksFromCloud, pullSessionsFromCloud } from '@/lib/sync'
import { useStore } from '@/lib/store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useStore((s) => s.setUser)
  const setAuthReady = useStore((s) => s.setAuthReady)
  const mergeTasks = useStore((s) => s.mergeTasks)
  const mergeSessions = useStore((s) => s.mergeSessions)

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser()
      if (user) {
        setUser(user)
        const [cloudTasks, cloudSessions] = await Promise.all([
          pullTasksFromCloud(user.id),
          pullSessionsFromCloud(user.id),
        ])
        mergeTasks(cloudTasks)
        mergeSessions(cloudSessions)
      }
      // Mark auth check complete — page.tsx waits for this before redirecting
      setAuthReady(true)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const user = await getCurrentUser()
        if (user) {
          setUser(user)
          const [cloudTasks, cloudSessions] = await Promise.all([
            pullTasksFromCloud(user.id),
            pullSessionsFromCloud(user.id),
          ])
          mergeTasks(cloudTasks)
          mergeSessions(cloudSessions)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return <>{children}</>
}
