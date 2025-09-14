import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaFilter, FaSearch, FaTimes, FaArrowRight, FaGlobe, FaUsers } from 'react-icons/fa';
import api from '../utils/api';
import { format } from 'date-fns';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PremiumEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dateFilter: 'all',
    locationFilter: 'all',
    categoryFilter: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filters, searchTerm]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      const eventsData = response?.data?.success ? response?.data?.data : response?.data || [];
      const eventsWithDates = eventsData.map(event => ({
        ...event,
        date: new Date(event?.date || new Date()),
        status: getEventStatus(event)
      }));
      setEvents(eventsWithDates);
      setFilteredEvents(eventsWithDates);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents(generatePremiumEvents());
      setFilteredEvents(generatePremiumEvents());
    } finally {
      setLoading(false);
    }
  };

  const generatePremiumEvents = () => [
    {
      _id: '1',
      title: 'Global Tech Summit 2024',
      description: 'Join industry leaders for the most innovative tech conference of the year',
      date: new Date('2024-03-15'),
      startTime: '09:00',
      endTime: '18:00',
      location: 'Bangalore, India',
      category: 'online',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'upcoming',
      attendees: 1250,
      price: '₹2,500'
    },
    {
      _id: '2',
      title: 'Sustainable Development Workshop',
      description: 'Learn about sustainable practices and environmental conservation',
      date: new Date('2024-02-28'),
      startTime: '14:00',
      endTime: '17:00',
      location: 'Mumbai, India',
      category: 'offline',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'ongoing',
      attendees: 85,
      price: 'Free'
    },
    {
      _id: '3',
      title: 'Youth Leadership Conference',
      description: 'Empowering young leaders to create positive change in society',
      date: new Date('2024-01-20'),
      startTime: '10:00',
      endTime: '16:00',
      location: 'Delhi, India',
      category: 'offline',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'past',
      attendees: 200,
      price: '₹1,000'
    },
    {
      _id: '4',
      title: 'Youth Leadership Conference',
      description: 'Empowering young leaders to create positive change in society',
      date: new Date('2024-01-20'),
      startTime: '10:00',
      endTime: '16:00',
      location: 'Delhi, India',
      category: 'offline',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'past',
      attendees: 200,
      price: '₹1,000'
    },
    {
      _id: '4',
      title: 'Youth Leadership Conference',
      description: 'Empowering young leaders to create positive change in society',
      date: new Date('2024-01-20'),
      startTime: '10:00',
      endTime: '16:00',
      location: 'Delhi, India',
      category: 'offline',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'past',
      attendees: 200,
      price: '₹1,000'
    }
  ];

  const getEventStatus = (event) => {
    const now = new Date();
    const eventStartTime = new Date(event?.date || new Date());
    if (event?.startTime) {
      const [h, m] = event.startTime.split(':');
      eventStartTime.setHours(parseInt(h), parseInt(m), 0);
    }
    if (now < eventStartTime) return 'upcoming';
    if (now >= eventStartTime && now <= new Date(event?.date || new Date()).setHours(23, 59, 59)) return 'ongoing';
    return 'past';
  };

  const applyFilters = () => {
    let filtered = events;
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event?.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.dateFilter !== 'all') filtered = filtered.filter(event => event?.status === filters.dateFilter);
    if (filters.locationFilter !== 'all') filtered = filtered.filter(event => event?.location?.toLowerCase().includes(filters.locationFilter.toLowerCase()));
    if (filters.categoryFilter !== 'all') filtered = filtered.filter(event => event?.category === filters.categoryFilter);
    setFilteredEvents(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'past': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming': return 'UPCOMING';
      case 'ongoing': return 'ONGOING';
      case 'past': return 'PAST';
      default: return 'UNKNOWN';
    }
  };

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ]
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-6 lg:mb-0">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Premium Events</h3>
          <p className="text-gray-600">Discover world-class events and conferences</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex">
            <FaSearch className="relative right-1 top-4 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <select
                value={filters.dateFilter}
                onChange={(e) => setFilters({ ...filters, dateFilter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="past">Past</option>
              </select>
            </div>
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <select
                value={filters.locationFilter}
                onChange={(e) => setFilters({ ...filters, locationFilter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                <option value="bangalore">Bangalore</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="online">Online</option>
              </select>
            </div>
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={filters.categoryFilter}
                onChange={(e) => setFilters({ ...filters, categoryFilter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Events Slider */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Slider {...sliderSettings}>
          {filteredEvents.map((event) => (
            <div key={event._id} className="px-3">
              <div className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 hover:-translate-y-2 h-[520px] flex flex-col group">
                <div className="relative h-48 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                      {getStatusText(event.status)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-primary-500 w-4 h-4" />
                      <span className="text-sm font-semibold text-gray-900">{format(event.date, "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.category === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                      {event.category === 'online' ? <FaGlobe className="inline w-3 h-3 mr-1" /> : <FaUsers className="inline w-3 h-3 mr-1" />}
                      {event.category.toUpperCase()}
                    </span>
                    <span className="text-lg font-bold text-primary-500">{event.price}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:line-clamp-none group-hover:whitespace-normal" title={event.title}>{event.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 group-hover:line-clamp-none group-hover:whitespace-normal flex-1" title={event.description}>{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-primary-500 w-4 h-4" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt className="text-primary-500 w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaUsers className="text-primary-500 w-4 h-4" />
                      <span>{event.attendees} attendees</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-primary-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary-600 flex items-center justify-center space-x-2"style={{ backgroundColor: '#D14343' }}>
                      <span>Register Now</span>
                      <FaArrowRight className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50">Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default PremiumEventsSection;
