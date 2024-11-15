// src/components/ModCard.js
import React from 'react';
import MapCard from './MapCard';

const ModCard = ({ mod, removeMod, removeMap }) => {
    return (
        <div className="card mod-card">
            <div className="mod-header">
                <img src={mod.thumbnail} alt={mod.modName} />
                <h3>
                    <a
                        href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.workshopId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {mod.modName}
                    </a>
                </h3>
                <p>Workshop ID: {mod.workshopId}</p>
                <button onClick={() => removeMod(mod.workshopId)}>Remove Mod</button>
            </div>

            <div className="maps">
                {mod.maps.length === 0 ? (
                    <p>No maps available for this mod.</p>
                ) : (
                    mod.maps.map((map) => (
                        <MapCard
                            key={map}
                            mapName={map}
                            modName={mod.modName}
                            removeMap={() => removeMap(mod.workshopId, map)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ModCard;
