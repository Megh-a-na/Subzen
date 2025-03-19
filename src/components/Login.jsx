import { Link } from 'react-router-dom';
import '../styles/Auth.css';

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-form-section">
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>USERNAME</label>
              <input type="text" placeholder="Username" />
            </div>
            <div className="form-group">
              <label>PASSWORD</label>
              <input type="password" placeholder="Password" />
            </div>
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember Me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password
              </Link>
            </div>
            <button type="submit" className="submit-button">
              Sign In
            </button>
          </form>
        </div>
        <div className="auth-welcome-section">
          <h2>Welcome to login</h2>
          <p>Don't have an account?</p>
          <Link to="/signup" className="switch-auth-button">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login; 