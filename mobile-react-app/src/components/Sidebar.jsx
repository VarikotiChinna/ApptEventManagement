import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faCalendarPlus, faInfoCircle, faComments, faDumbbell, faBook, faPoll } from '@fortawesome/free-solid-svg-icons'
import './Sidebar.css'

function Sidebar({ activeMenu, onMenuClick, collapsed, onToggle }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: faChartLine },
    { id: 'event-registration', label: 'Event Registration', icon: faCalendarPlus },
    { id: 'event-info', label: 'Event Information', icon: faInfoCircle },
    { id: 'feedback', label: 'Feedback', icon: faComments },
    { id: 'amenities', label: 'Amenities Booking', icon: faDumbbell },
    { id: 'directory', label: 'Resident Directory', icon: faBook },
    { id: 'polls', label: 'Polls & Voting', icon: faPoll }
  ]

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="toggle-button" onClick={onToggle}>
        {collapsed ? '☰' : '✕'}
      </button>
      
      <nav className="menu">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
            onClick={() => onMenuClick(item.id)}
          >
            <FontAwesomeIcon icon={item.icon} className="menu-icon" />
            {!collapsed && <span className="menu-label">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
