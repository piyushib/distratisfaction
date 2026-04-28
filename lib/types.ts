export type Category = 'learn' | 'absorb' | 'hustle' | 'reset'

export type Task = {
  id: string
  category: Category
  text: string
  createdAt: number
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
