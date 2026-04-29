import type { Category } from './types'

export type CommunityPoolId = 'writers' | 'founders' | 'students' | 'recovery'

export type CommunityPool = {
  id: CommunityPoolId
  name: string
  emoji: string
  tagline: string
  description: string
  month: string // "rotating monthly" label
  tasks: { category: Category; text: string }[]
}

export const COMMUNITY_POOLS: CommunityPool[] = [
  {
    id: 'writers',
    name: 'Writers',
    emoji: '✍️',
    tagline: 'For the ones who write — or want to.',
    description: 'Prompts and micro-tasks from writers who use distraction as procrastination fuel. Two minutes to get unstuck.',
    month: 'May 2026',
    tasks: [
      { category: 'learn',  text: `Read one paragraph from a writer you admire. Notice one technique — sentence length, punctuation, rhythm. Just one.` },
      { category: 'learn',  text: `Look up the word "liminal." Read its definition slowly. What would a liminal character in your story look like?` },
      { category: 'learn',  text: `Find a short poem you've never read. Read it twice — once for meaning, once for sound.` },
      { category: 'learn',  text: `Read the first sentence of five different books. Which one pulls you in? Why?` },
      { category: 'absorb', text: `Open your reading app and read two pages of the book you're currently in. Just two.` },
      { category: 'absorb', text: `Listen to two minutes of an audiobook or interview with a writer. What's one thing they said about their process?` },
      { category: 'absorb', text: `Find a short essay online about a craft topic — voice, structure, revision. Read the opening paragraph.` },
      { category: 'hustle', text: `Write one sentence about your current project — not a summary, the feeling of it.` },
      { category: 'hustle', text: `Open your draft. Find the last sentence you wrote. Write the next one. Just one.` },
      { category: 'hustle', text: `Write down the thing your character (or essay, or piece) is secretly about. Not the plot — the underneath.` },
      { category: 'hustle', text: `Name one scene or section you've been avoiding. Write one sentence of it — even the wrong one.` },
      { category: 'hustle', text: `Write your working title. Then write three alternatives. The third one is usually better.` },
      { category: 'reset',  text: `Free-write for two minutes. No editing. Start with "The thing I haven't written yet is…"` },
      { category: 'reset',  text: `Close your eyes. Picture your project finished and out in the world. Who reads it? Hold that for 30 seconds.` },
      { category: 'reset',  text: `Breathe through the blank page. It's not an enemy — it's just waiting. Four slow breaths, then one word.` },
      { category: 'reset',  text: `Write the most honest sentence about where you are with your work right now. No performance.` },
    ],
  },

  {
    id: 'founders',
    name: 'Founders',
    emoji: '🏗️',
    tagline: 'Built by people building things.',
    description: 'Submitted by early-stage founders who use Dopa between deep work blocks. Short, sharp, and pointed at the thing that matters.',
    month: 'May 2026',
    tasks: [
      { category: 'learn',  text: `Read one paragraph of a competitor's landing page. What's the job they're promising to do?` },
      { category: 'learn',  text: `Look up one term from your industry you still secretly don't fully understand. Read the definition.` },
      { category: 'learn',  text: `Find one tweet or post from someone in your space that made you think. Read it again slowly.` },
      { category: 'learn',  text: `Look up one metric you should be tracking that you currently aren't. What would it tell you?` },
      { category: 'absorb', text: `Open a business or product book you've been meaning to finish. Read two pages.` },
      { category: 'absorb', text: `Listen to two minutes of a founder interview. What's one thing they said about failure?` },
      { category: 'hustle', text: `Write the one sentence you'd say to your ideal customer if you had 10 seconds in an elevator.` },
      { category: 'hustle', text: `Name the one thing in your business you keep deprioritizing. Write why it scares you.` },
      { category: 'hustle', text: `Write the subject line of an outreach email to someone who could change your trajectory.` },
      { category: 'hustle', text: `Open your task list. Is the first item the highest-leverage thing? If not, reorder it.` },
      { category: 'hustle', text: `Write the single biggest assumption your business depends on being true. Have you tested it?` },
      { category: 'hustle', text: `Name one thing you're building that users didn't ask for. Is it for them or for you?` },
      { category: 'reset',  text: `Write down what "winning" looks like in 90 days — one sentence, specific and honest.` },
      { category: 'reset',  text: `Remember why you started this. Not the pitch — the real reason. Sit with it for 60 seconds.` },
      { category: 'reset',  text: `Box breathe: in 4, hold 4, out 4, hold 4. Four rounds. Decisions made from calm are better.` },
      { category: 'reset',  text: `Write one thing that went right this week, even if it's small. Evidence compounds.` },
    ],
  },

  {
    id: 'students',
    name: 'Students',
    emoji: '🎓',
    tagline: 'For the overwhelmed and under-slept.',
    description: 'Written for students fighting the doom-scroll between study sessions. Two minutes that actually move the needle.',
    month: 'May 2026',
    tasks: [
      { category: 'learn',  text: `Read one paragraph from your current assigned reading. Just one — then decide if you want to keep going.` },
      { category: 'learn',  text: `Look up one concept from class that you've been nodding along to but don't fully get.` },
      { category: 'learn',  text: `Find a five-minute YouTube explainer on a topic you're studying. Watch the first two minutes.` },
      { category: 'learn',  text: `Review one flashcard or note from this week. Can you explain it without looking?` },
      { category: 'absorb', text: `Open your reading app and read two pages of anything — required or not. Reading is reading.` },
      { category: 'absorb', text: `Listen to two minutes of a podcast or lecture on a topic that interests you, even if it's not for class.` },
      { category: 'hustle', text: `Write down every assignment or deadline in your head right now. Get it all out.` },
      { category: 'hustle', text: `Pick the one task with the earliest deadline. Write the very first step to start it.` },
      { category: 'hustle', text: `Open your notes from the last class you attended. Summarize it in two sentences.` },
      { category: 'hustle', text: `Write one email or message you've been putting off — to a professor, classmate, or advisor.` },
      { category: 'hustle', text: `Identify one thing you're doing this semester that isn't serving you. Name it.` },
      { category: 'reset',  text: `You don't have to have it all figured out. Breathe through that for 60 seconds.` },
      { category: 'reset',  text: `5-4-3-2-1: name 5 things you can see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.` },
      { category: 'reset',  text: `Write one thing you're proud of from this semester. It counts even if no one gave you a grade for it.` },
      { category: 'reset',  text: `Stand up. Shake out your hands. Roll your shoulders. Take three deep breaths. You're still here.` },
    ],
  },

  {
    id: 'recovery',
    name: 'Recovery',
    emoji: '🌱',
    tagline: 'One minute at a time.',
    description: 'Curated with care for people in recovery from addiction, burnout, or crisis. Gentle, grounding, and judgment-free.',
    month: 'May 2026',
    tasks: [
      { category: 'learn',  text: `Read one paragraph about the nervous system and safety. Your body is trying to protect you.` },
      { category: 'learn',  text: `Look up one grounding technique you haven't tried. Read the instructions once.` },
      { category: 'learn',  text: `Read one paragraph written by someone in recovery — memoir, essay, or post. You're not alone.` },
      { category: 'learn',  text: `Find one thing you can learn about a hobby you used to love before things got hard.` },
      { category: 'absorb', text: `Open your reading app and read two pages of something slow and kind. No thrillers today.` },
      { category: 'absorb', text: `Listen to two minutes of music that makes you feel safe. Eyes closed if you can.` },
      { category: 'hustle', text: `Write one small thing you can do today to take care of your body — and commit to it.` },
      { category: 'hustle', text: `Write down one thing you need that you haven't asked for. You don't have to ask yet — just name it.` },
      { category: 'hustle', text: `Name one person who is safe to reach out to. You don't have to message them — just remember they exist.` },
      { category: 'hustle', text: `Write one boundary you want to hold today. One sentence. Post it somewhere you'll see it.` },
      { category: 'reset',  text: `Place both feet flat on the floor. Feel the ground. Take five slow breaths. You're here. That's enough.` },
      { category: 'reset',  text: `Put one hand on your chest. Feel your heartbeat. You've made it through every hard day so far.` },
      { category: 'reset',  text: `Close your eyes and picture somewhere you feel safe. A room, a person, a moment. Stay there for 60 seconds.` },
      { category: 'reset',  text: `Write the most compassionate thing you could say to yourself right now — as if you were saying it to a friend.` },
      { category: 'reset',  text: `Breathe in for 4 counts, hold for 4, out for 6. The longer exhale activates the calm. Three rounds.` },
      { category: 'reset',  text: `Name one thing you did today that took courage, even if it looks small from the outside.` },
    ],
  },
]

// Get which month we're "in" for the rotating monthly label
export function getCurrentMonth(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
