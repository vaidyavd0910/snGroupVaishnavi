import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = ({ 
  title = "SN Trust", 
  subtitle = "Loading your premium experience...",
  duration = 1500 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4 sm:mb-6"
        />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl font-bold text-white mb-2"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-sm sm:text-base"
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default PageLoader;
