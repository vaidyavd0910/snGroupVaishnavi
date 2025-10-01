import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ImageCropper from '../common/ImageCropper';

const EventsEditor = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '12:00',
    endTime: '14:00',
    location: '',
    description: '',
    ticketsAvailable: true,
    gallery: []
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to fetch events');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitFormData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'image') {
          submitFormData.append(key, formData[key]);
        }
      });

      // Append all new images
      images.forEach((image, index) => {
        submitFormData.append('images', image.file);
      });

      // Append existing images if editing
      if (selectedEvent && existingImages.length > 0) {
        submitFormData.append('existingImages', JSON.stringify(existingImages));
      }

      if (selectedEvent) {
        await api.put(`/events/${selectedEvent._id}`, submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Event updated successfully');
      } else {
        await api.post('/events', submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Event created successfully');
      }
      fetchEvents();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        toast.success('Event deleted successfully');
        fetchEvents();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: new Date(event.date).toISOString().split('T')[0],
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      description: event.description,
      ticketsAvailable: true,
      gallery: event.gallery || []
    });
    
    // Handle existing images
    if (event.images && event.images.length > 0) {
      setExistingImages(event.images);
    } else {
      setExistingImages([]);
    }
    
    setImages([]);
  };

  const resetForm = () => {
    setSelectedEvent(null);
    setImages([]);
    setExistingImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormData({
      title: '',
      date: '',
      startTime: '12:00',
      endTime: '14:00',
      location: '',
      description: '',
      ticketsAvailable: true,
      gallery: []
    });
  };

  const removeExistingImage = (imageIndex) => {
    setExistingImages(prev => prev.filter((_, index) => index !== imageIndex));
  };

  return (
    <div className="events-editor">
      <h2>{selectedEvent ? 'Edit Event' : 'Create New Event'}</h2>
      <p className="form-note">
        <strong>Note:</strong> Event status (Upcoming/Ongoing/Past) is automatically calculated based on the date and time.
      </p>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Multiple Image Upload */}
        <div className="form-group">
          <label>Event Images</label>
          <ImageCropper
            onImageCropped={(image) => {
              const newImage = {
                id: Date.now(),
                file: image,
                preview: URL.createObjectURL(image),
                name: image.name,
                size: image.size
              };
              handleImagesChange([...images, newImage]);
            }}
            aspectRatio={16 / 9}
            maxWidth={1920}
            maxHeight={1080}
            buttonText="Add Event Image"
          />
          {images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginTop: '10px' }}>
              {images.map((img) => (
                <div key={img.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={img.preview} alt={img.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => handleImagesChange(images.filter(i => i.id !== img.id))}
                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
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

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group" style={{display:'none'}}>
          <label>
            <input
              type="checkbox"
              name="ticketsAvailable"
              checked={formData.ticketsAvailable}
              onChange={handleInputChange}
            />
            Tickets Available
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {selectedEvent ? 'Update Event' : 'Create Event'}
          </button>
          {selectedEvent && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="events-list">
        <h3>Existing Events</h3>
        <div className="events-grid">
          {events.map(event => (
            <div key={event._id} className="event-item">
              <div className="event-images">
                {event.images && event.images.length > 0 ? (
                  <div className="event-images-grid">
                    {event.images.slice(0, 3).map((image, index) => (
                      <img key={index} src={image} alt={`${event.title} ${index + 1}`} />
                    ))}
                    {event.images.length > 3 && (
                      <div className="more-images">+{event.images.length - 3}</div>
                    )}
                  </div>
                ) : (
                  <div className="no-images">No images</div>
                )}
              </div>
              <h4>{event.title}</h4>
              <p>{event.description}</p>
              <div className="event-actions">
                <button
                  onClick={() => handleEdit(event)}
                  className="btn btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
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

export default EventsEditor; 