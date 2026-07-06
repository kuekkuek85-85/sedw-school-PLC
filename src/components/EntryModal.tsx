import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { ENTRY_CODE, INSTRUCTOR_CODE, SUBJECTS } from '../lib/constants'

export default function EntryModal() {
  const { enter } = useAuth()
  const [code, setCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [subject, setSubject] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const trimmed = code.trim().toUpperCase()
    const isInstructor = trimmed === INSTRUCTOR_CODE.toUpperCase()
    if (!isInstructor && trimmed !== ENTRY_CODE.toUpperCase()) {
      setError('입장 코드가 맞지 않아요. 화면의 코드를 다시 확인해 주세요.')
      return
    }
    if (!nickname.trim()) {
      setError('닉네임(실명 권장)을 입력해 주세요.')
      return
    }
    if (!subject) {
      setError('교과를 선택해 주세요.')
      return
    }
    setBusy(true)
    try {
      await enter({
        nickname: nickname.trim(),
        subject,
        role: isInstructor ? 'instructor' : 'teacher',
      })
    } catch {
      setError('입장 중 문제가 생겼어요. 다시 시도해 주세요.')
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cinema-900/70 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="text-5xl">🎬</div>
          <h1 className="mt-3 font-display text-2xl font-bold text-cinema-900">
            다원 어울림시네마
          </h1>
          <p className="mt-1 text-gray-600">AI 연수 플랫폼에 오신 것을 환영합니다</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-bold text-gray-700">입장 코드</label>
            <input
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg uppercase focus:border-cinema-500 focus:outline-none"
              placeholder="예: DAWON1"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block font-bold text-gray-700">
              닉네임 <span className="font-normal text-gray-400">(실명 권장)</span>
            </label>
            <input
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg focus:border-cinema-500 focus:outline-none"
              placeholder="예: 김다원"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
            />
          </div>
          <div>
            <label className="mb-1 block font-bold text-gray-700">교과</label>
            <div className="grid grid-cols-3 gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubject(s)}
                  className={`rounded-xl border-2 px-2 py-2.5 text-sm font-medium transition ${
                    subject === s
                      ? 'border-cinema-500 bg-cinema-50 text-cinema-700'
                      : 'border-gray-200 text-gray-600 hover:border-cinema-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-cinema-500 py-4 text-lg font-bold text-white transition hover:bg-cinema-600 disabled:opacity-50"
          >
            {busy ? '입장 중…' : '연수 입장하기 🎟️'}
          </button>
        </form>
      </div>
    </div>
  )
}
