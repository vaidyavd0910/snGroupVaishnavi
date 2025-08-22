import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaSearch, FaFilter, FaArrowRight, FaClock, FaUsers, FaStar, FaCalendarAlt } from 'react-icons/fa';
import api from '../utils/api';

const PremiumProgramsSection = () => {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    statusFilter: 'all',
    difficultyFilter: 'all',
    categoryFilter: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [programs, filters, searchTerm]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/programs');
      // Handle direct data structure
      const programsData = response?.data || [];
      setPrograms(programsData);
      setFilteredPrograms(programsData);
    } catch (error) {
      console.error('Error fetching programs:', error);
      // Fallback data for premium experience
      setPrograms(generatePremiumPrograms());
      setFilteredPrograms(generatePremiumPrograms());
    } finally {
      setLoading(false);
    }
  };

  const generatePremiumPrograms = () => {
    return [
      {
        _id: '1',
        title: 'Youth Leadership Development Program',
        description: 'A comprehensive 12-week program designed to develop leadership skills in young professionals.',
        duration: '12 weeks',
        status: 'ongoing',
        difficulty: 'intermediate',
        category: 'Leadership',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        participants: 45,
        maxParticipants: 60,
        rating: 4.8,
        price: '₹15,000',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-04-30'),
        tags: ['Leadership', 'Youth', 'Professional Development']
      },
      {
        _id: '2',
        title: 'Digital Skills Bootcamp',
        description: 'Intensive 6-week program covering essential digital skills for the modern workplace.',
        duration: '6 weeks',
        status: 'upcoming',
        difficulty: 'beginner',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        participants: 0,
        maxParticipants: 30,
        rating: 4.9,
        price: '₹8,000',
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-04-30'),
        tags: ['Technology', 'Digital Skills', 'Bootcamp']
      },
      {
        _id: '3',
        title: 'Sustainable Business Practices',
        description: 'Learn how to implement sustainable practices in your business operations.',
        duration: '8 weeks',
        status: 'completed',
        difficulty: 'advanced',
        category: 'Sustainability',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        participants: 25,
        maxParticipants: 25,
        rating: 4.7,
        price: '₹12,000',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-02-28'),
        tags: ['Sustainability', 'Business', 'Advanced']
      },
      {
        _id: '4',
        title: 'Community Health Worker Training',
        description: 'Comprehensive training program for community health workers and volunteers.',
        duration: '10 weeks',
        status: 'upcoming',
        difficulty: 'intermediate',
        category: 'Healthcare',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        participants: 12,
        maxParticipants: 40,
        rating: 4.6,
        price: '₹6,000',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-06-10'),
        tags: ['Healthcare', 'Community', 'Training']
      }
    ];
  };

  const applyFilters = () => {
    let filtered = programs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(program =>
        program?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program?.tags?.some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(program => program?.status === filters.statusFilter);
    }

    // Difficulty filter
    if (filters.difficultyFilter !== 'all') {
      filtered = filtered.filter(program => program?.difficulty === filters.difficultyFilter);
    }

    // Category filter
    if (filters.categoryFilter !== 'all') {
      filtered = filtered.filter(program => program?.category === filters.categoryFilter);
    }

    setFilteredPrograms(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming': return 'UPCOMING';
      case 'ongoing': return 'ONGOING';
      case 'completed': return 'COMPLETED';
      default: return 'UNKNOWN';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (participants, maxParticipants) => {
    return Math.round(((participants || 0) / (maxParticipants || 1)) * 100);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-6 lg:mb-0">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Premium Programs</h3>
          <p className="text-gray-600">Transformative learning experiences designed for impact</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative flex">
            <FaSearch className="relative right-1 top-4 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
            />
          </div>
          
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
          >
            <FaFilter className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 font-medium">Filters</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-soft p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={filters.statusFilter}
                  onChange={(e) => setFilters({...filters, statusFilter: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                <select
                  value={filters.difficultyFilter}
                  onChange={(e) => setFilters({...filters, difficultyFilter: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={filters.categoryFilter}
                  onChange={(e) => setFilters({...filters, categoryFilter: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Technology">Technology</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Programs Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Horizontal Scroll Container */}
          <div className="flex overflow-x-auto space-x-6 pb-6 scrollbar-hide">
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program?._id || index}
                variants={cardVariants}
                className="flex-shrink-0 w-96 bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-2 group"
              >
                {/* Program Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={program?.image}
                    alt={program?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(program?.status)}`}>
                      {getStatusText(program?.status)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(program?.difficulty)}`}>
                      {program?.difficulty?.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-primary-500 w-4 h-4" />
                      <span className="text-sm font-semibold text-gray-900">{program?.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Program Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-semibold">
                      {program?.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <FaStar className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-900">{program?.rating}</span>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{program?.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program?.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Enrollment Progress</span>
                      <span>{program?.participants || 0}/{program?.maxParticipants || 1}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(program?.participants, program?.maxParticipants)}%` }}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {program?.tags?.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">{program?.price}</span>
                    <button className="inline-flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-xl hover:bg-primary-600 transition-colors duration-200 font-semibold">
                      <span>Enroll Now</span>
                      <FaArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <button className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-semibold">
                Load More Programs
                <FaArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && filteredPrograms.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaGraduationCap className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default PremiumProgramsSection; 