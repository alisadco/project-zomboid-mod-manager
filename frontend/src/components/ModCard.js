// src/components/ModCard.js
import React from 'react';
import MapCard from './MapCard';

const ModCard = ({ mod, removeMod, removeMap }) => {
    return (
        <div className="mod-card">
            <div className="mod-card-header">
                <div className="mod-thumbnail">
                    <img src={mod.thumbnail} alt={mod.modName} />
                    <div className="mod-overlay">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
                <div className="mod-info">
                    <h3 className="mod-title">
                        <a
                            href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.workshopId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {mod.modName}
                        </a>
                    </h3>
                    <p className="mod-id">ID: {mod.workshopId}</p>
                    <div className="mod-actions">
                        <button
                            className="btn-remove"
                            onClick={() => removeMod(mod.workshopId)}
                            title="Remove mod"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Remove
                        </button>
                    </div>
                </div>
            </div>

            <div className="mod-maps">
                <h4 className="maps-title">Maps ({mod.maps.length})</h4>
                {mod.maps.length === 0 ? (
                    <div className="no-maps">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p>No maps available</p>
                    </div>
                ) : (
                    <div className="maps-grid">
                        {mod.maps.map((map) => (
                            <MapCard
                                key={map}
                                mapName={map}
                                modName={mod.modName}
                                removeMap={() => removeMap(mod.workshopId, map)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModCard;