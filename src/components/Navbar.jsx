import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import authService from '../services/authService';
import logo from './logo.png';
import { FaChevronDown, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { AiOutlineClose } from "react-icons/ai";
import { IoIosMenu } from "react-icons/io";

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
  const baseClasses = "px-4 py-2 sm:px-6 sm:py-3 rounded-3xl font-semibold transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-500 text-white hover:from-primary-500 hover:to-primary-500 focus:ring-primary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-500",
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
  const handleKeyDown = (e) => { if (e.key === 'Enter' || e.key === ' ') toggleDropdown(); };
  const handleLogout = () => { setIsOpen(false); onLogout(); };
  const handleDashboard = () => {
    setIsOpen(false);
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'subadmin') navigate('/subadmin');
    else navigate('/dashboard');
  };
  const getInitials = (email) => email ? email.charAt(0).toUpperCase() : "U";

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
    { name: "About", path: "/about", submenu: [{ name: "Our Story", path: "/about" }, { name: "Our Mission", path: "/mission" }, { name: "Our Vision", path: "/vision" }] },
    { name: "Campaigns", path: "/campaigns" },
    { name: "Programs", path: "/programs" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "SN Arya Mitra", path: "/sn-arya-mitra" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); setActiveSubmenu(null); }, [location.pathname]);

  const toggleSubmenu = (name) => setActiveSubmenu(activeSubmenu === name ? null : name);
  const handleLogout = async () => { await authService.logout(); logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;
  const isSubmenuActive = (items) => items.some(item => isActive(item.path));

  useEffect(() => { document.body.style.overflow = isMenuOpen ? 'hidden' : ''; }, [isMenuOpen]);

  return (
    <header className={`bg-white text-[#101840] sticky top-0 z-50 border-b border-gray-200 transition-shadow duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => (
              link.submenu ? (
                <div key={link.name} className="relative group">
                  <button
                    className={`flex items-center space-x-1 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isSubmenuActive(link.submenu) ? 'text-[#D14343]' : 'text-[#101840] hover:text-[#D14343]'}`}
                    onClick={() => toggleSubmenu(link.name)}
                    aria-expanded={activeSubmenu === link.name}
                  >
                    <span>{link.name}</span>
                    <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeSubmenu === link.name ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeSubmenu === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2"
                      >
                        {link.submenu.map(sub => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            className={`block px-4 py-2 text-sm ${isActive(sub.path) ? 'text-[#D14343]' : 'text-[#101840] hover:text-[#D14343]'}`}
                            onClick={() => setActiveSubmenu(null)}
                          >
                            {sub.name}
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
                  className={`px-4 py-2 rounded-xl font-medium ${isActive(link.path) ? 'text-[#D14343]' : 'text-[#101840] hover:text-[#D14343]'}`}
                  onClick={() => setActiveSubmenu(null)} // <-- close any submenu
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-3">
              {currentUser ? <AvatarDropdown user={currentUser} onLogout={handleLogout} /> : (
                <>
                  <Link to="/login"><Button variant="outline">Login</Button></Link>
                  <Link to="/register"><Button>Register</Button></Link>
                </>
              )}
            </div>

            {/* <button
              className="lg:hidden ml-auto inline-flex items-center justify-center h-10 w-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            > */}
            {/* menu */}
            <div className="lg:hidden">

              <IoIosMenu size={30} onClick={() => setIsMenuOpen(true)} />
            </div>

            {/* </button> */}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[50]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-full bg-white z-[60] flex flex-col"
            >
              <div className=" justify-between relative h-14 border-b border-gray-100 flex items-center px-4">
                <Logo />
                {/* <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 inline-flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <AiOutlineClose />
                </button> */}

                <AiOutlineClose size={20} onClick={() => setIsMenuOpen(false)} />

              </div>

              <nav className="flex-1 p-4 space-y-1 text-[#101840] overflow-y-auto">
                {navLinks.map(link => (
                  link.submenu ? (
                    <div key={link.name} className="space-y-1">
                      <button
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium ${isSubmenuActive(link.submenu) ? 'text-[#D14343]' : 'text-[#101840] hover:text-[#D14343]'}`}
                        onClick={() => toggleSubmenu(link.name)}
                        aria-expanded={activeSubmenu === link.name}
                      >
                        <span>{link.name}</span>
                        <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeSubmenu === link.name ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeSubmenu === link.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 space-y-1 overflow-hidden"
                          >
                            {link.submenu.map(sub => (
                              <Link
                                key={sub.name}
                                to={sub.path}
                                className={`block px-4 py-2 rounded-lg ${isActive(sub.path) ? 'text-[#D14343]' : 'text-[#101840] hover:text-[#D14343]'}`}
                                onClick={() => { setIsMenuOpen(false); setActiveSubmenu(null); }}
                              >
                                {sub.name}
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
                      className={`block px-4 py-3 rounded-xl font-medium ${isActive(link.path) ? 'text-[#D14343]' : 'text-[#101840] hover:text-[#D14343]'}`}
                      onClick={() => { setIsMenuOpen(false); setActiveSubmenu(null); }}
                    >
                      {link.name}
                    </Link>
                  )
                ))}
              </nav>

              {!currentUser && (
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <Link to="/login"><Button variant="outline" className="w-full">Login</Button></Link>
                  <Link to="/register"><Button className="w-full">Register</Button></Link>
                </div>
              )}

              {currentUser && (
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-300"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
