import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { trackBadge } from '../lib/constants'
import { STAGES } from '../data/stages'
import type { Submission, Signal } from '../lib/types'

interface Participant {
  id: string
  nickname: string
  subject: string
  role: string
}

const SIGNAL_ORDER = { red: 0, yellow: 1, green: 2 } as const
const SIGNAL_EMOJI = { red: '🔴', yellow: '🟡', green: '🟢' } as const

export default function Instructor() {
  const { session } = useAuth()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [subs, setSubs] = useState<Submission[]>([])
  const [signals, setSignals] = useState<Signal[]>([])
  const [activeStage, setActiveStage] = useState<string | null>(null)

  useEffect(() => {
    const unsubs = [
      onSnapshot(collection(db, 'participants'), (snap) =>
        setParticipants(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Participant),
        ),
      ),
      onSnapshot(
        query(collection(db, 'submissions'), orderBy('createdAt', 'desc')),
        (snap) =>
          setSubs(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Submission)),
      ),
      onSnapshot(collection(db, 'signals'), (snap) =>
        setSignals(snap.docs.map((d) => ({ ...d.data() }) as Signal)),
      ),
      onSnapshot(doc(db, 'config', 'app'), (snap) => {
        const data = snap.data() as { activeStage?: string | null } | undefined
        setActiveStage(data?.activeStage ?? null)
      }),
    ]
    return () => unsubs.forEach((u) => u())
  }, [])

  async function broadcastStage(stageId: string | null) {
    await setDoc(
      doc(db, 'config', 'app'),
      { activeStage: stageId, stageUpdatedAt: serverTimestamp() as Timestamp },
      { merge: true },
    )
  }

  if (session?.role !== 'instructor') {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <p className="text-lg text-gray-500">
          이 페이지는 강사 코드로 입장한 경우에만 볼 수 있어요.
        </p>
      </div>
    )
  }

  const teachers = participants.filter((p) => p.role === 'teacher')
  const submittedUids = new Set(subs.map((s) => s.uid))
  const notSubmitted = teachers.filter((t) => !submittedUids.has(t.id))
  const sortedSignals = [...signals].sort(
    (a, b) => SIGNAL_ORDER[a.status] - SIGNAL_ORDER[b.status],
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-cinema-900">🎛️ 강사 대시보드</h1>
        <Link
          to="/gallery/present"
          className="rounded-xl bg-cinema-900 px-5 py-3 font-bold text-white transition hover:scale-105"
        >
          📽️ 발표 모드 시작
        </Link>
      </div>

      {/* 스테이지 진행 — 누르면 모든 참가자 화면에 전체화면으로 강제 표시됨 */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold text-cinema-700">📽️ 스테이지 진행</h2>
          {activeStage && (
            <button
              onClick={() => broadcastStage(null)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-bold text-gray-500 hover:border-cinema-200"
            >
              화면 해제
            </button>
          )}
        </div>
        <p className="mb-4 text-sm text-gray-500">
          버튼을 누르면 참가자 전원의 화면에 설명 슬라이드가 즉시 뜹니다 (강사 화면 제외).
        </p>
        <div className="space-y-2">
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => broadcastStage(s.id)}
              className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${
                activeStage === s.id
                  ? 'border-cinema-500 bg-cinema-50'
                  : 'border-gray-100 hover:border-cinema-100'
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="flex-1">
                <span className="mr-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
                  {s.session}
                </span>
                <span className="font-bold text-gray-800">{s.title}</span>
              </span>
              {activeStage === s.id && (
                <span className="rounded-full bg-cinema-500 px-3 py-1 text-xs font-bold text-white">
                  방송 중
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 현황 요약 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="접속 교사" value={teachers.length} emoji="👩‍🏫" />
        <StatCard label="제출 완료" value={subs.length} emoji="📮" />
        <StatCard label="미제출" value={notSubmitted.length} emoji="⏳" />
        <StatCard
          label="도움 요청 🔴"
          value={signals.filter((s) => s.status === 'red').length}
          emoji="🚨"
        />
      </div>

      {/* 신호등 스트림 */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-cinema-700">🚦 신호등 스트림</h2>
        <p className="mb-4 text-sm text-gray-500">🔴 도움 요청이 맨 위에 정렬됩니다</p>
        {sortedSignals.length === 0 ? (
          <p className="text-gray-400">아직 신호가 없어요.</p>
        ) : (
          <div className="space-y-2">
            {sortedSignals.map((s) => (
              <div
                key={s.uid + s.status}
                className={`flex items-center gap-3 rounded-xl p-3 ${
                  s.status === 'red'
                    ? 'bg-red-50 ring-1 ring-red-200'
                    : s.status === 'yellow'
                      ? 'bg-amber-50'
                      : 'bg-green-50'
                }`}
              >
                <span className="text-2xl">{SIGNAL_EMOJI[s.status]}</span>
                <span className="font-bold">{s.nickname}</span>
                <span className="text-sm text-gray-500">
                  {s.status === 'red'
                    ? '도와주세요!'
                    : s.status === 'yellow'
                      ? '조금 헤매는 중'
                      : '잘 되고 있어요'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 제출 현황 */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-xl font-bold text-cinema-700">📋 제출 현황</h2>
        {notSubmitted.length > 0 && (
          <p className="mb-4 rounded-xl bg-amber-50 p-3 text-amber-800">
            ⏳ 미제출: {notSubmitted.map((t) => t.nickname).join(', ')}
          </p>
        )}
        <div className="space-y-2">
          {subs.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 p-3">
              <span className="font-bold">{s.nickname}</span>
              <span className="rounded-full bg-cinema-50 px-2 py-0.5 text-sm text-cinema-700">
                {s.subject}
              </span>
              <span className="text-sm text-gray-500">{trackBadge(s.track)}</span>
              <span className="flex-1 truncate text-sm text-gray-400">{s.appName}</span>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-cinema-600 hover:underline"
              >
                열기 ↗
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
      <div className="text-3xl">{emoji}</div>
      <div className="mt-1 font-display text-3xl font-bold text-cinema-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}
