import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaNewspaper, FaGraduationCap, FaHandHoldingHeart, FaStar, FaUsers, FaGlobe, FaInfoCircle, FaArrowRight, FaImages, FaUserFriends, FaFileAlt, FaEnvelope } from 'react-icons/fa';
import Hero from '../components/Hero';
import Announcements from '../components/Announcements';
import EventsSection from '../components/EventsSection';
import GallerySection from '../components/GallerySection';
import Footer from '../components/Footer';
import PremiumEventsSection from '../components/PremiumEventsSection';
import PremiumBlogsSection from '../components/PremiumBlogsSection';
import PremiumProgramsSection from '../components/PremiumProgramsSection';
import PremiumCampaignsSection from '../components/PremiumCampaignsSection';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for premium experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { icon: FaUsers, value: '50K+', label: 'Active Volunteers', color: 'from-blue-500 to-cyan-500' },
    { icon: FaGlobe, value: '1400+', label: 'NGOs Impacted', color: 'from-green-500 to-emerald-500' },
    { icon: FaStar, value: '4.9', label: 'Trust Score', color: 'from-yellow-500 to-orange-500' },
    { icon: FaHandHoldingHeart, value: '₹300Cr+', label: 'Total Impact', color: 'from-purple-500 to-pink-500' }
  ];

  if (isLoading) {
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
            SN Trust
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-sm sm:text-base"
          >
            Loading your premium experience...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <Hero />

      {/* Announcements */}
      <Announcements />

      {/* Impact Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Impact</span> in Numbers
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Real change happens when people come together. See how our community is making a difference.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.div
                  className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="text-white text-xl sm:text-2xl" />
                </motion.div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="flex items-center justify-center mb-4 mx-auto w-fit">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Events</span>
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Discover world-class events and conferences that bring communities together
            </p>
          </motion.div>
          <PremiumEventsSection />
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="flex items-center justify-center mb-4 mx-auto w-fit">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <FaNewspaper className="text-white text-xl" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-700">Blogs</span>
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Insights, stories, and perspectives that inspire change and drive impact
            </p>
          </motion.div>
          <PremiumBlogsSection />
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="flex items-center justify-center mb-4 mx-auto w-fit">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">Programs</span>
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Transformative learning experiences designed for impact and community development
            </p>
          </motion.div>
          <PremiumProgramsSection />
        </div>
      </section>

      {/* Campaigns Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="flex items-center justify-center mb-4 mx-auto w-fit">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4">
                <FaHandHoldingHeart className="text-white text-xl" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">Campaigns</span>
              </h2>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Make a difference through impactful social initiatives and community campaigns
            </p>
          </motion.div>
          <PremiumCampaignsSection />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 px-4">
              Join thousands of donors and volunteers who are already creating positive change in communities around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-6 py-3 sm:px-8 sm:py-4 bg-white text-primary-600 font-semibold rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHandHoldingHeart className="text-lg sm:text-xl" />
                <span>Start Donating</span>
              </motion.button>
              <motion.button
                className="px-6 py-3 sm:px-8 sm:py-4 bg-transparent text-white font-semibold rounded-xl sm:rounded-2xl border-2 border-white/30 hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUsers className="text-lg sm:text-xl" />
                <span>Become a Volunteer</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Website</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Discover all the features and pages available on our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {/* About Us */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to="/about" className="block">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-medium transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaInfoCircle className="text-white text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">About Us</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">Learn about our story, mission, and vision for creating positive change.</p>
                  <div className="flex items-center text-primary-600 font-semibold text-sm sm:text-base group-hover:translate-x-2 transition-transform duration-300">
                    <span>Learn More</span>
                    <FaArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Campaigns */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to="/campaigns" className="block">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-medium transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaHandHoldingHeart className="text-white text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Campaigns</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">Support our ongoing campaigns and make a real impact in communities.</p>
                  <div className="flex items-center text-primary-600 font-semibold text-sm sm:text-base group-hover:translate-x-2 transition-transform duration-300">
                    <span>View Campaigns</span>
                    <FaArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Programs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to="/programs" className="block">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-medium transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaGraduationCap className="text-white text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Programs</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">Explore our educational and community development programs.</p>
                  <div className="flex items-center text-primary-600 font-semibold text-sm sm:text-base group-hover:translate-x-2 transition-transform duration-300">
                    <span>Explore Programs</span>
                    <FaArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Events */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to="/events" className="block">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-medium transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaCalendarAlt className="text-white text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Events</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">Join our upcoming events and connect with the community.</p>
                  <div className="flex items-center text-primary-600 font-semibold text-sm sm:text-base group-hover:translate-x-2 transition-transform duration-300">
                    <span>View Events</span>
                    <FaArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to="/gallery" className="block">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-medium transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaImages className="text-white text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Gallery</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">Browse through our photo gallery and see our impact in action.</p>
                  <div className="flex items-center text-primary-600 font-semibold text-sm sm:text-base group-hover:translate-x-2 transition-transform duration-300">
                    <span>View Gallery</span>
                    <FaArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* SN Arya Mitra */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to="/sn-arya-mitra" className="block">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-medium transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaUserFriends className="text-white text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">SN Arya Mitra</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">Connect with our verified volunteers and emergency contacts.</p>
                  <div className="flex items-center text-primary-600 font-semibold text-sm sm:text-base group-hover:translate-x-2 transition-transform duration-300">
                    <span>Find Mitras</span>
                    <FaArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Blog */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to="/blog" className="block">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-medium transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaFileAlt className="text-white text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Blog</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">Read our latest articles, stories, and insights about social impact.</p>
                  <div className="flex items-center text-primary-600 font-semibold text-sm sm:text-base group-hover:translate-x-2 transition-transform duration-300">
                    <span>Read Blog</span>
                    <FaArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to="/contact" className="block">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-medium transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaEnvelope className="text-white text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Contact</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">Get in touch with us for questions, support, or collaboration.</p>
                  <div className="flex items-center text-primary-600 font-semibold text-sm sm:text-base group-hover:translate-x-2 transition-transform duration-300">
                    <span>Contact Us</span>
                    <FaArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Legacy Sections (keeping for compatibility) */}
      <EventsSection />
      <GallerySection />
    </div>
  );
};

export default Home; 