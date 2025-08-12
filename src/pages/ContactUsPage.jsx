import React from 'react';
import ContactUs from '../components/ContactUs';
import PageHeader from '../components/PageHeader';

const ContactUsPage = () => {
  return (
    <div className="page-container">
      <PageHeader 
        title="Contact Us" 
        backgroundImage="/images/contact-bg.jpg"
        description="Get in touch with our team"
      />
      <ContactUs />
    </div>
  );
};

export default ContactUsPage; 