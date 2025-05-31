// src/components/Header.js
import React from 'react';

const Header = () => (
    <header className="header">
        <div className="header-content">
            <div className="header-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <h1 className="header-title">Project Zomboid Mod Manager</h1>
            <p className="header-subtitle">Organize and manage your mods with ease</p>
        </div>
    </header>
);

export default Header;