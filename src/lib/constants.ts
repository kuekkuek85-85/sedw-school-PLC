// 입장/강사 코드 — 배포 전 확정 후 QR 인쇄 (PRD 오픈이슈 4)
export const ENTRY_CODE = import.meta.env.VITE_ENTRY_CODE || 'DAWON1'
export const INSTRUCTOR_CODE = import.meta.env.VITE_INSTRUCTOR_CODE || 'DAWON-T'

export const SUBJECTS = [
  '국어',
  '수학',
  '사회',
  '과학',
  '음악',
  '미술',
  '체육',
  '진로와직업',
  '일상생활(자립)',
  '기타',
] as const

export const CHATGPT_GROUP_URL =
  'https://chatgpt.com/gg/v/6a4be0f0e46481958cde93d34614e718?token=FkVO6xaDL2_7cDkJj6m60A'

export const TRACKS = [
  { id: 'worksheet', emoji: '📄', name: '웹 활동지 트랙', level: '입문' },
  { id: 'canvas', emoji: '🖌', name: '캔버스 앱 트랙', level: '중급' },
  { id: 'codex', emoji: '🎮', name: 'Codex 트랙', level: '상급' },
] as const

export type TrackId = (typeof TRACKS)[number]['id']

export function trackBadge(track: string) {
  const t = TRACKS.find((t) => t.id === track)
  return t ? `${t.emoji} ${t.name}` : track
}
