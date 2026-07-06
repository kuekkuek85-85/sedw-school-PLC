import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

export interface Session {
  nickname: string
  subject: string
  role: 'teacher' | 'instructor'
}

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  enter: (session: Session) => Promise<void>
  leave: () => void
}

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
  enter: async () => {},
  leave: () => {},
})

const STORAGE_KEY = 'dawon_session_v1'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as Session) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u)
        setLoading(false)
      } else {
        try {
          await signInAnonymously(auth)
        } catch (e) {
          console.error('익명 로그인 실패', e)
          setLoading(false)
        }
      }
    })
    return unsub
  }, [])

  // 입장 시점에 인증이 아직 없었던 경우, 인증이 붙는 즉시 참가자 문서 기록
  useEffect(() => {
    if (!user || !session) return
    setDoc(
      doc(db, 'participants', user.uid),
      {
        nickname: session.nickname,
        subject: session.subject,
        role: session.role,
        joinedAt: serverTimestamp(),
      },
      { merge: true },
    ).catch(() => {})
  }, [user, session])

  async function enter(s: Session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    setSession(s)
    if (auth.currentUser) {
      await setDoc(
        doc(db, 'participants', auth.currentUser.uid),
        {
          nickname: s.nickname,
          subject: s.subject,
          role: s.role,
          joinedAt: serverTimestamp(),
        },
        { merge: true },
      )
    }
  }

  function leave() {
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, enter, leave }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
