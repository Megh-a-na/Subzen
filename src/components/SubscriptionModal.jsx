import React, { useState } from 'react';
import '../styles/SubscriptionModal.css';

function SubscriptionModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    duration: 'monthly',
    customDuration: '',
    cost: ''
  });
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [customName, setCustomName] = useState('');
  const [showCustomName, setShowCustomName] = useState(false);
  const [error, setError] = useState('');

  // Common subscriptions by category
  const subscriptionSuggestions = {
    entertainment: [
      "Netflix",
      "Amazon Prime",
      "Disney+",
      "Hulu",
      "HBO Max",
      "Spotify",
      "Apple Music",
      "YouTube Premium",
      "PlayStation Plus",
      "Xbox Game Pass"
    ],
    productivity: [
      "Microsoft 365",
      "Google Workspace",
      "Slack",
      "Zoom Pro",
      "Adobe Creative Cloud",
      "Notion",
      "Evernote",
      "Dropbox",
      "LastPass",
      "Grammarly"
    ],
    education: [
      "Coursera",
      "Udemy",
      "Skillshare",
      "LinkedIn Learning",
      "Masterclass",
      "Duolingo Plus",
      "Brilliant",
      "DataCamp",
      "Codecademy Pro"
    ],
    shopping: [
      "Amazon Prime",
      "Costco Membership",
      "Sam's Club",
      "Walmart+",
      "Instacart Express",
      "DoorDash DashPass",
      "Uber One",
      "GrubHub+"
    ],
    fitness: [
      "Peloton",
      "Nike Training Club",
      "MyFitnessPal Premium",
      "Strava",
      "Fitbod",
      "Apple Fitness+",
      "SWEAT",
      "Gym Membership"
    ],
    news: [
      "New York Times",
      "Wall Street Journal",
      "Washington Post",
      "The Economist",
      "Medium",
      "Substack",
      "Apple News+"
    ],
    software: [
      "Antivirus Software",
      "VPN Service",
      "Cloud Storage",
      "Password Manager",
      "Adobe Creative Cloud",
      "Microsoft 365",
      "JetBrains Tools",
      "GitHub Pro"
    ]
  };

  // Get all subscription suggestions in a flat array and sort alphabetically
  const allSuggestions = Object.values(subscriptionSuggestions)
    .flat()
    .sort((a, b) => a.localeCompare(b));

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setShowCustomName(true);
      setFormData({ ...formData, name: '' });
    } else {
      setShowCustomName(false);
      setFormData({ ...formData, name: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name) {
      setError('Subscription name is required');
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      return;
    }
    if (!formData.duration) {
      setError('Duration is required');
      return;
    }
    if (!formData.cost || formData.cost <= 0) {
      setError('Please enter a valid cost');
      return;
    }

    try {
      // Get user ID from session storage
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user || !user.id) {
        setError('User not authenticated');
        return;
      }

      const finalDuration = formData.duration === 'custom' ? formData.customDuration : formData.duration;

      const response = await fetch('http://localhost:5000/api/subscriptions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: formData.name,
          category: formData.category,
          duration: finalDuration,
          cost: parseFloat(formData.cost)
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Show success message
        alert('Subscription added successfully!');
        // Clear form
        setFormData({
          name: '',
          category: '',
          duration: 'monthly',
          customDuration: '',
          cost: ''
        });
        // Close modal and refresh parent component
        onSubmit();
        onClose();
      } else {
        setError(data.error || 'Failed to add subscription');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to add subscription. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Subscription</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><strong>Subscription Name:</strong></label>
            <div className="subscription-name-container">
              <select
                value={formData.name || 'custom'}
                onChange={handleNameChange}
                className="subscription-select"
              >
                <option value="">Select Subscription</option>
                {allSuggestions.map((suggestion, index) => (
                  <option key={index} value={suggestion}>{suggestion}</option>
                ))}
                <option value="custom">Custom</option>
              </select>
              {showCustomName && (
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => {
                    setCustomName(e.target.value);
                    setFormData({ ...formData, name: e.target.value });
                  }}
                  placeholder="Enter custom subscription name"
                  className="custom-name-input"
                />
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select Category</option>
              <option value="entertainment">Entertainment</option>
              <option value="productivity">Productivity</option>
              <option value="education">Education</option>
              <option value="shopping">Shopping</option>
              <option value="fitness">Fitness</option>
              <option value="news">News & Media</option>
              <option value="software">Software & Tools</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duration:</label>
            <div className="duration-container">
              <select
                value={formData.duration}
                onChange={(e) => {
                  setShowCustomDuration(e.target.value === 'custom');
                  setFormData({...formData, duration: e.target.value});
                }}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="custom">Custom</option>
              </select>
              {showCustomDuration && (
                <input
                  type="text"
                  value={formData.customDuration}
                  onChange={(e) => setFormData({...formData, customDuration: e.target.value})}
                  placeholder="Enter custom duration"
                  className="custom-duration"
                />
              )}
            </div>
          </div>

          <div className="form-group">
            <label><strong>Cost:</strong></label>
            <div className="cost-input-container">
              <div className="rupee-symbol">₹</div>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                placeholder="Enter amount"
                step="1"
                min="0"
                className="cost-input"
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-buttons">
            <button type="submit" className="submit-btn">Add Subscription</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubscriptionModal; 