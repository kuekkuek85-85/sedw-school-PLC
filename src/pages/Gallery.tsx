import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db, auth } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { trackBadge } from '../lib/constants'
import type { Submission, Comment, Reaction, Reflection } from '../lib/types'

const EMOJIS = ['❤️', '👍', '😍']

export default function Gallery() {
  const { session } = useAuth()
  const [subs, setSubs] = useState<Submission[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [trainingEnded, setTrainingEnded] = useState(false)

  useEffect(() => {
    const unsub1 = onSnapshot(
      query(collection(db, 'submissions'), orderBy('createdAt', 'desc')),
      (snap) =>
        setSubs(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Submission)),
    )
    const unsub2 = onSnapshot(collection(db, 'reactions'), (snap) =>
      setReactions(snap.docs.map((d) => d.data() as Reaction)),
    )
    const unsub3 = onSnapshot(doc(db, 'config', 'app'), (snap) => {
      setTrainingEnded(!!snap.data()?.trainingEnded)
    })
    return () => {
      unsub1()
      unsub2()
      unsub3()
    }
  }, [])

  async function toggleReaction(subId: string, emoji: string) {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const ref = doc(db, 'reactions', `${subId}_${uid}`)
    const mine = reactions.find((r) => r.submissionId === subId && r.uid === uid)
    if (mine?.emoji === emoji) {
      await deleteDoc(ref)
    } else {
      await setDoc(ref, { submissionId: subId, uid, emoji })
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-cinema-900">🖼️ 갤러리 워크</h1>
          <p className="mt-1 text-lg text-gray-600">
            동료 2명의 작품에 댓글을 남겨 주세요 — <b>좋은 점 1가지 + 제안 1가지</b>
          </p>
        </div>
        {session?.role === 'instructor' && (
          <Link
            to="/gallery/present"
            className="rounded-xl bg-cinema-900 px-5 py-3 font-bold text-white transition hover:scale-105"
          >
            📽️ 발표 모드 시작
          </Link>
        )}
      </div>

      {subs.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-cinema-100 bg-white p-12 text-center text-gray-400">
          아직 제출물이 없어요. 첫 번째 주인공이 되어 보세요! 🎬
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subs.map((s) => {
          const subReactions = reactions.filter((r) => r.submissionId === s.id)
          const myUid = auth.currentUser?.uid
          return (
            <div key={s.id} className="flex flex-col rounded-2xl border border-cinema-100 bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-cinema-50 px-3 py-1 text-sm font-bold text-cinema-700">
                  {s.subject}
                </span>
                <span className="text-sm text-gray-400">{trackBadge(s.track)}</span>
              </div>
              <h3 className="font-display text-lg font-bold">{s.appName}</h3>
              <p className="text-sm text-gray-500">
                {s.nickname}
                {s.remixedFrom && <span className="ml-1 text-emerald-600">· {s.remixedFrom} 개작</span>}
              </p>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 rounded-xl bg-cinema-500 py-2.5 text-center font-bold text-white transition hover:bg-cinema-600"
              >
                🔗 앱 열어보기
              </a>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex gap-1">
                  {EMOJIS.map((e) => {
                    const count = subReactions.filter((r) => r.emoji === e).length
                    const mine = subReactions.some((r) => r.uid === myUid && r.emoji === e)
                    return (
                      <button
                        key={e}
                        onClick={() => toggleReaction(s.id, e)}
                        className={`rounded-full px-2 py-1 text-sm transition hover:scale-110 ${
                          mine ? 'bg-cinema-100 ring-1 ring-cinema-500' : 'bg-gray-50'
                        }`}
                      >
                        {e} {count > 0 && count}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setOpenId(openId === s.id ? null : s.id)}
                  className="text-sm font-bold text-cinema-600 hover:underline"
                >
                  💬 댓글
                </button>
              </div>
              {openId === s.id && <CommentSection submissionId={s.id} />}
            </div>
          )
        })}
      </div>

      {trainingEnded && <ReflectionSection />}
    </div>
  )
}

function ReflectionSection() {
  const { session } = useAuth()
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [mySaved, setMySaved] = useState(false)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'reflections'), (snap) => {
      const all = snap.docs.map((d) => d.data() as Reflection)
      setReflections(all)
      const mine = all.find((r) => r.uid === auth.currentUser?.uid)
      if (mine) {
        setText(mine.text)
        setMySaved(true)
      }
    })
    return unsub
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !auth.currentUser || !session) return
    setBusy(true)
    try {
      await setDoc(doc(db, 'reflections', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        nickname: session.nickname,
        subject: session.subject,
        text: text.trim(),
        createdAt: serverTimestamp(),
      })
      setMySaved(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-cinema-100 bg-white p-6 shadow-sm">
      <h2 className="font-display text-xl font-bold text-cinema-700">📝 연수 성찰 후기</h2>
      <p className="mb-4 mt-1 text-gray-600">
        오늘 연수를 마치며 느낀 점을 자유롭게 남겨 주세요. 모두의 후기를 함께 볼 수 있어요.
      </p>
      <form onSubmit={submit} className="mb-6 space-y-2">
        <textarea
          className="h-28 w-full rounded-xl border-2 border-gray-200 p-3 focus:border-cinema-500 focus:outline-none"
          placeholder="오늘 연수에서 느낀 점, 아쉬운 점, 다음에 바라는 점을 자유롭게 적어 주세요."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          disabled={busy || !text.trim()}
          className="rounded-xl bg-cinema-500 px-6 py-2.5 font-bold text-white disabled:opacity-40"
        >
          {mySaved ? '수정 저장 💾' : '후기 남기기 ✏️'}
        </button>
      </form>
      <div className="space-y-3">
        {reflections.map((r) => (
          <div key={r.uid} className="rounded-xl bg-gray-50 p-3 text-sm">
            <p className="font-bold text-gray-700">
              {r.nickname} <span className="font-normal text-gray-400">· {r.subject}</span>
            </p>
            <p className="mt-1 whitespace-pre-wrap text-gray-700">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function CommentSection({ submissionId }: { submissionId: string }) {
  const { session } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [good, setGood] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const q = query(
      collection(db, 'submissions', submissionId, 'comments'),
      orderBy('createdAt', 'asc'),
    )
    return onSnapshot(q, (snap) =>
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Comment)),
    )
  }, [submissionId])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!good.trim() || !suggestion.trim() || !auth.currentUser || !session) return
    setBusy(true)
    try {
      await addDoc(collection(db, 'submissions', submissionId, 'comments'), {
        uid: auth.currentUser.uid,
        nickname: session.nickname,
        good: good.trim(),
        suggestion: suggestion.trim(),
        createdAt: serverTimestamp(),
      })
      setGood('')
      setSuggestion('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
      {comments.map((c) => (
        <div key={c.id} className="rounded-xl bg-gray-50 p-3 text-sm">
          <p className="font-bold text-gray-700">{c.nickname}</p>
          <p className="mt-1">
            <span className="font-bold text-green-600">👏 좋은 점:</span> {c.good}
          </p>
          <p>
            <span className="font-bold text-blue-600">💡 제안:</span> {c.suggestion}
          </p>
        </div>
      ))}
      <form onSubmit={submit} className="space-y-2">
        <input
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-cinema-500 focus:outline-none"
          placeholder="좋은 점 1가지"
          value={good}
          onChange={(e) => setGood(e.target.value)}
        />
        <input
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-cinema-500 focus:outline-none"
          placeholder="제안 1가지"
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
        />
        <button
          disabled={busy || !good.trim() || !suggestion.trim()}
          className="w-full rounded-lg bg-cinema-500 py-2 text-sm font-bold text-white disabled:opacity-40"
        >
          댓글 남기기
        </button>
      </form>
    </div>
  )
}
