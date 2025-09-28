import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = ({ 
  title = "SN Trust", 
  subtitle = "Loading your premium experience...",
  duration = 1500 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Animated loading spinner with pulsing effect */}
        <motion.div
          className="relative mx-auto mb-6 sm:mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-t-transparent rounded-full mx-auto"
            style={{ borderColor: 'rgb(209, 67, 67)' }}
          />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 rounded-full mx-auto"
            style={{ borderColor: 'rgba(209, 67, 67, 0.3)' }}
          />
        </motion.div>

        {/* Animated title with gradient text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3"
        >
          <span style={{ color: 'rgb(209, 67, 67)' }}>
            {title}
          </span>
        </motion.h2>

        {/* Animated subtitle with typing effect */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-md mx-auto"
        >
          {subtitle}
        </motion.p>

        {/* Animated dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center space-x-1 mt-4"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'rgb(209, 67, 67)' }}
            />
          ))}
        </motion.div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3 + index * 0.5,
                repeat: Infinity,
                delay: index * 0.3,
                ease: "easeInOut"
              }}
              className="absolute w-1 h-1 rounded-full"
              style={{ backgroundColor: 'rgba(209, 67, 67, 0.6)' }}
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + index * 10}%`
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PageLoader;
