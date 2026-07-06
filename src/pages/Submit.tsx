import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db, auth } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { TRACKS } from '../lib/constants'

export default function Submit() {
  const { session } = useAuth()
  const [existingId, setExistingId] = useState<string | null>(null)
  const [appName, setAppName] = useState('')
  const [url, setUrl] = useState('')
  const [track, setTrack] = useState('')
  const [targetStudents, setTargetStudents] = useState('')
  const [features, setFeatures] = useState(['', '', ''])
  const [proudOf, setProudOf] = useState('')
  const [toImprove, setToImprove] = useState('')
  const [remixed, setRemixed] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    // 기존 제출물 불러오기 (본인 것 수정 가능)
    async function load() {
      if (!auth.currentUser) return
      const q = query(
        collection(db, 'submissions'),
        where('uid', '==', auth.currentUser.uid),
      )
      const snap = await getDocs(q)
      if (!snap.empty) {
        const d = snap.docs[0]
        const s = d.data()
        setExistingId(d.id)
        setAppName(s.appName ?? '')
        setUrl(s.url ?? '')
        setTrack(s.track ?? '')
        setTargetStudents(s.targetStudents ?? '')
        setFeatures(s.features ?? ['', '', ''])
        setProudOf(s.proudOf ?? '')
        setToImprove(s.toImprove ?? '')
        setRemixed(!!s.remixedFrom)
      }
    }
    load().catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!appName.trim()) return setError('앱 이름을 입력해 주세요.')
    if (!/^https:\/\/.+/.test(url.trim()))
      return setError('배포 URL은 https:// 로 시작해야 해요.')
    if (!track) return setError('트랙을 선택해 주세요.')
    if (!targetStudents.trim()) return setError('대상 학생·수행수준을 입력해 주세요.')
    if (features.some((f) => !f.trim()))
      return setError('핵심 기능 3개를 모두 채워 주세요.')
    if (!proudOf.trim()) return setError('자랑할 점을 입력해 주세요.')
    if (!toImprove.trim()) return setError('아쉬운 점·다음 버전 계획을 입력해 주세요.')
    if (!auth.currentUser || !session) return setError('세션이 만료됐어요. 새로고침해 주세요.')

    setBusy(true)
    try {
      const grillDone = localStorage.getItem('dawon_grill_done') === 'true'
      const data = {
        uid: auth.currentUser.uid,
        nickname: session.nickname,
        subject: session.subject,
        track,
        appName: appName.trim(),
        url: url.trim(),
        targetStudents: targetStudents.trim(),
        features: features.map((f) => f.trim()),
        proudOf: proudOf.trim(),
        toImprove: toImprove.trim(),
        remixedFrom: remixed ? '강사 v0.1' : '',
        grillDone,
        updatedAt: serverTimestamp(),
      }
      if (existingId) {
        await updateDoc(doc(db, 'submissions', existingId), data)
      } else {
        const ref = await addDoc(collection(db, 'submissions'), {
          ...data,
          createdAt: serverTimestamp(),
        })
        setExistingId(ref.id)
      }
      setDone(true)
    } catch {
      setError('저장에 실패했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-10 text-center shadow-lg">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-4 font-display text-2xl font-bold text-cinema-900">
          제출 완료!
        </h1>
        <p className="mt-2 text-gray-600">
          발표 슬라이드가 자동으로 만들어졌어요.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/gallery"
            className="rounded-xl bg-cinema-500 py-4 text-lg font-bold text-white transition hover:bg-cinema-600"
          >
            🖼️ 갤러리에서 내 발표 슬라이드 보기
          </Link>
          <button
            onClick={() => setDone(false)}
            className="rounded-xl border-2 border-gray-200 py-3 font-bold text-gray-600 hover:border-cinema-100"
          >
            ✏️ 제출 내용 수정하기
          </button>
        </div>
      </div>
    )
  }

  const inputCls =
    'w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-cinema-500 focus:outline-none'

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-bold text-cinema-900">📮 제출하기</h1>
      <p className="mb-2 mt-2 text-lg text-gray-600">
        이 폼을 채우는 것 자체가 오늘의 성찰 활동이에요. 제출하면 발표 슬라이드 4장이
        자동으로 만들어집니다. {existingId && <b>(이미 제출한 내용을 수정하는 중)</b>}
      </p>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block font-bold">앱 이름 *</label>
          <input className={inputCls} value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="예: 팝콘 가게 계산 연습" />
        </div>
        <div>
          <label className="mb-1 block font-bold">배포 URL *</label>
          <input className={inputCls} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://내앱.vercel.app" inputMode="url" />
        </div>
        <div>
          <label className="mb-1 block font-bold">트랙 *</label>
          <div className="flex flex-wrap gap-2">
            {TRACKS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTrack(t.id)}
                className={`rounded-xl border-2 px-4 py-2.5 font-medium transition ${
                  track === t.id
                    ? 'border-cinema-500 bg-cinema-50 text-cinema-700'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                {t.emoji} {t.name} ({t.level})
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block font-bold">대상 학생 · 수행수준 *</label>
          <input className={inputCls} value={targetStudents} onChange={(e) => setTargetStudents(e.target.value)} placeholder="예: 중학교 2학년, 수행수준 나 (글 읽기 가능, 소근육 약함)" />
        </div>
        <div>
          <label className="mb-1 block font-bold">핵심 기능 3개 *</label>
          {features.map((f, i) => (
            <input
              key={i}
              className={`${inputCls} mb-2`}
              value={f}
              onChange={(e) => {
                const next = [...features]
                next[i] = e.target.value
                setFeatures(next)
              }}
              placeholder={`기능 ${i + 1}`}
            />
          ))}
        </div>
        <div>
          <label className="mb-1 block font-bold">자랑할 점 *</label>
          <textarea className={`${inputCls} h-24`} value={proudOf} onChange={(e) => setProudOf(e.target.value)} placeholder="이 자료에서 가장 마음에 드는 부분은?" />
        </div>
        <div>
          <label className="mb-1 block font-bold">아쉬운 점 · 다음 버전 계획 *</label>
          <textarea className={`${inputCls} h-24`} value={toImprove} onChange={(e) => setToImprove(e.target.value)} placeholder="시간이 더 있다면 무엇을 고치고 싶나요?" />
        </div>
        <label className="flex items-center gap-2 text-gray-600">
          <input type="checkbox" checked={remixed} onChange={(e) => setRemixed(e.target.checked)} className="h-5 w-5 accent-cinema-500" />
          강사 v0.1을 개작해서 만들었어요
        </label>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-cinema-500 py-4 text-lg font-bold text-white transition hover:bg-cinema-600 disabled:opacity-50"
        >
          {busy ? '저장 중…' : existingId ? '수정 내용 저장 💾' : '제출하고 슬라이드 만들기 🚀'}
        </button>
      </form>
    </div>
  )
}
