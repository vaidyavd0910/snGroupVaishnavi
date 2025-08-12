import React from 'react';
import OurVision from '../components/OurVision';
import PageHeader from '../components/PageHeader';

const OurVisionPage = () => {
  return (
    <div className="page-container">
      <PageHeader 
        title="Our Vision" 
        backgroundImage="/images/vision-bg.jpg"
        description="Discover our aspirations for a better world and how we're working to achieve them"
      />
      <OurVision />
    </div>
  );
};

export default OurVisionPage; 