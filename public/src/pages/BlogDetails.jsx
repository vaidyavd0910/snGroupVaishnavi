import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { format } from 'date-fns';
import ImageCarousel from '../components/common/ImageCarousel';
import ShareButton from '../components/common/ShareButton';
import './BlogDetails.css';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/blog/${id}`);
        if (!response.ok) throw new Error('Failed to fetch blog post');
        const data = await response.json();
        setPost(data.success ? data.data : data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <Loader text="Loading blog post..." />;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="error-message">Blog post not found</div>;

  // Support multiple images if available
  const images = post.images && post.images.length > 0 ? post.images : (post.image ? [post.image] : []);

  return (
    <div className="blog-details-pro-page">
      {/* Header Section */}
      <header className="blog-header-pro">
        <button className="back-btn floating" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
      </header>

      {/* Hero Section with carousel only */}
      <section className="blog-hero-pro">
        <div className="blog-hero-carousel-wrap">
          <ImageCarousel 
            images={images}
            className="hero-carousel"
            autoPlay={true}
            interval={5000}
          />
        </div>
      </section>

      {/* Info Section below carousel */}
      <main className="blog-main-pro">
        <div className="blog-content-pro">
          <section className="blog-info-pro">
            <h1 className="blog-title-pro">{post.title}</h1>
            {post.excerpt && <div className="blog-excerpt-pro">{post.excerpt}</div>}
            <div className="blog-meta-pro">
              <span className="blog-author-pro">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18"><circle cx="12" cy="7" r="4" /><path d="M5.5 21a7.5 7.5 0 0113 0" /></svg>
                {post.author}
              </span>
              {post.date && !isNaN(new Date(post.date)) && (
                <span className="blog-date-pro">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18"><rect x="4" y="5" width="16" height="16" rx="5"/><path d="M16 3v4M8 3v4M4 11h16"/></svg>
                  {format(new Date(post.date), 'MMM dd, yyyy')}
                </span>
              )}
            </div>
            {post.tags && post.tags.filter(tag => tag).length > 0 && (
              <div className="blog-tags-pro">
                {post.tags.filter(tag => tag).map(tag => (
                  <span key={tag} className="blog-tag-pro">#{tag}</span>
                ))}
              </div>
            )}
            <div className="blog-share-section">
              <ShareButton 
                url={window.location.href}
                title={post.title}
                description={post.excerpt || post.content.substring(0, 150) + '...'}
              />
            </div>
          </section>
          <section className="blog-body-pro">
            <div className="blog-body-content-pro">
              {post.content}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BlogDetails; 