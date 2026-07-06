import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import SlideContent from './SlideContent'
import type { Submission } from '../lib/types'

interface SlidePreview {
  subId: string
  slideNo: number
}

// 강사가 대시보드에서 슬라이드를 넘기면 참가자 화면에도 실시간으로 동일하게 표시됨
export default function SlidePreviewOverlay() {
  const { session } = useAuth()
  const [preview, setPreview] = useState<SlidePreview | null>(null)
  const [sub, setSub] = useState<Submission | null>(null)

  useEffect(() => {
    return onSnapshot(doc(db, 'config', 'app'), (snap) => {
      setPreview((snap.data()?.slidePreview as SlidePreview | undefined) ?? null)
    })
  }, [])

  useEffect(() => {
    if (!preview?.subId) {
      setSub(null)
      return
    }
    return onSnapshot(doc(db, 'submissions', preview.subId), (snap) => {
      setSub(snap.exists() ? ({ id: snap.id, ...snap.data() } as Submission) : null)
    })
  }, [preview?.subId])

  const isInstructor = session?.role === 'instructor'
  if (isInstructor || !preview || !sub) return null

  return (
    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-cinema-900 text-white">
      <div className="absolute left-6 top-6 rounded-full bg-white/10 px-3 py-1 text-sm text-white/70">
        📽️ 강사님이 발표 슬라이드를 보여주고 있어요
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <SlideContent sub={sub} slideNo={preview.slideNo} />
      </div>
      <div className="pb-8 text-sm text-white/50">슬라이드 {preview.slideNo + 1}/4</div>
    </div>
  )
}
