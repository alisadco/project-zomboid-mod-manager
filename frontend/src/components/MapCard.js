import React from 'react';

const MapCard = ({ mapName, modName, removeMap }) => {
    return (
        <div className="card map-card">
            <h4>{mapName}</h4>
            <p>Mod: {modName}</p>
            {/* Remove Map Button */}
            <button onClick={removeMap}>Remove Map</button>
        </div>
    );
};

export default MapCard;
