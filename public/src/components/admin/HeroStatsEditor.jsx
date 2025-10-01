import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaUsers, FaGlobe, FaHandHoldingHeart, FaSave, FaSync, FaImage } from 'react-icons/fa';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ImageCropper from '../common/ImageCropper';
import './HeroStatsEditor.css';

const HeroStatsEditor = () => {
  const [stats, setStats] = useState({
    donations: 10,
    transactions: 1,
    ngos: 1200,
    volunteers: 50,
    raised: 10,
    heroImage: null
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setFetching(true);
      const response = await api.get('/hero-stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching hero stats:', error);
      toast.error('Failed to fetch hero statistics');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStats(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('donations', stats.donations);
      formData.append('transactions', stats.transactions);
      formData.append('ngos', stats.ngos);
      formData.append('volunteers', stats.volunteers);
      formData.append('raised', stats.raised);

      if (selectedImage) {
        formData.append('heroImage', selectedImage);
      }

      const response = await api.put('/hero-stats', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        toast.success('Hero statistics updated successfully!');
        setSelectedImage(null); // Clear selected image after successful upload
        fetchStats(); // Refresh to get updated data
      }
    } catch (error) {
      console.error('Error updating hero stats:', error);
      toast.error(error.response?.data?.message || 'Failed to update hero statistics');
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    {
      name: 'donations',
      label: 'Worth Donations',
      icon: <FaHeart />,
      color: 'rgb(209, 67, 67)',
      description: 'Total worth of donations'
    },
    {
      name: 'transactions',
      label: 'Donor Transactions',
      icon: <FaHandHoldingHeart />,
      color: 'rgb(209, 67, 67)',
      description: 'Total number of donor transactions'
    },
    {
      name: 'ngos',
      label: 'NGOs Impacted',
      icon: <FaGlobe />,
      color: 'rgb(209, 67, 67)',
      description: 'Total number of NGOs impacted'
    },
    {
      name: 'volunteers',
      label: 'Volunteers',
      icon: <FaUsers />,
      color: 'rgb(209, 67, 67)',
      description: 'Total number of volunteers'
    },
    {
      name: 'raised',
      label: 'Amount Raised',
      icon: <FaHeart />,
      color: 'rgb(209, 67, 67)',
      description: 'Total amount raised'
    }
  ];

  if (fetching) {
    return (
      <div className="hero-stats-editor">
        <div className="loading-state">
          <FaSync className="spin-icon" />
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-stats-editor">
      <div className="editor-header">
        <div>
          <h2>Hero Section Statistics</h2>
          <p>Update the statistics displayed on the homepage hero section</p>
        </div>
        <button
          className="btn-refresh"
          onClick={fetchStats}
          disabled={loading}
        >
          <FaSync className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit} className="stats-form">
        <div className="stats-grid">
          {statsConfig.map((config) => (
            <motion.div
              key={config.name}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="stat-card-header">
                <div 
                  className="stat-icon" 
                  style={{ backgroundColor: `${config.color}20`, color: config.color }}
                >
                  {config.icon}
                </div>
                <div className="stat-info">
                  <h3>{config.label}</h3>
                  <p>{config.description}</p>
                </div>
              </div>

              <div className="stat-input-group">
                <label htmlFor={config.name}>Value</label>
                <input
                  type="text"
                  id={config.name}
                  name={config.name}
                  value={stats[config.name]}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter text value"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hero Image Upload Section */}
        <div className="hero-image-section">
          <div className="section-header">
            <div className="section-title">
              <FaImage className="section-icon" />
              <h3>Hero Background Image</h3>
            </div>
            <p>Upload a background image for the hero section</p>
          </div>

          <div className="image-upload-container">
            <ImageCropper
              onImageCropped={(image) => {
                setSelectedImage(image);
              }}
              aspectRatio={16 / 9}
              maxWidth={1920}
              maxHeight={1080}
              buttonText="Upload Hero Image"
              maxFileSize={5 * 1024 * 1024}
            />
            
            {selectedImage && (
              <div className="image-preview">
                <img 
                  src={URL.createObjectURL(selectedImage)} 
                  alt="Hero preview" 
                  className="preview-image"
                />
                <p className="preview-text">✅ New image selected: {selectedImage.name}</p>
              </div>
            )}

            {stats.heroImage && !selectedImage && (
              <div className="current-image">
                <img 
                  src={stats.heroImage} 
                  alt="Current hero" 
                  className="current-image-preview"
                />
                <p className="current-text">Current hero image</p>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-save"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSync className="spinning" />
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      <div className="info-note">
        <strong>Note:</strong> Changes will be reflected on the homepage hero section immediately after saving.
        The numbers will animate from 0 to the target value for better user experience.
      </div>
    </div>
  );
};

export default HeroStatsEditor;

