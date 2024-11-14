// src/components/ModSection.js
import React, { useState } from 'react';
import ModCard from './ModCard';

const ModSection = ({ mods }) => {
    const [modSearchTerm, setModSearchTerm] = useState('');

    const filterMods = (mod) => mod.modName.toLowerCase().includes(modSearchTerm.toLowerCase());

    return (
        <div className="section">
            <h2>Mods</h2>

            {/* Search bar for mods */}
            <input
                type="text"
                placeholder="Search Mods"
                value={modSearchTerm}
                onChange={(e) => setModSearchTerm(e.target.value)}
            />

            <div className="mod-cards">
                {mods.filter(filterMods).map((mod) => (
                    <ModCard key={mod.workshopId} mod={mod} />
                ))}
            </div>
        </div>
    );
};

export default ModSection;
