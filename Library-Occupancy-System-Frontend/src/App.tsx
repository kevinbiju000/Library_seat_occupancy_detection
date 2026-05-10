import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { HomeScreen, LiveAnalysisScreen } from './pages'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#000000]">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/live" element={<LiveAnalysisScreen />} />
        </Routes>
      </div>
    </Router>
  )
}
export default App
