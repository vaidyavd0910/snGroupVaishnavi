import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaPlus, FaTrash, FaInfoCircle, FaEdit } from 'react-icons/fa';
import api from '../../utils/api';
import EmergencyContactEditModal from './EmergencyContactEditModal';
import './EmergencyContactManagement.css';

const EmergencyContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewContact, setViewContact] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    service: '',
    location: '',
    district: '',
    taluka: '',
    pincode: '',
    active: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    services: [],
    location: '',
    availability: '24x7',
    notes: '',
    district: '',
    taluka: '',
    pincode: '',
    work: '',
    secondaryMobileNumber: '',
    passportPhoto: null,
    idCard: null,
    educationalCertificate: null,
    experienceDocument: null,
    experience: '',
    isGovernmentEmployee: false,
    specializations: [],
    badge: 'unverified',
    rescueCount: 0,
    rating: 0,
    totalRatings: 0,
    active: true
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

  useEffect(() => {
    fetchContacts();
  }, [filters]);

  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.service) params.append('service', filters.service);
      if (filters.location) params.append('location', filters.location);
      if (filters.district) params.append('district', filters.district);
      if (filters.taluka) params.append('taluka', filters.taluka);
      if (filters.pincode) params.append('pincode', filters.pincode);
      if (filters.active) params.append('active', filters.active);

      const response = await api.get(`/emergency-contacts/admin?${params}`);
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      setError('Failed to fetch emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    if (customService.trim()) {
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
      services: prev.services.filter(s => s !== serviceToRemove)
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
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'passportPhoto') {
          if (formData.passportPhoto) {
            formDataToSend.append(key, formData.passportPhoto);
          }
        } else if (key === 'services') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await api.post('/emergency-contacts/admin/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowAddForm(false);
      setFormData({
        name: '',
        email: '',
        mobileNumber: '',
        services: [],
        location: '',
        availability: '24x7',
        notes: '',
        district: '',
        taluka: '',
        pincode: '',
        work: '',
        secondaryMobileNumber: '',
        passportPhoto: null,
        idCard: null,
        educationalCertificate: null,
        experienceDocument: null,
        experience: '',
        isGovernmentEmployee: false,
        specializations: [],
        badge: 'unverified',
        rescueCount: 0,
        rating: 0,
        totalRatings: 0,
        active: true
      });
      fetchContacts();
    } catch (error) {
      setError('Failed to add emergency contact');
    }
  };

  const handleApprove = async (contactId) => {
    try {
      await api.put(`/emergency-contacts/admin/approve/${contactId}`);
      fetchContacts();
    } catch (error) {
      setError('Failed to approve contact');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    try {
      await api.put(`/emergency-contacts/admin/reject/${selectedContact._id}`, {
        rejectionReason
      });
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      setError('Failed to reject contact');
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await api.delete(`/emergency-contacts/admin/${contactId}`);
        fetchContacts();
      } catch (error) {
        setError('Failed to delete contact');
      }
    }
  };

  const handleEditContact = (contact) => {
    setEditContact(contact);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditContact(null);
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      await api.put(`/emergency-contacts/admin/${editContact._id}`, updatedData);
      alert('SN Arya Mitra updated successfully!');
      setShowEditModal(false);
      setEditContact(null);
      fetchContacts();
    } catch (error) {
      setError('Failed to update SN Arya Mitra');
      alert('Failed to update SN Arya Mitra. Please try again.');
    }
  };

  const handleBadgeUpdate = async (contactId, newBadge) => {
    try {
      await api.put(`/emergency-contacts/${contactId}/badge`, { badge: newBadge });
      alert('Badge updated successfully!');
      fetchContacts();
    } catch (error) {
      setError('Failed to update badge');
      alert('Failed to update badge. Please try again.');
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: '#ff9800', label: 'Pending' },
      approved: { color: '#4caf50', label: 'Approved' },
      rejected: { color: '#f44336', label: 'Rejected' }
    };
    const config = statusConfig[status] || { color: '#666', label: status };
    
    return (
      <span 
        className="status-badge"
        style={{ backgroundColor: config.color }}
      >
        {config.label}
      </span>
    );
  };

  if (loading) return <div className="loading">Loading SN Arya Mitras...</div>;

  return (
    <div className="emergency-contact-management">
      <div className="management-header">
        <h2>SN Arya Mitra Management</h2>
        <button 
          className="add-button"
          onClick={() => setShowAddForm(true)}
        >
          <FaPlus /> Add SN Arya Mitra
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')}>Close</button>
        </div>
      )}

      <div className="filters-section">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Service:</label>
          <select 
            name="service" 
            value={filters.service} 
            onChange={handleFilterChange}
          >
            <option value="">All Services</option>
            {availableServices.map(service => (
              <option key={service.key} value={service.key}>
                {service.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Search by location"
          />
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
            {filters.district && maharashtraData[filters.district] && maharashtraData[filters.district].map(taluka => (
              <option key={taluka} value={taluka}>
                {taluka}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Pincode:</label>
          <input
            type="text"
            name="pincode"
            value={filters.pincode}
            onChange={handleFilterChange}
            placeholder="Search by pincode"
          />
        </div>

        <div className="filter-group">
          <label>Active:</label>
          <select 
            name="active" 
            value={filters.active} 
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div className="contacts-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Services</th>
              <th>Location</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact._id}>
                <td>
                  <div className="contact-name">
                    <strong>{contact.name}</strong>
                    {contact.isVerified && (
                      <span className="verified-badge">✓ Verified</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div>{contact.email}</div>
                    <div>{contact.mobileNumber}</div>
                  </div>
                </td>
                <td>
                  <div className="services-list">
                    {contact.services.map((service, idx) => {
                      const serviceInfo = availableServices.find(s => s.key === service);
                      return (
                        <span key={idx} className="service-tag">
                          {serviceInfo ? serviceInfo.label : service}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td>{contact.location}</td>
                <td>{contact.availability}</td>
                <td>{getStatusBadge(contact.status)}</td>
                <td>
                  <div className="action-buttons">
                    {contact.status === 'pending' && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => handleApprove(contact._id)}
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowRejectModal(true);
                          }}
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    <button
                      className="view-btn"
                      onClick={() => {
                        setViewContact(contact);
                        setShowViewModal(true);
                      }}
                      title="View Details"
                    >
                      <FaInfoCircle />
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditContact(contact);
                        setShowEditModal(true);
                      }}
                      title="Edit Contact"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(contact._id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Emergency Contact</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="add-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
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
              </div>
              
              <div className="form-row">
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
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Services *</label>
                
                {/* Custom Service Input */}
                <div className="custom-service-section">
                  <div className="custom-service-input">
                    <input
                      type="text"
                      value={customService}
                      onChange={(e) => setCustomService(e.target.value)}
                      placeholder="Add custom service..."
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
                    <label>Custom Services:</label>
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
                      <span>{service.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Availability *</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="24x7">24x7 Available</option>
                    <option value="day_time">Day Time Only</option>
                    <option value="night_time">Night Time Only</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="on_call">On Call Basis</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
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
                    {formData.district && maharashtraData[formData.district] && maharashtraData[formData.district].map(taluka => (
                      <option key={taluka} value={taluka}>
                        {taluka}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Work *</label>
                  <input
                    type="text"
                    name="work"
                    value={formData.work}
                    onChange={handleInputChange}
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
                  />
                </div>
                <div className="form-group">
                  <label>Passport Photo</label>
                  <input
                    type="file"
                    name="passportPhoto"
                    accept="image/*"
                    onChange={(e) => setFormData(prev => ({ ...prev, passportPhoto: e.target.files[0] }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Active</label>
                <select
                  name="active"
                  value={formData.active ? 'true' : 'false'}
                  onChange={handleInputChange}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Add Contact
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Reject Application</h3>
              <button 
                className="close-btn"
                onClick={() => setShowRejectModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="reject-form">
              <p><strong>Contact:</strong> {selectedContact?.name}</p>
              <p><strong>Email:</strong> {selectedContact?.email}</p>
              
              <div className="form-group">
                <label>Rejection Reason *</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  rows="4"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button 
                  onClick={handleReject}
                  className="reject-btn"
                  disabled={!rejectionReason.trim()}
                >
                  Reject Application
                </button>
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Contact Modal */}
      {showViewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Contact Details</h3>
              <button 
                className="close-btn"
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="view-contact-details">
              <h4>{viewContact?.name}</h4>
              
              <div className="contact-info-section">
                <h5>Basic Information</h5>
                <p><strong>Email:</strong> {viewContact?.email}</p>
                <p><strong>Mobile Number:</strong> {viewContact?.mobileNumber}</p>
                <p><strong>Secondary Mobile:</strong> {viewContact?.secondaryMobileNumber || 'Not provided'}</p>
                <p><strong>Work:</strong> {viewContact?.work || 'Not provided'}</p>
              </div>

              <div className="contact-info-section">
                <h5>Location Details</h5>
                <p><strong>Location:</strong> {viewContact?.location}</p>
                <p><strong>District:</strong> {viewContact?.district}</p>
                <p><strong>Taluka:</strong> {viewContact?.taluka}</p>
                <p><strong>Pincode:</strong> {viewContact?.pincode}</p>
              </div>

              <div className="contact-info-section">
                <h5>Services & Availability</h5>
                <p><strong>Services:</strong></p>
                <div className="services-display">
                  {viewContact?.services?.map((service, idx) => {
                    const serviceInfo = availableServices.find(s => s.key === service);
                    return (
                      <span key={idx} className="service-tag">
                        {serviceInfo ? serviceInfo.label : service}
                      </span>
                    );
                  })}
                </div>
                <p><strong>Availability:</strong> {viewContact?.availability}</p>
              </div>

              <div className="contact-info-section">
                <h5>Status & Verification</h5>
                <p><strong>Status:</strong> {getStatusBadge(viewContact?.status)}</p>
                <p><strong>Active:</strong> {viewContact?.active ? 'Yes' : 'No'}</p>
                <p><strong>Verified:</strong> {viewContact?.isVerified ? 'Yes' : 'No'}</p>
                {viewContact?.rejectionReason && (
                  <p><strong>Rejection Reason:</strong> {viewContact?.rejectionReason}</p>
                )}
              </div>

              {viewContact?.passportPhoto && (
                <div className="contact-info-section">
                  <h5>Passport Photo</h5>
                  <div className="passport-photo">
                    <img 
                      src={viewContact.passportPhoto} 
                      alt="Passport Photo" 
                      style={{ maxWidth: '200px', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              )}

              {viewContact?.notes && (
                <div className="contact-info-section">
                  <h5>Notes</h5>
                  <p>{viewContact.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      <EmergencyContactEditModal
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        contact={editContact}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default EmergencyContactManagement; 