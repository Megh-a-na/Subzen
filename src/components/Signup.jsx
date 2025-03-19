import { Link } from 'react-router-dom';
import '../styles/Auth.css';

function Signup() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-form-section">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>USERNAME</label>
              <input type="text" placeholder="Username" />
            </div>
            <div className="form-group">
              <label>EMAIL</label>
              <input type="email" placeholder="Email" />
            </div>
            <div className="form-group">
              <label>PASSWORD</label>
              <input type="password" placeholder="Password" />
            </div>
            <div className="form-group">
              <label>CONFIRM PASSWORD</label>
              <input type="password" placeholder="Confirm Password" />
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