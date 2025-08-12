import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import authService from '../services/authService';
import logo from './logo.png';
import { FaBars, FaTimes, FaChevronDown, FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

// Logo component
const Logo = () => (
  <Link to="/" className="flex items-center space-x-3 group">
    <img src={logo} alt="SnTrust" className="w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-300 group-hover:scale-110" />
    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
      SN Trust
    </span>
  </Link>
);

// Button component
const Button = ({ children, variant = "primary", onClick, className = "", ...props }) => {
  const baseClasses = "px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Avatar dropdown component
const AvatarDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.avatar-dropdown')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleDropdown();
    }
  };
  
  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };
  
  const handleDashboard = () => {
    setIsOpen(false);
    if(user.role === 'admin'){
      navigate('/admin'); 
    } else if(user.role === 'subadmin'){
      navigate('/subadmin');
    }
    else{
      navigate('/dashboard');
    }
  };
  
  // Get initials from email
  const getInitials = (email) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };
  
  return (
    <div className="avatar-dropdown relative">
      <button
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
          {getInitials(user?.email)}
        </div>
        <FaChevronDown className={`w-3 h-3 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
            </div>
            
            <div className="py-1">
              <button
                onClick={handleDashboard}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <FaTachometerAlt className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { 
      name: "About", 
      path: "/about",
      submenu: [
        { name: "Our Story", path: "/about" },
        { name: "Our Mission", path: "/mission" },
        { name: "Our Vision", path: "/vision" },
      ]
    },
    { name: "Campaigns", path: "/campaigns" },
    { name: "Programs", path: "/programs" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "SN Arya Mitra", path: "/sn-arya-mitra" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const toggleSubmenu = (submenuName) => {
    setActiveSubmenu(activeSubmenu === submenuName ? null : submenuName);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isSubmenuActive = (submenuItems) => {
    return submenuItems.some(item => isActive(item.path));
  };
  
  return (
    <header className={`relative z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              link.submenu ? (
                <div key={link.name} className="relative group">
                  <button 
                    className={`flex items-center space-x-1 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isSubmenuActive(link.submenu) 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleSubmenu(link.name)}
                    aria-expanded={activeSubmenu === link.name}
                    aria-haspopup="true"
                  >
                    <span>{link.name}</span>
                    <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                      activeSubmenu === link.name ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  <AnimatePresence>
                    {activeSubmenu === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2"
                      >
                        {link.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                              isActive(subItem.path) 
                                ? 'text-primary-600 bg-primary-50' 
                                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveSubmenu(null)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive(link.path) 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                >
                  {link.name}
                </Link>
              )
            ))}
            
            {/* Dashboard link (only if logged in) */}
            {currentUser && currentUser.role !== 'admin' && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  isActive('/dashboard') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                aria-current={isActive('/dashboard') ? 'page' : undefined}
              >
                Dashboard
              </Link>
            )}
          </nav>
          
          {/* Right side - Auth buttons or avatar */}
          <div className="flex items-center space-x-3">
            {/* Desktop auth buttons or avatar */}
            <div className="hidden lg:flex items-center space-x-3">
              {currentUser ? (
                <AvatarDropdown user={currentUser} onLogout={handleLogout} />
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Register</Button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="w-6 h-6 text-gray-700" />
              ) : (
                <FaBars className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Side Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleMenu}
            />
            
            {/* Drawer */}
            <motion.aside
              className="mobile-menu fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <Logo />
                  <button
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                    onClick={toggleMenu}
                    aria-label="Close menu"
                  >
                    <FaTimes className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
                
                {/* User info */}
                {currentUser && (
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {currentUser.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">{currentUser.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{currentUser.role || 'User'}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Navigation */}
                <nav className="flex-1 p-6 space-y-2">
                  {navLinks.map((link) => (
                    link.submenu ? (
                      <div key={link.name} className="space-y-1">
                        <button
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                            isSubmenuActive(link.submenu) 
                              ? 'text-primary-600 bg-primary-50' 
                              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          }`}
                          onClick={() => toggleSubmenu(link.name)}
                          aria-expanded={activeSubmenu === link.name}
                          aria-haspopup="true"
                        >
                          <span>{link.name}</span>
                          <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                            activeSubmenu === link.name ? 'rotate-180' : ''
                          }`} />
                        </button>
                        <AnimatePresence>
                          {activeSubmenu === link.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-4 space-y-1"
                            >
                              {link.submenu.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.path}
                                  className={`block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                    isActive(subItem.path) 
                                      ? 'text-primary-600 bg-primary-50' 
                                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                                  }`}
                                  onClick={toggleMenu}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          isActive(link.path) 
                            ? 'text-primary-600 bg-primary-50' 
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                        onClick={toggleMenu}
                      >
                        {link.name}
                      </Link>
                    )
                  ))}
                  
                  {currentUser && currentUser.role !== 'admin' && (
                    <Link
                      to="/dashboard"
                      className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        isActive('/dashboard') 
                          ? 'text-primary-600 bg-primary-50' 
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                  )}
                </nav>
                
                {/* Auth buttons for mobile */}
                {!currentUser && (
                  <div className="p-6 border-t border-gray-200 space-y-3">
                    <Link to="/login" className="block">
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link to="/register" className="block">
                      <Button className="w-full">Register</Button>
                    </Link>
                  </div>
                )}
                
                {/* Logout for mobile */}
                {currentUser && (
                  <div className="p-6 border-t border-gray-200">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-300"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar; 