import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import '../styles/Dashboard.css';

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user || !user.id) {
          return;
        }

        const response = await fetch(`http://localhost:5000/api/subscriptions/get/${user.id}`);
        const data = await response.json();

        if (response.ok) {
          setSubscriptions(data);
          calculateMonthlyTotal(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const calculateMonthlyTotal = (subs) => {
    const total = subs.reduce((acc, sub) => {
      let monthlyCost = 0;
      const cost = parseFloat(sub.cost);

      switch (sub.duration.toLowerCase()) {
        case 'weekly':
          monthlyCost = cost * 4; // Assuming 4 weeks per month
          break;
        case 'monthly':
          monthlyCost = cost;
          break;
        case 'annual':
          monthlyCost = cost / 12;
          break;
        default:
          monthlyCost = cost; // Default to monthly for custom durations
      }

      return acc + monthlyCost;
    }, 0);

    setMonthlyTotal(total);
  };

  return (
    <Layout>
      <div className="dashboard-content">
        <div className="welcome-message">
          <h2>Welcome to Subzen</h2>
          <p>The ultimate subscription tracker</p>
          <p>Manage and track all your subscriptions at one place</p>
        </div>
        
        <div className="subscription-summary">
          <h3>Your Subscription Summary</h3>
          {loading ? (
            <p>Loading...</p>
          ) : subscriptions.length === 0 ? (
            <p>You don't have any subscriptions yet.</p>
          ) : (
            <div className="summary-content">
              <div className="total-subscriptions">
                <p>Total Active Subscriptions: {subscriptions.length}</p>
              </div>
              <div className="monthly-spending">
                <h4>Monthly Spending Overview</h4>
                <p className="monthly-amount">₹{monthlyTotal.toFixed(2)}</p>
                <p className="spending-note">*Includes all subscriptions normalized to monthly payments</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard; 