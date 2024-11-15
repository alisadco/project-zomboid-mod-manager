// src/components/ModSection.js
import React, { useState } from 'react';
import ModCard from './ModCard';

const ModSection = ({ mods, removeMod, removeMap }) => {
    const [modSearchTerm, setModSearchTerm] = useState('');

    // Filter mods based on the search term
    const filteredMods = mods.filter((mod) =>
        mod.modName.toLowerCase().includes(modSearchTerm.toLowerCase())
    );

    return (
        <div className="section">
            <h2>Mods</h2>
            <input
                type="text"
                placeholder="Search Mods"
                value={modSearchTerm}
                onChange={(e) => setModSearchTerm(e.target.value)}
            />
            <div className="mod-cards">
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
                    <p>No mods found.</p>
                )}
            </div>
        </div>
    );
};

export default ModSection;
