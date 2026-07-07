import { useEffect, useRef, useState } from 'react'
import { doc, onSnapshot, setDoc, arrayUnion, type Timestamp } from 'firebase/firestore'
import { db, auth } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { STAGES } from '../data/stages'

interface AppConfig {
  activeStage?: string | null
  stageUpdatedAt?: Timestamp
}

// 슬라이드 동기화와 동일한 방식: 참가자는 직접 닫을 수 없고, 강사가 화면을
// 해제하거나 다음 단계로 넘길 때만 화면이 바뀌거나 사라진다.
export default function StageOverlay() {
  const { session } = useAuth()
  const [config, setConfig] = useState<AppConfig | null>(null)
  const seenStageIds = useRef(new Set<string>())

  useEffect(() => {
    return onSnapshot(doc(db, 'config', 'app'), (snap) => {
      setConfig(snap.exists() ? (snap.data() as AppConfig) : null)
    })
  }, [])

  // 강사 본인 화면은 강제 표시하지 않음 — 참가자에게만 적용
  const isInstructor = session?.role === 'instructor'
  const stage = config?.activeStage ? STAGES.find((s) => s.id === config.activeStage) : null

  // 스테이지가 화면에 뜬 순간 도장판에 자동으로 도장이 찍힘 (참가자가 누를 버튼 없음)
  useEffect(() => {
    if (isInstructor || !stage || !auth.currentUser) return
    if (seenStageIds.current.has(stage.id)) return
    seenStageIds.current.add(stage.id)
    setDoc(
      doc(db, 'participants', auth.currentUser.uid),
      { completedStages: arrayUnion(stage.id) },
      { merge: true },
    ).catch(() => {})
  }, [isInstructor, stage])

  if (isInstructor || !stage) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-cinema-900/85 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-cinema-50 px-3 py-1 text-sm font-bold text-cinema-700">
            {stage.session}
          </span>
          <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
            🔴 강사님이 진행 중
          </span>
        </div>
        <div className="mt-4 text-6xl">{stage.emoji}</div>
        <h1 className="mt-3 font-display text-2xl font-bold text-cinema-900">{stage.title}</h1>
        <ul className="mt-5 space-y-2">
          {stage.body.map((line, i) => (
            <li key={i} className="flex gap-2 text-gray-700">
              <span className="text-cinema-500">•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
        {stage.term && (
          <div className="mt-5 rounded-2xl bg-cinema-50 p-4">
            <p className="font-bold text-cinema-700">💡 {stage.term.name}란?</p>
            <p className="mt-1 text-gray-700">{stage.term.desc}</p>
          </div>
        )}
        <p className="mt-6 text-center text-sm text-gray-400">
          강사님이 다음 단계로 넘기면 자동으로 화면이 바뀌어요.
        </p>
      </div>
    </div>
  )
}
