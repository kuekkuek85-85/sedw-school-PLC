import { useEffect, useState } from 'react'
import SlideContent from './SlideContent'
import type { Submission } from '../lib/types'

// 강사 대시보드에서 새 탭 없이 바로 큰 화면으로 슬라이드를 넘겨보는 모달
export default function SlideViewerModal({
  sub,
  onClose,
}: {
  sub: Submission
  onClose: () => void
}) {
  const [slideNo, setSlideNo] = useState(0)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === ' ') setSlideNo((n) => Math.min(n + 1, 3))
      if (e.key === 'ArrowLeft') setSlideNo((n) => Math.max(n - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 sm:p-8">
      <div className="flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-cinema-900 text-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-3 text-white/60">
          <span>
            {sub.nickname} · {sub.appName}
          </span>
          <span>슬라이드 {slideNo + 1}/4</span>
          <button onClick={onClose} className="text-2xl hover:text-white" aria-label="닫기">
            ✕
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-y-auto p-8">
          <SlideContent sub={sub} slideNo={slideNo} />
        </div>

        <div className="flex items-center justify-center gap-6 pb-8">
          <button
            onClick={() => setSlideNo((n) => Math.max(n - 1, 0))}
            disabled={slideNo === 0}
            className="rounded-2xl bg-white/10 px-8 py-4 text-lg transition hover:bg-white/20 disabled:opacity-30"
          >
            ← 이전
          </button>
          <button
            onClick={() => setSlideNo((n) => Math.min(n + 1, 3))}
            disabled={slideNo === 3}
            className="rounded-2xl bg-cinema-500 px-8 py-4 text-lg font-bold transition hover:bg-cinema-600 disabled:opacity-30"
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  )
}
