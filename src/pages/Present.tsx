import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { QRCodeSVG } from 'qrcode.react'
import { db } from '../lib/firebase'
import { trackBadge } from '../lib/constants'
import type { Submission } from '../lib/types'

// 제출물당 슬라이드 4장: 표지 / 기능 / 장점(+QR) / 개선점
export default function Present() {
  const [subs, setSubs] = useState<Submission[]>([])
  const [idx, setIdx] = useState(0)
  const [searchParams] = useSearchParams()
  const focusedRef = useRef(false)

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'submissions'), orderBy('createdAt', 'asc')),
      (snap) =>
        setSubs(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Submission)),
    )
  }, [])

  // 강사 대시보드에서 특정 제출물 슬라이드로 바로 이동 (?focus=제출물ID)
  useEffect(() => {
    if (focusedRef.current || subs.length === 0) return
    const focusId = searchParams.get('focus')
    if (!focusId) return
    const subIdx = subs.findIndex((s) => s.id === focusId)
    if (subIdx >= 0) {
      setIdx(subIdx * 4)
      focusedRef.current = true
    }
  }, [subs, searchParams])

  const totalSlides = subs.length * 4

  const next = useCallback(
    () => setIdx((i) => Math.min(i + 1, Math.max(totalSlides - 1, 0))),
    [totalSlides],
  )
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const current = useMemo(() => {
    if (subs.length === 0) return null
    const subIdx = Math.floor(idx / 4)
    const slideNo = idx % 4
    return { sub: subs[subIdx], slideNo, subIdx }
  }, [subs, idx])

  function fullscreen() {
    document.documentElement.requestFullscreen?.()
  }

  if (!current) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cinema-900 text-white">
        <div className="text-7xl">🎬</div>
        <p className="mt-6 text-3xl">아직 제출물이 없어요</p>
        <Link to="/gallery" className="mt-8 rounded-xl bg-white px-6 py-3 font-bold text-cinema-900">
          갤러리로 돌아가기
        </Link>
      </div>
    )
  }

  const { sub, slideNo, subIdx } = current

  return (
    <div className="flex min-h-screen flex-col bg-cinema-900 text-white">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-6 py-3 text-white/60">
        <Link to="/gallery" className="hover:text-white">
          ← 갤러리
        </Link>
        <span>
          {subIdx + 1} / {subs.length}번째 작품 · 슬라이드 {slideNo + 1}/4
        </span>
        <button onClick={fullscreen} className="hover:text-white">
          ⛶ 전체화면
        </button>
      </div>

      {/* 슬라이드 본문 — 프로젝터 가독성: 제목 48px+, 본문 28px+ */}
      <div className="flex flex-1 items-center justify-center p-8">
        {slideNo === 0 && (
          <div className="text-center">
            <p className="text-[32px] text-cinema-100">
              {sub.subject} · {trackBadge(sub.track)}
            </p>
            <h1 className="mt-6 font-display text-[72px] font-bold leading-tight">
              {sub.appName}
            </h1>
            <p className="mt-8 text-[40px] font-bold text-cinema-100">{sub.nickname} 선생님</p>
            <p className="mt-4 text-[28px] text-white/70">대상: {sub.targetStudents}</p>
            {sub.remixedFrom && (
              <p className="mt-2 text-[24px] text-emerald-300">🌱 {sub.remixedFrom} 개작</p>
            )}
          </div>
        )}
        {slideNo === 1 && (
          <div className="w-full max-w-4xl">
            <h2 className="text-center font-display text-[48px] font-bold">✨ 핵심 기능 3가지</h2>
            <div className="mt-12 space-y-6">
              {sub.features.map((f, i) => (
                <div key={i} className="flex items-center gap-6 rounded-2xl bg-white/10 p-6">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-cinema-500 text-[32px] font-bold">
                    {i + 1}
                  </span>
                  <p className="text-[32px]">{f}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {slideNo === 2 && (
          <div className="flex w-full max-w-5xl items-center gap-12">
            <div className="flex-1">
              <h2 className="font-display text-[48px] font-bold">💪 자랑할 점</h2>
              <p className="mt-8 whitespace-pre-wrap text-[32px] leading-relaxed">{sub.proudOf}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 text-center">
              <QRCodeSVG value={sub.url} size={220} />
              <p className="mt-3 text-[20px] font-bold text-cinema-900">📱 직접 열어보세요</p>
            </div>
          </div>
        )}
        {slideNo === 3 && (
          <div className="w-full max-w-4xl">
            <h2 className="font-display text-[48px] font-bold">🌱 아쉬운 점 · 다음 버전 계획</h2>
            <p className="mt-8 whitespace-pre-wrap text-[32px] leading-relaxed">{sub.toImprove}</p>
          </div>
        )}
      </div>

      {/* 하단 내비게이션 */}
      <div className="flex items-center justify-center gap-6 pb-8">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="rounded-2xl bg-white/10 px-8 py-4 text-[28px] transition hover:bg-white/20 disabled:opacity-30"
        >
          ← 이전
        </button>
        <button
          onClick={next}
          disabled={idx >= totalSlides - 1}
          className="rounded-2xl bg-cinema-500 px-8 py-4 text-[28px] font-bold transition hover:bg-cinema-600 disabled:opacity-30"
        >
          다음 →
        </button>
      </div>
    </div>
  )
}
