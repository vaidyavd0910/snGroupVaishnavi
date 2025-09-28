import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import MultipleImageUpload from '../common/MultipleImageUpload';
import withAdminAccess from '../Auth/withAdminAccess';

const BlogEditor = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    image: '',
    tags: '',   
    featured: false
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/blog');
      setPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = new FormData();
      formattedData.append('title', formData.title);
      formattedData.append('excerpt', formData.excerpt);
      formattedData.append('content', formData.content);
      formattedData.append('author', formData.author);
      formattedData.append('tags', JSON.stringify(formData.tags.split(',')?.map(tag => tag.trim())));
      formattedData.append('featured', formData.featured);
      
      // Append all new images
      images.forEach((image, index) => {
        formattedData.append('images', image.file);
      });

      // Append existing images if editing
      if (selectedPost && existingImages.length > 0) {
        formattedData.append('existingImages', JSON.stringify(existingImages));
      }

      if (selectedPost) {
        await api.put(`/blog/${selectedPost._id}`, formattedData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post('/blog', formattedData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      fetchPosts();
      resetForm();
    } catch (error) {
      console.error('Error saving blog post:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/blog/${postId}`);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting blog post:', error);
      }
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      image: post.image,
      tags: post.tags.join(', '),
      featured: post.featured
    });
    
    // Handle existing images
    if (post.images && post.images.length > 0) {
      setExistingImages(post.images);
    } else {
      setExistingImages([]);
    }
    
    setImages([]);
  };

  const resetForm = () => {
    setSelectedPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      image: '',
      tags: '',
      featured: false
    });
    setImages([]);
    setExistingImages([]);
  };

  const removeExistingImage = (imageIndex) => {
    setExistingImages(prev => prev.filter((_, index) => index !== imageIndex));
  };

  return (
    <div className="blog-editor">
      <div className="blog-editor-header">
        <h2>{selectedPost ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
        <div className="blog-editor-subtitle">
          {selectedPost ? 'Update your blog post content and settings' : 'Create a new blog post for your website'}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
            rows="10"
          />
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            required
          />
        </div>

        {/* Multiple Image Upload */}
        <div className="form-group">
          <label>Blog Images</label>
          <MultipleImageUpload
            images={images}
            onImagesChange={handleImagesChange}
            maxImages={8}
            className="blog-images-upload"
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

        <div className="form-group">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="e.g., health, water, community"
          />
        </div>

        <div className="form-group checkbox-container">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({...formData, featured: e.target.checked})}
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            <span className="checkbox-text">Featured Post</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {selectedPost ? 'Update Post' : 'Create Post'}
          </button>
          {selectedPost && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="blog-posts-list">
        <div className="blog-posts-header">
          <h3>Existing Posts</h3>
          <div className="blog-posts-count">{posts?.length || 0} posts</div>
        </div>
        {posts?.length && posts?.map(post => (
          <motion.div
            key={post._id}
            className="blog-post-item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="post-images">
              {post.images && post.images.length > 0 ? (
                <div>
                  {post.images.slice(0, 3).map((image, index) => (
                    <img key={index} src={image} alt={`${post.title} ${index + 1}`} />
                  ))}
                  {post.images.length > 3 && (
                    <div className="more-images">+{post.images.length - 3}</div>
                  )}
                </div>
              ) : (
                <div className="no-images">No images</div>
              )}
            </div>
            <div className="post-info">
              <h4>{post.title}</h4>
              <p>{post.excerpt}</p>
              <div className="post-meta">
                <span>{post.author}</span>
                {post.featured && <span className="featured-badge">Featured</span>}
              </div>
            </div>
            <div className="post-actions">
              <button onClick={() => handleEdit(post)} className="btn btn-edit">
                Edit
              </button>
              <button onClick={() => handleDelete(post._id)} className="btn btn-delete">
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default withAdminAccess(BlogEditor); 