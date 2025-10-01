import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaStar, FaCheck, FaTimes, FaUser } from 'react-icons/fa';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ImageCropper from '../common/ImageCropper';
import './TestimonialsEditor.css';

const TestimonialsEditor = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    organization: '',
    message: '',
    rating: 5,
    image: null,
    isActive: true,
    displayOrder: 0
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/testimonials/admin/all');
      setTestimonials(response.data.testimonials || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
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

  const handleImageCropped = (image) => {
    setSelectedImage(image);
    setImagePreview(URL.createObjectURL(image));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('designation', formData.designation);
      submitData.append('organization', formData.organization);
      submitData.append('message', formData.message);
      submitData.append('rating', formData.rating);
      submitData.append('isActive', formData.isActive);
      submitData.append('displayOrder', formData.displayOrder);

      if (selectedImage) {
        submitData.append('image', selectedImage);
      }

      if (editingTestimonial) {
        await api.put(`/testimonials/${editingTestimonial._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Testimonial updated successfully');
      } else {
        await api.post('/testimonials', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Testimonial created successfully');
      }

      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error(error.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      designation: testimonial.designation || '',
      organization: testimonial.organization || '',
      message: testimonial.message,
      rating: testimonial.rating,
      isActive: testimonial.isActive !== false,
      displayOrder: testimonial.displayOrder || 0
    });
    if (testimonial.image) {
      setImagePreview(testimonial.image);
    }
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await api.delete(`/testimonials/${id}`);
      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      designation: '',
      organization: '',
      message: '',
      rating: 5,
      image: null,
      isActive: true,
      displayOrder: 0
    });
    setEditingTestimonial(null);
    setSelectedImage(null);
    setImagePreview(null);
    setShowForm(false);
  };

  return (
    <div className="testimonials-editor">
      <div className="editor-header">
        <div>
          <h2>Testimonials Management</h2>
          <p>Manage customer testimonials and reviews</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          <FaPlus /> Add Testimonial
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          className="form-card"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="form-card-header">
            <h3>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
            <button className="btn-icon" onClick={resetForm}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="testimonial-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter person's name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Designation *</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="e.g., Community Leader, Volunteer"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="e.g., ABC Foundation"
                />
              </div>

              <div className="form-group">
                <label>Rating *</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
                    >
                      <FaStar />
                    </button>
                  ))}
                  <span className="rating-text">{formData.rating} / 5</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Testimonial Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Write the testimonial message..."
                rows="5"
                required
              />
              <small>{formData.message.length} / 500 characters</small>
            </div>

            <div className="form-group">
              <label>Avatar/Photo</label>
              <ImageCropper
                onImageCropped={handleImageCropped}
                aspectRatio={1}
                circular={true}
                maxWidth={400}
                maxHeight={400}
                buttonText="Upload Avatar"
                maxFileSize={2 * 1024 * 1024}
              />
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Avatar preview" className="avatar-preview" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="remove-image-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
              <small>Square image recommended. Will be displayed in a circle.</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
                <small>Lower numbers appear first</small>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span>Active (Show on website)</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={resetForm}>
                <FaTimes /> Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                <FaCheck /> {editingTestimonial ? 'Update' : 'Create'} Testimonial
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Testimonials List */}
      <div className="testimonials-grid">
        {loading && !showForm ? (
          <div className="loading-state">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="empty-state">
            <FaUser className="empty-icon" />
            <h3>No Testimonials Yet</h3>
            <p>Click "Add Testimonial" to create your first testimonial</p>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <motion.div
              key={testimonial._id}
              className="testimonial-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  {testimonial.image ? (
                    <img src={testimonial.image} alt={testimonial.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.designation}</p>
                  {testimonial.organization && (
                    <span className="location">{testimonial.organization}</span>
                  )}
                </div>
                <div className="testimonial-badges">
                  {testimonial.displayOrder === 0 && (
                    <span className="badge featured">Priority</span>
                  )}
                  {!testimonial.isActive && (
                    <span className="badge inactive">Inactive</span>
                  )}
                </div>
              </div>

              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < testimonial.rating ? 'star-filled' : 'star-empty'}
                  />
                ))}
              </div>

              <div className="testimonial-content">
                <p>"{testimonial.message}"</p>
              </div>

              <div className="testimonial-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(testimonial)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(testimonial._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialsEditor;