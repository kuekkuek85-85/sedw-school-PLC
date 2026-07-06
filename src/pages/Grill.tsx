import { useState } from 'react'
import { Link } from 'react-router-dom'

const FALLBACK_QUESTIONS = [
  '수행수준(가/나/다)별로 활동이 어떻게 달라지나요?',
  '조작 요소(버튼·드래그)가 소근육이 약한 학생도 가능한 크기와 방식인가요?',
  '글을 읽지 못하는 학생도 그림만 보고 이해할 수 있나요?',
  '성공/실패 피드백이 즉각적이고 긍정적인가요?',
  '이 자료는 7/14 영화관람의 어느 단계(사전/당일/사후)에 쓰이나요?',
]

export default function Grill() {
  const [prd, setPrd] = useState('')
  const [questions, setQuestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passed, setPassed] = useState(
    () => localStorage.getItem('dawon_grill_done') === 'true',
  )

  async function grill() {
    if (prd.trim().length < 20) {
      setError('PRD를 조금 더 작성해 주세요 (20자 이상).')
      return
    }
    setError('')
    setLoading(true)
    setQuestions([])
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
        setQuestions(data.questions)
      } else {
        setQuestions(FALLBACK_QUESTIONS)
      }
    } catch {
      // 로컬 개발(서버리스 없음)·네트워크 장애 시 폴백
      setQuestions(FALLBACK_QUESTIONS)
    } finally {
      setLoading(false)
    }
  }

  function markDone() {
    localStorage.setItem('dawon_grill_done', 'true')
    setPassed(true)
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
    </div>
  )
}
