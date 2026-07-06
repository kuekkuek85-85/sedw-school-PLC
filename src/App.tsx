import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import EntryModal from './components/EntryModal'
import Layout from './components/Layout'
import StageOverlay from './components/StageOverlay'
import Portal from './pages/Portal'
import Missions from './pages/Missions'
import Grill from './pages/Grill'
import Submit from './pages/Submit'
import Gallery from './pages/Gallery'
import Present from './pages/Present'
import Guide from './pages/Guide'
import Instructor from './pages/Instructor'
import Certificate from './pages/Certificate'

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cinema-50">
        <div className="text-center">
          <div className="animate-bounce text-6xl">🎬</div>
          <p className="mt-4 text-lg text-gray-500">연수장을 준비하고 있어요…</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <EntryModal />
  }

  return (
    <>
      <StageOverlay />
      <Routes>
        <Route path="/gallery/present" element={<Present />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Portal />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/grill" element={<Grill />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/instructor" element={<Instructor />} />
          <Route path="/certificate" element={<Certificate />} />
        </Route>
      </Routes>
    </>
  )
}
