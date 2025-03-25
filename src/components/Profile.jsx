import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { FaUser } from 'react-icons/fa';
import '../styles/Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [subscriptionStats, setSubscriptionStats] = useState({
    total: 0,
    monthlyAmount: 0
  });

  useEffect(() => {
    // Get user data from session storage
    const userData = JSON.parse(sessionStorage.getItem('user'));
    setUser(userData);

    // Fetch subscriptions for the user
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/subscriptions/get/${userData.id}`);
        const data = await response.json();

        if (response.ok) {
          // Calculate total monthly amount
          const monthlyTotal = data.reduce((acc, sub) => {
            let monthlyCost = 0;
            const cost = parseFloat(sub.cost);

            switch (sub.duration.toLowerCase()) {
              case 'weekly':
                monthlyCost = cost * 4;
                break;
              case 'monthly':
                monthlyCost = cost;
                break;
              case 'annual':
                monthlyCost = cost / 12;
                break;
              default:
                monthlyCost = cost;
            }
            return acc + monthlyCost;
          }, 0);

          setSubscriptionStats({
            total: data.length,
            monthlyAmount: monthlyTotal
          });
        }
      } catch (err) {
        console.error('Error fetching subscriptions:', err);
      }
    };

    if (userData && userData.id) {
      fetchSubscriptions();
    }
  }, []);

  if (!user) return null;

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-header">
          <h2 className="profile-heading">My Profile</h2>
        </div>

        <div className="profile-content">
          <div className="profile-info-section">
            <div className="profile-picture-container">
              <div className="profile-picture">
                <FaUser className="default-avatar" />
              </div>
            </div>

            <div className="user-details">
              <div className="detail-group">
                <label>Username</label>
                <p>{user.username}</p>
              </div>
              <div className="detail-group">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          <div className="subscription-stats">
            <div className="stats-card">
              <h3>Active Subscriptions</h3>
              <p className="stats-number">{subscriptionStats.total}</p>
            </div>
            <div className="stats-card">
              <h3>Monthly Spending</h3>
              <p className="stats-number">₹{subscriptionStats.monthlyAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile; 