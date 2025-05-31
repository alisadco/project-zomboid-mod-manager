// src/components/LoadingSpinner.js
import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading..." }) => {
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <div className="spinner-modern">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                <p className="loading-message">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;