import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Workout from './pages/Workout'
import QuickFlicks from './pages/QuickFlicks'
import History from './pages/History'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
    <SettingsProvider>
      <HashRouter>
        <div className="min-h-screen flex bg-ivory dark:bg-plum-950 text-ink dark:text-ivory-100 transition-colors duration-300">
          <Sidebar />
          <div className="flex-1 min-w-0">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workout" element={<Workout />} />
                <Route path="/quick-flicks" element={<QuickFlicks />} />
                <Route path="/history" element={<History />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </HashRouter>
    </SettingsProvider>
    </AuthProvider>
  )
}
