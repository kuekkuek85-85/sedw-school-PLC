import { useState } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'

const SIGNALS = [
  { status: 'green', emoji: '🟢', label: '잘 되고 있어요' },
  { status: 'yellow', emoji: '🟡', label: '조금 헤매는 중' },
  { status: 'red', emoji: '🔴', label: '도와주세요!' },
] as const

export default function SignalButtons() {
  const { session } = useAuth()
  const [active, setActive] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  async function send(status: string, label: string) {
    if (!auth.currentUser || !session) return
    setActive(status)
    setToast(`${label} — 강사님께 전달했어요`)
    setTimeout(() => setToast(''), 2500)
    await setDoc(doc(db, 'signals', auth.currentUser.uid), {
      nickname: session.nickname,
      status,
      updatedAt: serverTimestamp(),
    })
  }

  return (
    <div className="relative flex items-center gap-1">
      {SIGNALS.map((s) => (
        <button
          key={s.status}
          title={s.label}
          onClick={() => send(s.status, s.label)}
          className={`rounded-full p-1.5 text-xl transition hover:scale-125 ${
            active === s.status ? 'bg-cinema-100 ring-2 ring-cinema-500' : ''
          }`}
        >
          {s.emoji}
        </button>
      ))}
      {toast && (
        <div className="absolute right-0 top-full z-40 mt-2 w-48 rounded-lg bg-cinema-900 px-3 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
