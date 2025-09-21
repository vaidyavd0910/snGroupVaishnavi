import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHeart, FaHandHoldingHeart, FaUsers, FaGlobe, FaArrowRight, FaPlay } from 'react-icons/fa';

const Hero = () => {
  const [counts, setCounts] = useState({
    donations: 0,
    transactions: 0,
    ngos: 0,
    volunteers: 0,
    raised: 0
  });

  useEffect(() => {
    const animateNumbers = () => {
      const targets = {
        donations: 10,
        transactions: 1,
        ngos: 1200,
        volunteers: 50,
        raised: 10
      };

      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setCounts({
          donations: Math.floor(targets.donations * progress),
          transactions: Math.floor(targets.transactions * progress),
          ngos: Math.floor(targets.ngos * progress),
          volunteers: Math.floor(targets.volunteers * progress),
          raised: Math.floor(targets.raised * progress)
        });

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateNumbers, 500);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.section 
      className="relative min-h-screen bg-[#F2F2F2] overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-48 h-48 sm:w-72 sm:h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-48 h-48 sm:w-72 sm:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center min-h-[70vh] sm:min-h-[80vh]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div className="text-white space-y-6 sm:space-y-8" variants={itemVariants}>
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              variants={itemVariants}
            >
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse "></span>
              <span className="text-xs sm:text-sm font-medium text-gray-600 ">Trusted by 1M+ donors worldwide</span>
            </motion.div>
            <motion.div 
              className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              variants={itemVariants}
            >
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse "></span>
              <span className="text-xs sm:text-sm font-medium text-gray-600 ">Opreted By: Manasparshi Aashas Sewa Sanstha</span>
            </motion.div>


            {/* Main Title */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-gray-900 font-bold leading-tight"
              variants={itemVariants}
            >
              Making a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-500">
                Difference
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r text-gray-900">
                Together
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl"
              variants={itemVariants}
            >
              Join us in creating positive change. Every donation, every volunteer hour, 
              and every act of kindness helps us build a better world for everyone.
            </motion.p>

            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                variants={statVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FaHeart className="text-white text-sm sm:text-lg " />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold  text-gray-900 mb-1">
                  ₹{counts.donations}+ Lakh
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Worth Donations</div>
              </motion.div>

              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                variants={statVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FaUsers className="text-white text-sm sm:text-lg" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {counts.transactions}K
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Donor Transactions</div>
              </motion.div>

              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                variants={statVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FaGlobe className="text-white text-sm sm:text-lg" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {counts.ngos}+
                </div>
                <div className="text-xs sm:text-sm text-gray-600">NGOs Impacted</div>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <motion.button
                className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-500 text-white font-semibold rounded-xl sm:rounded-2xl  transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <FaHandHoldingHeart className="text-lg sm:text-xl" />
                  <span className=''>Donate Now</span>
                </span>
                {/* <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                /> */}
              </motion.button>

              <motion.button
                className="group px-6 py-3 sm:px-8 sm:py-4  backdrop-blur-sm text-white font-semibold rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className='text-red-500'>Explore Campaigns</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300 text-red-500" />
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-400"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>100% Secure Donations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Tax Benefits Available</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            className="relative flex justify-center items-center mt-8 lg:mt-0"
            variants={itemVariants}
          >
            {/* Main Hero Image Container */}
            <motion.div 
              className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg"
              variants={floatingVariants}
              animate="animate"
            >
              {/* Central Image */}
              <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/20 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-red-500 to-red-500 rounded-full flex items-center justify-center mb-4 mx-auto"
                  >
                    <FaHeart className="text-white text-2xl sm:text-3xl lg:text-4xl" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Hero Image</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Premium Visual Content</p>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: '1s' }}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-500 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FaUsers className="text-white text-sm sm:text-lg lg:text-xl" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{counts.volunteers}K+</div>
                    <div className="text-xs sm:text-sm text-gray-600">Volunteers</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: '2s' }}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-500 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FaHeart className="text-white text-sm sm:text-lg lg:text-xl" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">₹{counts.raised}M+</div>
                    <div className="text-xs sm:text-sm text-gray-600">Raised</div>
                  </div>
                </div>
              </motion.div>

              {/* Play Button */}
              {/* <motion.button
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaPlay className="text-white text-lg sm:text-xl lg:text-2xl ml-1" />
              </motion.button> */}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-4 h-6 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-2 sm:h-3 bg-white rounded-full mt-1 sm:mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero; 