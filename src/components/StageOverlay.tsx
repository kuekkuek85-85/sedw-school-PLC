import { useEffect, useState } from 'react'
import { doc, onSnapshot, type Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { STAGES } from '../data/stages'

interface AppConfig {
  activeStage?: string | null
  stageUpdatedAt?: Timestamp
}

export default function StageOverlay() {
  const { session } = useAuth()
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [dismissedAt, setDismissedAt] = useState<number | null>(null)

  useEffect(() => {
    return onSnapshot(doc(db, 'config', 'app'), (snap) => {
      setConfig(snap.exists() ? (snap.data() as AppConfig) : null)
    })
  }, [])

  // 강사 본인 화면은 강제 표시하지 않음 — 참가자에게만 적용
  const isInstructor = session?.role === 'instructor'
  const stage = config?.activeStage ? STAGES.find((s) => s.id === config.activeStage) : null
  const updatedMs = config?.stageUpdatedAt?.toMillis() ?? null
  const shouldShow = !isInstructor && !!stage && updatedMs !== null && updatedMs !== dismissedAt

  if (!shouldShow || !stage) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-cinema-900/85 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
        <span className="rounded-full bg-cinema-50 px-3 py-1 text-sm font-bold text-cinema-700">
          {stage.session}
        </span>
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
        <button
          onClick={() => setDismissedAt(updatedMs)}
          className="mt-6 w-full rounded-xl bg-cinema-500 py-4 text-lg font-bold text-white transition hover:bg-cinema-600"
        >
          확인했어요, 진행할게요 ✅
        </button>
      </div>
    </div>
  )
}
