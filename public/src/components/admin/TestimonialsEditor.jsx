import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const TestimonialsEditor = () => {
  const [loading, setLoading] = useState(true);
  const [testimonialsData, setTestimonialsData] = useState({
    title: 'What Our Clients Say',
    testimonials: [
      { name: '', role: '', content: '', avatar: '' }
    ]
  });

  useEffect(() => {
    const fetchTestimonialsData = async () => {
      try {
        const response = await api.get('/content/testimonials');
        if (response.data.success) {
          setTestimonialsData(response.data.data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching testimonials data:', error);
        setLoading(false);
      }
    };

    fetchTestimonialsData();
  }, []);

  const handleTitleChange = (e) => {
    setTestimonialsData({
      ...testimonialsData,
      title: e.target.value
    });
  };

  const handleTestimonialChange = (index, field, value) => {
    const updatedTestimonials = [...testimonialsData.testimonials];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      [field]: value
    };
    
    setTestimonialsData({
      ...testimonialsData,
      testimonials: updatedTestimonials
    });
  };

  const handleAddTestimonial = () => {
    setTestimonialsData({
      ...testimonialsData,
      testimonials: [
        ...testimonialsData.testimonials,
        { name: '', role: '', content: '', avatar: '' }
      ]
    });
  };

  const handleRemoveTestimonial = (index) => {
    const updatedTestimonials = testimonialsData.testimonials.filter((_, i) => i !== index);
    setTestimonialsData({
      ...testimonialsData,
      testimonials: updatedTestimonials
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.put('/content/testimonials', { data: testimonialsData });
      if (response.data.success) {
        toast.success('Testimonials updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update testimonials');
      console.error('Error updating testimonials data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="editor-container">
      <h2>Edit Testimonials</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Section Title</label>
          <input
            type="text"
            id="title"
            value={testimonialsData.title}
            onChange={handleTitleChange}
            required
          />
        </div>
        
        {testimonialsData.testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-item-editor">
            <h3>Testimonial #{index + 1}</h3>
            
            <div className="form-group">
              <label htmlFor={`name-${index}`}>Name</label>
              <input
                type="text"
                id={`name-${index}`}
                value={testimonial.name}
                onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`role-${index}`}>Role/Company</label>
              <input
                type="text"
                id={`role-${index}`}
                value={testimonial.role}
                onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`content-${index}`}>Testimonial Content</label>
              <textarea
                id={`content-${index}`}
                value={testimonial.content}
                onChange={(e) => handleTestimonialChange(index, 'content', e.target.value)}
                rows={4}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`avatar-${index}`}>Avatar URL</label>
              <input
                type="text"
                id={`avatar-${index}`}
                value={testimonial.avatar}
                onChange={(e) => handleTestimonialChange(index, 'avatar', e.target.value)}
              />
            </div>
            
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={() => handleRemoveTestimonial(index)}
            >
              Remove Testimonial
            </button>
          </div>
        ))}
        
        <div className="button-group">
          <button type="button" className="btn btn-secondary" onClick={handleAddTestimonial}>
            Add New Testimonial
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Testimonials'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialsEditor; 