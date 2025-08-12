import React, { useState } from 'react';
import './VolunteerForm.css';
import axios from 'axios';
import api from '../utils/api';

const VolunteerForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    age: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    
    // ID Verification
    idProof: null,
    
    // Volunteering Preferences
    district: '',
    areasOfInterest: [],
    skills: [],
    previousExperience: '',
    
    // Motivation
    motivation: '',
    goals: '',
    
    // Emergency Contact
    emergencyName: '',
    emergencyRelationship: '',
    emergencyContact: ''
  });

  const maharashtraDistricts = [
    'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 
    'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 
    'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 
    'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 
    'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 
    'Thane', 'Wardha', 'Washim', 'Yavatmal','Other'
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File details:', {
        type: file.type,
        size: file.size,
        name: file.name
      });
      
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type.toLowerCase())) {
        setErrors(prev => ({
          ...prev,
          idProof: 'Please upload a valid JPEG, JPG or PNG image'
        }));
        return;
      }
      
      // Create a new File object with explicit MIME type
      const fileWithMimeType = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      
      setFormData(prev => ({
        ...prev,
        idProof: fileWithMimeType
      }));
      
      // Clear error if file is valid
      setErrors(prev => ({
        ...prev,
        idProof: null
      }));
    }
  };

  const handleMultiSelect = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    
    setFormData(prev => ({
      ...prev,
      [name]: values
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch(step) {
      case 1:
        if (!formData.fullName) newErrors.fullName = 'Name is required';
        if (!formData.age || isNaN(formData.age) || Number(formData.age) < 18) {
          newErrors.age = 'Age must be at least 18';
        }
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (!formData.contactNumber) {
          newErrors.contactNumber = 'Contact number is required';
        } else if (!validatePhone(formData.contactNumber)) {
          newErrors.contactNumber = 'Invalid phone number format';
        }
        if (!formData.address) newErrors.address = 'Address is required';
        break;
      case 2:
        if (!formData.idProof) newErrors.idProof = 'ID proof is required';
        break;
      case 3:
        if (!formData.district) newErrors.district = 'District is required';
        if (formData.areasOfInterest.length === 0) newErrors.areasOfInterest = 'Select at least one area';
        break;
      case 4:
        if (!formData.motivation) newErrors.motivation = 'Motivation is required';
        break;
      case 5:
        if (!formData.emergencyName) newErrors.emergencyName = 'Emergency contact name is required';
        if (!formData.emergencyContact) {
          newErrors.emergencyContact = 'Emergency contact number is required';
        } else if (!validatePhone(formData.emergencyContact)) {
          newErrors.emergencyContact = 'Invalid emergency contact number format';
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      try {
        setIsSubmitting(true);
        setSubmitStatus({ type: '', message: '' });

        const formDataToSend = new FormData();
        
        // Handle file separately
        if (formData.idProof) {
          formDataToSend.append('idProof', formData.idProof);
          console.log('Uploading file:', formData.idProof.type); // Debug log
        }

        // Append other form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== 'idProof') { // Skip idProof as it's handled above
            if (Array.isArray(value)) {
              formDataToSend.append(key, JSON.stringify(value));
            } else if (value !== null) {
              formDataToSend.append(key, value);
            }
          }
        });

        const response = await api.post( '/volunteers', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setSubmitStatus({
          type: 'success',
          message: 'Registration submitted successfully! We will contact you soon.'
        });

        // Reset form
        setFormData({
          fullName: '',
          age: '',
          gender: '',
          contactNumber: '',
          email: '',
          address: '',
          idProof: null,
          district: '',
          areasOfInterest: [],
          skills: [],
          previousExperience: '',
          motivation: '',
          goals: '',
          emergencyName: '',
          emergencyRelationship: '',
          emergencyContact: ''
        });
        setCurrentStep(1);

      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
        setSubmitStatus({
          type: 'error',
          message: errorMessage
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="volunteer-form-container">
      <h2>Volunteer Registration Form</h2>
      
      {submitStatus.message && (
        <div className={`status-message ${submitStatus.type}`}>
          {submitStatus.message}
        </div>
      )}

      <div className="step-indicator">
        {["Personal Info", "ID Verification", "Preferences", "Motivation", "Emergency Contact"].map((label, idx) => (
          <React.Fragment key={label}>
            <div className={`step${currentStep === idx + 1 ? ' active' : ''}${currentStep > idx + 1 ? ' completed' : ''}`}>
              <div className="step-circle">{currentStep > idx + 1 ? <span>&#10003;</span> : idx + 1}</div>
              <div className="step-label">{label}</div>
            </div>
            {idx < 4 && <div className="step-connector" />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="volunteer-form">
        {currentStep === 1 && (
          <div className="form-step">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              {errors.fullName && <span className="error">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
              {errors.age && <span className="error">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
              />
              {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <h3>ID Verification</h3>
            <div className="form-group">
              <label>Upload ID Proof *</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              {errors.idProof && <span className="error">{errors.idProof}</span>}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step">
            <h3>Volunteering Preferences</h3>
            <div className="form-group">
              <label>District *</label>
              <select name="district" value={formData.district} onChange={handleInputChange}>
                <option value="">Select District</option>
                {maharashtraDistricts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
                {/* Add more districts */}
              </select>
              {errors.district && <span className="error">{errors.district}</span>}
            </div>

            <div className="form-group">
              <label>Areas of Interest *</label>
              <select
                multiple
                name="areasOfInterest"
                value={formData.areasOfInterest}
                onChange={handleMultiSelect}
              >
                <option value="community">Community Service</option>
                <option value="education">Education</option>
                <option value="environment">Environment</option>
                <option value="health">Health</option>
              </select>
              {errors.areasOfInterest && <span className="error">{errors.areasOfInterest}</span>}
            </div>

            <div className="form-group">
              <label>Previous Experience</label>
              <textarea
                name="previousExperience"
                value={formData.previousExperience}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="form-step">
            <h3>Motivation</h3>
            <div className="form-group">
              <label>Why do you want to volunteer with us? *</label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
              />
              {errors.motivation && <span className="error">{errors.motivation}</span>}
            </div>

            <div className="form-group">
              <label>What do you hope to achieve?</label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="form-step">
            <h3>Emergency Contact</h3>
            <div className="form-group">
              <label>Emergency Contact Name *</label>
              <input
                type="text"
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleInputChange}
              />
              {errors.emergencyName && <span className="error">{errors.emergencyName}</span>}
            </div>

            <div className="form-group">
              <label>Relationship</label>
              <input
                type="text"
                name="emergencyRelationship"
                value={formData.emergencyRelationship}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Emergency Contact Number *</label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
              />
              {errors.emergencyContact && <span className="error">{errors.emergencyContact}</span>}
            </div>
          </div>
        )}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button 
              type="button" 
              onClick={handlePrevious}
              disabled={isSubmitting}
              className="btn-secondary"
            >
              Previous
            </button>
          )}
          {currentStep < 5 ? (
            <button 
              type="button" 
              onClick={handleNext}
              disabled={isSubmitting}
              className="btn-primary"
            >
              Next
            </button>
          ) : (
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn-submit"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default VolunteerForm; 