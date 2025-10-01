import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../utils/api';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get('/testimonials');
      const activeTestimonials = response.data.testimonials?.filter(t => t.isActive !== false) || [];
      if (activeTestimonials.length > 0) {
        setTestimonials(activeTestimonials);
      } else {
        // Fallback testimonials if API fails
        setTestimonials([
          {
            _id: '1',
            name: 'Priya Sharma',
            designation: 'Community Leader',
            organization: 'Mumbai, Maharashtra',
            message: 'The impact SN Trust has made in our village is incredible. They\'ve not only provided education but also empowered our women with skills training.',
            rating: 5
          },
          {
            _id: '2',
            name: 'Rahul Kumar',
            designation: 'Volunteer',
            organization: 'Delhi',
            message: 'Being part of SN Trust has been life-changing. The work we do directly impacts communities and creates lasting positive change.',
            rating: 5
          },
          {
            _id: '3',
            name: 'Dr. Anjali Patel',
            designation: 'Healthcare Partner',
            organization: 'Bangalore, Karnataka',
            message: 'Their healthcare initiatives have reached the most remote areas. The dedication and professionalism of the team is outstanding.',
            rating: 5
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Use fallback testimonials
      setTestimonials([
        {
          _id: '1',
          name: 'Priya Sharma',
          designation: 'Community Leader',
          organization: 'Mumbai, Maharashtra',
          message: 'The impact SN Trust has made in our village is incredible. They\'ve not only provided education but also empowered our women with skills training.',
          rating: 5
        },
        {
          _id: '2',
          name: 'Rahul Kumar',
          designation: 'Volunteer',
          organization: 'Delhi',
          message: 'Being part of SN Trust has been life-changing. The work we do directly impacts communities and creates lasting positive change.',
          rating: 5
        },
        {
          _id: '3',
          name: 'Dr. Anjali Patel',
          designation: 'Healthcare Partner',
          organization: 'Bangalore, Karnataka',
          message: 'Their healthcare initiatives have reached the most remote areas. The dedication and professionalism of the team is outstanding.',
          rating: 5
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, testimonials.length]);

  const handlePrevious = () => {
    setAutoPlay(false);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setAutoPlay(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index) => {
    setAutoPlay(false);
    setActiveIndex(index);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="testimonials-loading">
        <div className="spinner"></div>
        <p>Loading testimonials...</p>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            What Our Community <span className="highlight">Says</span>
          </h2>
          <p className="section-subtitle">
            Hear from the people whose lives have been transformed through our initiatives
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="testimonials-carousel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="testimonial-card-main"
            >
              {/* Quote Icon */}
              <div className="quote-icon-wrapper">
                <FaQuoteLeft className="quote-icon" />
              </div>

              {/* Testimonial Content */}
              <div className="testimonial-content-main">
                <p className="testimonial-text">"{currentTestimonial.message || currentTestimonial.content}"</p>

                {/* Rating */}
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < currentTestimonial.rating ? 'star-filled' : 'star-empty'}
                    />
                  ))}
                </div>

                {/* Author Info */}
                <div className="author-info">
                  {/* Avatar */}
                  <div className="author-avatar">
                    <div className="avatar-placeholder">
                      {getInitials(currentTestimonial.name)}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="author-details">
                    <h4 className="author-name">{currentTestimonial.name}</h4>
                    <p className="author-role">{currentTestimonial.designation || currentTestimonial.role}</p>
                    {(currentTestimonial.organization || currentTestimonial.location) && (
                      <p className="author-location">📍 {currentTestimonial.organization || currentTestimonial.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              {testimonials.length > 1 && (
                <>
                  <button
                    className="nav-arrow nav-arrow-left"
                    onClick={handlePrevious}
                    aria-label="Previous testimonial"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    className="nav-arrow nav-arrow-right"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Dots Navigation */}
          {testimonials.length > 1 && (
            <div className="dots-navigation">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* All Testimonials Grid (Desktop) */}
        <div className="all-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              className={`testimonial-mini-card ${index === activeIndex ? 'active' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => handleDotClick(index)}
            >
              <div className="mini-card-header">
                <div className="mini-avatar">
                  <div className="mini-avatar-placeholder">
                    {getInitials(testimonial.name)}
                  </div>
                </div>
                <div className="mini-info">
                  <h5>{testimonial.name}</h5>
                  <p>{testimonial.designation || testimonial.role}</p>
                </div>
              </div>
              <div className="mini-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="mini-star" />
                ))}
              </div>
              <p className="mini-content">"{(testimonial.message || testimonial.content || '').slice(0, 100)}..."</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
