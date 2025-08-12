import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import "./PageStyles.css";
import Loader from "../components/Loader";
import ImageCarousel from "../components/common/ImageCarousel";
import ShareButton from "../components/common/ShareButton";

const Programs = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
    
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch( process.env.REACT_APP_API_URL+'/programs');
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      const data = await response.json();
      setPrograms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All Programs" },
    { id: "health", name: "Health" },
    { id: "education", name: "Education" },
    { id: "food", name: "Food Security" },
    { id: "social", name: "Social Welfare" },
    { id: "environment", name: "Environment" }
  ];

  const filteredPrograms = activeFilter === "all" 
    ? programs 
    : programs.filter(program => program.category === activeFilter);

  if (loading) {
    return (
      <div className="page-container">
        <Loader text="Loading programs..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          Error: {error}
          <button onClick={fetchPrograms} className="retry-button">Retry</button>
        </div>
      </div>
    );
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
            Our Programs
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="page-subtitle"
          >
            Making a difference through sustainable and impactful initiatives
          </motion.p>
        </div>
      </section>

      <section className="content-section">
        <div className="filter-container">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-button ${activeFilter === category.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="programs-grid">
          {filteredPrograms.map(program => (
            <motion.div
              key={program._id}
              className="program-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              onClick={() => navigate(`/programs/${program._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="program-image">
                {/* Show only the first image, no carousel */}
                {program.images && program.images.length > 0 ? (
                  <img 
                    src={program.images[0]} 
                    alt={program.title} 
                    className="program-card-image" 
                  />
                ) : program.image ? (
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="program-card-image" 
                  />
                ) : (
                  <div className="no-images program-card-image">No image</div>
                )}
                <div className="program-category">{categories.find(c => c.id === program.category)?.name || program.category}</div>
              </div>
              <div className="program-content">
                <h3 className="program-title">{program.title}</h3>
                <p className="program-description">{program.description}</p>
                <div className="program-meta">
                  <span className="program-category">{program.category}</span>
                  <span className="program-location">{program.location}</span>
                </div>
                <div className="program-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate(`/programs/${program._id}`)}
                  >
                    Learn More
                  </button>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: 'inline-block' }}
                  >
                    <ShareButton 
                      url={`${window.location.origin}/programs/${program._id}`}
                      title={program.title}
                      description={`Check out this amazing program: ${program.title}. ${program.description}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Want to support our programs?</h2>
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

export default Programs; 