import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SignalButtons from './SignalButtons'

const NAV = [
  { to: '/', label: '포털', emoji: '🎬' },
  { to: '/missions', label: '미션', emoji: '🗺️' },
  { to: '/grill', label: 'Grill Me', emoji: '🔥' },
  { to: '/submit', label: '제출', emoji: '📮' },
  { to: '/gallery', label: '갤러리', emoji: '🖼️' },
  { to: '/guide', label: '가이드', emoji: '📖' },
]

export default function Layout() {
  const { session } = useAuth()

  return (
    <div className="min-h-screen bg-cinema-50">
      <header className="sticky top-0 z-30 border-b border-cinema-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2">
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-xl px-3 py-2 font-bold transition ${
                    isActive
                      ? 'bg-cinema-500 text-white'
                      : 'text-gray-600 hover:bg-cinema-50'
                  }`
                }
              >
                <span className="mr-1">{item.emoji}</span>
                {item.label}
              </NavLink>
            ))}
            {session?.role === 'instructor' && (
              <NavLink
                to="/instructor"
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-xl px-3 py-2 font-bold transition ${
                    isActive
                      ? 'bg-cinema-900 text-white'
                      : 'text-cinema-700 hover:bg-cinema-50'
                  }`
                }
              >
                🎛️ 대시보드
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {session && (
              <span className="hidden text-sm text-gray-500 sm:block">
                {session.nickname} · {session.subject}
              </span>
            )}
            <SignalButtons />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-cinema-100 py-6 text-center text-sm text-gray-400">
        서울다원학교 어울림시네마 교원학습공동체 연수 · 2026. 7. 8.
      </footer>
    </div>
  )
}
