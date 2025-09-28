import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import MultipleImageUpload from '../common/MultipleImageUpload';

const GalleryEditor = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'events',
    image: null
  })

  const fetchGalleryItems = async () => {
    try {
      const response = await api.get('/gallery');
      setGalleryItems(response.data);
    } catch (error) {
      toast.error('Failed to fetch gallery items');
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitFormData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'image') {
          submitFormData.append(key, formData[key]);
        }
      });

      // Send first image as main image for backend compatibility
      if (images.length > 0) {
        submitFormData.append('image', images[0].file);
      }

      // Append all new images
      images.forEach((image, index) => {
        submitFormData.append('images', image.file);
      });

      // Append existing images if editing
      if (selectedItem && existingImages.length > 0) {
        submitFormData.append('existingImages', JSON.stringify(existingImages));
      }

      if (selectedItem) {
        await api.put(`/gallery/${selectedItem._id}`, submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Gallery item updated successfully');
      } else {
        if (images.length === 0 && existingImages.length === 0) {
          toast.error('At least one image is required for gallery items');
          setLoading(false);
          return;
        }
        await api.post('/gallery', submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Gallery item added successfully');
      }

      fetchGalleryItems();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      image: '' // Reset to allow new image selection
    });
    
    // Handle existing images
    if (item.images && item.images.length > 0) {
      setExistingImages(item.images);
    } else {
      setExistingImages([]);
    }
    
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setSelectedItem(null);
    setImages([]);
    setExistingImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFormData({
      title: '',
      description: '',
      category: 'events',
      image: null
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Gallery item deleted successfully');
      fetchGalleryItems();
    } catch (error) {
      toast.error('Failed to delete gallery item');
    }
  };

  const removeExistingImage = (imageIndex) => {
    setExistingImages(prev => prev.filter((_, index) => index !== imageIndex));
  };

  return (
    <div className="gallery-editor">
      <h2>{selectedItem ? 'Edit Gallery Item' : 'Add Gallery Item'}</h2>

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
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="events">Events</option>
            <option value="programs">Programs</option>
            <option value="people">People</option>
            <option value="nature">Nature</option>
          </select>
        </div>

        {/* Multiple Image Upload */}
        <div className="form-group">
          <label>Gallery Images</label>
          <MultipleImageUpload
            images={images}
            onImagesChange={handleImagesChange}
            maxImages={15}
            className="gallery-images-upload"
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

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (selectedItem ? 'Update Item' : 'Add Item')}
          </button>
          {selectedItem && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="gallery-items-list">
        <h3>Existing Gallery Items</h3>
        <div className="gallery-items-grid">
          {galleryItems.map(item => (
            <div key={item._id} className="gallery-item-card">
              <div className="item-images">
                {item.images && item.images.length > 0 ? (
                  <div className="item-images-grid">
                    {item.images.slice(0, 4).map((image, index) => (
                      <img key={index} src={image} alt={`${item.title} ${index + 1}`} />
                    ))}
                    {item.images.length > 4 && (
                      <div className="more-images">+{item.images.length - 4}</div>
                    )}
                  </div>
                ) : (
                  <div className="no-images">No images</div>
                )}
              </div>
              <div className="item-details">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="category-badge">{item.category}</span>
                <div className="item-actions">
                  <button
                    onClick={() => handleEdit(item)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryEditor;
