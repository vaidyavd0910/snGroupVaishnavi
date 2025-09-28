import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import "./PageStyles.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ImageCarousel from "../components/common/ImageCarousel";
import ShareButton from "../components/common/ShareButton";
import api from "../utils/api";
import PageLoader from "../components/PageLoader";
import usePageLoader from "../hooks/usePageLoader";

const Events = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusFromQuery = queryParams.get('status');
  
  const [activeTab, setActiveTab] = useState(statusFromQuery || "upcoming");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isPageLoading = usePageLoader();
  
  useEffect(() => {
    fetchEvents();
  }, []);

  // Update active tab when query parameter changes
  useEffect(() => {
    if (statusFromQuery) {
      setActiveTab(statusFromQuery);
    }
  }, [statusFromQuery]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      // Transform dates from strings to Date objects
      const eventsWithDates = response.data.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
      setEvents(eventsWithDates);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (date) => {
    return format(date, "MMMM d, yyyy");
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const eventStartTime = new Date(event.date);
    const eventEndTime = new Date(event.date);
    
    // Set start time based on event.startTime
    if (event.startTime) {
      const [startHours, startMinutes] = event.startTime.split(':');
      eventStartTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);
    }
    
    // Set end time based on event.endTime
    if (event.endTime) {
      const [endHours, endMinutes] = event.endTime.split(':');
      eventEndTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);
    } else {
      // Default to 2 hours after start if no end time
      eventEndTime.setHours(eventStartTime.getHours() + 2);
    }

    if (now < eventStartTime) {
      return 'upcoming';
    } else if (now >= eventStartTime && now <= eventEndTime) {
      return 'ongoing';
    } else {
      return 'past';
    }
  };

  const getFilteredEvents = () => {
    return events.filter(event => {
      const eventStatus = getEventStatus(event);
      return eventStatus === activeTab;
    });
  };

  const getStatusBadge = (event) => {
    const status = getEventStatus(event);
    switch (status) {
      case 'upcoming':
        return <span className="status-badge upcoming">Upcoming</span>;
      case 'ongoing':
        return <span className="status-badge ongoing">Ongoing</span>;
      case 'past':
        return <span className="status-badge past">Past</span>;
      default:
        return null;
    }
  };

  const getStatusColor = (event) => {
    const status = getEventStatus(event);
    switch (status) {
      case 'upcoming':
        return '#D14343';
      case 'ongoing':
        return '#D14343';
      case 'past':
        return '#D14343';
      default:
        return '#D14343';
    }
  };

  if (isPageLoading) {
    return <PageLoader subtitle="Loading events..." />;
  }

  return (
    <div className="page-container">
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="page-title"
          >
            Events
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="page-subtitle"
          >
            Join us in making a difference through our community events
          </motion.p>
        </div>
      </section>

      <section className="content-section">
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
          </button>
          <button 
            className={`tab-button ${activeTab === 'ongoing' ? 'active' : ''}`}
            onClick={() => setActiveTab('ongoing')}
          >
            Ongoing Events
          </button>
          <button 
            className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past Events
          </button>
        </div>

        <div className="events-container">
          {error ? (
            <div className="error-message">{error}</div>
          ) : getFilteredEvents().length > 0 ? (
            getFilteredEvents().map(event => (
              <motion.div
                key={event._id}
                className="event-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                onClick={() => navigate(`/events/${event._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="event-image">
                  <ImageCarousel 
                    images={event.images && event.images.length > 0 ? event.images : (event.image ? [event.image] : [])}
                    className="event-carousel"
                    autoPlay={true}
                    interval={4000}
                  />
                  <div className="event-date">
                    <span className="date-day">{format(event.date, "d")}</span>
                    <span className="date-month">{format(event.date, "MMM")}</span>
                  </div>
                  {getStatusBadge(event)}
                </div>
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-details">
                    <div className="event-detail">
                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="event-detail">
                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="event-description">{event.description}</p>
                  
                  <div className="event-actions">
                    <button 
                      className="btn btn-primary" 
                      style={{
                        cursor: 'default',
                        backgroundColor: getStatusColor(event)
                      }}
                    >
                      {getEventStatus(event) === 'upcoming' ? 'Upcoming Event' : 
                       getEventStatus(event) === 'ongoing' ? 'Ongoing Event' : 'Past Event'}
                    </button>
                    <div
                      onClick={e => {
                        // Prevent click from bubbling to event card
                        e.stopPropagation();
                      }}
                      style={{ display: 'inline-block' }}
                    >
                      <ShareButton 
                        url={`${window.location.origin}/events/${event._id}`}
                        title={event.title}
                        description={`Join us for ${event.title} on ${format(event.date, "MMMM d, yyyy")} at ${event.location || 'our venue'}. ${event.description}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-events">
              <p>No {activeTab} events at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="text-gray-900">Want to support our programs?</h2>
          <p>Your contribution can make a significant difference in the lives of those we serve.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/campaigns')}>Donate Now</button>
            <button className="btn btn-outline" onClick={() => navigate('/volunteer-join')}>Become a Volunteer</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events; 