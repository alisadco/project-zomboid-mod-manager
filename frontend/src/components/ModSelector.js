// src/components/ModSelector.js
import React, { useState } from 'react';
import ModSection from './ModSection';
import MapSection from './MapSection';
import LoadingSpinner from './LoadingSpinner'; // Import Spinner component

const ModSelector = () => {
    const [collectionId, setCollectionId] = useState('');
    const [individualModId, setIndividualModId] = useState('');
    const [mods, setMods] = useState([]);
    const [loading, setLoading] = useState(false);  // Add loading state

    const apiUrl = process.env.REACT_APP_API_URL;

    // Fetch mods by collection ID
    const fetchModsByCollectionId = async () => {
        if (!collectionId) {
            alert("Please enter a collection ID.");
            return;
        }

        setLoading(true);  // Set loading state to true

        try {
            const response = await fetch(`${apiUrl}/api/mods/getWorkshopIds?collectionId=${collectionId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch mods');
            }

            const data = await response.json();
            setMods(data.map(mod => ({
                modName: mod.modName,
                workshopId: mod.workshopId,
                thumbnail: mod.thumbnailUrl,
                maps: mod.maps  // No modification of maps here
            })));

            setCollectionId('');
        } catch (error) {
            console.error('Error fetching mods:', error);
            alert('Failed to fetch mod details. Please try again.');
        } finally {
            setLoading(false);  // Set loading state to false after fetch
        }
    };

    // Fetch individual mod details by ID
    const fetchModById = async () => {
        if (!individualModId) {
            alert("Please enter a mod ID.");
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/mods/getModDetails?workshopID=${individualModId}`);
            if (!response.ok) {
                // If the response is not ok, do nothing
                console.error('Failed to fetch mod details or mod not found.');
                return;
            }

            const modDetails = await response.json();

            // Check if modName, workshopId, or thumbnail is null or undefined
            if (!modDetails.modName || !modDetails.workshopId || !modDetails.thumbnailUrl) {
                console.log('Invalid mod data, not adding.');
                return; // Do nothing if any of these values are missing
            }

            // If all required fields are valid, create the new mod object
            const newMod = {
                modName: modDetails.modName,
                workshopId: modDetails.workshopId,
                thumbnail: modDetails.thumbnailUrl,
                maps: modDetails.maps,
            };

            // Add the new mod to the existing mods list
            setMods((prevMods) => [...prevMods, newMod]);
            setIndividualModId('');  // Clear the input field after success
        } catch (error) {
            // Handle any errors (e.g., network issues or invalid responses)
            console.error('Error fetching mod by ID:', error);
            alert('Failed to fetch mod details. Please try again.');
        }
    };

    // Remove a mod by its workshop ID
    const removeMod = (workshopId) => {
        setMods((prevMods) => prevMods.filter((mod) => mod.workshopId !== workshopId));
    };

    // Remove a specific map from a mod by workshop ID and map name
    const removeMap = (workshopId, mapName) => {
        setMods((prevMods) =>
            prevMods.map((mod) =>
                mod.workshopId === workshopId
                    ? { ...mod, maps: mod.maps.filter((map) => map !== mapName) }
                    : mod
            )
        );
    };

    // Function to copy the mods, maps, and workshop IDs to the clipboard
    const copyToClipboard = () => {
        const modsNames = mods.map(mod => mod.modName).join('; ');
        const maps = ['Muldraugh, KY', ...mods.flatMap(mod => mod.maps)].join('; '); // Include Muldraugh, KY always
        const workshopIds = mods.map(mod => mod.workshopId).join('; ');

        const data = `
Mods=${modsNames}
Map=${maps}
WorkshopItems=${workshopIds}
        `.trim();

        const textArea = document.createElement('textarea');
        textArea.value = data;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        alert('Mod details copied to clipboard!');
    };

    return (
        <main>
            {/* Loading Spinner */}
            {loading && <LoadingSpinner />}

            {/* Collection ID Input */}
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Enter Collection ID"
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                />
                <button onClick={fetchModsByCollectionId} disabled={loading}>
                    Fetch Mods from Collection
                </button>
            </div>

            {/* Individual Mod ID Input */}
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Enter Mod ID"
                    value={individualModId}
                    onChange={(e) => setIndividualModId(e.target.value)}
                />
                <button onClick={fetchModById} disabled={loading}>
                    Add Individual Mod
                </button>
            </div>

            {/* Button to copy mod details to clipboard */}
            <div className="copy-button">
                <button onClick={copyToClipboard} disabled={loading}>
                    Copy Mod Details
                </button>
            </div>

            {/* Mod Section */}
            <ModSection mods={mods} removeMod={removeMod} removeMap={removeMap} />

            {/* Map Section */}
            <MapSection mods={mods} removeMap={removeMap} />
        </main>
    );
};

export default ModSelector;
