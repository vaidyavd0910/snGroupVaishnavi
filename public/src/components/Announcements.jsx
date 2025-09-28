import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaExternalLinkAlt } from 'react-icons/fa';
import api from '../utils/api';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/important-updates/public');
      
      if (response.data.success) {
        setAnnouncements(response.data.updates);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className=" mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-600">Loading announcements...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show error on homepage, just don't display announcements
  }

  if (announcements.length === 0) {
    return null; // Don't show anything if no announcements
  }

  return (
    <div className="py-8 bg-gradient-to-r from-primary-50 to-secondary-50">
      <div className=" mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaBullhorn className="w-6 h-6 text-primary-500 mr-3" />
              Important Announcements
            </h2>
            <div className="flex items-center space-x-2 text-primary-600">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div 
                key={announcement._id} 
                className="border border-gray-200 rounded-xl p-4 hover:shadow-medium transition-all duration-200 hover:border-primary-200"
              >
                <div className="flex items-start space-x-4">
                  {announcement.imageUrl && announcement.imageUrl.trim() !== '' && (
                    <div className="flex-shrink-0">
                      <img 
                        src={announcement.imageUrl} 
                        alt={announcement.title}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {announcement.link ? (
                          <a 
                            href={announcement.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-200 flex items-center group"
                          >
                            {announcement.title}
                            <FaExternalLinkAlt className="ml-2 w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" />
                          </a>
                        ) : (
                          <h3 className="text-lg font-semibold text-gray-900">
                            {announcement.title}
                          </h3>
                        )}
                        
                        {announcement.description && (
                          <p className="text-gray-600 mt-2 leading-relaxed">
                            {announcement.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0 ml-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          New
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <span>
                        {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {announcements.length} announcement{announcements.length !== 1 ? 's' : ''} available
              </p>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                View All Updates →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements; 