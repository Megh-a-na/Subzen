import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="app-title">Subzen</h1>
      <p className="app-tagline">The Ultimate Subscription Tracker</p>
      
      <div className="auth-options">
        <Link to="/login" className="auth-button signin-button">
          Sign In
        </Link>
        <Link to="/signup" className="auth-button signup-button">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Home; 