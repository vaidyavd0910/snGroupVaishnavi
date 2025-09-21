import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import api from '../utils/api';
import { toast } from 'react-toastify';
import "./PageStyles.css";
import "./blog.css";
import { useNavigate } from 'react-router-dom';
import ImageCarousel from "../components/common/ImageCarousel";
import ShareButton from "../components/common/ShareButton";
import PageLoader from "../components/PageLoader";
import usePageLoader from "../hooks/usePageLoader";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [featuredPost, setFeaturedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isPageLoading = usePageLoader();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blog');
      if (response.data.success) {
        const allPosts = response.data.data;
        const featured = allPosts.find(post => post.featured);
        setFeaturedPost(featured);
        setPosts(allPosts);
      } else {
        toast.error('Failed to fetch blog posts');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error(error.response?.data?.message || 'Error fetching blog posts');
    } finally {
      setLoading(false);
    }
  };

  const getAllTags = () => {
    const tags = new Set(posts.flatMap(post => post.tags));
    return ['all', ...Array.from(tags)];
  };

  const filterPosts = () => {
    return posts
      .filter(post => !post.featured)
      .filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(post => 
        activeTag === 'all' || post.tags.includes(activeTag)
      );
  };

  if (isPageLoading) {
    return <PageLoader subtitle="Loading blog posts..." />;
  }

  return (
    <div className="page-container">
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="page-title"
          >
            Blog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="page-subtitle"
          >
            Read our latest articles and insights
          </motion.p>
        </div>
      </section>

      <section className="content-section">
        <div className="blog-controls">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="tags-filter">
            {getAllTags().map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`tag-btn ${activeTag === tag ? 'active' : ''}`}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {featuredPost && (
          <motion.div 
            className="featured-post"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(`/blog/${featuredPost._id}`)}
          >
            <div className="featured-post-image">
              <ImageCarousel 
                images={featuredPost.images && featuredPost.images.length > 0 ? featuredPost.images : (featuredPost.image ? [featuredPost.image] : [])}
                className="featured-post-carousel"
                autoPlay={true}
                interval={5000}
              />
              <span className="featured-badge">Featured</span>
            </div>
            <div className="featured-post-content">
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.excerpt}</p>
              <div className="post-meta">
                <span>{featuredPost.author}</span>
                <span>•</span>
                <span>
                  {featuredPost.date && !isNaN(new Date(featuredPost.date)) 
                    ? format(new Date(featuredPost.date), 'MMM dd, yyyy') 
                    : 'Unknown date'}
                </span>
                <div className="tags">
                  {featuredPost.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          className="blog-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filterPosts().map(post => (
            <motion.article 
              key={post._id}
              className="blog-item clickable"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(`/blog/${post._id}`)}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <div className="blog-item-image">
                <ImageCarousel 
                  images={post.images && post.images.length > 0 ? post.images : (post.image ? [post.image] : [])}
                  className="blog-item-carousel"
                  autoPlay={true}
                  interval={4000}
                />
              </div>
              <div className="blog-item-content">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="post-meta">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>
                    {post.date && !isNaN(new Date(post.date)) 
                      ? format(new Date(post.date), 'MMM dd, yyyy') 
                      : 'Unknown date'}
                  </span>
                  <div className="tags">
                    {post.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="blog-actions">
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: 'inline-block' }}
                  >
                    <ShareButton 
                      url={`${window.location.origin}/blog/${post._id}`}
                      title={post.title}
                      description={post.excerpt}
                    />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

    </div>
  );
};

export default Blog; 