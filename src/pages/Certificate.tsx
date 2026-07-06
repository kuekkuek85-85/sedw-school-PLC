import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db, auth } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { STAGES } from '../data/stages'

export default function Certificate() {
  const { session } = useAuth()
  const [completedStages, setCompletedStages] = useState<string[]>([])
  const [trainingEnded, setTrainingEnded] = useState(false)

  useEffect(() => {
    if (!auth.currentUser) return
    const unsub1 = onSnapshot(doc(db, 'participants', auth.currentUser.uid), (snap) => {
      setCompletedStages((snap.data()?.completedStages as string[]) ?? [])
    })
    const unsub2 = onSnapshot(doc(db, 'config', 'app'), (snap) => {
      setTrainingEnded(!!snap.data()?.trainingEnded)
    })
    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  const stampedCount = STAGES.filter((s) => completedStages.includes(s.id)).length

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-bold text-cinema-900">🏅 나의 도장판 · 수료증</h1>
      <p className="mt-2 text-lg text-gray-600">
        단계별 설명 화면을 확인할 때마다 도장이 찍혀요. 연수가 끝나면 수료증을 받을 수 있어요.
      </p>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-cinema-700">📋 도장판</h2>
          <span className="rounded-full bg-cinema-50 px-3 py-1 text-sm font-bold text-cinema-700">
            {stampedCount} / {STAGES.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {STAGES.map((s) => {
            const stamped = completedStages.includes(s.id)
            return (
              <div
                key={s.id}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 text-center ${
                  stamped
                    ? 'border-cinema-500 bg-cinema-50'
                    : 'border-dashed border-gray-200 opacity-50'
                }`}
              >
                <span className="text-3xl">{stamped ? s.emoji : '⚪'}</span>
                <span className="text-xs font-bold text-gray-600">{s.session}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-xl font-bold text-cinema-700">🎓 수료증</h2>
        {!trainingEnded ? (
          <p className="rounded-xl bg-amber-50 p-4 text-amber-800">
            연수가 아직 진행 중이에요. 강사님이 연수 종료를 선언하면 수료증을 받을 수 있어요.
          </p>
        ) : (
          <div>
            <div className="print-cert rounded-2xl border-4 border-double border-cinema-500 p-10 text-center">
              <p className="text-lg text-gray-500">수료증</p>
              <p className="mt-6 font-display text-2xl font-bold text-cinema-900">
                {session?.nickname ?? ''} 선생님
              </p>
              <p className="mt-6 leading-relaxed text-gray-700">
                위 선생님은 서울다원학교 어울림시네마 교원학습공동체 연수
                <br />
                「다원 어울림시네마 AI 연수 플랫폼」 과정을 성실히 이수하였음을 증명합니다.
              </p>
              <p className="mt-8 text-gray-500">
                완료 단계: {stampedCount} / {STAGES.length}
              </p>
              <p className="mt-6 font-bold text-cinema-700">2026년 7월 8일</p>
              <p className="mt-1 text-gray-500">서울다원학교장</p>
            </div>
            <button
              onClick={() => window.print()}
              className="mt-4 w-full rounded-xl bg-cinema-500 py-4 text-lg font-bold text-white transition hover:bg-cinema-600"
            >
              🖨️ 수료증 인쇄하기
            </button>
          </div>
        )}
      </section>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-cert, .print-cert * { visibility: visible; }
          .print-cert { position: fixed; inset: 0; margin: auto; }
        }
      `}</style>
    </div>
  )
}
