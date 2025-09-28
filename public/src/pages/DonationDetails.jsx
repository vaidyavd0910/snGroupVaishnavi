import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion } from 'framer-motion';
import ShareButton from '../components/common/ShareButton';
import './DonationDetails.css';
import Loader from '../components/Loader';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [message, setMessage] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [recentDonors, setRecentDonors] = useState([]);
  const [donorsLoading, setDonorsLoading] = useState(true);

  useEffect(() => {
    fetchDonationDetails();
  }, [id]);

  useEffect(() => {
    if (donation?._id) {
      fetchRecentDonors();
    }
  }, [donation]);

  const fetchDonationDetails = async () => {
    try {
      const response = await api.get(`/donations/${id}`);
      setDonation(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching donation details');
      setLoading(false);
    }
  };

  const fetchRecentDonors = async () => {
    setDonorsLoading(true);
    try {
      const response = await api.get(`/payments/recent?campaignId=${donation._id}`);
      if (response.data.success) {
        setRecentDonors(response.data.donors || []);
      } else {
        setRecentDonors([]);
      }
    } catch (error) {
      console.error('Error fetching recent donors:', error);
      setRecentDonors([]);
    }
    setDonorsLoading(false);
  };

  const handleDonation = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate('/login', { state: { from: `/donations/${id}` } });
      return;
    }

    // Load Razorpay script
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    try {
      setError('');
      // Fetch Razorpay key
      const keyRes = await api.get('/config/razorpay-key');
      const razorpayKey = keyRes.data.key;

      // 1. Create order on backend
      const orderRes = await api.post(
        `/donations/${id}/create-order`,
        { amount: Number(donationAmount) },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (!orderRes.data.success) throw new Error(orderRes.data.message || 'Order creation failed');

      // 2. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load Razorpay. Please try again.');

      // 3. Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderRes.data.order.amount,
        currency: orderRes.data.order.currency,
        name: donation.title,
        description: donation.description,
        order_id: orderRes.data.order.id,
        handler: async function (response) {
          // 4. Verify payment on backend
          try {
            const verifyRes = await api.post(
              `/donations/${id}/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: Number(donationAmount),
                message
              },
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            if (verifyRes.data.success) {
              setDonation(verifyRes.data.data);
              setDonationAmount('');
              setMessage('');
              // Refresh recent donors list to show the new donation
              fetchRecentDonors();
              // Show success message or redirect
            } else {
              setError(verifyRes.data.message || 'Payment verification failed');
            }
          } catch (err) {
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email
        },
        theme: { color: '#3b82f6' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Error processing donation');
    }
  };

  if (loading) return <Loader text="Loading donation details..." />;
  if (error) return <div className="error">{error}</div>;
  if (!donation) return <div className="error">Donation not found</div>;

  return (
    <motion.div 
      className="donation-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="donation-header">
        <h1>{donation.title}</h1>
        <div className="donation-category">{donation.category}</div>
        <div className="donation-share">
          <ShareButton 
            url={window.location.href}
            title={donation.title}
            description={`Support this campaign: ${donation.title}. ${donation.description}`}
          />
        </div>
      </div>

      <div className="donation-gallery">
        <div className="main-image">
          <img src={donation.images[activeImage]} alt={donation.title} />
        </div>
        {donation.images.length > 1 && (
          <div className="thumbnail-list">
            {donation.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${donation.title} - ${index + 1}`}
                className={activeImage === index ? 'active' : ''}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="donation-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${donation.progressPercentage}%` }}
          />
        </div>
        <div className="progress-stats">
          <div className="stat">
            <span className="label">Goal</span>
            <span className="value">₹{donation.goal.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="label">Raised</span>
            <span className="value">₹{donation.collectedAmount.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="label">Remaining</span>
            <span className="value">₹{donation.remainingAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="donation-content">
        <div className="description">
          <h2>About this Campaign</h2>
          <p>{donation.description}</p>
        </div>

        <div className="benefits">
          <h2>How Your Donation Helps</h2>
          <ul>
            {donation.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="donation-form">
          <h2>Make a Donation</h2>
          <form onSubmit={handleDonation}>
            <div className="form-group">
              <label>Donation Amount (₹)</label>
              <input
                type="number"
                min={donation.minDonationAmount}
                max={donation.remainingAmount}
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                required
                placeholder={`Minimum ₹${donation.minDonationAmount}`}
              />
            </div>
            <div className="form-group">
              <label>Message (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share why you're donating..."
                rows="3"
              />
            </div>
            <button 
              type="submit"
              className="donate-button"
              disabled={donation.status !== 'active'}
            >
              {donation.status === 'active' ? 'Donate Now' : 'Campaign Ended'}
            </button>
          </form>
        </div>
      </div>

      <div className="donation-info">
        <div className="info-item">
          <h3>Location</h3>
          <p>{donation.location}</p>
        </div>
        <div className="info-item">
          <h3>Campaign Period</h3>
          <p>
            {new Date(donation.startDate).toLocaleDateString()} - 
            {new Date(donation.endDate).toLocaleDateString()}
          </p>
        </div>
        <div className="info-item">
          <h3>Status</h3>
          <p className={`status ${donation.status}`}>
            {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
          </p>
        </div>
      </div>

      {donorsLoading ? (
        <div className="donors-list">
          <h2>Recent Donors</h2>
          <div className="donors-loading">Loading recent donors...</div>
        </div>
      ) : recentDonors.length > 0 ? (
        <div className="donors-list">
          <h2>Recent Donors</h2>
          <div className="donors-grid">
            {recentDonors.map((donor, index) => (
              <div key={index} className="donor-card">
                <div className="donor-info">
                  <span className="donor-name">{donor.name}</span>
                  <span className="donation-amount">₹{donor.amount.toLocaleString()}</span>
                </div>
                {donor.message && (
                  <p className="donor-message">{donor.message}</p>
                )}
                <span className="donation-date">
                  {new Date(donor.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="donors-list">
          <h2>Recent Donors</h2>
          <div className="no-donors">
            <p>Be the first to donate to this campaign!</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DonationDetails; 