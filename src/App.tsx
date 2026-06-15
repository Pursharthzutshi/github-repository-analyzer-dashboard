import { useState } from 'react'
import './App.css'
import Leftsidebar from './components/Leftsidebar'
import Navbar from './components/Navbar'
import Home from './app/Home/page'
import OnboardingGuide from './components/HomePage/OnboardingGuide'
import RepositoryExplorer from './app/RepositoryExplorer/page'

function App() {
  const [activePage, setActivePage] = useState('home')

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Leftsidebar activePage={activePage} onNavigate={setActivePage} />
        <main className="main-content">
          {activePage === 'home' && <Home />}
          {activePage === 'repositories' && <RepositoryExplorer />}
          {activePage === 'onboarding' && (
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
              <OnboardingGuide />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App

