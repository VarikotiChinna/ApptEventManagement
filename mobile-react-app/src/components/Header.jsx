import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons'
import './Header.css'

function Header({ userName, onLogout }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="header">
      <div className="header-left">
        <img src="/logo.png" alt="Logo" className="logo" />
        <h1 className="app-name">Sahasra Serenity Community</h1>
      </div>
      
      <div className="header-right">
        <button className="icon-button">
          <FontAwesomeIcon icon={faBell} size="lg" />
        </button>
        
        <button 
          className="profile-button"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FontAwesomeIcon icon={faUser} size="lg" />
        </button>
        
        {showMenu && (
          <div className="dropdown">
            <button className="menu-item">Profile</button>
            <button className="menu-item">Settings</button>
            <button className="menu-item" onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
