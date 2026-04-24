import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../style/Auth.css';

const Login = () => {


  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        login('cookie-token', data.role); // Server uses httpOnly cookie for real auth
        if (data.role === 'prime_admin') {
          navigate('/prime-admin');
        } else if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/products');
        }
      } else {
        setError(data.message || 'Failed to login');
      }
    } catch (err) {
      setError('An error occurred during login. Please ensure the server is running.');
    }
  };

  return (
    <div className="page-container auth-container">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Enter your credentials to access your account</p>
        </div>

        {error && <div className="error-message" style={
          {
            color: '#ff6b6b',
            textAlign: 'center',
            marginBottom: '1rem',
            padding: '0.5rem',
            background: 'rgba(180, 128, 128, 0.1)',
            borderRadius: '4px'
          }}> {error}</div>}


        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              id="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email Address</label>
          </div>

          <div className="input-group">
            <div className="password-input">

              <input
                type="password"
                id="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <label htmlFor="password">Password</label>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
