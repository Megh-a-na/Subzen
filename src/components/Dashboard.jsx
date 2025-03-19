import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from session storage
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      // If no user data, redirect to login
      navigate('/login');
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data and redirect to login
    sessionStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Subzen Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.username}!</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="welcome-message">
          <h2>Welcome to Subzen</h2>
          <p>The ultimate subscription tracker</p>
          <p>Track and manage all your subscriptions in one place.</p>
        </div>
        
        <div className="subscription-summary">
          <h3>Your Subscription Summary</h3>
          <p>You don't have any subscriptions yet.</p>
          <button className="add-subscription-button">
            Add Your First Subscription
          </button>
        </div>
      </main>
    </div>
  );
}

export default Dashboard; 