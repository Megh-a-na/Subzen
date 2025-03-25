import React, { useState } from 'react';
import '../styles/SubscriptionModal.css';

function EditSubscriptionModal({ isOpen, onClose, onSubmit, subscription }) {
  const [formData, setFormData] = useState({
    name: subscription.name,
    category: subscription.category,
    duration: subscription.duration,
    customDuration: '',
    cost: subscription.cost
  });
  const [error, setError] = useState('');
  const [showCustomDuration, setShowCustomDuration] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/subscriptions/update/${subscription.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          duration: showCustomDuration ? formData.customDuration : formData.duration,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSubmit();
        onClose();
      } else {
        setError(data.error || 'Failed to update subscription');
      }
    } catch (err) {
      setError('Failed to update subscription. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Subscription</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><strong>Subscription Name:</strong></label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Netflix, Spotify"
            />
          </div>

          <div className="form-group">
            <label><strong>Category:</strong></label>
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
            <label><strong>Duration:</strong></label>
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
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-buttons">
            <button type="submit" className="submit-btn">Save Changes</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSubscriptionModal; 