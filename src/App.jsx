import React from 'react';
import { Routes, Route, BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router2, useLocation as useLocation2 } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/Login';
import PrivateRoute from './components/Auth/PrivateRoute';
import './App.css';
import './styles/DonationCards.css';
import Footer from './components/Footer';
// Layout components
import Navbar from './components/Navbar';
import Dashboard from './pages/Admin';
// Pages we've created
import AboutUsPage from './pages/AboutUsPage';
import WhyChooseUsPage from './pages/WhyChooseUsPage';
import OurMissionPage from './pages/OurMissionPage';
import OurVisionPage from './pages/OurVisionPage';
import ContactUsPage from './pages/ContactUsPage';
// New pages
import Programs from './pages/Programs';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Register from './components/Register';
import DonationPage from './pages/DonationPage';
import DonationDetails from './pages/DonationDetails';
import VolunteerForm from './pages/VolunteerForm'
import SubadminManagement from './components/admin/SubadminManagement';
import SubadminDashboard from './components/admin/SubadminDashboard';
import ProgramDetails from './pages/ProgramDetails';
import BlogDetails from './pages/BlogDetails';
import UserDashboard from './pages/UserDashboard';
import Profile from './components/Profile';
import Campaigns from './pages/Campaigns';
import NotFound from './pages/NotFound';
import EventDetails from './pages/EventDetails';
// Custom hooks
import useScrollToTop from './hooks/useScrollToTop';
import Emergency from './pages/Emergency';
import EmergencyDetail from './pages/EmergencyDetail';

// Create a wrapper component to use useLocation hook
function AppContent() {
  const location = useLocation();
  
  // Use the scroll to top hook
  useScrollToTop();

  return (
    <>
    <Navbar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* About routes */}
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
            <Route path="/mission" element={<OurMissionPage />} />
            <Route path="/vision" element={<OurVisionPage />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/donations/:id" element={<DonationDetails />} />
            <Route path="/sn-arya-mitra" element={<Emergency />} />
            <Route path="/sn-arya-mitra/:id" element={<EmergencyDetail />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/emergency/:id" element={<EmergencyDetail />} />
            
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Contact route */}
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/campaigns" element={<Campaigns />} />
            
            {/* New routes */}
            <Route path="/programs" element={<Programs />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/events/:id" element={<EventDetails />} />
            
            {/* Temporary home route - redirect to About for now */}
            <Route path="/" element={<Home />} />
            <Route path="/volunteer-join" element={<VolunteerForm />} />
            <Route 
              path="/admin" 
              element={
                // <PrivateRoute>
                <>
                <AdminDashboard />
                <SubadminManagement />
                </>
                // </PrivateRoute>
              } 
            />
            <Route 
              path="/subadmin" 
              element={
                // <PrivateRoute>
                <SubadminDashboard />
                // </PrivateRoute>
              } 
            />
            <Route path="/programs/:id" element={<ProgramDetails />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  );
}

function App() {
  return (

      <AuthProvider>
        <AppContent />
        <Footer />

      </AuthProvider>

  );
}

export default App; 