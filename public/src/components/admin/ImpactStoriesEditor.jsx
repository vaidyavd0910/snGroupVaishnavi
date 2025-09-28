import React, { useState, useEffect } from 'react';
import { FaHeartbeat, FaGraduationCap, FaHome, FaTree, FaHandHoldingHeart, FaClock } from 'react-icons/fa';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import withAdminAccess from '../Auth/withAdminAccess';
import 'react-toastify/dist/ReactToastify.css';

const ImpactStoriesEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storiesData, setStoriesData] = useState({
    healthcareAccess: { value: '1.5K+', label: 'Healthcare Access', description: 'People received medical care', icon: 'FaHeartbeat' },
    educationSupport: { value: '10K+', label: 'Education Support', description: 'Students supported', icon: 'FaGraduationCap' },
    communityDevelopment: { value: '100+', label: 'Community Development', description: 'Villages transformed', icon: 'FaHome' },
    environmentalImpact: { value: '1Cr+', label: 'Environmental Impact', description: 'Trees planted', icon: 'FaTree' },
    disasterRelief: { value: '1.7K+', label: 'Disaster Relief', description: 'Families helped', icon: 'FaHandHoldingHeart' },
    volunteerHours: { value: '50K+', label: 'Volunteer Hours', description: 'Hours of service', icon: 'FaClock' }
  });

  useEffect(() => {
    const fetchStoriesData = async () => {
      try {
        console.log('🔄 [ADMIN] Fetching impact stories from API...');
        // Try to fetch from API first - use stats endpoint since impact-stories doesn't exist
        const response = await api.get('/content/stats');
        console.log('✅ [ADMIN] API Response received:', response.data);
        
        if (response.data.success) {
          // Handle API response structure: response.data.data.data (same as statistics)
          const apiData = response.data.data.data;
          console.log('📊 [ADMIN] Extracted Stories Data:', apiData);
          
          if (apiData && apiData.healthcareAccess) {
            console.log('✅ [ADMIN] API data is valid, using API data');
            // Only keep the 6 main impact stories we want
            const cleanData = {
              healthcareAccess: apiData.healthcareAccess || { value: '1.5K+', label: 'Healthcare Access', description: 'People received medical care', icon: 'FaHeartbeat' },
              educationSupport: apiData.educationSupport || { value: '10K+', label: 'Education Support', description: 'Students supported', icon: 'FaGraduationCap' },
              communityDevelopment: apiData.communityDevelopment || { value: '100+', label: 'Community Development', description: 'Villages transformed', icon: 'FaHome' },
              environmentalImpact: apiData.environmentalImpact || { value: '1Cr+', label: 'Environmental Impact', description: 'Trees planted', icon: 'FaTree' },
              disasterRelief: apiData.disasterRelief || { value: '1.7K+', label: 'Disaster Relief', description: 'Families helped', icon: 'FaHandHoldingHeart' },
              volunteerHours: apiData.volunteerHours || { value: '50K+', label: 'Volunteer Hours', description: 'Hours of service', icon: 'FaClock' }
            };
            setStoriesData(cleanData);
          } else {
            console.log('⚠️ [ADMIN] API data is malformed, checking localStorage...');
            // Fallback to localStorage if API data is malformed
            const savedStories = localStorage.getItem('admin-impact-stories');
            if (savedStories) {
              console.log('📱 [ADMIN] Using localStorage data:', JSON.parse(savedStories));
              setStoriesData(JSON.parse(savedStories));
            } else {
              console.log('🔄 [ADMIN] Using default values');
            }
          }
        } else {
          console.log('❌ [ADMIN] API returned unsuccessful response');
          const savedStories = localStorage.getItem('admin-impact-stories');
          if (savedStories) {
            console.log('📱 [ADMIN] Using localStorage data:', JSON.parse(savedStories));
            setStoriesData(JSON.parse(savedStories));
          }
        }
      } catch (error) {
        console.error('❌ [ADMIN] Error fetching impact stories data:', error);
        console.log('📱 [ADMIN] Falling back to localStorage...');
        // Fallback to localStorage if API fails
        const savedStories = localStorage.getItem('admin-impact-stories');
        if (savedStories) {
          console.log('📱 [ADMIN] Using localStorage data:', JSON.parse(savedStories));
          setStoriesData(JSON.parse(savedStories));
        } else {
          console.log('🔄 [ADMIN] Using default values');
        }
        // Otherwise keep default values
      } finally {
        setLoading(false);
      }
    };

    fetchStoriesData();
  }, []);

  const handleChange = (storyKey, field, value) => {
    setStoriesData(prev => ({
      ...prev,
      [storyKey]: {
        ...prev[storyKey],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['healthcareAccess', 'educationSupport', 'communityDevelopment', 'environmentalImpact', 'disasterRelief', 'volunteerHours'];
    for (const field of requiredFields) {
      if (!storiesData[field]?.value || !storiesData[field]?.label || !storiesData[field]?.description) {
        toast.error(`Please fill in all required fields for ${storiesData[field]?.label || field}`);
        return;
      }
    }
    
    try {
      setSaving(true);
      
      // Try API first
      try {
        const response = await api.put('/content/stats', { data: storiesData });
        if (response.data.success) {
          toast.success('✅ Impact Stories updated successfully!', {
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
        localStorage.setItem('admin-impact-stories', JSON.stringify(storiesData));
        toast.success('✅ Impact Stories updated successfully! (Saved locally)', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (storageError) {
        toast.error('❌ Failed to save impact stories. Please try again.', {
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
    const icons = { FaHeartbeat, FaGraduationCap, FaHome, FaTree, FaHandHoldingHeart, FaClock };
    return icons[iconName] || FaHeartbeat;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="impact-stories-editor">
      <div className="impact-stories-editor-header">
        <h2>Our Impact Stories</h2>
        <div className="impact-stories-editor-subtitle">
          Manage the impact stories displayed on your homepage
        </div>
      </div>

      <div className="impact-stories-preview">
        <h3>Live Preview</h3>
        <div className="impact-stories-grid">
          {Object.entries(storiesData).map(([key, story]) => {
            const IconComponent = getIconComponent(story.icon);
            return (
              <div key={key} className="impact-story-preview-card">
                <div className="impact-story-icon">
                  <IconComponent />
                </div>
                <div className="impact-story-value">{story.value}</div>
                <div className="impact-story-label">{story.label}</div>
                <div className="impact-story-description">{story.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="impact-stories-form">
        <div className="impact-stories-form-grid">
          {Object.entries(storiesData).map(([key, story]) => (
            <div key={key} className="impact-story-form-card">
              <div className="impact-story-form-header">
                <div className="impact-story-form-icon">
                  {React.createElement(getIconComponent(story.icon))}
                </div>
                <h4>{story.label}</h4>
              </div>
              
              <div className="form-group">
                <label>Value</label>
                <input
                  type="text"
                  value={story.value}
                  onChange={(e) => handleChange(key, 'value', e.target.value)}
                  placeholder="e.g., 1.5K+, 10K+, 1Cr+"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Label</label>
                <input
                  type="text"
                  value={story.label}
                  onChange={(e) => handleChange(key, 'label', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={story.description}
                  onChange={(e) => handleChange(key, 'description', e.target.value)}
                  placeholder="e.g., People received medical care"
                  required
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Updating...' : 'Update Impact Stories'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default withAdminAccess(ImpactStoriesEditor);
