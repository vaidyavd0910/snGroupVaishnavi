import React, { useState, useEffect } from 'react';
import { FaUsers, FaGlobe, FaStar, FaHandHoldingHeart } from 'react-icons/fa';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import withAdminAccess from '../Auth/withAdminAccess';
import 'react-toastify/dist/ReactToastify.css';

const StatsEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statsData, setStatsData] = useState({
    activeVolunteers: { value: '50K+', label: 'Active Volunteers', icon: 'FaUsers' },
    ngosImpacted: { value: '1200+', label: 'NGOs Impacted', icon: 'FaGlobe' },
    trustScore: { value: '4.9', label: 'Trust Score', icon: 'FaStar' },
    totalImpact: { value: '₹300Cr+', label: 'Total Impact', icon: 'FaHandHoldingHeart' }
  });

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        // Try to fetch from API first
        const response = await api.get('/content/stats');
        if (response.data.success) {
          // Handle API response structure: response.data.data.data
          const apiData = response.data.data.data;
          console.log('API Response:', response.data);
          console.log('Extracted Stats Data:', apiData);
          
          if (apiData && apiData.activeVolunteers) {
            // Only keep the 4 main statistics we want
            const cleanData = {
              activeVolunteers: apiData.activeVolunteers || { value: '100+', label: 'Active Volunteers', icon: 'FaUsers' },
              ngosImpacted: apiData.ngosImpacted || { value: '1200+', label: 'NGOs Impacted', icon: 'FaGlobe' },
              trustScore: apiData.trustScore || { value: '4.9', label: 'Trust Score', icon: 'FaStar' },
              totalImpact: apiData.totalImpact || { value: '₹300Cr+', label: 'Total Impact', icon: 'FaHandHoldingHeart' }
            };
            setStatsData(cleanData);
          } else {
            // Fallback to localStorage if API data is malformed
            const savedStats = localStorage.getItem('admin-stats');
            if (savedStats) {
              setStatsData(JSON.parse(savedStats));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching stats data:', error);
        // Fallback to localStorage if API fails
        const savedStats = localStorage.getItem('admin-stats');
        if (savedStats) {
          setStatsData(JSON.parse(savedStats));
        }
        // Otherwise keep default values
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []);

  const handleChange = (statKey, field, value) => {
    setStatsData(prev => ({
      ...prev,
      [statKey]: {
        ...prev[statKey],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['activeVolunteers', 'ngosImpacted', 'trustScore', 'totalImpact'];
    for (const field of requiredFields) {
      if (!statsData[field]?.value || !statsData[field]?.label) {
        toast.error(`Please fill in all required fields for ${statsData[field]?.label || field}`);
        return;
      }
    }
    
    try {
      setSaving(true);
      
      // Try API first
      try {
        const response = await api.put('/content/stats', { data: statsData });
        if (response.data.success) {
          toast.success('✅ Statistics updated successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (apiError) {
        console.warn('API not available, using localStorage fallback:', apiError);
        throw new Error('API Error: ' + (apiError.response?.data?.message || apiError.message));
      }
      
    } catch (error) {
      // Fallback to localStorage
      try {
        localStorage.setItem('admin-stats', JSON.stringify(statsData));
        toast.success('✅ Statistics updated successfully! (Saved locally)', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (storageError) {
        toast.error('❌ Failed to save statistics. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error('Storage error:', storageError);
      }
    } finally {
      setSaving(false);
    }
  };

  const getIconComponent = (iconName) => {
    const icons = { FaUsers, FaGlobe, FaStar, FaHandHoldingHeart };
    return icons[iconName] || FaUsers;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="stats-editor">
      <div className="stats-editor-header">
        <h2>Our Impact in Numbers</h2>
        <div className="stats-editor-subtitle">
          Manage the statistics displayed on your homepage
        </div>
      </div>

      <div className="stats-preview">
        <h3>Live Preview</h3>
        <div className="stats-grid">
          {Object.entries(statsData).map(([key, stat]) => {
            const IconComponent = getIconComponent(stat.icon);
            return (
              <div key={key} className="stat-preview-card">
                <div className="stat-icon">
                  <IconComponent />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="stats-form">
        <div className="stats-form-grid">
          {Object.entries(statsData).map(([key, stat]) => (
            <div key={key} className="stat-form-card">
              <div className="stat-form-header">
                <div className="stat-form-icon">
                  {React.createElement(getIconComponent(stat.icon))}
                </div>
                <h4>{stat.label}</h4>
              </div>
              
              <div className="form-group">
                <label>Value</label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => handleChange(key, 'value', e.target.value)}
                  placeholder="e.g., 50K+, 1200+, 4.9, ₹300Cr+"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleChange(key, 'label', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Updating...' : 'Update Statistics'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default withAdminAccess(StatsEditor); 