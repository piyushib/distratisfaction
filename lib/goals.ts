import type { Category } from './types'

export type GoalId =
  | 'build'
  | 'learn'
  | 'read'
  | 'fitness'
  | 'stress'
  | 'career'
  | 'creative'
  | 'finance'
  | 'slow-down'

export type Goal = {
  id: GoalId
  emoji: string
  label: string
  description: string
}

export type AppLink = {
  name: string
  emoji: string
  webUrl: string
}

export const GOALS: Goal[] = [
  { id: 'build',     emoji: '🏗️', label: 'Build a side project',  description: 'validate ideas, write copy, ship things' },
  { id: 'learn',     emoji: '🧠', label: 'Learn something new',    description: 'grow your knowledge every day' },
  { id: 'read',      emoji: '📚', label: 'Read more',              description: 'books, articles, audiobooks' },
  { id: 'fitness',   emoji: '💪', label: 'Health & fitness',       description: 'move, stretch, feel better' },
  { id: 'stress',    emoji: '🧘', label: 'Reduce stress',          description: 'calm the noise, find ground' },
  { id: 'career',    emoji: '💼', label: 'Career growth',          description: 'advance, network, upskill' },
  { id: 'creative',  emoji: '✍️', label: 'Writing & creativity',   description: 'make things, write things' },
  { id: 'finance',   emoji: '💰', label: 'Sort my finances',       description: 'budget, save, stop avoiding it' },
  { id: 'slow-down', emoji: '🌱', label: 'Just slow down',         description: 'less doing, more being' },
]

// App shortcuts shown on the task screen for specific categories
export const CATEGORY_APP_LINKS: Partial<Record<Category, AppLink[]>> = {
  absorb: [
    { name: 'Libby',   emoji: '📗', webUrl: 'https://libbyapp.com' },
    { name: 'Audible', emoji: '🎧', webUrl: 'https://audible.com/library' },
    { name: 'Kindle',  emoji: '📱', webUrl: 'https://read.amazon.com' },
  ],
  hustle: [
    { name: 'LinkedIn',  emoji: '💼', webUrl: 'https://linkedin.com/feed' },
    { name: 'Indeed',    emoji: '🔍', webUrl: 'https://indeed.com' },
    { name: 'Glassdoor', emoji: '🏢', webUrl: 'https://glassdoor.com' },
  ],
}

// Task text keyed by goal → category (Partial — not every goal needs every category)
export const GOAL_TASKS: Record<GoalId, Partial<Record<Category, string[]>>> = {
  build: {
    learn: [
      `Search "[your project] problem reddit" and skim one thread. What are people actually frustrated about?`,
      `Look up one competitor. Read only their tagline and first paragraph. What do they emphasize? What's missing?`,
      `Think of one assumption baked into your idea. Write it down so you can test it later.`,
      `Find one open-source tool or API that could save you time on your project. Bookmark it.`,
      `Read the first two paragraphs of a "how to validate your idea" article. Write one thing that applies.`,
    ],
    absorb: [
      `Open your reading app and read 2 pages about entrepreneurship, product, or your industry.`,
      `Listen to 60 seconds of a startup or business podcast. What's one thing that applies to your project?`,
      `Find a book about building products or businesses. Read the first page.`,
    ],
    hustle: [
      `Write a one-sentence value prop: "[App] helps [who] do [what] without [pain]." Fill in the blanks.`,
      `Name three types of people who might pay for what you're building. Just names — no analysis yet.`,
      `Write the subject line of an email you'd send to your first 10 users.`,
      `Write the first sentence of your about page. Who you are, why this exists.`,
      `Open your project notes. Archive anything you haven't looked at in a week. Clear space, clear mind.`,
    ],
    reset: [
      `Close your eyes and picture shipping it. Hold that feeling for 30 seconds. Come back.`,
      `Write down the fear that's slowing you down right now. Then write one reason it's smaller than it feels.`,
      `Box breathe while thinking about your project: in 4s, hold 4s, out 4s, hold 4s. Four rounds.`,
      `Write one word that describes how you want people to feel when they use what you're building.`,
      `Step away from the screen. Your best ideas never come while staring at it. Just breathe.`,
    ],
  },

  learn: {
    learn: [
      `Open a learning resource you bookmarked and actually read two paragraphs of it right now.`,
      `Write down one concept you learned this week in your own words. Teaching = remembering.`,
      `Find one question on a forum about a topic you're learning. Read the top answer.`,
      `Think of a subject you dismissed as "not for you." Look up the most beginner-friendly intro.`,
      `Write down the three things you most want to learn this year, ranked. Just rank them.`,
    ],
    absorb: [
      `Open your reading app and read 2 pages from the book you're learning from right now.`,
      `Listen to 60 seconds of an educational podcast. Pause and write one thing you want to remember.`,
      `Find a book on a subject you've been curious about. Read the first page.`,
    ],
    hustle: [
      `Find one course, book, or resource for a skill you've been saying you'll learn. Bookmark the actual page.`,
      `Schedule a 30-minute learning block somewhere in your week. Put it in your calendar now.`,
      `Write a 3-step mini-syllabus for one thing you want to learn. Step 1, step 2, step 3.`,
      `Find one person who does what you want to learn. Read one paragraph about their path.`,
      `Write down one question you've been too embarrassed to Google. Then Google it.`,
    ],
    reset: [
      `Breathe through "I don't know enough yet." Everyone started at zero. Four slow breaths.`,
      `Name one thing you know now that you didn't know a year ago. Say it out loud.`,
      `Write down one thing you're confused about right now. Naming the confusion is the first step.`,
      `Close your eyes. Think about why you want to learn this. Hold that reason for 30 seconds.`,
      `Notice where in your body the frustration of learning lives. Breathe into it for 30 seconds.`,
    ],
  },

  read: {
    learn: [
      `Find the Wikipedia page for a book you want to read. Read the first two paragraphs.`,
      `Search "best books on [a topic you care about]" and add one result to your reading list.`,
      `Read the back cover or description of a book near you right now. Does it interest you?`,
      `Find out what book someone you admire recommends. Add it to your list.`,
      `Read one paragraph about how reading fiction builds empathy. Then go read some fiction.`,
    ],
    absorb: [
      `Open your reading app and read for 60 seconds. Fully present — no switching.`,
      `Resume your current audiobook. 60 seconds, eyes closed if you can.`,
      `Open the book you've been meaning to start. Read just the first page.`,
      `Open Libby and browse what's available from your library. Find something for this week.`,
      `Listen to one chapter of an audiobook. Really listen — don't multitask.`,
    ],
    hustle: [
      `Find one book that would help a skill you want to build. Add it to your list or borrow it now.`,
      `Write down one concept from a book you've read that actually changed how you work or think.`,
      `Find a book that someone in your dream role recommends. Note it somewhere you'll find it.`,
      `Add 3 books to a "want to read" list in your notes app. No overthinking — gut instinct.`,
      `Find a reading app you haven't tried. Download it and open one book.`,
    ],
    reset: [
      `Read one poem. The whole thing, slowly. Let the words land.`,
      `Read one paragraph from a book that comforts you. Something you've read before.`,
      `Close your eyes and think about the last book that really moved you. Hold it for 30 seconds.`,
      `Open a book — any book. Read the first paragraph. Let yourself disappear for a moment.`,
      `Find a short essay or piece you've been meaning to read. Start the first paragraph.`,
    ],
  },

  fitness: {
    learn: [
      `Look up one mobility exercise you've never tried. Find a 30-second demo and watch it.`,
      `Read one paragraph about the physical benefits of the activity you already enjoy most.`,
      `Look up the proper form for one exercise you're not 100% sure you're doing right.`,
      `Read about one recovery technique — foam rolling, cold exposure, sleep position. One paragraph.`,
      `Look up one healthy ingredient you've been curious about. Just one. What does it actually do?`,
    ],
    absorb: [
      `Listen to 60 seconds of a fitness or health podcast. What's one thing you want to try?`,
      `Open your reading app and find a book about movement, health, or nutrition. Read the first page.`,
    ],
    hustle: [
      `Do 10 bodyweight squats right now. Stand up and do them.`,
      `Do a 45-second wall sit. Start now — the timer's already running.`,
      `Do 10 slow, controlled push-ups. Drop to your knees if needed — still counts.`,
      `Stand up and take a brisk 60-second walk around your space. Go.`,
      `Roll your shoulders back 10 times, then forward 10 times. Slowly and deliberately.`,
    ],
    reset: [
      `Full body shake: shake your hands, then arms, then whole body for 30 seconds. Weird but it works.`,
      `Stand up, arms overhead, get tall. Hold for 10 seconds. Notice where the tension is.`,
      `Slow neck rolls: 5 times to the left, 5 to the right. Breathe through it.`,
      `Press your feet into the floor. Roll your ankles 5 times each. Feel your body.`,
      `Close your eyes and scan from toes to head. Where are you holding tension? Breathe into it.`,
    ],
  },

  stress: {
    learn: [
      `Read one paragraph about a coping technique you haven't tried — progressive muscle relaxation, cold water, journaling.`,
      `Look up the "5-4-3-2-1 grounding technique" if you haven't seen it. Read how to do it.`,
      `Read two paragraphs about how slow breathing affects the nervous system. Just curiosity.`,
      `Look up one study-backed tip for reducing cortisol that you could do today.`,
      `Read one paragraph about the difference between anxiety and excitement. They feel the same, physically.`,
    ],
    absorb: [
      `Open your reading app and read one calming page of fiction. Let someone else's world carry you.`,
      `Listen to 60 seconds of a meditation or calming podcast. Eyes closed.`,
    ],
    hustle: [
      `Write down everything in your head right now. The whole worry list. Get it out — no action required.`,
      `Pick the one thing causing the most stress. Write one next step. Just one step.`,
      `Look at your calendar for the next three days. Is there anything you can reschedule or drop?`,
      `Write an honest "not-to-do list" — three things you're going to stop trying to do this week.`,
      `Find one commitment you wish you hadn't made. Draft a polite "I need to step back" message (don't send yet).`,
    ],
    reset: [
      `5-4-3-2-1: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Slowly.`,
      `Place one hand on your chest. Feel it rise and fall. Five slow breaths focusing only on that sensation.`,
      `Close your eyes. Picture a place where you feel completely safe. Stay there for 45 seconds.`,
      `Tense every muscle in your body for 5 seconds, then release. Repeat twice. Notice the difference.`,
      `Write one sentence: "Right now, I'm feeling…" without judging what comes out.`,
    ],
  },

  career: {
    learn: [
      `Read one paragraph of an industry newsletter or article you've been ignoring.`,
      `Look up one person in a role you want. Read their bio — note one thing they did you hadn't considered.`,
      `Search "[your field] trends 2025" and read just the headlines. What's moving?`,
      `Look up a job description for a role you want. What's listed that you haven't focused on?`,
      `Think of one skill gap at work. Look up the best free resource to start closing it.`,
    ],
    absorb: [
      `Open your reading app and read 2 pages of a career, leadership, or skills book.`,
      `Listen to 60 seconds of a career or industry podcast. What's one takeaway?`,
      `Find a book written by someone in a role you want. Read the first page.`,
    ],
    hustle: [
      `Update one bullet on your LinkedIn or resume to be more specific and results-focused.`,
      `Write one sentence describing the professional problem you most want to solve in the next year.`,
      `Think of one person you respect professionally. Draft the first sentence of a "catching up" message.`,
      `Write down one skill you consistently undersell. How would you say it more confidently?`,
      `List three companies you'd actually want to work at or with. Just name them — no action yet.`,
    ],
    reset: [
      `Write down one professional win from the past month, however small. It counts.`,
      `Remember why you got into your field in the first place. Write one sentence about it.`,
      `Breathe through imposter syndrome for 60 seconds. Everyone feels it — even the people you admire.`,
      `Close your eyes and picture yourself 2 years from now after consistent small effort. Hold it for 30 seconds.`,
      `Write one thing you know how to do that you didn't know how to do a year ago.`,
    ],
  },

  creative: {
    learn: [
      `Read one paragraph of writing by someone you admire. Read it slowly. What did they do that you noticed?`,
      `Look up one word you've been wanting to use. Find it in an actual sentence.`,
      `Find one piece of work in your field that intimidates you a little. Look at it for 60 seconds.`,
      `Read about one creative technique — oblique strategies, mind mapping, morning pages. One paragraph.`,
      `Look up the origin or history of a creative concept you use or want to use.`,
    ],
    absorb: [
      `Open your reading app and read one page of writing by someone whose voice you want to absorb.`,
      `Listen to 60 seconds of an interview with a writer, artist, or creator you admire.`,
      `Find a book about creativity or craft. Read the first page.`,
    ],
    hustle: [
      `Write one sentence of your current project. Just one. First sentence that comes — don't edit.`,
      `Name a character, scene, or idea you want to explore. Write three adjectives describing it.`,
      `Open your drafts. Pick the one closest to shareable. Write the one thing holding it back.`,
      `Write a one-paragraph pitch for a project you've been sitting on. Pretend you're excited.`,
      `Write down the most "too weird" idea you've had lately. The weird ones are usually the right ones.`,
    ],
    reset: [
      `Free-write for 60 seconds. No editing, no backspace. Start with "Right now I want to make…"`,
      `Close your eyes and let an image or scene come. Don't chase it — let it appear. One sentence to describe it.`,
      `Breathe through the fear of the blank page. It's not a threat — it's an invitation. Four slow breaths.`,
      `Write the most honest thing about your creative work right now, even if it's "I'm scared it's bad."`,
      `Remember one piece of your work that you're proud of. Hold it in mind for 30 seconds.`,
    ],
  },

  finance: {
    learn: [
      `Look up one financial term you've been fuzzy on — compound interest, index fund, emergency fund. One paragraph.`,
      `Read about the 50/30/20 budget rule. Does it apply to your situation?`,
      `Look up the average salary for your role in your city. Is the number surprising?`,
      `Find one money myth you believed that isn't true. "I can't invest until I'm debt-free" is a classic.`,
      `Read one paragraph about the difference between a want and a need — for your actual life, not a textbook.`,
    ],
    absorb: [
      `Open your reading app and read 2 pages of a personal finance book you've been meaning to start.`,
      `Listen to 60 seconds of a finance or money podcast. What's one thing you want to apply?`,
    ],
    hustle: [
      `Write your top 3 monthly expenses from memory. Are they aligned with what you actually care about?`,
      `Name one subscription you're paying for that you haven't used this month. Just name it.`,
      `Write your current financial goal in one honest sentence: "I want to _____ by _____."`,
      `Check your last 5 transactions. Anything surprising? Write it down without judgment.`,
      `Write one concrete thing you could do this month to spend $20 less. Just one.`,
    ],
    reset: [
      `Money anxiety is real. Breathe through it for 60 seconds. You're not behind — you're starting.`,
      `Write one financial thing you've handled well this year. Evidence that you can do this.`,
      `Close your eyes. Picture yourself one year from now with one financial stress resolved. Hold it.`,
      `Box breathe: in 4, hold 4, out 4, hold 4. Four rounds. Problems feel smaller after oxygen.`,
      `Write one limiting belief you have about money. Then write one reason it might not be entirely true.`,
    ],
  },

  'slow-down': {
    learn: [
      `Read one poem. The whole thing. Don't skim.`,
      `Read two paragraphs about the Japanese concept of "ma" — the pause, the space between things.`,
      `Find a piece of music you've never heard. Listen for 60 seconds with your eyes closed.`,
      `Read one paragraph about attention — how rare it is, and one way to reclaim it.`,
      `Look up "slow living" and read one paragraph. Note the one idea that resonates most.`,
    ],
    absorb: [
      `Open your reading app and read one page of something slow and beautiful. No skimming.`,
      `Listen to 60 seconds of an audiobook or podcast with your eyes closed. Really listen.`,
      `Find a collection of poetry on Libby or Kindle. Read one poem.`,
    ],
    hustle: [
      `Write one thing you're going to stop doing this week. Put it in writing — it's now a decision.`,
      `Look at your commitments this week. Name the one that doesn't deserve your full energy.`,
      `Write a "slow morning" routine you'd actually want to do. Three steps, five minutes each.`,
      `Set one boundary you've been avoiding. Write it down. You don't have to send it yet.`,
      `Name the one recurring thing that drains you most. Write one way to reduce its frequency.`,
    ],
    reset: [
      `Look out the nearest window for 60 full seconds. No phone. Let your gaze go soft.`,
      `Close your eyes. Just listen. Name five sounds you can hear right now, from quiet to loud.`,
      `Notice your jaw, shoulders, hands. Are they clenched? Unclench them slowly. Breathe.`,
      `Do nothing for 60 seconds. Literally nothing. If a thought comes, let it pass. Be still.`,
      `Sit with both feet flat on the floor. Feel the weight of your body. Five slow breaths.`,
    ],
  },
}
