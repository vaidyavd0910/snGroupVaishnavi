import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', mobileNumber: '', password: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, donationsResponse] = await Promise.all([
          authService.getCurrentUser(),
          authService.getDonationHistory()
        ]);
        setUserData(userResponse);
        setDonationHistory(donationsResponse);
        setForm({
          name: userResponse?.name || '',
          email: userResponse?.email || '',
          mobileNumber: userResponse?.mobileNumber || '',
          password: ''
        });
      } catch (err) {
        setError('Failed to fetch profile data');
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
    setSuccess('');
    setError(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: userData?.name || '',
      email: userData?.email || '',
      mobileNumber: userData?.mobileNumber || '',
      password: ''
    });
    setSuccess('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...form };
      if (!updateData.password) delete updateData.password;
      const updated = await authService.updateProfile(updateData);
      setUserData(updated);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
      setSuccess('');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>Profile</h1>
        {!editMode && <button className="edit-profile-btn" onClick={handleEdit}>Edit Profile</button>}
      </div>
      <div className="profile-content">
        <div className="profile-details">
          <div className="profile-avatar-big">
            {(userData?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <h2>User Details</h2>
          {editMode ? (
            <form className="edit-profile-form" onSubmit={handleSubmit}>
              <div className="detail-item">
                <label>Name:</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <input name="email" value={form.email} onChange={handleChange} required type="email" />
              </div>
              <div className="detail-item">
                <label>Mobile:</label>
                <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required />
              </div>
              <div className="detail-item">
                <label>Password:</label>
                <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Leave blank to keep unchanged" />
              </div>
              <div className="profile-form-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
              </div>
              {success && <div className="success-msg">{success}</div>}
              {error && <div className="error-msg">{error}</div>}
            </form>
          ) : (
            <>
              <div className="detail-item">
                <label>Name:</label>
                <span>{userData?.name}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{userData?.email}</span>
              </div>
              <div className="detail-item">
                <label>Mobile:</label>
                <span>{userData?.mobileNumber}</span>
              </div>
              <div className="detail-item">
                <label>Role:</label>
                <span>{userData?.role}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 