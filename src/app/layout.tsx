import '../App.css'
import '../index.css'
import Leftsidebar from '../components/Leftsidebar'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'GitHub Repo Analyzer',
  description: 'Analyze GitHub repositories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <Navbar />
          <div className="content-wrapper">
            <Leftsidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
