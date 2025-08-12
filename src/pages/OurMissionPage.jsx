import React from 'react';
import OurMission from '../components/OurMission';
import PageHeader from '../components/PageHeader';

const OurMissionPage = () => {
  return (
    <div className="page-container">
      <PageHeader 
        title="Our Mission" 
        backgroundImage="/images/mission-bg.jpg"
        description="Discover how we're working to create positive change in our world"
      />
      <OurMission />
    </div>
  );
};

export default OurMissionPage; 