import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import TimelineView from './views/TimelineView'
import UploadMemory from './views/UploadMemory'
import MemoryViewer from './views/MemoryViewer'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<TimelineView />} />
            <Route path="/upload" element={<UploadMemory />} />
            <Route path="/view/:id" element={<MemoryViewer />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function NavBar() {
  const location = useLocation()

  return (
    <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-blue-600 hover:opacity-80">
        AetherSync
      </Link>
      <div className="space-x-4">
        <NavLink to="/" label="Timeline" active={location.pathname === '/'} />
        <NavLink to="/upload" label="Upload" active={location.pathname === '/upload'} />
      </div>
    </nav>
  )
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors duration-200 ${
        active ? 'text-blue-600 underline' : 'text-gray-700 hover:text-blue-500'
      }`}
    >
      {label}
    </Link>
  )
}
