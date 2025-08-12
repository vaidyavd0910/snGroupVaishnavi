import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import DonationReceipt from '../components/common/DonationReceipt';
import * as htmlToImage from 'html-to-image';
import Loader from '../components/Loader';
import api from '../utils/api';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const receiptRef = useRef();
  const [receiptData, setReceiptData] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadPaymentId, setDownloadPaymentId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const profileRes = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfile(profileRes.data);
        // Fetch user payments
        const paymentsRes = await api.get('/payments/my', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPayments(paymentsRes.data.payments || []);
        // Fetch active campaigns
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalDonated = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  // Download receipt as image (robust version)
  const handleDownloadReceipt = (payment) => {
    setReceiptData({
      receiptNo: payment._id.slice(-6).toUpperCase(),
      date: new Date(payment.createdAt).toLocaleDateString(),
      donorName: profile?.name || currentUser?.name || 'User',
      address: profile?.address || '-',
      contact: profile?.phone || '-',
      email: profile?.email || currentUser?.email || '-',
      amount: payment.amount,
      paymentMode: payment.paymentId ? 'Online' : 'Other',
      transactionId: payment.paymentId || payment.orderId || '-',
      pan: profile?.pan || '-',
      representative: '',
    });
    setDownloadPaymentId(payment._id);
    setDownloading(true);
  };

  useEffect(() => {
    // Only run if downloading and receiptData is set
    if (downloading && receiptData && receiptRef.current) {
      // Wait a tick to ensure DOM is updated
      setTimeout(async () => {
        try {
          const dataUrl = await htmlToImage.toPng(receiptRef.current);
          const link = document.createElement('a');
          link.download = `DonationReceipt_${downloadPaymentId?.slice(-6)}.png`;
          link.href = dataUrl;
          link.click();
        } catch (err) {
          alert('Failed to generate receipt image.');
        }
        setDownloading(false);
        setReceiptData(null);
        setDownloadPaymentId(null);
      }, 100);
    }
  }, [downloading, receiptData, downloadPaymentId]);

  if (loading) return <div className="user-dashboard-loading">Loading...</div>;
  if (error) return <div className="user-dashboard-error">{error}</div>;

  return (
    <div className="user-dashboard-container">
      {/* Loader overlay for receipt download */}
      {downloading && (
        <div className="dashboard-loader-overlay">
          <Loader text="Generating receipt..." />
        </div>
      )}
      <div className="user-dashboard-header">
        <h1>Welcome, {profile?.name || currentUser?.name || 'User'}!</h1>
        <button className="edit-profile-btn" onClick={() => navigate('/profile')}>Edit Profile</button>
      </div>
      <div className="user-dashboard-summary-cards">
        <div className="summary-card">
          <div className="summary-label">Total Donated</div>
          <div className="summary-value">₹{totalDonated.toLocaleString()}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Donations Made</div>
          <div className="summary-value">{payments.filter(p => p.status === 'paid').length}</div>
        </div>
      </div>
      <div className="user-dashboard-section">
        <h2>Recent Donations</h2>
        {payments.length === 0 ? (
          <div className="no-data">No donations yet.</div>
        ) : (
          <table className="donation-history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Campaign</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 10).map((p) => (
                <tr key={p._id}>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>{p.donation?.title || '-'}</td>
                  <td>₹{p.amount}</td>
                  <td className={`status ${p.status}`}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</td>
                  <td>{p.status === 'paid' ? <a href="#" className="receipt-link" onClick={e => { e.preventDefault(); handleDownloadReceipt(p); }}>Download</a> : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Hidden receipt for image export */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          {receiptData && <DonationReceipt ref={receiptRef} {...receiptData} />}
        </div>
      </div>
    
    </div>
  );
};

export default UserDashboard; 