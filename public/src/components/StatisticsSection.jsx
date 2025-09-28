import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaGlobe, FaStar, FaHandHoldingHeart } from 'react-icons/fa';
import api from '../utils/api';

const StatisticsSection = () => {
  const [stats, setStats] = useState({
    activeVolunteers: { value: '50K+', label: 'Active Volunteers', icon: 'FaUsers' },
    ngosImpacted: { value: '1200+', label: 'NGOs Impacted', icon: 'FaGlobe' },
    trustScore: { value: '4.9', label: 'Trust Score', icon: 'FaStar' },
    totalImpact: { value: '₹300Cr+', label: 'Total Impact', icon: 'FaHandHoldingHeart' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Try to fetch from API first
        const response = await api.get('/content/stats');
        if (response.data.success) {
          // Handle API response structure: response.data.data.data
          const apiData = response.data.data.data;
          console.log('API Response:', response.data);
          console.log('Extracted Stats Data:', apiData);
          
          if (apiData && apiData.activeVolunteers) {
            // Only keep the 4 main statistics we want
            const cleanData = {
              activeVolunteers: apiData.activeVolunteers || { value: '100+', label: 'Active Volunteers', icon: 'FaUsers' },
              ngosImpacted: apiData.ngosImpacted || { value: '1200+', label: 'NGOs Impacted', icon: 'FaGlobe' },
              trustScore: apiData.trustScore || { value: '4.9', label: 'Trust Score', icon: 'FaStar' },
              totalImpact: apiData.totalImpact || { value: '₹300Cr+', label: 'Total Impact', icon: 'FaHandHoldingHeart' }
            };
            setStats(cleanData);
          } else {
            // Fallback to localStorage if API data is malformed
            const savedStats = localStorage.getItem('admin-stats');
            if (savedStats) {
              setStats(JSON.parse(savedStats));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
        // Fallback to localStorage if API fails
        const savedStats = localStorage.getItem('admin-stats');
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }
        // Otherwise keep default values
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getIconComponent = (iconName) => {
    const icons = { FaUsers, FaGlobe, FaStar, FaHandHoldingHeart };
    return icons[iconName] || FaUsers;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-12"></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-2xl mx-auto mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded w-20 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const statsArray = Object.values(stats);

  return (
    <section className="py-20 sm:py-24 lg:py-32 w-full">
      <div className="w-full px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-20 xl:gap-24">
          {statsArray.map((stat, index) => {
            const IconComponent = getIconComponent(stat.icon);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.div
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  style={{ backgroundColor: 'rgb(209, 67, 67)' }}
                  whileHover={{ scale: 1.1 }}
                >
                  <IconComponent className="text-white text-xl sm:text-2xl lg:text-3xl" />
                </motion.div>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium text-sm sm:text-base lg:text-lg">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
