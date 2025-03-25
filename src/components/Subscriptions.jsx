import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import SubscriptionModal from './SubscriptionModal';
import '../styles/Subscriptions.css';

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user || !user.id) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        // Debug log
        console.log('Fetching subscriptions for user:', user.id);

        const response = await fetch(`http://localhost:5000/api/subscriptions/get/${user.id}`);
        const data = await response.json();

        if (response.ok) {
          console.log('Fetched subscriptions:', data);
          setSubscriptions(data);
        } else {
          throw new Error(data.error || 'Failed to fetch subscriptions');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch subscriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSubscriptionAdded = () => {
    fetchSubscriptions(); // Refresh the list after adding
  };

  return (
    <Layout>
      <div className="subscriptions-container">
        <div className="subscriptions-header">
          <h2 className="subscriptions-heading">My Subscriptions</h2>
          <button className="add-subscription-button" onClick={() => setIsModalOpen(true)}>
            Add New Subscription
          </button>
        </div>

        {loading && (
          <div className="no-subscriptions">
            <p>Loading subscriptions...</p>
          </div>
        )}

        {error && (
          <div className="no-subscriptions error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && subscriptions.length === 0 && (
          <div className="no-subscriptions">
            <p>You haven't added any subscriptions yet.</p>
          </div>
        )}

        {!loading && !error && subscriptions.length > 0 && (
          <div className="subscriptions-grid">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="subscription-card">
                <div className="subscription-header">
                  <h3>{subscription.name}</h3>
                  <span className="category-badge">{subscription.category}</span>
                </div>
                <div className="subscription-details">
                  <p><strong>Duration:</strong> {subscription.duration}</p>
                  <p><strong>Cost:</strong> ₹{subscription.cost}</p>
                  <p><strong>Added on:</strong> {new Date(subscription.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <SubscriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubscriptionAdded}
        />
      </div>
    </Layout>
  );
}

export default Subscriptions; 