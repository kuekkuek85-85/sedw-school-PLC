import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, auth } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'

const FALLBACK_QUESTIONS = [
  '수행수준(가/나/다)별로 활동이 어떻게 달라지나요?',
  '조작 요소(버튼·드래그)가 소근육이 약한 학생도 가능한 크기와 방식인가요?',
  '글을 읽지 못하는 학생도 그림만 보고 이해할 수 있나요?',
  '성공/실패 피드백이 즉각적이고 긍정적인가요?',
  '이 자료는 7/14 영화관람의 어느 단계(사전/당일/사후)에 쓰이나요?',
]

const FALLBACK_PRD_FEEDBACK =
  'PRD를 잘 정리해 주셨어요! 수행수준(가/나/다)별로 활동이 어떻게 달라지는지, 그리고 그림·큰 버튼 같은 접근성 요소를 조금 더 구체적으로 적으면 더 좋아질 거예요.'

export default function Grill() {
  const { session } = useAuth()
  const [prd, setPrd] = useState('')
  const [questions, setQuestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passed, setPassed] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackLoading, setFeedbackLoading] = useState(false)

  // 기존에 저장된 PRD 불러오기 (강사가 피드백을 수정하면 실시간 반영)
  useEffect(() => {
    if (!auth.currentUser) return
    return onSnapshot(doc(db, 'prds', auth.currentUser.uid), (snap) => {
      if (!snap.exists()) return
      const d = snap.data()
      setPrd((prev) => prev || d.prdText || '')
      setQuestions((prev) => (prev.length ? prev : d.questions || []))
      setPassed(!!d.grillDone)
      setFeedback(d.aiFeedback || '')
    })
  }, [])

  async function savePrd(fields: Record<string, unknown>) {
    if (!auth.currentUser || !session) return
    await setDoc(
      doc(db, 'prds', auth.currentUser.uid),
      {
        uid: auth.currentUser.uid,
        nickname: session.nickname,
        subject: session.subject,
        updatedAt: serverTimestamp(),
        ...fields,
      },
      { merge: true },
    )
  }

  async function grill() {
    if (prd.trim().length < 20) {
      setError('PRD를 조금 더 작성해 주세요 (20자 이상).')
      return
    }
    setError('')
    setLoading(true)
    setQuestions([])
    let finalQuestions = FALLBACK_QUESTIONS
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 10000)
      const res = await fetch('/api/grill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prd }),
        signal: controller.signal,
      })
      clearTimeout(timer)
      const data = await res.json()
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        finalQuestions = data.questions
      }
    } catch {
      // 로컬 개발(서버리스 없음)·네트워크 장애 시 폴백
    } finally {
      setQuestions(finalQuestions)
      setLoading(false)
    }
    // PRD는 Grill Me를 돌리는 순간 자동 저장(제출)됨
    await savePrd({
      prdText: prd,
      questions: finalQuestions,
      grillDone: false,
      createdAt: serverTimestamp(),
    }).catch(() => {})
  }

  async function markDone() {
    setPassed(true)
    setFeedbackLoading(true)
    await savePrd({ grillDone: true }).catch(() => {})
    let aiFeedback = FALLBACK_PRD_FEEDBACK
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'prd', text: prd }),
      })
      const data = await res.json()
      if (typeof data.feedback === 'string' && data.feedback.trim()) {
        aiFeedback = data.feedback
      }
    } catch {
      // 서버리스 함수 없음(로컬 개발)·네트워크 장애 시 폴백
    }
    setFeedback(aiFeedback)
    setFeedbackLoading(false)
    await savePrd({
      aiFeedback,
      feedbackEditedBy: 'ai',
      feedbackUpdatedAt: serverTimestamp(),
    }).catch(() => {})
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-bold text-cinema-900">🔥 Grill Me</h1>
      <p className="mt-2 text-lg text-gray-600">
        작성한 PRD-lite를 붙여넣으면, AI가 특수교육 관점의 <b>질문만</b> 던집니다.
        답은 주지 않아요 — 생각은 선생님의 몫이니까요.
      </p>

      {passed && (
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-green-50 p-4">
          <p className="font-bold text-green-700">✅ Grill Me 통과! 이제 빌드를 시작하세요.</p>
          <Link to="/missions" className="rounded-lg bg-green-600 px-4 py-2 font-bold text-white">
            미션으로 →
          </Link>
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <textarea
          className="h-56 w-full rounded-xl border-2 border-gray-200 p-4 focus:border-cinema-500 focus:outline-none"
          placeholder="ChatGPT에서 완성한 PRD-lite를 여기에 붙여넣으세요…"
          value={prd}
          onChange={(e) => setPrd(e.target.value)}
        />
        {error && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-red-600">{error}</p>}
        <button
          onClick={grill}
          disabled={loading}
          className="mt-3 w-full rounded-xl bg-cinema-500 py-4 text-lg font-bold text-white transition hover:bg-cinema-600 disabled:opacity-50"
        >
          {loading ? '🔥 굽는 중… (최대 10초)' : questions.length > 0 ? '🔄 다시 구워보기 (선택)' : '🔥 내 PRD 구워줘!'}
        </button>
      </div>

      {questions.length > 0 && (
        <div className="mt-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-cinema-700">
            AI의 질문 — PRD에 답을 보강해 보세요
          </h2>
          {questions.map((q, i) => (
            <div key={i} className="flex gap-3 rounded-2xl border-l-4 border-cinema-500 bg-white p-4 shadow-sm">
              <span className="text-2xl">🤔</span>
              <p className="pt-0.5 text-gray-700">{q}</p>
            </div>
          ))}
          {!passed && (
            <button
              onClick={markDone}
              className="w-full rounded-xl bg-green-600 py-4 text-lg font-bold text-white transition hover:bg-green-700"
            >
              ✅ 질문을 PRD에 반영했습니다 — 통과!
            </button>
          )}
        </div>
      )}

      {(feedbackLoading || feedback) && (
        <div className="mt-6 rounded-2xl border border-cinema-100 bg-cinema-50 p-5">
          <p className="font-bold text-cinema-700">🤖 AI 피드백</p>
          {feedbackLoading ? (
            <p className="mt-1 text-gray-500">피드백을 작성하고 있어요…</p>
          ) : (
            <p className="mt-1 text-gray-700">{feedback}</p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            이 피드백은 강사님이 검토 후 수정할 수 있어요.
          </p>
        </div>
      )}
    </div>
  )
}
