import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { STAGES } from '../data/stages'

export default function StageRibbon() {
  const [activeStage, setActiveStage] = useState<string | null>(null)

  useEffect(() => {
    return onSnapshot(doc(db, 'config', 'app'), (snap) => {
      const data = snap.data() as { activeStage?: string | null } | undefined
      setActiveStage(data?.activeStage ?? null)
    })
  }, [])

  const idx = activeStage ? STAGES.findIndex((s) => s.id === activeStage) : -1
  if (idx < 0) return null
  const stage = STAGES[idx]

  return (
    <div className="bg-cinema-900 px-4 py-2 text-center text-sm text-white">
      <span className="mr-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
        {idx + 1} / {STAGES.length}
      </span>
      <span className="mr-1">{stage.emoji}</span>
      <span className="font-bold">현재 단계 · {stage.title}</span>
    </div>
  )
}
