import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import DashboardContent from './components/DashboardContent'
import EventRegistration from './pages/EventRegistration'
import EventInfo from './pages/EventInfo'
import Feedback from './pages/Feedback'
import Amenities from './pages/Amenities'
import Directory from './pages/Directory'
import Polls from './pages/Polls'
import './Dashboard.css'

function DashboardLayout({ phone, onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()

  const handleMenuClick = (menuId) => {
    const routes = {
      'dashboard': '/',
      'event-registration': '/event-registration',
      'event-info': '/event-info',
      'feedback': '/feedback',
      'amenities': '/amenities',
      'directory': '/directory',
      'polls': '/polls'
    }
    navigate(routes[menuId])
  }

  return (
    <div className="dashboard-container">
      <Header userName={phone} onLogout={onLogout} />
      
      <div className="dashboard-main">
        <Sidebar 
          activeMenu={window.location.pathname === '/' ? 'dashboard' : window.location.pathname.slice(1)}
          onMenuClick={handleMenuClick}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="dashboard-content">
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/event-registration" element={<EventRegistration />} />
            <Route path="/event-info" element={<EventInfo />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/polls" element={<Polls />} />
          </Routes>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}

function Dashboard({ phone, onLogout }) {
  return (
    <Router>
      <DashboardLayout phone={phone} onLogout={onLogout} />
    </Router>
  )
}

export default Dashboard
