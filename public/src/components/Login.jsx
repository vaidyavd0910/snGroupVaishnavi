import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('📝 Login Form - FormData:', formData);
    console.log('📝 Login Form - Email:', formData.email);
    console.log('📝 Login Form - Password length:', formData.password ? formData.password.length : 'UNDEFINED');
    console.log('📝 Login Form - Password value:', formData.password ? '***' : 'MISSING');

    try {
      const response = await login(formData.email, formData.password);
      
      if (response.success) {
        const userData = response.user;
        
        // Debug: Log user data to console
        console.log('Login - User data:', userData);
        console.log('Login - User role:', userData.role);
        console.log('Login - User roles:', userData.roles);
        
        // Redirect based on user role
        if (userData.role === 'admin' || (userData.roles && userData.roles.includes('ADMIN'))) {
          console.log('Redirecting to admin dashboard');
          navigate('/admin');
        } else if (userData.role === 'subadmin') {
          navigate('/subadmin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(response.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login; 