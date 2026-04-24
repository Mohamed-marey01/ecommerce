import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/Auth.css';


const Registration = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password, role, adminCode }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        navigate('/'); // redirect to login
      } else {
        if (data.message === 'failed to registration') {
          alert('failed to registration');
        }
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container auth-container">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join NexusMart to start shopping</p>
        </div>

        {error && <div className="error-message" style={{color: '#ff6b6b', textAlign: 'center', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '4px'}}>{error}</div>}

        <form className="auth-form" onSubmit={handleRegister}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <input type="text" id="firstName" required placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <label htmlFor="firstName">First Name</label>
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <input type="text" id="lastName" required placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <label htmlFor="lastName">Last Name</label>
            </div>
          </div>

          <div className="input-group">
            <input type="email" id="signup-email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="signup-email">Email Address</label>
          </div>

          <div className="input-group">
            <input type="password" id="signup-password" required placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="signup-password">Password</label>
          </div>

          <div className="input-group">
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required style={{width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', background: 'rgba(255, 255, 255, 0.9)'}}>
              <option value="user">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          {role === 'admin' && (
            <div className="input-group">
              <input type="text" id="adminCode" required placeholder="Admin Registration Code" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} />
              <label htmlFor="adminCode">Registration Code</label>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/" className="auth-link">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;
