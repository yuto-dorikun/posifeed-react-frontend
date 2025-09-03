export const FEEDBACK_CATEGORIES = {
  gratitude: {
    id: 0,
    name: 'ありがとう',
    emoji: '🙏',
    description: '感謝の気持ちを伝える'
  },
  admiration: {
    id: 1,
    name: 'すごい！',
    emoji: '✨',
    description: '成果や頑張りを称える'
  },
  appreciation: {
    id: 2,
    name: 'お疲れさま',
    emoji: '💪',
    description: '努力をねぎらう'
  },
  respect: {
    id: 3,
    name: 'さすが',
    emoji: '👏',
    description: '能力や判断力を評価する'
  }
} as const

export type FeedbackCategoryKey = keyof typeof FEEDBACK_CATEGORIES
export type FeedbackCategory = typeof FEEDBACK_CATEGORIES[FeedbackCategoryKey]