// src/components/MapSection.js
import React, { useState } from 'react';
import MapCard from './MapCard';

const MapSection = ({ mods }) => {
    const [mapSearchTerm, setMapSearchTerm] = useState('');

    const filterMaps = (map) => map.toLowerCase().includes(mapSearchTerm.toLowerCase());

    return (
        <div className="section">
            <h2>Maps</h2>

            {/* Search bar for maps */}
            <input
                type="text"
                placeholder="Search Maps"
                value={mapSearchTerm}
                onChange={(e) => setMapSearchTerm(e.target.value)}
            />

            <div className="map-cards">
                {mods.flatMap((mod) =>
                    mod.maps.filter(filterMaps).map((map, index) => (
                        <MapCard key={`${mod.workshopId}-${map}`} mapName={map} modName={mod.modName} />
                    ))
                )}
            </div>
        </div>
    );
};

export default MapSection;
