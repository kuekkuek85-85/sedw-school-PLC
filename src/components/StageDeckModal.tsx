import { useEffect, useState } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { stagesBySession, type SessionName } from '../data/stages'

// 강사용 전체화면 스테이지 슬라이드 묶음 — 같은 차시의 단계를 이전·다음으로 넘긴다.
// 페이지를 넘길 때마다 config/app.activeStage가 갱신되어 참가자 화면(StageOverlay)에도
// 동일하게 강제 표시된다. 강사 본인 화면도 이 모달 자체가 전체화면 미리보기 역할을 한다.
export default function StageDeckModal({
  session,
  onClose,
}: {
  session: SessionName
  onClose: () => void
}) {
  const stages = stagesBySession(session)
  const [pageIdx, setPageIdx] = useState(0)
  const stage = stages[pageIdx]

  function broadcast(idx: number) {
    setPageIdx(idx)
    setDoc(
      doc(db, 'config', 'app'),
      { activeStage: stages[idx].id, stageUpdatedAt: serverTimestamp() },
      { merge: true },
    ).catch(() => {})
  }

  useEffect(() => {
    broadcast(0)
    return () => {
      setDoc(
        doc(db, 'config', 'app'),
        { activeStage: null, stageUpdatedAt: serverTimestamp() },
        { merge: true },
      ).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === ' ') broadcast(Math.min(pageIdx + 1, stages.length - 1))
      if (e.key === 'ArrowLeft') broadcast(Math.max(pageIdx - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, pageIdx, stages.length])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 sm:p-8">
      <div className="flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-cinema-900 text-white shadow-2xl">
        {/* 상단 바 */}
        <div className="flex items-center justify-between px-6 py-3 text-white/60">
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">{session}</span>
          <div className="flex items-center gap-2">
            {stages.map((s, i) => (
              <button
                key={s.id}
                onClick={() => broadcast(i)}
                title={s.title}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === pageIdx ? 'w-6 bg-cinema-500' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <span className="flex items-center gap-2">
            <span className="rounded-full bg-red-500/80 px-2 py-0.5 text-xs font-bold text-white">
              🔴 참가자 화면 동기화 중
            </span>
            {pageIdx + 1}/{stages.length}
          </span>
          <button onClick={onClose} className="text-2xl hover:text-white" aria-label="닫기">
            ✕
          </button>
        </div>

        {/* 슬라이드 본문 */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto p-10">
          <div className="w-full max-w-3xl">
            <div className="text-6xl">{stage.emoji}</div>
            <h1 className="mt-4 font-display text-[40px] font-bold leading-tight">{stage.title}</h1>
            <ul className="mt-6 space-y-3">
              {stage.body.map((line, i) => (
                <li key={i} className="flex gap-3 text-[20px] leading-relaxed text-white/90">
                  <span className="text-cinema-300">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            {stage.term && (
              <div className="mt-6 rounded-2xl bg-white/10 p-5">
                <p className="font-bold text-cinema-200">💡 {stage.term.name}란?</p>
                <p className="mt-1 text-white/80">{stage.term.desc}</p>
              </div>
            )}
          </div>
        </div>

        {/* 하단 내비게이션 */}
        <div className="flex items-center justify-center gap-6 pb-8">
          <button
            onClick={() => broadcast(Math.max(pageIdx - 1, 0))}
            disabled={pageIdx === 0}
            className="rounded-2xl bg-white/10 px-8 py-4 text-lg transition hover:bg-white/20 disabled:opacity-30"
          >
            ← 이전
          </button>
          <button
            onClick={() => broadcast(Math.min(pageIdx + 1, stages.length - 1))}
            disabled={pageIdx === stages.length - 1}
            className="rounded-2xl bg-cinema-500 px-8 py-4 text-lg font-bold transition hover:bg-cinema-600 disabled:opacity-30"
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  )
}
