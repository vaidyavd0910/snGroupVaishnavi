import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight, FaHandHoldingHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800 relative overflow-hidden border-t-4 border-[rgb(209,67,67)] w-full">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[rgb(209,67,67)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[rgb(209,67,67)] rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16 lg:py-20">
        {/* Desktop: three columns | Tablet: two rows | Mobile: stacked */}
        <div className="flex flex-col gap-12 lg:gap-16 md:grid md:grid-cols-12 md:items-start">
          {/* Brand / Left */}
          <motion.div 
            className="md:col-span-4 lg:col-span-4 md:pr-8 lg:pr-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-[rgb(209,67,67)] to-[rgb(189,47,47)] flex items-center justify-center shadow-xl">
                <FaHandHoldingHeart className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold tracking-tight text-gray-900">SN Trust</span>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              We are India's most trusted and transparent crowdfunding platform, with a vision to create a social impact. Join us in making a difference.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-[rgb(209,67,67)] hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-[rgb(209,67,67)]">₹10L+</div>
                <div className="text-xs text-gray-600 mt-1">Donations</div>
              </div>
              <div className="text-center bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-[rgb(209,67,67)] hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-[rgb(209,67,67)]">1000+</div>
                <div className="text-xs text-gray-600 mt-1">Donors</div>
              </div>
              <div className="text-center bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-[rgb(209,67,67)] hover:shadow-lg transition-all duration-300">
                <div className="text-2xl font-bold text-[rgb(209,67,67)]">1200+</div>
                <div className="text-xs text-gray-600 mt-1">NGOs</div>
              </div>
            </div>
          </motion.div>

          {/* Navigation / Center */}
          <motion.div 
            className="md:col-span-4 lg:col-span-4 md:px-8 lg:px-12 md:border-l md:border-r md:border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="grid grid-cols-2 gap-8 lg:gap-12">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
                  <span className="h-1 w-8 bg-gradient-to-r from-[rgb(209,67,67)] to-[rgb(189,47,47)] rounded-full"></span>
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  <li><Link to="/about" className="text-gray-600 hover:text-[rgb(209,67,67)] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"><FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(209,67,67)]" />About Us</Link></li>
                  <li><Link to="/campaigns" className="text-gray-600 hover:text-[rgb(209,67,67)] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"><FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(209,67,67)]" />Campaigns</Link></li>
                  <li><Link to="/programs" className="text-gray-600 hover:text-[rgb(209,67,67)] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"><FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(209,67,67)]" />Programs</Link></li>
                  <li><Link to="/events" className="text-gray-600 hover:text-[rgb(209,67,67)] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"><FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(209,67,67)]" />Events</Link></li>
                  <li><Link to="/blog" className="text-gray-600 hover:text-[rgb(209,67,67)] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"><FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(209,67,67)]" />Blog</Link></li>
                  <li><Link to="/contact" className="text-gray-600 hover:text-[rgb(209,67,67)] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"><FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(209,67,67)]" />Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
                  <span className="h-1 w-8 bg-gradient-to-r from-[rgb(209,67,67)] to-[rgb(189,47,47)] rounded-full"></span>
                  Support
                </h4>
                <ul className="space-y-3">
                  <li><Link to="/how-it-works" className="text-gray-600 hover:text-[rgb(209,67,67)] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"><FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(209,67,67)]" />How It Works</Link></li>
                  <li><Link to="/faqs" className="text-gray-600 hover:text-[rgb(209,67,67)] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"><FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(209,67,67)]" />FAQs</Link></li>
                  <li><Link to="/volunteer-join" className="text-gray-600 hover:text-[rgb(209,67,67)] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"><FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(209,67,67)]" />Volunteer</Link></li>
                  <li><Link to="/sn-arya-mitra" className="text-gray-600 hover:text-[rgb(209,67,67)] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"><FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(209,67,67)]" />SN Arya Mitra</Link></li>
                  <li><Link to="/donate" className="text-gray-600 hover:text-[rgb(209,67,67)] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"><FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(209,67,67)]" />Donate</Link></li>
                  <li><Link to="/gift-cards" className="text-gray-600 hover:text-[rgb(209,67,67)] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group"><FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[rgb(209,67,67)]" />Gift Cards</Link></li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact + Socials */}
          <motion.div 
            className="md:col-span-4 lg:col-span-4 md:pl-8 lg:pl-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
              <span className="h-1 w-8 bg-gradient-to-r from-[rgb(209,67,67)] to-[rgb(189,47,47)] rounded-full"></span>
              Get in Touch
            </h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 group">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-[rgb(209,67,67)] to-[rgb(189,47,47)] flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <FaMapMarkerAlt className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm text-gray-600">
                  <p>Main road Jafrabad Near Dawargaon Fata,</p>
                  <p>Behind Sn properties group Tembhurni,</p>
                  <p>Jalna Maharashtra 431208</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-[rgb(209,67,67)] to-[rgb(189,47,47)] flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <FaPhone className="h-4 w-4 text-white" />
                </div>
                <a href="tel:+917570708992" className="text-sm text-gray-600 hover:text-[rgb(209,67,67)] transition-colors">+91 757070899</a>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-[rgb(209,67,67)] to-[rgb(189,47,47)] flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <FaEnvelope className="h-4 w-4 text-white" />
                </div>
                <a href="mailto:sngroupfoundationoffice@gmail.com" className="text-sm text-gray-600 hover:text-[rgb(209,67,67)] transition-colors break-all">sngroupfoundationoffice@gmail.com</a>
              </div>
            </div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Follow Us</h4>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/share/17RycVv5j2/" aria-label="Facebook" className="h-11 w-11 rounded-xl bg-white border-2 border-gray-200 hover:border-[rgb(209,67,67)] hover:bg-[rgb(209,67,67)] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 group">
                <FaFacebook className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
              <a href="https://www.instagram.com/sngroupfoundation?igsh=bTltYXo2anQ0dXg0" aria-label="Instagram" className="h-11 w-11 rounded-xl bg-white border-2 border-gray-200 hover:border-[rgb(209,67,67)] hover:bg-[rgb(209,67,67)] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 group">
                <FaInstagram className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
              <a href="#" aria-label="Twitter" className="h-11 w-11 rounded-xl bg-white border-2 border-gray-200 hover:border-[rgb(209,67,67)] hover:bg-[rgb(209,67,67)] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 group">
                <FaTwitter className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
              <a href="#" aria-label="YouTube" className="h-11 w-11 rounded-xl bg-white border-2 border-gray-200 hover:border-[rgb(209,67,67)] hover:bg-[rgb(209,67,67)] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 group">
                <FaYoutube className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
              <a href="https://www.linkedin.com/company/mansparshi-aashas-sewa-sanstha/" aria-label="LinkedIn" className="h-11 w-11 rounded-xl bg-white border-2 border-gray-200 hover:border-[rgb(209,67,67)] hover:bg-[rgb(209,67,67)] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-110 group">
                <FaLinkedin className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mt-16 lg:mt-20 h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Bottom row */}
        <div className="mt-8 lg:mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-600">© {currentYear} <span className="text-gray-900 font-semibold">SN Trust</span> | Made with <FaHeart className="inline text-[rgb(209,67,67)] animate-pulse" /> in India | All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm flex-wrap">
            <Link to="/terms" className="text-gray-600 hover:text-[rgb(209,67,67)] transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="text-gray-600 hover:text-[rgb(209,67,67)] transition-colors">Privacy Policy</Link>
            <Link to="/shipping" className="text-gray-600 hover:text-[rgb(209,67,67)] transition-colors">Shipping</Link>
            <Link to="/cancellation-refunds" className="text-gray-600 hover:text-[rgb(209,67,67)] transition-colors">Cancellation & Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;