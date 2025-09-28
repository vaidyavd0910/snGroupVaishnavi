import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./PageStyles.css";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "../components/common/ImageCarousel";
import ShareButton from "../components/common/ShareButton";
import api from "../utils/api";
import PageLoader from "../components/PageLoader";
import usePageLoader from "../hooks/usePageLoader";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [columns, setColumns] = useState(3);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isPageLoading = usePageLoader();

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const response = await api.get('/gallery');
        setGalleryItems(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load gallery items. Please try again later.');
        console.error('Error fetching gallery items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  // Responsive columns
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = [
    { id: "all", name: "All Photos" },
    { id: "events", name: "Events" },
    { id: "programs", name: "Programs" },
    { id: "people", name: "People" },
    { id: "nature", name: "Nature" }
  ];

  const filteredItems = activeCategory === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  // Organize items into columns
  const getColumnItems = () => {
    const result = Array(columns).fill().map(() => []);
    filteredItems.forEach((item, index) => {
      result[index % columns].push(item);
    });
    return result;
  };

  const columnItems = getColumnItems();

  if (isPageLoading) {
    return <PageLoader subtitle="Loading gallery..." />;
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
            Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="page-subtitle"
          >
            Capturing moments of impact and transformation
          </motion.p>
        </div>
      </section>

      <section className="content-section">
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        <div className="filter-container">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
              disabled={loading}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="gallery-container">
          {columnItems.map((column, columnIndex) => (
            <div key={columnIndex} className="gallery-column">
              {column.map(item => (
                <motion.div
                  key={item.id}
                  className="gallery-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: columnIndex * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="gallery-image">
                    <ImageCarousel 
                      images={item.images && item.images.length > 0 ? item.images : (item.image ? [item.image] : [])}
                      className="gallery-carousel"
                      autoPlay={true}
                      interval={5000}
                    />
                  </div>
                  <div className="gallery-overlay">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div 
                      className="gallery-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ShareButton 
                        url={window.location.href}
                        title={item.title}
                        description={item.description}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <motion.div
                className="lightbox-content"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ImageCarousel 
                  images={selectedImage.images && selectedImage.images.length > 0 ? selectedImage.images : (selectedImage.image ? [selectedImage.image] : [])}
                  className="lightbox-carousel"
                  autoPlay={false}
                />
                <div className="lightbox-info">
                  <h3>{selectedImage.title}</h3>
                  <p>{selectedImage.description}</p>
                  <div className="lightbox-share">
                    <ShareButton 
                      url={window.location.href}
                      title={selectedImage.title}
                      description={selectedImage.description}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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

export default Gallery;