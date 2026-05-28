export type Category = 'learn' | 'absorb' | 'hustle' | 'reset'

export type AuthUser = {
  id: string
  email: string
  username: string
}

export type Task = {
  id: string
  category: Category
  text: string
  createdAt: number
  duration?: number  // seconds — defaults to 120 if unset
}

export type Session = {
  id: string
  taskId: string
  taskText: string
  category: Category
  completed: boolean
  note?: string
  startedAt: number
  endedAt: number
}
