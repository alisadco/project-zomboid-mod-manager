// src/components/Footer.js
import React from 'react';

const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            <p>&copy; 2024 Project Zomboid Mod Manager</p>
            <div className="footer-links">
                <a href="https://projectzomboid.com" target="_blank" rel="noopener noreferrer">
                    Project Zomboid
                </a>
                <span className="divider">•</span>
                <a href="https://steamcommunity.com/app/108600/workshop/" target="_blank" rel="noopener noreferrer">
                    Steam Workshop
                </a>
            </div>
        </div>
    </footer>
);

export default Footer;