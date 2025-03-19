import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Auth.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Data sent successfully');
        setError('');
      } else {
        setError(data.error || 'Failed to send data');
      }
    } catch (error) {
      setError('Error connecting to server');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-form-section">
          <h2>Sign Up</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>USERNAME</label>
              <input 
                type="text" 
                name="username"
                placeholder="Username" 
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>EMAIL</label>
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>PASSWORD</label>
              <div className="password-input-container">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <i 
                  className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                ></i>
              </div>
            </div>
            <div className="form-group">
              <label>CONFIRM PASSWORD</label>
              <div className="password-input-container">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <i 
                  className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                  onMouseDown={() => setShowConfirmPassword(true)}
                  onMouseUp={() => setShowConfirmPassword(false)}
                  onMouseLeave={() => setShowConfirmPassword(false)}
                ></i>
              </div>
            </div>
            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </form>
        </div>
        <div className="auth-welcome-section">
          <h2>Welcome Back!</h2>
          <p>Already have an account?</p>
          <Link to="/" className="switch-auth-button">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup; 