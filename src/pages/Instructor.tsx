import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { trackBadge } from '../lib/constants'
import { STAGES } from '../data/stages'
import SlideViewerModal from '../components/SlideViewerModal'
import type { Submission, Signal, Prd } from '../lib/types'

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
  const [prds, setPrds] = useState<Prd[]>([])
  const [signals, setSignals] = useState<Signal[]>([])
  const [activeStage, setActiveStage] = useState<string | null>(null)
  const [trainingEnded, setTrainingEnded] = useState(false)
  const [previewSub, setPreviewSub] = useState<Submission | null>(null)

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
      onSnapshot(collection(db, 'prds'), (snap) =>
        setPrds(snap.docs.map((d) => d.data() as Prd)),
      ),
      onSnapshot(collection(db, 'signals'), (snap) =>
        setSignals(snap.docs.map((d) => ({ ...d.data() }) as Signal)),
      ),
      onSnapshot(doc(db, 'config', 'app'), (snap) => {
        const data = snap.data() as
          | { activeStage?: string | null; trainingEnded?: boolean }
          | undefined
        setActiveStage(data?.activeStage ?? null)
        setTrainingEnded(!!data?.trainingEnded)
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

  async function endTraining() {
    if (!confirm('연수를 종료할까요? 참가자들이 성찰 후기를 작성하고 수료증을 받을 수 있게 됩니다.')) return
    await setDoc(
      doc(db, 'config', 'app'),
      { trainingEnded: true, trainingEndedAt: serverTimestamp() as Timestamp },
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
  const prdByUid = new Map(prds.map((p) => [p.uid, p]))

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-cinema-900">🎛️ 강사 대시보드</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/gallery/present"
            className="rounded-xl bg-cinema-900 px-5 py-3 font-bold text-white transition hover:scale-105"
          >
            📽️ 발표 모드 시작
          </Link>
          {!trainingEnded ? (
            <button
              onClick={endTraining}
              className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:scale-105"
            >
              🏁 연수 종료
            </button>
          ) : (
            <span className="rounded-xl bg-green-100 px-5 py-3 font-bold text-green-700">
              🏁 연수 종료됨
            </span>
          )}
        </div>
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

      {/* 제출 현황 — PRD / 스펙 / 링크 / 슬라이드 4갈래 */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-xl font-bold text-cinema-700">📋 제출 현황</h2>
        {notSubmitted.length > 0 && (
          <p className="mb-4 rounded-xl bg-amber-50 p-3 text-amber-800">
            ⏳ 미제출: {notSubmitted.map((t) => t.nickname).join(', ')}
          </p>
        )}
        <div className="space-y-3">
          {subs.map((s) => (
            <SubmissionRow
              key={s.id}
              sub={s}
              prd={prdByUid.get(s.uid)}
              onPreviewSlides={() => setPreviewSub(s)}
            />
          ))}
        </div>
      </section>

      {previewSub && <SlideViewerModal sub={previewSub} onClose={() => setPreviewSub(null)} />}
    </div>
  )
}

type PanelKind = 'prd' | 'spec' | null

function SubmissionRow({
  sub,
  prd,
  onPreviewSlides,
}: {
  sub: Submission
  prd?: Prd
  onPreviewSlides: () => void
}) {
  const [panel, setPanel] = useState<PanelKind>(null)

  return (
    <div className="rounded-xl border border-gray-100">
      <div className="flex flex-wrap items-center gap-2 p-3">
        <span className="font-bold">{sub.nickname}</span>
        <span className="rounded-full bg-cinema-50 px-2 py-0.5 text-sm text-cinema-700">
          {sub.subject}
        </span>
        <span className="text-sm text-gray-500">{trackBadge(sub.track)}</span>
        <span className="flex-1 truncate text-sm text-gray-400">{sub.appName}</span>
        <div className="flex flex-wrap gap-1.5">
          <PillButton
            active={panel === 'prd'}
            onClick={() => setPanel(panel === 'prd' ? null : 'prd')}
            disabled={!prd}
          >
            📋 PRD
          </PillButton>
          <PillButton
            active={panel === 'spec'}
            onClick={() => setPanel(panel === 'spec' ? null : 'spec')}
          >
            📝 스펙
          </PillButton>
          <PillButton onClick={() => window.open(sub.url, '_blank', 'noreferrer')}>
            🔗 링크
          </PillButton>
          <PillButton onClick={onPreviewSlides}>🖼️ 슬라이드</PillButton>
        </div>
      </div>

      {panel === 'prd' && (
        <div className="border-t border-gray-100 p-4">
          {prd ? (
            <>
              <p className="whitespace-pre-wrap rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                {prd.prdText}
              </p>
              {prd.questions?.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-bold text-gray-400">Grill Me 질문</p>
                  {prd.questions.map((q, i) => (
                    <p key={i} className="text-sm text-gray-600">
                      🤔 {q}
                    </p>
                  ))}
                </div>
              )}
              <FeedbackEditor
                value={prd.aiFeedback ?? ''}
                editedBy={prd.feedbackEditedBy}
                onSave={async (text) => {
                  await updateDoc(doc(db, 'prds', sub.uid), {
                    aiFeedback: text,
                    feedbackEditedBy: 'instructor',
                    feedbackUpdatedAt: serverTimestamp(),
                  })
                }}
              />
            </>
          ) : (
            <p className="text-sm text-gray-400">아직 Grill Me를 사용하지 않았어요.</p>
          )}
        </div>
      )}

      {panel === 'spec' && (
        <div className="border-t border-gray-100 p-4">
          <div className="space-y-1 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
            <p>
              <b>대상 학생·수행수준:</b> {sub.targetStudents}
            </p>
            <p>
              <b>핵심 기능:</b> {sub.features?.join(', ')}
            </p>
            <p>
              <b>자랑할 점:</b> {sub.proudOf}
            </p>
            <p>
              <b>아쉬운 점·다음 계획:</b> {sub.toImprove}
            </p>
          </div>
          <FeedbackEditor
            value={sub.specFeedback ?? ''}
            editedBy={sub.specFeedbackEditedBy}
            onSave={async (text) => {
              await updateDoc(doc(db, 'submissions', sub.id), {
                specFeedback: text,
                specFeedbackEditedBy: 'instructor',
                specFeedbackUpdatedAt: serverTimestamp(),
              })
            }}
          />
        </div>
      )}
    </div>
  )
}

function PillButton({
  children,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
        disabled
          ? 'cursor-not-allowed bg-gray-50 text-gray-300'
          : active
            ? 'bg-cinema-500 text-white'
            : 'bg-cinema-50 text-cinema-700 hover:bg-cinema-100'
      }`}
    >
      {children}
    </button>
  )
}

function FeedbackEditor({
  value,
  editedBy,
  onSave,
}: {
  value: string
  editedBy?: 'ai' | 'instructor'
  onSave: (text: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)

  useEffect(() => setDraft(value), [value])

  return (
    <div className="mt-3 rounded-xl border border-cinema-100 bg-cinema-50 p-3">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs font-bold text-cinema-700">
          🤖 AI 피드백 {editedBy === 'instructor' && <span className="text-gray-400">(강사 수정됨)</span>}
        </p>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-bold text-cinema-600 hover:underline"
          >
            ✏️ 수정
          </button>
        )}
      </div>
      {editing ? (
        <div className="space-y-2">
          <textarea
            className="h-24 w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-cinema-500 focus:outline-none"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              disabled={saving}
              onClick={async () => {
                setSaving(true)
                await onSave(draft).finally(() => setSaving(false))
                setEditing(false)
              }}
              className="rounded-lg bg-cinema-500 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
            >
              {saving ? '저장 중…' : '저장'}
            </button>
            <button
              onClick={() => {
                setDraft(value)
                setEditing(false)
              }}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-500"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-700">{value || '(아직 피드백이 없어요)'}</p>
      )}
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
