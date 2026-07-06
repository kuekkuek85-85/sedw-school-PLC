import { QRCodeSVG } from 'qrcode.react'
import { trackBadge } from '../lib/constants'
import type { Submission } from '../lib/types'

// 제출물당 슬라이드 4장: 표지 / 기능 / 장점(+QR) / 개선점
// Present.tsx(전체 발표 모드)와 강사 대시보드 인라인 미리보기가 함께 사용한다.
export default function SlideContent({ sub, slideNo }: { sub: Submission; slideNo: number }) {
  if (slideNo === 0) {
    return (
      <div className="text-center">
        <p className="text-[32px] text-cinema-100">
          {sub.subject} · {trackBadge(sub.track)}
        </p>
        <h1 className="mt-6 font-display text-[72px] font-bold leading-tight">{sub.appName}</h1>
        <p className="mt-8 text-[40px] font-bold text-cinema-100">{sub.nickname} 선생님</p>
        <p className="mt-4 text-[28px] text-white/70">대상: {sub.targetStudents}</p>
        {sub.remixedFrom && (
          <p className="mt-2 text-[24px] text-emerald-300">🌱 {sub.remixedFrom} 개작</p>
        )}
      </div>
    )
  }
  if (slideNo === 1) {
    return (
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
    )
  }
  if (slideNo === 2) {
    return (
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
    )
  }
  return (
    <div className="w-full max-w-4xl">
      <h2 className="font-display text-[48px] font-bold">🌱 아쉬운 점 · 다음 버전 계획</h2>
      <p className="mt-8 whitespace-pre-wrap text-[32px] leading-relaxed">{sub.toImprove}</p>
    </div>
  )
}
