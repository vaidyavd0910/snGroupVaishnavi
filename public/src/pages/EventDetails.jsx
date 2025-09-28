import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Loader from '../components/Loader';
import ImageCarousel from '../components/common/ImageCarousel';
import ShareButton from '../components/common/ShareButton';
import api from '../utils/api';
import './ProgramDetails.css'; // Reuse for now

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${id}`);
        if (response.data.success) {
          setEvent(response.data.data);
        } else if (response.data._id) {
          setEvent(response.data);
        } else {
          throw new Error('Failed to fetch event');
        }
      } catch (err) {
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <Loader text="Loading event details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>Error Loading Event</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/events')} className="btn btn-primary">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/events')} className="btn btn-primary">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  // Prepare images array for carousel
  const getImages = () => {
    if (event.images && event.images.length > 0) {
      return event.images;
    } else if (event.image) {
      return [event.image];
    }
    return [];
  };

  const images = getImages();

  return (
    <div className="program-details-page">
      {/* Header Section */}
      <header className="program-header">
        <div className="header-container">
          <button 
            className="back-button" 
            onClick={() => navigate('/events')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </button>
          <div className="program-breadcrumb">
            <span>Events</span>
            <span>/</span>
            <span>{event.title}</span>
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
        </div>
      </section>

      {/* Main Content */}
      <main className="program-main">
        <div className="content-container">
          <div className="main-content">
            {/* Event Info Header */}
            <motion.section 
              className="content-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="event-info-card">
                <div className="event-title-detail">{event.title}</div>
                <div className="event-meta-detail">
                  <span className="event-date-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {format(new Date(event.date), 'MMMM d, yyyy')}
                  </span>
                  {event.time && (
                    <span className="event-time-detail">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /></svg>
                      {event.time}
                    </span>
                  )}
                  {event.location && (
                    <span className="event-location-detail">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {event.location}
                    </span>
                  )}
                </div>
                <div className="event-divider"></div>
                <div className="event-share-section">
                  <ShareButton 
                    url={window.location.href}
                    title={event.title}
                    description={`Join us for ${event.title} on ${format(new Date(event.date), 'MMMM d, yyyy')} at ${event.location || 'our venue'}. ${event.description}`}
                  />
                </div>
              </div>
            </motion.section>
            {/* About Section */}
            <motion.section 
              className="content-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="section-title">
                <span className="title-icon">📋</span>
                About This Event
              </h2>
              <div className="section-content">
                <p className="program-description">{event.description}</p>
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails; 