import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Loader from '../components/Loader';
import ImageCarousel from '../components/common/ImageCarousel';
import ShareButton from '../components/common/ShareButton';
import api from '../utils/api';
import './ProgramDetails.css';

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/programs/${id}`);
        // Handle both success and direct data formats
        if (response.data.success) {
          setProgram(response.data.data);
        } else if (response.data._id) {
          // Direct data format
          setProgram(response.data);
        } else {
          throw new Error('Failed to fetch program');
        }
      } catch (err) {
        console.error('Error fetching program:', err);
        setError(err.message || 'Failed to load program details');
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <Loader text="Loading program details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>Error Loading Program</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/programs')} className="btn btn-primary">
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>Program Not Found</h2>
          <p>The program you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/programs')} className="btn btn-primary">
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'health': 'Health & Wellness',
      'education': 'Education',
      'food': 'Food Security',
      'social': 'Social Welfare',
      'environment': 'Environment'
    };
    return categoryMap[category] || category;
  };

  // Prepare images array for carousel
  const getImages = () => {
    console.log('Program data:', program);
    console.log('Program images:', program.images);
    console.log('Program image:', program.image);
    
    if (program.images && program.images.length > 0) {
      console.log('Using images array:', program.images);
      return program.images;
    } else if (program.image) {
      console.log('Using single image:', program.image);
      return [program.image];
    }
    console.log('No images found');
    return [];
  };

  const images = getImages();
  console.log('Final images array:', images);

  return (
    <div className="program-details-page">
      {/* Header Section */}
      <header className="program-header">
        <div className="header-container">
          <button 
            className="back-button" 
            onClick={() => navigate('/programs')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Programs
          </button>
          
          <div className="program-breadcrumb">
            <span>Programs</span>
            <span>/</span>
            <span>{program.title}</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="program-hero">
        <div className="hero-background">
          <ImageCarousel 
            images={images}
            className="hero-carousel"
            autoPlay={true}
            interval={5000}
          />
          <div className="hero-overlay">
            <div className="hero-content">
              <motion.div
                className="program-badge"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {getCategoryDisplayName(program.category)}
              </motion.div>
              
              <motion.h1 
                className="program-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {program.title}
              </motion.h1>
              
              <motion.div 
                className="program-location"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {program.location}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="program-main">
        <div className="content-container">
          {/* Left Column - Main Content */}
          <div className="main-content">
            {/* About Section */}
            <motion.section 
              className="content-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="section-title">
                <span className="title-icon">📋</span>
                About This Program
              </h2>
              <div className="section-content">
                <p className="program-description">{program.description}</p>
              </div>
            </motion.section>

            {/* Impact Section */}
            <motion.section 
              className="content-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="section-title">
                <span className="title-icon">⚡</span>
                Our Impact
              </h2>
              <div className="section-content">
                <div className="impact-card">
                  <div className="impact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="impact-text">
                    {program.impact}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Program Details */}
            <motion.section 
              className="content-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="section-title">
                <span className="title-icon">ℹ️</span>
                Program Details
              </h2>
              <div className="section-content">
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{getCategoryDisplayName(program.category)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{program.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`detail-value status-${program.active ? 'active' : 'inactive'}`}>
                      {program.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {program.createdAt && (
                    <div className="detail-item">
                      <span className="detail-label">Started</span>
                      <span className="detail-value">
                        {format(new Date(program.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column - Sidebar */}
          <motion.aside 
            className="program-sidebar"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Action Buttons */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Get Involved</h3>
              <div className="action-buttons">
                <button 
                  className="action-btn primary"
                  onClick={() => navigate('/campaigns')}
                >
                  Donate to This Program
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => navigate('/volunteer-join')}
                >
                  Volunteer for This Program
                </button>
                <div className="share-section">
                  <ShareButton 
                    url={window.location.href}
                    title={program.title}
                    description={`Check out this amazing program: ${program.title}. ${program.description}`}
                  />
                </div>
              </div>
            </div>

            {/* Program Stats */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Program Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{program.beneficiaries ? `${program.beneficiaries}+` : 'N/A'}</div>
                  <div className="stat-label">Beneficiaries</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{program.yearsActive ? program.yearsActive : 'N/A'}</div>
                  <div className="stat-label">Years Active</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{program.successRate ? `${program.successRate}%` : 'N/A'}</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Related Programs */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Explore More</h3>
              <div className="related-links">
                <button 
                  className="related-link"
                  onClick={() => navigate('/programs')}
                >
                  View All Programs
                </button>
                <button 
                  className="related-link"
                  onClick={() => navigate('/events')}
                >
                  Upcoming Events
                </button>
                <button 
                  className="related-link"
                  onClick={() => navigate('/gallery')}
                >
                  Program Gallery
                </button>
              </div>
            </div>
          </motion.aside>
        </div>
      </main>

      {/* Call to Action */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="cta-container">
          <h2>Ready to Make a Difference?</h2>
          <p>Join us in creating positive change in our community</p>
          <div className="cta-buttons">
            <button 
              className="cta-btn primary"
              onClick={() => navigate('/campaigns')}
            >
              Donate Now
            </button>
            <button 
              className="cta-btn secondary"
              onClick={() => navigate('/volunteer-join')}
            >
              Become a Volunteer
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ProgramDetails; 