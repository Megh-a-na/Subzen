import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Layout({ children }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user'));

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Overlay */}
      {isSidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard" onClick={() => setSidebarOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/subscriptions" onClick={() => setSidebarOpen(false)}>
                My Subscriptions
              </Link>
            </li>
            <li>
              <Link to="/profile" onClick={() => setSidebarOpen(false)}>
                Profile
              </Link>
            </li>
            <li>
              <Link to="/settings" onClick={() => setSidebarOpen(false)}>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button 
            className={`hamburger-menu ${isSidebarOpen ? 'active' : ''}`} 
            onClick={toggleSidebar}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1>Subzen</h1>
        </div>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout; 