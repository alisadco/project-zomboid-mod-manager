// src/components/MapSection.js
import React, { useState } from 'react';
import MapCard from './MapCard';

const MapSection = ({ mods, removeMap }) => {
    const [mapSearchTerm, setMapSearchTerm] = useState('');

    const filterMaps = (map) => map.toLowerCase().includes(mapSearchTerm.toLowerCase());

    const allMaps = mods.flatMap((mod) =>
        mod.maps.filter(filterMaps).map((map) => ({
            mapName: map,
            modName: mod.modName,
            workshopId: mod.workshopId,
            removeMap: () => removeMap(mod.workshopId, map)
        }))
    );

    return (
        <section className="content-section">
            <div className="section-header">
                <div className="section-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h2>Maps</h2>
                    <span className="count-badge">{allMaps.length}</span>
                </div>
                <div className="search-container">
                    <div className="search-input-wrapper">
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search maps..."
                            value={mapSearchTerm}
                            onChange={(e) => setMapSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {mapSearchTerm && (
                            <button
                                className="clear-search"
                                onClick={() => setMapSearchTerm('')}
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

            <div className="maps-container">
                {allMaps.length > 0 ? (
                    allMaps.map((mapData, index) => (
                        <MapCard
                            key={`${mapData.workshopId}-${mapData.mapName}-${index}`}
                            mapName={mapData.mapName}
                            modName={mapData.modName}
                            removeMap={mapData.removeMap}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3>No maps found</h3>
                        <p>{mapSearchTerm ? 'Try adjusting your search terms' : 'Maps will appear here when you add mods'}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MapSection;