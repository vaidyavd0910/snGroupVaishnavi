import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaClock, FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import './ContactUs.css';
import axios from 'axios';
import Loader from '../components/Loader';
import api from '../utils/api';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);
    setLoading(true);
    try {
      await api.post('/contact', formData, {
        headers: {
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
        }
      });
      setFormStatus('success');
      setTimeout(() => {
        setFormStatus(null);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 3000);
    } catch (err) {
      setFormStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-us-container">
      {/* Loader overlay for contact form submission */}
      {loading && (
        <div className="contact-loader-overlay">
          <Loader text="Sending message..." />
        </div>
      )}
      
      <motion.div 
        className="contact-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Contact Us</h1>
        <div className="contact-underline"></div>
        <p>We'd love to hear from you. Reach out to us with any questions or inquiries.</p>
      </motion.div>

      <div className="contact-content">
        <motion.div 
          className="contact-info"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="info-card">
            <h2>Get In Touch</h2>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="contact-text">
                  <h3>Address</h3>
                  <p>Main road Jafrabad Near Dawargaon Fata Behind Sn properties group Tembhurni, Jalna Maharashtra 431208</p>
                  <a href="https://maps.app.goo.gl/M8d6sXVdNPuJExzv7" target="_blank" rel="noopener noreferrer" className="map-link">
                    View on Map
                  </a>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <FaPhone />
                </div>
                <div className="contact-text">
                  <h3>Phone</h3>
                  <p><a href="tel:7058257708">757070899</a></p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <FaEnvelope />
                </div>
                <div className="contact-text">
                  <h3>Email</h3>
                  <p>
                    <a href="mailto:sngroupfoundationoffice@gmail.com">sngroupfoundationoffice@gmail.com</a>
                  </p>
                  <p>
                    <a href="mailto:sngroupfoundation@org.com">sngroupfoundation@org.com</a>
                  </p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <FaClock />
                </div>
                <div className="contact-text">
                  <h3>Office Hours</h3>
                  <p>9 am to 7 pm</p>
                </div>
              </div>
            </div>
            
            <div className="social-media">
              <h3>Connect With Us</h3>
              <div className="social-icons">
                <a href="https://www.facebook.com/share/17RycVv5j2/" className="social-icon facebook" aria-label="Facebook">
                  <FaFacebookF />
                </a>
                <a href="https://www.instagram.com/sngroupfoundation?igsh=bTltYXo2anQ0dXg0" className="social-icon instagram" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://www.linkedin.com/company/mansparshi-aashas-sewa-sanstha/" className="social-icon linkedin" aria-label="LinkedIn">
                  <FaLinkedinIn />
                </a>
                <a href="#" className="social-icon twitter" aria-label="Twitter">
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="contact-form-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="form-card">
            <h2>Send Us a Message</h2>
            
            {formStatus === 'success' ? (
              <div className="form-success">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                  </svg>
                  <h3>Message Sent!</h3>
                  <p>We'll get back to you as soon as possible.</p>
                </motion.div>
              </div>
            ) : formStatus === 'error' ? (
              <div className="form-error">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3>Failed to send message.</h3>
                  <p>Please try again later.</p>
                </motion.div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Enter subject"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Enter your message"
                    rows="5"
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="map-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3753.1907243051236!2d76.0!3d19.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDQ4JzAwLjAiTiA3NsKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="SN Group Foundation Location"
        ></iframe>
      </motion.div>
    </div>
  );
};

export default ContactUs;