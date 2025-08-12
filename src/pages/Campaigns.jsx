import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserDashboard.css';
import ShareButton from '../components/common/ShareButton';
import api from '../utils/api';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get('/donations');
        setCampaigns(res.data.data || []);
      } catch (err) {
        setError('Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) return (
    <div className="user-dashboard-container">
      <div className="user-dashboard-header">
        <h1>All Campaigns</h1>
      </div>
      <div className="campaigns-shimmer-list">
        {[1,2,3,4].map(i => (
          <div className="campaign-shimmer-card" key={i}>
            <div className="campaign-shimmer-img shimmer" />
            <div className="campaign-shimmer-line full shimmer" />
            <div className="campaign-shimmer-line medium shimmer" />
            <div className="campaign-shimmer-line short shimmer" />
            <div className="campaign-shimmer-progress shimmer" />
            <div className="campaign-shimmer-line short shimmer" style={{height:'36px', marginTop:'1.2rem'}} />
          </div>
        ))}
      </div>
    </div>
  );
  if (error) return <div className="user-dashboard-error">{error}</div>;

  return (
    <div >
      <div className="user-dashboard-header" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',padding:'2rem 0'}}>
        <h1 style={{fontSize: '2.5rem', color: '#333'}}>All Campaigns</h1>
        <div className="section-underline"></div>
      </div>
      <div className="campaigns-list" style={{padding:'0rem 2rem'}}>
        {campaigns.length === 0 ? (
          <div className="no-data">No campaigns found.</div>
        ) : (
          campaigns.map((c) => (
            <div key={c._id} className="campaign-card">
              {c.images && c.images.length > 0 ? (
                <img src={c.images[0]} alt={c.title} />
              ) : (
                <div style={{ width: '100%', height: '200px', background: '#f3f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '1.1rem', borderTopLeftRadius: '18px', borderTopRightRadius: '18px' }}>No Image</div>
              )}
              <div className="campaign-title">{c.title}</div>
              <div className="campaign-desc">{c.description}</div>
              <div className="campaign-goal">Goal: ₹{c.goal.toLocaleString()}</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${c.progressPercentage || 0}%` }}></div>
              </div>
              <div className="progress-stats">
                <span>Raised: ₹{c.collectedAmount?.toLocaleString() || 0}</span>
                <span>{c.progressPercentage || 0}%</span>
              </div>
              <div className="campaign-actions">
                <button className="donate-btn" onClick={() => navigate(`/donations/${c._id}`)}>Donate</button>
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{ display: 'inline-block' }}
                >
                  <ShareButton 
                    url={`${window.location.origin}/donations/${c._id}`}
                    title={c.title}
                    description={`Support this campaign: ${c.title}. ${c.description}`}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Campaigns; 