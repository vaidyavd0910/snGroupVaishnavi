import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { FaHandHoldingHeart, FaSearch, FaFilter, FaArrowRight, FaUsers, FaTarget, FaCalendarAlt, FaHeart } from 'react-icons/fa';
import api from '../utils/api';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PremiumCampaignsSection = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    statusFilter: 'all',
    goalTypeFilter: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [campaigns, filters, searchTerm]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/donations');
      // Handle success/data structure
      const campaignsData = response?.data?.success ? response?.data?.data : response?.data || [];
      setCampaigns(campaignsData);
      setFilteredCampaigns(campaignsData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      // Fallback data for premium experience
      setCampaigns(generatePremiumCampaigns());
      setFilteredCampaigns(generatePremiumCampaigns());
    } finally {
      setLoading(false);
    }
  };

  const generatePremiumCampaigns = () => {
    return [
      {
        _id: '1',
        title: 'Education for Every Child',
        description: 'Help us provide quality education to underprivileged children across rural India.',
        goalAmount: 500000,
        raisedAmount: 375000,
        status: 'active',
        goalType: 'education',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        donors: 1247,
        daysLeft: 15,
        category: 'Education',
        tags: ['Education', 'Children', 'Rural Development']
      },
      {
        _id: '2',
        title: 'Clean Water Initiative',
        description: 'Building sustainable water solutions for communities in drought-affected regions.',
        goalAmount: 300000,
        raisedAmount: 280000,
        status: 'active',
        goalType: 'environment',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        donors: 892,
        daysLeft: 8,
        category: 'Environment',
        tags: ['Water', 'Environment', 'Sustainability']
      },
      {
        _id: '3',
        title: 'Healthcare Access for All',
        description: 'Providing essential healthcare services to remote communities.',
        goalAmount: 750000,
        raisedAmount: 750000,
        status: 'completed',
        goalType: 'healthcare',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        donors: 2156,
        daysLeft: 0,
        category: 'Healthcare',
        tags: ['Healthcare', 'Medical', 'Community']
      },
      {
        _id: '4',
        title: 'Women Empowerment Program',
        description: 'Supporting women entrepreneurs and skill development initiatives.',
        goalAmount: 400000,
        raisedAmount: 125000,
        status: 'active',
        goalType: 'social',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        donors: 456,
        daysLeft: 45,
        category: 'Social',
        tags: ['Women', 'Empowerment', 'Entrepreneurship']
      },
      {
        _id: '5',
        title: 'Disaster Relief Fund',
        description: 'Emergency relief support for communities affected by natural disasters.',
        goalAmount: 600000,
        raisedAmount: 320000,
        status: 'active',
        goalType: 'emergency',
        image: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        donors: 1789,
        daysLeft: 22,
        category: 'Emergency',
        tags: ['Disaster', 'Relief', 'Emergency']
      }
    ];
  };

  const applyFilters = () => {
    let filtered = [...campaigns]; // ✅ avoid mutating state

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign?.tags?.some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign?.status === filters.statusFilter);
    }

    // Goal type filter
    if (filters.goalTypeFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign?.goalType === filters.goalTypeFilter);
    }

    setFilteredCampaigns(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'ACTIVE';
      case 'completed': return 'COMPLETED';
      case 'closed': return 'CLOSED';
      default: return 'UNKNOWN';
    }
  };

  const getGoalTypeColor = (goalType) => {
    switch (goalType) {
      case 'education': return 'bg-blue-100 text-blue-800';
      case 'healthcare': return 'bg-red-100 text-red-800';
      case 'environment': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (raised, goal) => {
    return Math.min(Math.round(((raised || 0) / (goal || 1)) * 100), 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // ✅ Slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: Math.min(4, filteredCampaigns.length || 1), // prevent issue when campaigns < 4
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: Math.min(3, filteredCampaigns.length || 1) } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(2, filteredCampaigns.length || 1) } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ]
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-6 lg:mb-0">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Premium Campaigns</h3>
          <p className="text-gray-600">Make a difference through impactful social initiatives</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative flex">
            <FaSearch className="relative right-1 top-4 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Campaigns..."
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
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={filters.statusFilter}
                onChange={(e) => setFilters({...filters, statusFilter: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Goal Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Type</label>
              <select
                value={filters.goalTypeFilter}
                onChange={(e) => setFilters({...filters, goalTypeFilter: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="environment">Environment</option>
                <option value="social">Social</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Slider */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <div className="w-full">
          <Slider {...sliderSettings}>
            {filteredCampaigns.map((campaign, index) => (
              <div key={campaign?._id || index} className="px-3">
                <div className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-2">
                  {/* Campaign Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={campaign?.image}
                      alt={campaign?.title}
                      onError={(e) => (e.currentTarget.src = '/fallback.jpg')}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign?.status)}`}>
                        {getStatusText(campaign?.status)}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getGoalTypeColor(campaign?.goalType)}`}>
                        {campaign?.category?.toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-primary-500 w-4 h-4" />
                        <span className="text-sm font-semibold text-gray-900">
                          {campaign?.daysLeft || 0} days left
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Content */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{campaign?.title}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign?.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{getProgressPercentage(campaign?.raisedAmount, campaign?.goalAmount)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-primary-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(campaign?.raisedAmount, campaign?.goalAmount)}%` }}
                        />
                      </div>
                    </div>

                    {/* Amount and Donors */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary-500">
                          {formatCurrency(campaign?.raisedAmount)}
                        </div>
                        <div className="text-xs text-gray-500">Raised</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(campaign?.goalAmount)}
                        </div>
                        <div className="text-xs text-gray-500">Goal</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {campaign?.tags?.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {campaign?.tags?.length > 2 && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                          +{campaign?.tags.length - 2} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaUsers className="w-4 h-4" />
                        <span>{campaign?.donors || 0} donors</span>
                      </div>
                      <button className="inline-flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-xl hover:bg-primary-500 transition-colors duration-200 font-semibold">
                        <FaHeart className="w-4 h-4" />
                        <span>Donate Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHandHoldingHeart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default PremiumCampaignsSection;