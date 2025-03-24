import Layout from './Layout';

function Dashboard() {
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
          <button className="add-subscription-button">
            Add Your First Subscription
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard; 