import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/common/Button';
import ShareButton from '../components/common/ShareButton';
import './DonationPage.css';

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

const DonationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedAmount = queryParams.get('amount');
  const campaignId = queryParams.get('campaign');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    amount: preselectedAmount || '',
    customAmount: '',
    paymentMethod: 'creditCard',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    isMonthly: false,
    isAnonymous: false,
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const [razorpayKey, setRazorpayKey] = useState('');

  const predefinedAmounts = [25, 50, 100, 250, 500];

  useEffect(() => {
    // Fetch campaign details if campaignId is provided
    if (campaignId) {
      // This would be replaced with an actual API call
      const fetchCampaign = async () => {
        try {
          // Simulating API call
          setTimeout(() => {
            setCampaign({
              id: campaignId,
              title: "Clean Water Initiative",
              description: "Help provide clean water to communities in need",
              goalAmount: 10000,
              raisedAmount: 6500,
              imageUrl: "/images/campaigns/water-initiative.jpg"
            });
          }, 500);
        } catch (error) {
          console.error("Error fetching campaign:", error);
        }
      };
      
      fetchCampaign();
    }
  }, [campaignId]);

  useEffect(() => {
    // Fetch Razorpay key from backend
    fetch('/api/config/razorpay-key')
      .then(res => res.json())
      .then(data => setRazorpayKey(data.key || ''));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'amount' && value !== 'custom') {
      setFormData({
        ...formData,
        amount: value,
        customAmount: '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    const donationAmount = formData.amount === 'custom' 
      ? parseFloat(formData.customAmount) 
      : parseFloat(formData.amount);
      
    if (isNaN(donationAmount) || donationAmount <= 0) {
      newErrors.amount = "Please enter a valid donation amount";
    }
    
    if (formData.paymentMethod === 'creditCard') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
      if (!formData.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required";
      if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
      if (!formData.nameOnCard.trim()) newErrors.nameOnCard = "Name on card is required";
    }
    
    return newErrors;
  };

  const handleRazorpayPayment = async (donationAmount) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setErrors({ submit: 'Failed to load Razorpay. Please try again.' });
      return;
    }
    try {
      // 1. Create order on backend
      const orderRes = await fetch(`/api/donations/${campaignId}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: donationAmount })
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message || 'Order creation failed');
      // 2. Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: campaign?.title || 'Donation',
        description: campaign?.description || '',
        order_id: orderData.order.id,
        handler: async function (response) {
          // 3. Verify payment on backend
          const verifyRes = await fetch(`/api/donations/${campaignId}/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: donationAmount,
              message: formData.message
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setIsSuccess(true);
            setTimeout(() => {
              navigate('/donation-success', {
                state: {
                  amount: donationAmount,
                  isMonthly: formData.isMonthly,
                  campaignId: campaignId
                }
              });
            }, 2000);
          } else {
            setErrors({ submit: verifyData.message || 'Payment verification failed' });
          }
        },
        prefill: {
          name: formData.firstName + ' ' + formData.lastName,
          email: formData.email
        },
        theme: { color: '#3b82f6' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setErrors({ submit: err.message || 'Razorpay payment failed' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const donationAmount = formData.amount === 'custom' ? parseFloat(formData.customAmount) : parseFloat(formData.amount);
      if (formData.paymentMethod === 'razorpay') {
        await handleRazorpayPayment(donationAmount);
        setIsSubmitting(false);
        return;
      }
      // ... existing code for other payment methods ...
    } catch (error) {
      setErrors({ submit: 'There was an error processing your donation. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 16));
    setFormData({
      ...formData,
      cardNumber: formattedValue
    });
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setFormData({
      ...formData,
      expiryDate: value
    });
  };

  return (
    <Layout title="Make a Donation | Donation Platform">
      <div className="donation-page">
        <div className="donation-container">
          <div className="donation-header">
            <h1 className="donation-title">Make a Donation</h1>
            <p className="donation-subtitle">
              Your generosity makes a real difference
            </p>
          </div>

          <div className="donation-content">
            <div className="donation-form-container">
              {isSuccess ? (
                <div className="donation-success">
                  <div className="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2>Thank You!</h2>
                  <p>Your donation has been processed successfully.</p>
                  <p>Redirecting you to the confirmation page...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="donation-form">
                  {errors.submit && (
                    <div className="form-error-message">{errors.submit}</div>
                  )}
                  
                  <div className="form-section">
                    <h3 className="section-title">Donation Amount</h3>
                    
                    <div className="amount-options">
                      {predefinedAmounts.map(amount => (
                        <label 
                          key={amount} 
                          className={`amount-option ${formData.amount == amount ? 'selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name="amount"
                            value={amount}
                            checked={formData.amount == amount}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span className="amount-label">${amount}</span>
                        </label>
                      ))}
                      
                      <label 
                        className={`amount-option custom ${formData.amount === 'custom' ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="amount"
                          value="custom"
                          checked={formData.amount === 'custom'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="amount-label">Custom</span>
                      </label>
                    </div>
                    
                    {formData.amount === 'custom' && (
                      <div className="form-group">
                        <label htmlFor="customAmount" className="form-label">
                          Enter amount
                        </label>
                        <div className="input-wrapper">
                          <span className="currency-symbol">$</span>
                          <input
                            type="number"
                            id="customAmount"
                            name="customAmount"
                            value={formData.customAmount}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            min="1"
                            step="1"
                            className="form-input"
                          />
                        </div>
                        {errors.amount && <div className="form-error">{errors.amount}</div>}
                      </div>
                    )}
                    
                    <div className="form-group checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isMonthly"
                          checked={formData.isMonthly}
                          onChange={handleChange}
                          className="checkbox-input"
                        />
                        <span className="checkbox-text">Make this a monthly donation</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h3 className="section-title">Your Information</h3>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName" className="form-label">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`form-input ${errors.firstName ? 'error' : ''}`}
                          placeholder="Your first name"
                        />
                        {errors.firstName && <div className="form-error">{errors.firstName}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="lastName" className="form-label">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`form-input ${errors.lastName ? 'error' : ''}`}
                          placeholder="Your last name"
                        />
                        {errors.lastName && <div className="form-error">{errors.lastName}</div>}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="Your email address"
                      />
                      {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>
                    
                    <div className="form-group checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isAnonymous"
                          checked={formData.isAnonymous}
                          onChange={handleChange}
                          className="checkbox-input"
                        />
                        <span className="checkbox-text">Make my donation anonymous</span>
                      </label>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message" className="form-label">
                        Message (Optional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="form-input textarea"
                        placeholder="Share why you're donating..."
                        rows="3"
                      />
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h3 className="section-title">Payment Information</h3>
                    
                    <div className="payment-methods">
                      <label className={`payment-method ${formData.paymentMethod === 'creditCard' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="creditCard"
                          checked={formData.paymentMethod === 'creditCard'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="payment-icon credit-card-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                          </svg>
                        </span>
                        <span className="payment-label">Credit Card</span>
                      </label>
                      
                      <label className={`payment-method ${formData.paymentMethod === 'paypal' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="payment-icon paypal-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M7 12l2 2 4-4" />
                            <path d="M17 6v6a2 2 0 01-2 2H9l-3 3V8a2 2 0 012-2h8a2 2 0 012 2z" />
                          </svg>
                        </span>
                        <span className="payment-label">PayPal</span>
                      </label>
                      
                      <label className={`payment-method ${formData.paymentMethod === 'razorpay' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={formData.paymentMethod === 'razorpay'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="payment-icon razorpay-icon">
                          <svg viewBox="0 0 32 32" width="24" height="24"><path d="M8 28l6-24h10l-6 24z" fill="#0f4fa8"/><path d="M18 4h6l-6 24h-6z" fill="#2d9cdb"/></svg>
                        </span>
                        <span className="payment-label">Razorpay</span>
                      </label>
                    </div>
                    
                    {formData.paymentMethod === 'creditCard' && (
                      <div className="credit-card-fields">
                        <div className="form-group">
                          <label htmlFor="nameOnCard" className="form-label">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            id="nameOnCard"
                            name="nameOnCard"
                            value={formData.nameOnCard}
                            onChange={handleChange}
                            className={`form-input ${errors.nameOnCard ? 'error' : ''}`}
                            placeholder="Name as it appears on card"
                          />
                          {errors.nameOnCard && <div className="form-error">{errors.nameOnCard}</div>}
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="cardNumber" className="form-label">
                            Card Number
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                            placeholder="1234 5678 9012 3456"
                          />
                          {errors.cardNumber && <div className="form-error">{errors.cardNumber}</div>}
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="expiryDate" className="form-label">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleExpiryDateChange}
                              className={`form-input ${errors.expiryDate ? 'error' : ''}`}
                              placeholder="MM/YY"
                            />
                            {errors.expiryDate && <div className="form-error">{errors.expiryDate}</div>}
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="cvv" className="form-label">
                              CVV
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              value={formData.cvv}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
                                setFormData({...formData, cvv: value});
                              }}
                              className={`form-input ${errors.cvv ? 'error' : ''}`}
                              placeholder="123"
                            />
                            {errors.cvv && <div className="form-error">{errors.cvv}</div>}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {formData.paymentMethod === 'paypal' && (
                      <div className="paypal-info">
                        <p>You will be redirected to PayPal to complete your donation.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="donation-summary">
                    <h3 className="summary-title">Donation Summary</h3>
                    <div className="summary-details">
                      <div className="summary-row">
                        <span>Donation Amount:</span>
                        <span className="summary-amount">
                          ${formData.amount === 'custom' ? formData.customAmount || '0' : formData.amount || '0'}
                          {formData.isMonthly && ' monthly'}
                        </span>
                      </div>
                      {campaign && (
                        <div className="summary-row">
                          <span>Campaign:</span>
                          <span>{campaign.title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <Button 
                      type="submit" 
                      className="donation-submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading-spinner"></span>
                          Processing...
                        </>
                      ) : (
                        `Complete ${formData.amount === 'custom' ? '$' + formData.customAmount : '$' + formData.amount} Donation`
                      )}
                    </Button>
                    <p className="secure-payment-note">
                      <svg className="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      Secure payment processing
                    </p>
                  </div>
                </form>
              )}
            </div>
            
            {campaign && (
              <div className="donation-sidebar">
                <div className="campaign-card">
                  <div className="campaign-image">
                    <img src={campaign.imageUrl} alt={campaign.title} />
                  </div>
                  <div className="campaign-details">
                    <h3 className="campaign-title">{campaign.title}</h3>
                    <p className="campaign-description">{campaign.description}</p>
                    <div className="campaign-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${Math.min(100, (campaign.raisedAmount / campaign.goalAmount) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="progress-stats">
                        <span className="raised-amount">${campaign.raisedAmount.toLocaleString()}</span>
                        <span className="goal-amount">of ${campaign.goalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="campaign-share">
                      <ShareButton 
                        url={window.location.href}
                        title={campaign.title}
                        description={`Support this campaign: ${campaign.title}. ${campaign.description}`}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="donation-impact">
                  <h3 className="impact-title">Your Impact</h3>
                  <div className="impact-items">
                    <div className="impact-item">
                      <div className="impact-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                        </svg>
                      </div>
                      <div className="impact-content">
                        <h4>$25</h4>
                        <p>Provides clean water for one person for a year</p>
                      </div>
                    </div>
                    <div className="impact-item">
                      <div className="impact-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                        </svg>
                      </div>
                      <div className="impact-content">
                        <h4>$100</h4>
                        <p>Helps build water filtration systems for a family</p>
                      </div>
                    </div>
                    <div className="impact-item">
                      <div className="impact-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                        </svg>
                      </div>
                      <div className="impact-content">
                        <h4>$500</h4>
                        <p>Funds a community water project serving dozens</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DonationPage; 