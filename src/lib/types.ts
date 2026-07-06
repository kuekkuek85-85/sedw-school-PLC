import type { Timestamp } from 'firebase/firestore'

export interface Submission {
  id: string
  uid: string
  nickname: string
  subject: string
  track: string
  appName: string
  url: string
  targetStudents: string
  features: [string, string, string]
  proudOf: string
  toImprove: string
  remixedFrom?: string
  grillDone: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Comment {
  id: string
  uid: string
  nickname: string
  good: string
  suggestion: string
  createdAt?: Timestamp
}

export interface Reaction {
  submissionId: string
  uid: string
  emoji: string
}

export interface Signal {
  uid: string
  nickname: string
  status: 'green' | 'yellow' | 'red'
  updatedAt?: Timestamp
}
