// src/components/ModSection.js
import React, { useState } from 'react';
import ModCard from './ModCard';

const ModSection = ({ mods, removeMod, removeMap }) => {
    const [modSearchTerm, setModSearchTerm] = useState('');

    const filteredMods = mods.filter((mod) =>
        mod.modName.toLowerCase().includes(modSearchTerm.toLowerCase())
    );

    return (
        <section className="content-section">
            <div className="section-header">
                <div className="section-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h2>Mods</h2>
                    <span className="count-badge">{filteredMods.length}</span>
                </div>
                <div className="search-container">
                    <div className="search-input-wrapper">
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search mods..."
                            value={modSearchTerm}
                            onChange={(e) => setModSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {modSearchTerm && (
                            <button
                                className="clear-search"
                                onClick={() => setModSearchTerm('')}
                                title="Clear search"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="content-grid">
                {filteredMods.length > 0 ? (
                    filteredMods.map((mod) => (
                        <ModCard
                            key={mod.workshopId}
                            mod={mod}
                            removeMod={removeMod}
                            removeMap={removeMap}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3>No mods found</h3>
                        <p>{modSearchTerm ? 'Try adjusting your search terms' : 'Add some mods to get started'}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ModSection;