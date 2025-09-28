import React from 'react';
import './Loader.css';

const Loader = ({ size = 48, color = '#1aaf5d', text = 'Loading...' }) => (
  <div className="loader-container">
    <div
      className="loader-spinner"
      style={{ width: size, height: size, borderColor: `${color}33`, borderTopColor: color }}
    />
    {text && <div className="loader-text">{text}</div>}
  </div>
);

export default Loader;