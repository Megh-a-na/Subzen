import React, { useState } from 'react';
import Layout from './Layout';
import SubscriptionModal from './SubscriptionModal';

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubscriptionAdded = () => {
    // You can add logic here to refresh the subscriptions list
    setIsModalOpen(false);
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
          <p>You don't have any subscriptions yet.</p>
          <button 
            className="add-subscription-button"
            onClick={() => setIsModalOpen(true)}
          >
            Add Your First Subscription
          </button>
        </div>

        <SubscriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubscriptionAdded}
        />
      </div>
    </Layout>
  );
}

export default Dashboard; 