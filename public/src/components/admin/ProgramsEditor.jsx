import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import MultipleImageUpload from '../common/MultipleImageUpload';

const ProgramsEditor = () => {
  const [programs, setPrograms] = useState([]);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'health',
    description: '',
    impact: '',
    location: '',
    beneficiaries: '',
    yearsActive: '',
    successRate: ''
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/programs');
      setPrograms(response.data);
    } catch (error) {
      toast.error('Failed to fetch programs');
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'beneficiaries' || name === 'yearsActive' || name === 'successRate' 
        ? value === '' ? '' : parseInt(value) 
        : value
    });
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append all new images
      images.forEach((image, index) => {
        formDataToSend.append('images', image.file);
      });

      // Append existing images if editing
      if (editingProgram && existingImages.length > 0) {
        formDataToSend.append('existingImages', JSON.stringify(existingImages));
      }

      if (editingProgram) {
        await api.put(`/programs/${editingProgram._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Program updated successfully');
      } else {
        await api.post('/programs', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Program created successfully');
      }

      setEditingProgram(null);
      setFormData({
        title: '',
        category: 'health',
        description: '',
        impact: '',
        location: '',
        beneficiaries: '',
        yearsActive: '',
        successRate: ''
      });
      setImages([]);
      setExistingImages([]);
      fetchPrograms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      category: program.category,
      description: program.description,
      impact: program.impact,
      location: program.location,
      beneficiaries: program.beneficiaries || '',
      yearsActive: program.yearsActive || '',
      successRate: program.successRate || ''
    });
    
    // Handle existing images
    if (program.images && program.images.length > 0) {
      setExistingImages(program.images);
    } else {
      setExistingImages([]);
    }
    
    setImages([]);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await api.delete(`/programs/${id}`);
        toast.success('Program deleted successfully');
        fetchPrograms();
      } catch (error) {
        toast.error('Failed to delete program');
      }
    }
  };

  const removeExistingImage = (imageIndex) => {
    setExistingImages(prev => prev.filter((_, index) => index !== imageIndex));
  };

  return (
    <div className="programs-editor">
      <h2>{editingProgram ? 'Edit Program' : 'Add New Program'}</h2>
      <form onSubmit={handleSubmit} className="program-form">
        <div className="form-group">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Program Title"
            required
          />
        </div>
        <div className="form-group">
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="food">Food Security</option>
            <option value="social">Social Welfare</option>
            <option value="environment">Environment</option>
          </select>
        </div>
        <div className="form-group">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="impact"
            value={formData.impact}
            onChange={handleInputChange}
            placeholder="Impact"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Location"
            required
          />
        </div>
        
        {/* New Statistics Fields */}
        <div className="form-row">
          <div className="form-group">
            <input
              type="number"
              name="beneficiaries"
              value={formData.beneficiaries}
              onChange={handleInputChange}
              placeholder="Number of Beneficiaries"
              min="0"
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="yearsActive"
              value={formData.yearsActive}
              onChange={handleInputChange}
              placeholder="Years Active"
              min="0"
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="successRate"
              value={formData.successRate}
              onChange={handleInputChange}
              placeholder="Success Rate (%)"
              min="0"
              max="100"
            />
          </div>
        </div>
        
        {/* Multiple Image Upload */}
        <div className="form-group">
          <label>Program Images</label>
          <MultipleImageUpload
            images={images}
            onImagesChange={handleImagesChange}
            maxImages={10}
            className="program-images-upload"
          />
        </div>

        {/* Existing Images Display */}
        {existingImages.length > 0 && (
          <div className="form-group">
            <label>Existing Images</label>
            <div className="existing-images-grid">
              {existingImages.map((image, index) => (
                <div key={index} className="existing-image-item">
                  <img src={image} alt={`Existing ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-existing-btn"
                    onClick={() => removeExistingImage(index)}
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          {editingProgram ? 'Update Program' : 'Add Program'}
        </button>
        {editingProgram && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setEditingProgram(null);
              setFormData({
                title: '',
                category: 'health',
                description: '',
                impact: '',
                location: '',
                beneficiaries: '',
                yearsActive: '',
                successRate: ''
              });
              setImages([]);
              setExistingImages([]);
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="programs-list">
        <h3>Existing Programs</h3>
        <div className="programs-grid">
          {programs.map(program => (
            <div key={program._id} className="program-item">
              <div className="program-images">
                {program.images && program.images.length > 0 ? (
                  <div className="program-images-grid">
                    {program.images.slice(0, 3).map((image, index) => (
                      <img key={index} src={image} alt={`${program.title} ${index + 1}`} />
                    ))}
                    {program.images.length > 3 && (
                      <div className="more-images">+{program.images.length - 3}</div>
                    )}
                  </div>
                ) : (
                  <div className="no-images">No images</div>
                )}
              </div>
              <h4>{program.title}</h4>
              <p>{program.description}</p>
              <div className="program-stats">
                {program.beneficiaries && (
                  <span className="stat">👥 {program.beneficiaries}+ Beneficiaries</span>
                )}
                {program.yearsActive && (
                  <span className="stat">📅 {program.yearsActive} Years Active</span>
                )}
                {program.successRate && (
                  <span className="stat">📊 {program.successRate}% Success Rate</span>
                )}
              </div>
              <div className="program-actions">
                <button
                  onClick={() => handleEdit(program)}
                  className="btn btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(program._id)}
                  className="btn btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramsEditor;