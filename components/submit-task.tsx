'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORY_META } from '@/lib/store'
import type { Category } from '@/lib/store'
import { getUserId } from '@/lib/user-id'
import { getAccessToken } from '@/lib/auth'
import { useStore } from '@/lib/store'

const CATEGORIES: Category[] = ['learn', 'absorb', 'hustle', 'reset']

export function SubmitTask({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const user = useStore((s) => s.user)
  const [text, setText] = useState('')
  const [category, setCategory] = useState<Category>('learn')
  const [isPublic, setIsPublic] = useState(false)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit() {
    if (!text.trim()) return

    // Gate: public submissions require a logged-in account
    if (isPublic && !user) {
      router.push('/auth/login')
      return
    }

    setStatus('submitting')

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }

    if (isPublic) {
      const token = await getAccessToken()
      if (token) headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch('/api/tasks/submit', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text: text.trim(),
        category,
        is_public: isPublic,
        anonymous_user_id: getUserId(),
        note: note.trim() || null,
      }),
    })

    if (res.ok) {
      setStatus('done')
    } else {
      const data = await res.json()
      setErrorMsg(data.error || 'Unknown error')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="border border-ink/10 bg-parchment p-5 animate-fade-in">
        <p className="font-serif text-base font-bold italic text-ink">Submitted.</p>
        <p className="mt-1 font-serif text-sm italic text-ink-light leading-relaxed">
          {isPublic
            ? `Your task is now live in the community pool. Others will see it on the Community page.`
            : `Saved privately to your own task list.`}
        </p>
        <button
          onClick={onClose}
          className="mt-4 font-mono text-[10px] uppercase tracking-widest text-terra underline underline-offset-2"
        >
          close
        </button>
      </div>
    )
  }

  return (
    <div className="border border-ink/10 bg-parchment p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <p className="font-serif text-base font-bold italic text-ink">Share a task</p>
        <button
          onClick={onClose}
          className="font-mono text-[10px] uppercase tracking-widest text-ink-muted hover:text-ink"
        >
          ✕
        </button>
      </div>

      {/* Category */}
      <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-2">category</p>
      <div className="flex gap-1.5 flex-wrap mb-4">
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat]
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                category === cat
                  ? 'border-terra bg-terra text-parchment'
                  : 'border-ink/20 text-ink-muted hover:border-terra/50'
              }`}
            >
              {meta.emoji} {meta.label}
            </button>
          )
        })}
      </div>

      {/* Task text */}
      <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-2">task</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe the task in one or two sentences. Keep it under 2 minutes."
        maxLength={500}
        rows={3}
        className="w-full border border-ink/20 bg-parchment-light p-3 font-serif text-sm text-ink placeholder:text-ink-muted/50 focus:border-terra focus:outline-none resize-none"
      />
      <p className="text-right font-mono text-[9px] text-ink-muted mt-0.5">{text.length}/500</p>

      {/* Optional note */}
      <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-2 mt-3">
        why this task? <span className="normal-case">(optional)</span>
      </p>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What makes this one useful?"
        maxLength={200}
        className="w-full border border-ink/20 bg-parchment-light p-3 font-serif text-sm text-ink placeholder:text-ink-muted/50 focus:border-terra focus:outline-none"
      />

      {/* Public / Private toggle */}
      <div className="mt-4 border border-ink/10 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink">
              {isPublic ? '🌍 Public' : '🔒 Private'}
            </p>
            <p className="mt-0.5 font-serif text-xs italic text-ink-muted leading-snug">
              {isPublic
                ? user
                  ? `Sharing as @${user.username} — visible to everyone`
                  : `Requires an account — you'll be prompted to sign in`
                : 'Only added to your own task list, stays on your device'}
            </p>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`ml-3 flex-shrink-0 w-11 h-6 border-2 transition-colors relative ${
              isPublic ? 'border-terra bg-terra' : 'border-ink/30 bg-parchment-dark'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-parchment transition-all ${
                isPublic ? 'left-[calc(100%-1.1rem)]' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {status === 'error' && (
        <p className="mt-3 font-mono text-[10px] text-terra leading-relaxed">
          {errorMsg || 'Something went wrong — try again'}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!text.trim() || status === 'submitting'}
        className="mt-4 w-full border-2 border-terra bg-terra py-3 font-mono text-[10px] uppercase tracking-widest text-parchment hover:bg-terra-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'submitting'
          ? 'submitting…'
          : isPublic && !user
          ? 'sign in to share publicly →'
          : isPublic
          ? 'share with community →'
          : 'save privately →'}
      </button>
    </div>
  )
}
