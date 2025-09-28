import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-slate-200 bg-gradient-to-b from-[#0d1733] to-[#0b1430]">
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Desktop: three columns | Tablet: two rows | Mobile: stacked */}
        <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:items-start md:gap-y-0 md:gap-x-16 lg:gap-x-20">
          {/* Brand / Left */}
          <div className="md:col-span-4 lg:col-span-4 md:pr-16 lg:pr-20">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary-500/90 flex items-center justify-center">
                <FaHeart className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-semibold tracking-tight text-white">SN Trust</span>
            </div>
            <p className="text-slate-300/90 leading-relaxed max-w-md">
              We are India's most trusted and transparent crowdfunding platform, with a vision to create a social impact. Our unique model allows people from across the globe to donate towards raising funds for products required by NGOs and charities in India.
            </p>
            
            {/* Stats (kept from original, placed after socials) */}
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-primary-400">₹10 Lakh+ </div>
                <div className="text-xs md:text-sm text-slate-400">Worth Donations</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-primary-400">1000+</div>
                <div className="text-xs md:text-sm text-slate-400">Donor Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-primary-400">1200+</div>
                <div className="text-xs md:text-sm text-slate-400">NGOs Impacted</div>
              </div>
            </div>
          </div>

          {/* Navigation / Center */}
          <div className="md:col-span-5 lg:col-span-5 md:pl-12 lg:pl-16">
            <div className="grid grid-cols-2 gap-3 md:gap-10 lg:gap-12">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">Quick Links</h4>
                <ul className="space-y-3">
                  <li><Link to="/about" className="text-slate-300 hover:text-white hover:underline transition-colors">About Us</Link></li>
                  <li><Link to="/campaigns" className="text-slate-300 hover:text-white hover:underline transition-colors">Campaigns</Link></li>
                  <li><Link to="/programs" className="text-slate-300 hover:text-white hover:underline transition-colors">Programs</Link></li>
                  <li><Link to="/events" className="text-slate-300 hover:text-white hover:underline transition-colors">Events</Link></li>
                  <li><Link to="/blog" className="text-slate-300 hover:text-white hover:underline transition-colors">Blog</Link></li>
                  <li><Link to="/contact" className="text-slate-300 hover:text-white hover:underline transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">Support</h4>
                <ul className="space-y-3">
                  <li><Link to="/how-it-works" className="text-slate-300 hover:text-white hover:underline transition-colors">How It Works</Link></li>
                  <li><Link to="/faqs" className="text-slate-300 hover:text-white hover:underline transition-colors">FAQs</Link></li>
                  <li><Link to="/volunteer-join" className="text-slate-300 hover:text-white hover:underline transition-colors">Join as Volunteer</Link></li>
                  <li><Link to="/sn-arya-mitra" className="text-slate-300 hover:text-white hover:underline transition-colors">SN Arya Mitra</Link></li>
                  <li><Link to="/donate" className="text-slate-300 hover:text-white hover:underline transition-colors">Donate Monthly</Link></li>
                  <li><Link to="/gift-cards" className="text-slate-300 hover:text-white hover:underline transition-colors">Gift Cards</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Contact + Socials */}
          <div className="md:col-span-3  lg:col-span-3 text-left">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-5 md:mb-4">Contact Us</h4>
            <div className="space-y-4 md:space-y-3 mb-3 md:mb-4 text-slate-200/90">
              <div className="flex items-start justify-start gap-3">
                <FaMapMarkerAlt className="h-4 w-4 mt-0.5 text-primary-400 flex-shrink-0" />
                <div className="text-left">
                  <p>5th Main Rd, Sector 6, HSR Layout,</p>
                  <p>Bangalore, Karnataka, 560102</p>
                </div>
              </div>
              <div className="flex items-center justify-start gap-3">
                <FaPhone className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <a href="tel:+918045685000" className="hover:text-white transition-colors">+91 757070899</a>
              </div>
              <div className="flex items-center justify-start gap-3">
                <FaEnvelope className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@sntrust.com" className="hover:text-white transition-colors">sngroupfoundationoffice@gmail.com</a>
              </div>
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Find Us On</h4>
            <div className="flex items-center justify-start gap-3">
              <a href="https://www.facebook.com/share/17RycVv5j2/" aria-label="Facebook" className="h-9 w-9 rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 flex items-center justify-center transition-colors">
                <FaFacebook className="h-4 w-4 text-slate-200" />
              </a>
              <a href="https://www.instagram.com/sngroupfoundation?igsh=bTltYXo2anQ0dXg0" aria-label="Instagram" className="h-9 w-9 rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 flex items-center justify-center transition-colors">
                <FaInstagram className="h-4 w-4 text-slate-200" />
              </a>
              <a href="#" aria-label="Twitter" className="h-9 w-9 rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 flex items-center justify-center transition-colors">
                <FaTwitter className="h-4 w-4 text-slate-200" />
              </a>
              <a href="#" aria-label="YouTube" className="h-9 w-9 rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 flex items-center justify-center transition-colors">
                <FaYoutube className="h-4 w-4 text-slate-200" />
              </a>
              <a href="https://www.linkedin.com/company/mansparshi-aashas-sewa-sanstha/" aria-label="LinkedIn" className="h-9 w-9 rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 flex items-center justify-center transition-colors">
                <FaLinkedin className="h-4 w-4 text-slate-200" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 lg:mt-14 h-px w-full bg-white/10" />

        {/* Bottom row */}
        <div className="mt-6 lg:mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-400">© {currentYear} SN Trust | All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/terms" className="text-slate-300 hover:text-white hover:underline transition-colors">Terms of Use</Link>
            <Link to="/privacy" className="text-slate-300 hover:text-white hover:underline transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;