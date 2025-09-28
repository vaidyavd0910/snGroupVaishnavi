import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Higher-Order Component (HOC) that provides admin access control
 * Wraps admin components to ensure only admin users can access them
 */
const withAdminAccess = (WrappedComponent) => {
  const WithAdminAccess = (props) => {
    const { currentUser, loading } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    // Redirect to access denied if not admin
    if (currentUser.role !== 'admin') {
      return <Navigate to="/access-denied" />;
    }

    // Render the wrapped component if user is admin
    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  WithAdminAccess.displayName = `withAdminAccess(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithAdminAccess;
};

export default withAdminAccess;
