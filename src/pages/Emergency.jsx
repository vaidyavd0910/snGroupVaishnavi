import React, { useState, useEffect } from 'react';
import { FaPhone, FaMapMarkerAlt, FaClock, FaUserPlus, FaExclamationTriangle, FaEye, FaStar, FaShare, FaShieldAlt, FaMedal, FaUserCheck, FaCamera, FaDownload, FaEdit, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Emergency.css';

const Emergency = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [detailsForm, setDetailsForm] = useState({
    name: '',
    contact: '',
    region: ''
  });
  const [filters, setFilters] = useState({
    district: '',
    taluka: '',
    pincode: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    services: [],
    location: '',
    availability: '24x7',
    district: '',
    taluka: '',
    pincode: '',
    work: '',
    secondaryMobileNumber: '',
    passportPhoto: null,
    idCard: null,
    educationalCertificate: null,
    experienceDocument: null,
    isGovernmentEmployee: false,
    experience: '',
    specializations: []
  });

  const [customService, setCustomService] = useState('');

  // Maharashtra Districts and Talukas Data
  const maharashtraData = {
    "Ahmednagar": ["Akole", "Jamkhed", "Karjat", "Kopargaon", "Nagar", "Nevasa", "Parner", "Pathardi", "Rahata", "Rahuri", "Sangamner", "Shevgaon", "Shrigonda", "Shrirampur"],
    "Akola": ["Akola", "Balapur", "Barshitakli", "Murtizapur", "Patur", "Telhara"],
    "Amravati": ["Amravati", "Anjangaon Surji", "Achalpur", "Chandur Bazar", "Chandur Railway", "Daryapur", "Dhamangaon Railway", "Morshi", "Nandgaon Khandeshwar", "Teosa", "Warud"],
    "Aurangabad": ["Aurangabad", "Vaijapur", "Gangapur", "Kannad", "Khuldabad", "Paithan", "Phulambri", "Sillod", "Soegaon"],
    "Beed": ["Ambejogai", "Ashti", "Beed", "Dharur", "Georai", "Kaij", "Majalgaon", "Parli", "Patoda", "Shirur (Kasar)", "Wadwani"],
    "Bhandara": ["Bhandara", "Lakhandur", "Mohadi", "Pauni", "Sakoli", "Tumsar"],
    "Buldhana": ["Buldhana", "Chikhli", "Deulgaon Raja", "Jalgaon Jamod", "Khamgaon", "Lonar", "Malkapur", "Mehkar", "Motala", "Nandura", "Sangrampur", "Shegaon"],
    "Chandrapur": ["Ballarpur", "Bhadravati", "Brahmapuri", "Chandrapur", "Chimur", "Gondpipri", "Jiwati", "Korpana", "Mul", "Nagbhid", "Pombhurna", "Rajura", "Saoli", "Sindewahi", "Warora"],
    "Dhule": ["Dhule", "Sakri", "Shirpur", "Shindkheda"],
    "Gadchiroli": ["Aheri", "Armori", "Bhamragad", "Chamorshi", "Dhanora", "Etapalli", "Gadchiroli", "Kurkheda", "Mulchera", "Sironcha"],
    "Gondia": ["Amgaon", "Arjuni Morgaon", "Deori", "Gondia", "Goregaon", "Sadak Arjuni", "Salekasa", "Tirora"],
    "Hingoli": ["Aundha Nagnath", "Basmath", "Hingoli", "Kalamnuri", "Sengaon"],
    "Jalgaon": ["Amalner", "Bhadgaon", "Bhusawal", "Bodwad", "Chalisgaon", "Chopda", "Dharangaon", "Erandol", "Jalgaon", "Jamner", "Muktainagar", "Pachora", "Parola", "Raver", "Yawal"],
    "Jalna": ["Ambad", "Badnapur", "Bhokardan", "Ghansawangi", "Jafrabad", "Jalna", "Mantha", "Partur"],
    "Kolhapur": ["Ajara", "Bhudargad", "Chandgad", "Gadhinglaj", "Hatkanangale", "Kagal", "Karvir", "Panhala", "Radhanagari", "Shahuwadi", "Shirol"],
    "Latur": ["Ahmadpur", "Ausa", "Chakur", "Deoni", "Jalkot", "Latur", "Nilanga", "Renapur", "Shirur Anantpal", "Udgir"],
    "Mumbai City": ["Mumbai City"],
    "Mumbai Suburban": ["Kurla", "Andheri", "Borivali"],
    "Nagpur": ["Hingna", "Kamptee", "Katol", "Nagpur (Rural)", "Nagpur (Urban)", "Narkhed", "Parseoni", "Ramtek", "Saoner", "Umred"],
    "Nanded": ["Ardhapur", "Bhokar", "Biloli", "Deglur", "Dharmabad", "Hadgaon", "Himayatnagar", "Kandhar", "Kinwat", "Loha", "Mahur", "Mudkhed", "Mukhed", "Naigaon", "Nanded"],
    "Nandurbar": ["Akkalkuwa", "Akrani", "Nandurbar", "Navapur", "Shahada", "Taloda"],
    "Nashik": ["Baglan", "Chandwad", "Deola", "Dindori", "Igatpuri", "Malegaon", "Nandgaon", "Nashik", "Niphad", "Peint", "Sinnar", "Trimbak", "Yeola"],
    "Osmanabad": ["Bhoom", "Kalamb", "Lohara", "Omerga", "Osmanabad", "Paranda", "Tuljapur", "Washi"],
    "Palghar": ["Dahanu", "Jawhar", "Mokhada", "Palghar", "Talasari", "Vasai", "Vikramgad", "Wada"],
    "Parbhani": ["Gangakhed", "Jintur", "Manwath", "Palam", "Parbhani", "Pathri", "Purna", "Sailu", "Sonpeth"],
    "Pune": ["Ambegaon", "Baramati", "Bhor", "Daund", "Haveli", "Indapur", "Junnar", "Khed", "Mawal", "Mulshi", "Pune City", "Purandar", "Shirur", "Velhe"],
    "Raigad": ["Alibag", "Karjat", "Khalapur", "Mahad", "Mangaon", "Mhasala", "Murud", "Panvel", "Pen", "Poladpur", "Roha", "Shrivardhan", "Sudhagad", "Tala", "Uran"],
    "Ratnagiri": ["Chiplun", "Dapoli", "Guhagar", "Khed", "Lanja", "Mandangad", "Ratnagiri", "Rajapur", "Sangameshwar"],
    "Sangli": ["Atpadi", "Jat", "Kadegaon", "Kavathe Mahankal", "Khanapur", "Miraj", "Palus", "Shirala", "Tasgaon", "Walwa"],
    "Satara": ["Jaoli", "Karad", "Khatav", "Koregaon", "Mahabaleshwar", "Man", "Patan", "Phaltan", "Satara", "Wai"],
    "Sindhudurg": ["Devgad", "Dodamarg", "Kankavli", "Kudal", "Malvan", "Sawantwadi", "Vaibhavwadi", "Vengurla"],
    "Solapur": ["Akkalkot", "Barshi", "Karmala", "Madha", "Malshiras", "Mangalwedha", "Mohol", "Pandharpur", "Sangole", "Solapur North", "Solapur South"],
    "Thane": ["Ambernath", "Bhiwandi", "Kalyan", "Murbad", "Shahapur", "Thane", "Ulhasnagar"],
    "Wardha": ["Arvi", "Ashti", "Deoli", "Hinganghat", "Karanja", "Samudrapur", "Seloo", "Wardha"],
    "Washim": ["Karanja", "Mangrulpir", "Malegaon", "Manora", "Risod", "Washim"],
    "Yavatmal": ["Arni", "Babhulgaon", "Darwha", "Digras", "Ghatanji", "Kalamb", "Kelapur", "Mahagaon", "Maregaon", "Ner", "Pandharkawda", "Pusad", "Ralegaon", "Umarkhed", "Wani", "Yavatmal"]
  };

  const availableServices = [
    { key: 'snake_rescue', label: 'Snake Rescue' },
    { key: 'animal_rescue', label: 'Animal Rescue' },
    { key: 'medical_emergency', label: 'Medical Emergency' },
    { key: 'fire_emergency', label: 'Fire Emergency' },
    { key: 'road_accident', label: 'Road Accident' },
    { key: 'natural_disaster', label: 'Natural Disaster' },
    { key: 'child_rescue', label: 'Child Rescue' },
    { key: 'elderly_help', label: 'Elderly Help' },
    { key: 'women_safety', label: 'Women Safety' },
    { key: 'mental_health', label: 'Mental Health' },
    { key: 'blood_donation', label: 'Blood Donation' },
    { key: 'ambulance_service', label: 'Ambulance Service' },
    { key: 'police_help', label: 'Police Help' },
    { key: 'fire_brigade', label: 'Fire Brigade' },
    { key: 'other', label: 'Other' }
  ];

  const availabilityOptions = [
    { key: '24x7', label: '24x7 Available' },
    { key: 'day_time', label: 'Day Time Only' },
    { key: 'night_time', label: 'Night Time Only' },
    { key: 'weekends', label: 'Weekends Only' },
    { key: 'on_call', label: 'On Call Basis' }
  ];

  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/emergency-contacts/public');
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleServiceChange = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleAddCustomService = () => {
    if (customService.trim() && !formData.services.includes(customService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, customService.trim()]
      }));
      setCustomService('');
    }
  };

  const handleRemoveCustomService = (serviceToRemove) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(service => service !== serviceToRemove)
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDistrictChange = (e) => {
    const { value } = e.target;
    setFilters(prev => ({
      ...prev,
      district: value,
      taluka: '' // Reset taluka when district changes
    }));
  };

  const handleFormDistrictChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      district: value,
      taluka: '' // Reset taluka when district changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (['passportPhoto', 'idCard', 'educationalCertificate', 'experienceDocument'].includes(key)) {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else if (key === 'services' || key === 'specializations') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await api.post('/emergency-contacts/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        setRegistrationSuccess(true);
        setFormData({
          name: '',
          email: '',
          mobileNumber: '',
          services: [],
          location: '',
          availability: '24x7',
          district: '',
          taluka: '',
          pincode: '',
          work: '',
          secondaryMobileNumber: '',
          passportPhoto: null,
          idCard: null,
          educationalCertificate: null,
          experienceDocument: null,
          isGovernmentEmployee: false,
          experience: '',
          specializations: []
        });
        setShowRegistrationForm(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowDetails = (contact) => {
    setSelectedContact(contact);
    setShowDetailsForm(true);
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit enquiry to database
      const enquiryData = {
        enquirerName: detailsForm.name,
        enquirerContact: detailsForm.contact,
        enquirerRegion: detailsForm.region,
        aryaMitraId: selectedContact._id
      };

      const response = await api.post('/arya-mitra-enquiries/submit', enquiryData);
      
      if (response.data.success) {
        // Update the contacts array to show full details for this contact
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact._id === selectedContact._id 
              ? { ...contact, showFullDetails: true }
              : contact
          )
        );
        
        // Close the form modal
        setShowDetailsForm(false);
        setSelectedContact(null);
        setDetailsForm({ name: '', contact: '', region: '' });
        
        // Show success message
        alert('Enquiry submitted successfully! You can now view the full contact details.');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit enquiry. Please try again.');
    }
  };

  const handleShare = async (contact) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `SN Arya Mitra - ${contact.name}`,
          text: `Contact ${contact.name} for emergency services in ${contact.location}`,
          url: window.location.href
        });
      } else {
        // Fallback to copying to clipboard
        const text = `SN Arya Mitra: ${contact.name}\nLocation: ${contact.location}\nServices: ${contact.services.join(', ')}`;
        await navigator.clipboard.writeText(text);
        alert('Contact information copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRating = async (contact, rating) => {
    try {
      await api.post(`/emergency-contacts/${contact._id}/rate`, { rating });
      // Refresh contacts to get updated ratings
      fetchContacts();
    } catch (error) {
      console.error('Error rating contact:', error);
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'government_verified':
        return <FaShieldAlt className="badge-icon government" title="Government Verified" />;
      case 'sn_arya_mitra':
        return <FaMedal className="badge-icon verified" title="SN Arya Mitra Verified" />;
      default:
        return <FaUserCheck className="badge-icon unverified" title="Unverified" />;
    }
  };

  const getBadgeLabel = (badge) => {
    switch (badge) {
      case 'government_verified':
        return 'Government Verified';
      case 'sn_arya_mitra':
        return 'SN Arya Mitra';
      default:
        return 'Unverified';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    // Filter by service
    if (selectedService !== 'all' && !contact.services.includes(selectedService)) {
      return false;
    }
    
    // Filter by district
    if (filters.district && contact.district !== filters.district) {
      return false;
    }
    
    // Filter by taluka
    if (filters.taluka && contact.taluka !== filters.taluka) {
      return false;
    }
    
    // Filter by pincode
    if (filters.pincode && contact.pincode !== filters.pincode) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="emergency-container">
        <div className="loading">Loading SN Arya Mitras...</div>
      </div>
    );
  }

  return (
    <div className="emergency-container">
      <div className="emergency-header">
        <div className="emergency-hero">
          <FaShieldAlt className="emergency-icon" />
          <h1>SN Arya Mitra</h1>
          <p>Connect with verified emergency responders and volunteers ready to help in times of need.</p>
        </div>
        
        <div className="emergency-actions">
          <button 
            className="register-btn"
            onClick={() => setShowRegistrationForm(true)}
          >
            <FaUserPlus /> Register as SN Arya Mitra
          </button>
        </div>
      </div>

      {registrationSuccess && (
        <div className="success-message">
          <h3>Registration Submitted Successfully!</h3>
          <p>Thank you for registering as an SN Arya Mitra. You are now automatically logged in. We will review your application and notify you via email.</p>
          <button onClick={() => setRegistrationSuccess(false)}>Close</button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')}>Close</button>
        </div>
      )}

      <div className="emergency-content">
        <div className="filter-section">
          <div className="filter-group">
            <label>Service:</label>
            <select 
              value={selectedService} 
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="all">All Services</option>
              {availableServices.map(service => (
                <option key={service.key} value={service.key}>
                  {service.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>District:</label>
            <select 
              name="district"
              value={filters.district} 
              onChange={handleDistrictChange}
            >
              <option value="">All Districts</option>
              {Object.keys(maharashtraData).map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Taluka:</label>
            <select 
              name="taluka"
              value={filters.taluka} 
              onChange={handleFilterChange}
            >
              <option value="">All Talukas</option>
              {filters.district && maharashtraData[filters.district] ? (
                maharashtraData[filters.district].map(taluka => (
                  <option key={taluka} value={taluka}>
                    {taluka}
                  </option>
                ))
              ) : (
                <option value="">Select a district first</option>
              )}
            </select>
          </div>

          <div className="filter-group">
            <label>Pincode:</label>
            <input
              type="text"
              name="pincode"
              value={filters.pincode}
              onChange={handleFilterChange}
              placeholder="Enter pincode"
              maxLength="6"
            />
          </div>
        </div>

        <div className="contacts-grid">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact, index) => (
              <div key={index} className="contact-card">
                <div className="contact-header">
                  <div className="contact-photo">
                    {contact.passportPhoto ? (
                      <img src={contact.passportPhoto} alt={contact.name} />
                    ) : (
                      <div className="photo-placeholder">
                        <FaCamera />
                      </div>
                    )}
                  </div>
                  <div className="contact-info-main">
                    <h3>{contact.name}</h3>
                    <div className="badge-section">
                      {getBadgeIcon(contact.badge)}
                      <span className="badge-label">{getBadgeLabel(contact.badge)}</span>
                    </div>
                    <div className="rescue-count">
                      <FaHeart className="rescue-icon" />
                      <span>{contact.rescueCount || 0} Rescues</span>
                    </div>
                    <div className="rating-section">
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map(star => (
                          <FaStar
                            key={star}
                            className={`star ${star <= (contact.rating || 0) ? 'filled' : ''}`}
                            onClick={() => handleRating(contact, star)}
                          />
                        ))}
                      </div>
                      <span className="rating-text">({contact.rating || 0}/5)</span>
                    </div>
                  </div>
                </div>
                
                <div className="contact-services">
                  {contact.services.map((service, idx) => {
                    const serviceInfo = availableServices.find(s => s.key === service);
                    return (
                      <span key={idx} className="service-tag">
                        {serviceInfo ? serviceInfo.label : service}
                      </span>
                    );
                  })}
                </div>
                
                <div className="contact-details">
                  <div className="contact-info">
                    <FaMapMarkerAlt className="contact-icon" />
                    <span>{contact.location}</span>
                  </div>
                  
                  <div className="contact-info">
                    <FaClock className="contact-icon" />
                    <span>{contact.availability}</span>
                  </div>

                  {contact.showFullDetails ? (
                    <>
                      <div className="contact-info">
                        <FaPhone className="contact-icon" />
                        <a href={`tel:${contact.mobileNumber}`} className="contact-link">
                          {contact.mobileNumber}
                        </a>
                      </div>
                      {contact.secondaryMobileNumber && (
                        <div className="contact-info">
                          <FaPhone className="contact-icon" />
                          <a href={`tel:${contact.secondaryMobileNumber}`} className="contact-link">
                            {contact.secondaryMobileNumber} (Secondary)
                          </a>
                        </div>
                      )}
                      <div className="contact-info">
                        <span className="contact-label">Work:</span>
                        <span>{contact.work}</span>
                      </div>
                      <div className="contact-info">
                        <span className="contact-label">Experience:</span>
                        <span>{contact.experience || 'Not specified'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="contact-info">
                      <span className="contact-label">Phone:</span>
                      <span className="hidden-phone">••••••••••</span>
                    </div>
                  )}
                </div>
                
                <div className="contact-actions">
                  {!contact.showFullDetails ? (
                    <button 
                      className="show-details-btn"
                      onClick={() => handleShowDetails(contact)}
                    >
                      <FaEye /> Show Details
                    </button>
                  ) : (
                    <button 
                      className="view-details-btn"
                      onClick={() => navigate(`/emergency/${contact._id}`)}
                    >
                      <FaEye /> View Full Profile
                    </button>
                  )}
                  <button 
                    className="share-btn"
                    onClick={() => handleShare(contact)}
                  >
                    <FaShare /> Share
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-contacts">
              <p>No SN Arya Mitras found for the selected criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Show Details Form Modal */}
      {showDetailsForm && (
        <div className="registration-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Show Contact Details</h2>
              <button 
                className="close-btn"
                onClick={() => setShowDetailsForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleDetailsSubmit} className="registration-form">
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={detailsForm.name}
                  onChange={(e) => setDetailsForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Your Contact Number *</label>
                <input
                  type="tel"
                  name="contact"
                  value={detailsForm.contact}
                  onChange={(e) => setDetailsForm(prev => ({ ...prev, contact: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Your Region *</label>
                <input
                  type="text"
                  name="region"
                  value={detailsForm.region}
                  onChange={(e) => setDetailsForm(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="City, District"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                >
                  Show Details
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowDetailsForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRegistrationForm && (
        <div className="registration-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Register as SN Arya Mitra</h2>
              <button 
                className="close-btn"
                onClick={() => setShowRegistrationForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>District *</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleFormDistrictChange}
                    required
                  >
                    <option value="">Select District</option>
                    {Object.keys(maharashtraData).map(district => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Taluka *</label>
                  <select
                    name="taluka"
                    value={formData.taluka}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Taluka</option>
                    {formData.district && maharashtraData[formData.district] ? (
                      maharashtraData[formData.district].map(taluka => (
                        <option key={taluka} value={taluka}>
                          {taluka}
                        </option>
                      ))
                    ) : (
                      <option value="">Select a district first</option>
                    )}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit pincode"
                    pattern="[0-9]{6}"
                    maxLength="6"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Work/Profession *</label>
                  <input
                    type="text"
                    name="work"
                    value={formData.work}
                    onChange={handleInputChange}
                    placeholder="Your profession/work"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Secondary Mobile Number</label>
                  <input
                    type="tel"
                    name="secondaryMobileNumber"
                    value={formData.secondaryMobileNumber}
                    onChange={handleInputChange}
                    placeholder="Optional secondary number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Experience (Years) *</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Years of experience in emergency services"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isGovernmentEmployee"
                    checked={formData.isGovernmentEmployee}
                    onChange={handleInputChange}
                  />
                  I am a government employee
                </label>
              </div>
              
              <div className="form-group">
                <label>Passport Photo *</label>
                <input
                  type="file"
                  name="passportPhoto"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, passportPhoto: e.target.files[0] }))}
                  required
                />
                <small>This photo will be displayed on your identity card</small>
              </div>

              <div className="form-group">
                <label>ID Card</label>
                <input
                  type="file"
                  name="idCard"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData(prev => ({ ...prev, idCard: e.target.files[0] }))}
                />
                <small>Upload your government ID card for verification</small>
              </div>

              <div className="form-group">
                <label>Educational Certificate</label>
                <input
                  type="file"
                  name="educationalCertificate"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData(prev => ({ ...prev, educationalCertificate: e.target.files[0] }))}
                />
                <small>Upload relevant educational certificates</small>
              </div>

              <div className="form-group">
                <label>Experience Document</label>
                <input
                  type="file"
                  name="experienceDocument"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData(prev => ({ ...prev, experienceDocument: e.target.files[0] }))}
                />
                <small>Upload documents proving your experience</small>
              </div>
              
              <div className="form-group">
                <label>Services You Can Provide *</label>
                
                {/* Custom Service Input */}
                <div className="custom-service-section">
                  <div className="custom-service-input">
                    <input
                      type="text"
                      value={customService}
                      onChange={(e) => setCustomService(e.target.value)}
                      placeholder="Add your own service..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomService()}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomService}
                      className="add-custom-service-btn"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Selected Custom Services */}
                {formData.services.filter(service => !availableServices.find(s => s.key === service)).length > 0 && (
                  <div className="custom-services-display">
                    <label>Your Custom Services:</label>
                    <div className="custom-services-list">
                      {formData.services
                        .filter(service => !availableServices.find(s => s.key === service))
                        .map((service, index) => (
                          <div key={index} className="custom-service-tag">
                            <span>{service}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomService(service)}
                              className="remove-custom-service"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Predefined Services */}
                <div className="services-grid">
                  {availableServices.map(service => (
                    <label key={service.key} className="service-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.key)}
                        onChange={() => handleServiceChange(service.key)}
                      />
                      <div className="permission-content">
                        <div className="permission-title">{service.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Availability *</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  required
                >
                  {availabilityOptions.map(option => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Registration'
                  )}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowRegistrationForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emergency;