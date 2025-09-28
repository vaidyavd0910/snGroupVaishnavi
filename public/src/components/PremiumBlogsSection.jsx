import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Link } from 'react-router-dom';
import { FaNewspaper, FaSearch, FaFilter, FaArrowRight, FaEye, FaClock, FaUser } from 'react-icons/fa';
import api from '../utils/api';
import { format } from 'date-fns';

const PremiumBlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categoryFilter: 'all',
    sortBy: 'recent'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [blogs, filters, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blog');
      const blogsData = response?.data?.success ? response?.data?.data : response?.data || [];
      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs(generatePremiumBlogs());
      setFilteredBlogs(generatePremiumBlogs());
    } finally {
      setLoading(false);
    }
  };

  const generatePremiumBlogs = () => [
    {
      _id: '1',
      title: 'The Future of Sustainable Development in India',
      excerpt: 'Exploring innovative approaches to sustainable development and their impact on India\'s growth trajectory.',
      category: 'Sustainability',
      author: 'Dr. Priya Sharma',
      date: new Date('2024-02-15'),
      readTime: '5 min read',
      views: 1247,
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['Sustainability', 'Development', 'India']
    },
    {
      _id: '2',
      title: 'Digital Transformation in Education: A Complete Guide',
      excerpt: 'How technology is revolutionizing education and creating new opportunities for learning.',
      category: 'Technology',
      author: 'Rahul Kumar',
      date: new Date('2024-02-10'),
      readTime: '8 min read',
      views: 2156,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['Technology', 'Education', 'Digital']
    },
    {
      _id: '3',
      title: 'Mental Health Awareness: Breaking the Stigma',
      excerpt: 'Understanding the importance of mental health and how to support those in need.',
      category: 'Health',
      author: 'Dr. Anjali Patel',
      date: new Date('2024-02-05'),
      readTime: '6 min read',
      views: 1893,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['Health', 'Mental Health', 'Awareness']
    },
    {
      _id: '4',
      title: 'Community Building: The Power of Local Networks',
      excerpt: 'How strong community networks can drive social change and create lasting impact.',
      category: 'Community',
      author: 'Meera Singh',
      date: new Date('2024-01-30'),
      readTime: '7 min read',
      views: 1567,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['Community', 'Networks', 'Social Change']
    },
    {
      _id: '5',
      title: 'Community Building: The Power of Local Networks',
      excerpt: 'How strong community networks can drive social change and create lasting impact.',
      category: 'Community',
      author: 'Meera Singh',
      date: new Date('2024-01-30'),
      readTime: '7 min read',
      views: 1567,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      tags: ['Community', 'Networks', 'Social Change']
    }
  ];

  const applyFilters = () => {
    let filtered = [...blogs]; // ✅ avoid mutating state
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog?.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog?.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog?.tags?.some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (filters.categoryFilter !== 'all') {
      filtered = filtered.filter(blog => blog?.category === filters.categoryFilter);
    }
    if (filters.sortBy === 'recent') {
      filtered = filtered.sort((a, b) => new Date(b?.date) - new Date(a?.date));
    } else if (filters.sortBy === 'popular') {
      filtered = filtered.sort((a, b) => (b?.views || 0) - (a?.views || 0));
    }
    setFilteredBlogs(filtered);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Sustainability': 'bg-green-100 text-green-800',
      'Health': 'bg-red-100 text-red-800',
      'Community': 'bg-purple-100 text-purple-800',
      'Education': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-6 lg:mb-0">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Premium Blogs</h3>
          <p className="text-gray-600">Insights, stories, and perspectives that inspire change</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex">
            <FaSearch className="relative right-1 top-4 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
            />
          </div>
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
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={filters.categoryFilter}
                onChange={(e) => setFilters({ ...filters, categoryFilter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Sustainability">Sustainability</option>
                <option value="Health">Health</option>
                <option value="Community">Community</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Blogs Slider */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredBlogs.length > 0 ? (
        <div className="w-full">
          <Swiper
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={20}
            navigation
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {filteredBlogs.map((blog) => (
              <SwiperSlide key={blog._id}>
                <div className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-2 h-[520px] flex flex-col group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      onError={(e) => (e.currentTarget.src = '/fallback.jpg')}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(blog.category)}`}>
                        {blog.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <FaEye className="text-primary-500 w-4 h-4" />
                        <span className="text-sm font-semibold text-gray-900">{blog.views || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaClock className="w-4 h-4 text-primary-500" />
                        <span>{blog.readTime || '5 min read'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaUser className="w-4 h-4 text-primary-500" />
                        <span>{blog.author}</span>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:line-clamp-none group-hover:whitespace-normal" title={blog.title}>{blog.title}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 group-hover:line-clamp-none group-hover:whitespace-normal flex-1" title={blog.excerpt}>{blog.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {blog.tags?.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                      {blog.tags?.length > 2 && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                          +{blog.tags.length - 2} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {format(blog.date || new Date(), 'MMM d, yyyy')}
                      </span>
                      <Link
                        to={`/blog/${blog._id}`}
                        className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-500 font-semibold transition-colors duration-200"
                      >
                        <span>Read More</span>
                        <FaArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaNewspaper className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default PremiumBlogsSection;