import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50  pt-5 text-gray-800 border-t border-gray-200">
      <div className="mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center mr-3">
                <FaHeart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">SN Trust</span>
            </div>
            <p className="text-gray-600 leading-relaxed mb-8">
              We are India's most trusted and transparent crowdfunding platform, 
              with a vision to create a social impact. Our unique model allows 
              people from across the globe to donate towards raising funds for 
              products required by NGOs and charities in India.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">₹300+ Cr</div>
                <div className="text-sm text-gray-500">Worth Donations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">15 Lakhs</div>
                <div className="text-sm text-gray-500">Donor Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">1400+</div>
                <div className="text-sm text-gray-500">NGOs Impacted</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b-2 border-primary-500 inline-block text-gray-900">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Campaigns
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b-2 border-primary-500 inline-block text-gray-900">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/volunteer-join" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Join as Volunteer
                </Link>
              </li>
              <li>
                <Link to="/sn-arya-mitra" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  SN Arya Mitra
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Donate Monthly
                </Link>
              </li>
              <li>
                <Link to="/gift-cards" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 pb-2 border-b-2 border-primary-500 inline-block text-gray-900">
              Contact Us
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-600">5th Main Rd, Sector 6, HSR Layout,</p>
                  <p className="text-gray-600">Bangalore, Karnataka, 560102</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <p className="text-gray-600">+91 8045685000</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <p className="text-gray-600">info@sntrust.com</p>
              </div>
            </div>
            
            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Find Us On</h4>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-colors duration-200 group shadow-sm"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-5 h-5 text-gray-600 group-hover:text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-colors duration-200 group shadow-sm"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-5 h-5 text-gray-600 group-hover:text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-colors duration-200 group shadow-sm"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5 text-gray-600 group-hover:text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-colors duration-200 group shadow-sm"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5 text-gray-600 group-hover:text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-colors duration-200 group shadow-sm"
                  aria-label="YouTube"
                >
                  <FaYoutube className="w-5 h-5 text-gray-600 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-300 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} SN Trust | All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link 
                to="/terms" 
                className="text-gray-500 hover:text-primary-600 transition-colors duration-200 text-sm"
              >
                Terms of Use
              </Link>
              <Link 
                to="/privacy" 
                className="text-gray-500 hover:text-primary-600 transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 