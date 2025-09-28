import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaHeart, FaUsers, FaGlobe, FaStar, FaArrowRight, FaQuoteLeft, FaHandHoldingHeart, FaGraduationCap, FaHeartbeat, FaHome, FaTree, FaClock } from 'react-icons/fa';
import api from '../utils/api';

const GallerySection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [impactStories, setImpactStories] = useState([
    {
      id: 1,
      icon: FaHeartbeat,
      title: 'Healthcare Access',
      value: '1.5K+',
      description: 'People received medical care',
      color: 'from-primary-500 to-primary-500'
    },
    {
      id: 2,
      icon: FaGraduationCap,
      title: 'Education Support',
      value: '10K+',
      description: 'Students supported',
      color: 'from-primary-500 to-primary-500'
    },
    {
      id: 3,
      icon: FaHome,
      title: 'Community Development',
      value: '100+',
      description: 'Villages transformed',
      color: 'from-primary-500 to-primary-500'
    },
    {
      id: 4,
      icon: FaTree,
      title: 'Environmental Impact',
      value: '1Cr+',
      description: 'Trees planted',
      color: 'from-primary-500 to-primary-500'
    },
    {
      id: 5,
      icon: FaHandHoldingHeart,
      title: 'Disaster Relief',
      value: '1.7K+',
      description: 'Families helped',
      color: 'from-primary-500 to-primary-500'
    },
    {
      id: 6,
      icon: FaClock,
      title: 'Volunteer Hours',
      value: '50K+',
      description: 'Hours of service',
      color: 'from-primary-500 to-primary-500'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({});
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Helper function to extract numeric value from string
  const extractNumericValue = (value) => {
    if (!value) return 0;
    const numericPart = value.replace(/[^\d.]/g, '');
    return parseFloat(numericPart) || 0;
  };

  // Helper function to format the animated value back to original format
  const formatAnimatedValue = (originalValue, animatedNum) => {
    if (!originalValue) return animatedNum.toString();
    
    // Check for different formats
    if (originalValue.includes('K+')) {
      return `${Math.round(animatedNum)}K+`;
    } else if (originalValue.includes('Cr+')) {
      return `₹${Math.round(animatedNum)}Cr+`;
    } else if (originalValue.includes('k+')) {
      return `${Math.round(animatedNum)}k+`;
    } else if (originalValue.includes('+')) {
      return `${Math.round(animatedNum)}+`;
    } else if (originalValue.includes('.')) {
      return animatedNum.toFixed(1);
    } else {
      return Math.round(animatedNum).toString();
    }
  };

  // Animation function
  const animateValue = (key, start, end, duration) => {
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = start + (end - start) * easeOutQuart;
      
      setAnimatedValues(prev => ({
        ...prev,
        [key]: currentValue
      }));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const fetchImpactStories = async () => {
      try {
        console.log('🔄 [GALLERY] Fetching impact stories from API...');
        // Try impact-stories endpoint first, fallback to stats endpoint
        let response;
        try {
          response = await api.get('/content/impact-stories');
        } catch (impactError) {
          console.log('⚠️ [GALLERY] impact-stories endpoint failed, trying stats endpoint...');
          response = await api.get('/content/stats');
        }
        
        console.log('✅ [GALLERY] API Response received:', response.data);
        
        if (response.data.success) {
          const apiData = response.data.data.data;
          console.log('📊 [GALLERY] Extracted Stories Data:', apiData);
          
          // Check if we have impact stories data or stats data
          if (apiData && (apiData.healthcareAccess || apiData.activeVolunteers)) {
            console.log('✅ [GALLERY] API data is valid, using API data');
            
            // Use impact stories data if available, otherwise use stats data
            const cleanData = [
              {
                id: 1,
                icon: FaHeartbeat,
                title: apiData.healthcareAccess?.label || 'Healthcare Access',
                value: apiData.healthcareAccess?.value || '1.5K+',
                description: apiData.healthcareAccess?.description || 'People received medical care',
                color: 'from-primary-500 to-primary-500'
              },
              {
                id: 2,
                icon: FaGraduationCap,
                title: apiData.educationSupport?.label || 'Education Support',
                value: apiData.educationSupport?.value || '10K+',
                description: apiData.educationSupport?.description || 'Students supported',
                color: 'from-primary-500 to-primary-500'
              },
              {
                id: 3,
                icon: FaHome,
                title: apiData.communityDevelopment?.label || 'Community Development',
                value: apiData.communityDevelopment?.value || '100+',
                description: apiData.communityDevelopment?.description || 'Villages transformed',
                color: 'from-primary-500 to-primary-500'
              },
              {
                id: 4,
                icon: FaTree,
                title: apiData.environmentalImpact?.label || 'Environmental Impact',
                value: apiData.environmentalImpact?.value || '1Cr+',
                description: apiData.environmentalImpact?.description || 'Trees planted',
                color: 'from-primary-500 to-primary-500'
              },
              {
                id: 5,
                icon: FaHandHoldingHeart,
                title: apiData.disasterRelief?.label || 'Disaster Relief',
                value: apiData.disasterRelief?.value || '1.7K+',
                description: apiData.disasterRelief?.description || 'Families helped',
                color: 'from-primary-500 to-primary-500'
              },
              {
                id: 6,
                icon: FaClock,
                title: apiData.volunteerHours?.label || 'Volunteer Hours',
                value: apiData.volunteerHours?.value || '50K+',
                description: apiData.volunteerHours?.description || 'Hours of service',
                color: 'from-primary-500 to-primary-500'
              }
            ];
            setImpactStories(cleanData);
          } else {
            console.log('⚠️ [GALLERY] API data is malformed, using default values');
          }
        } else {
          console.log('❌ [GALLERY] API returned unsuccessful response');
        }
      } catch (error) {
        console.error('❌ [GALLERY] Error fetching impact stories:', error);
        console.log('🔄 [GALLERY] Using default values');
      } finally {
        setLoading(false);
      }
    };

    fetchImpactStories();
  }, []);

  // Trigger animations when component comes into view
  useEffect(() => {
    if (isInView && impactStories.length > 0) {
      impactStories.forEach((story, index) => {
        const targetValue = extractNumericValue(story.value);
        const delay = index * 200; // Stagger animations by 200ms
        
        setTimeout(() => {
          animateValue(story.id, 0, targetValue, 2000); // 2 second animation
        }, delay);
      });
    }
  }, [isInView, impactStories]);

  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Community Leader',
      content: 'The impact SN Trust has made in our village is incredible. They\'ve not only provided education but also empowered our women with skills training.',
      avatar: 'PS',
      rating: 5
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      role: 'Volunteer',
      content: 'Being part of SN Trust has been life-changing. The work we do directly impacts communities and creates lasting positive change.',
      avatar: 'RK',
      rating: 5
    },
    {
      id: 3,
      name: 'Dr. Anjali Patel',
      role: 'Healthcare Partner',
      content: 'Their healthcare initiatives have reached the most remote areas. The dedication and professionalism of the team is outstanding.',
      avatar: 'AP',
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Our <span style={{ color: 'rgb(209, 67, 67)' }}>Impact</span> Stories
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Real stories of transformation and positive change from communities across India
          </p>
        </motion.div>

        {/* Impact Stories Grid */}
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {impactStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group text-center"
            >
              <motion.div
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: 'rgb(209, 67, 67)' }}
                whileHover={{ rotate: 5 }}
              >
                <story.icon className="text-white text-lg sm:text-xl lg:text-2xl" />
              </motion.div>
              <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                {formatAnimatedValue(story.value, animatedValues[story.id] || 0)}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                {story.title}
              </div>
              <div className="text-xs text-gray-500 leading-tight">
                {story.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <motion.div
          className="bg-white rounded-2xl sm:rounded-3xl shadow-soft p-6 sm:p-8 lg:p-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              What Our Community Says
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto px-4">
              Hear from the people whose lives have been transformed through our initiatives
            </p>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="mb-6 sm:mb-8">
                  <FaQuoteLeft className="text-3xl sm:text-4xl mx-auto mb-4 sm:mb-6 opacity-80" style={{ color: 'rgb(209, 67, 67)' }} />
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6 sm:mb-8 italic px-4">
                    "{testimonials[activeTestimonial].content}"
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl" style={{ backgroundColor: 'rgb(209, 67, 67)' }}>
                      {testimonials[activeTestimonial].avatar}
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        {testimonials[activeTestimonial].name}
                      </div>
                      <div className="text-gray-600 text-xs sm:text-sm">
                        {testimonials[activeTestimonial].role}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex justify-center space-x-1">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-6 sm:mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  style={{ backgroundColor: index === activeTestimonial ? 'rgb(209, 67, 67)' : undefined }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl group text-sm sm:text-base"
            style={{ backgroundColor: 'rgb(209, 67, 67)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Join Our Mission</span>
            <FaArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection; 