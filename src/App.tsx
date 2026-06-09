import './App.css'
import Leftsidebar from './components/Leftsidebar'
import Navbar from './components/Navbar'
import Home from './app/Home/page'

function App() {

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Leftsidebar />
        <main className="main-content">
          <Home />
        </main>
      </div>
    </div>
  )
}

export default App
