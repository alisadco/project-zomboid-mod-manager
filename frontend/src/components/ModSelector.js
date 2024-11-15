import React, { useState } from 'react';
import ModSection from './ModSection';
import MapSection from './MapSection';
import LoadingSpinner from './LoadingSpinner'; // Import Spinner component

const ModSelector = () => {
    const [collectionId, setCollectionId] = useState('');
    const [individualModId, setIndividualModId] = useState('');
    const [mods, setMods] = useState([]);
    const [loading, setLoading] = useState(false);  // Loading state to manage async requests
    const [errorMessage, setErrorMessage] = useState(null); // For error messages
    const [invalidMods, setInvalidMods] = useState([]); // List for mods with null values

    const apiUrl = process.env.REACT_APP_API_URL;

    // Fetch mods by collection ID with async handling
    const fetchModsByCollectionId = async () => {
        if (!collectionId) {
            alert("Please enter a collection ID.");
            return;
        }

        setLoading(true);  // Set loading to true
        setErrorMessage(null); // Reset error message on each fetch

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

            // Fetching mod details from the API asynchronously
            const response = await fetch(`${apiUrl}/api/mods/getWorkshopIds?collectionId=${collectionId}`, {
                signal: controller.signal,  // Pass the abort signal
            });

            clearTimeout(timeoutId); // Clear timeout if fetch completes in time

            if (!response.ok) {
                throw new Error('Failed to fetch mods');
            }

            const data = await response.json();

            // Process mods and detect invalid ones with null values
            const validMods = [];
            const invalidModList = [];

            data.forEach(mod => {
                // Check for mods with null values and add them to the invalid list
                if (!mod.modName || !mod.thumbnailUrl || !mod.maps) {
                    invalidModList.push(mod.workshopId);  // Collect invalid mods by their workshopId
                } else {
                    validMods.push({
                        modName: mod.modName,
                        workshopId: mod.workshopId,
                        thumbnail: mod.thumbnailUrl,
                        maps: mod.maps,  // Maps remain as they are
                    });
                }
            });

            setMods(validMods);  // Set valid mods to the state
            setInvalidMods(invalidModList);  // Set invalid mods to the state

            setCollectionId('');  // Clear the input field after successful fetch
        } catch (error) {
            console.error('Error fetching mods:', error);
            if (error.name === 'AbortError') {
                setErrorMessage('The request timed out. Please try again.');
            } else {
                setErrorMessage('Failed to fetch mod details. Please try again.');
            }
        } finally {
            setLoading(false);  // Reset loading state after async operation
        }
    };

    // Fetch individual mod details by ID with async handling
    const fetchModById = async () => {
        if (!individualModId) {
            alert("Please enter a mod ID.");
            return;
        }

        setLoading(true);  // Set loading to true
        setErrorMessage(null); // Reset error message on each fetch

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

            // Fetching individual mod details asynchronously
            const response = await fetch(`${apiUrl}/api/mods/getModDetails?workshopID=${individualModId}`, {
                signal: controller.signal,  // Pass the abort signal
            });

            clearTimeout(timeoutId); // Clear timeout if fetch completes in time

            if (!response.ok) {
                console.error('Failed to fetch mod details or mod not found.');
                return;
            }

            const modDetails = await response.json();

            // Check if mod details are valid before adding
            if (!modDetails.modName || !modDetails.workshopId || !modDetails.thumbnailUrl) {
                console.log('Invalid mod data, not adding.');
                setInvalidMods((prevList) => [...prevList, modDetails.workshopId]);  // Add to invalid list
                return; // If data is invalid, do nothing
            }

            const newMod = {
                modName: modDetails.modName,
                workshopId: modDetails.workshopId,
                thumbnail: modDetails.thumbnailUrl,
                maps: modDetails.maps,
            };

            // Add the new mod to the list
            setMods((prevMods) => [...prevMods, newMod]);
            setIndividualModId('');  // Clear input after success
        } catch (error) {
            console.error('Error fetching mod by ID:', error);
            if (error.name === 'AbortError') {
                setErrorMessage('The request timed out. Please try again.');
            } else {
                setErrorMessage('Failed to fetch mod details. Please try again.');
            }
        } finally {
            setLoading(false);  // Reset loading state after async operation
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

        const data = `Mods=${modsNames}\nMap=${maps}\nWorkshopItems=${workshopIds}`.trim();

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

            {/* Error Message */}
            {errorMessage && <p className="error">{errorMessage}</p>}

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

            {/* Show invalid mods if any */}
            {invalidMods.length > 0 && (
                <div className="invalid-mods">
                    <h3>Mods with Missing Data:</h3>
                    <p>These mods have missing information and could not be added fully:</p>
                    <ul>
                        {invalidMods.map((workshopId) => (
                            <li key={workshopId}>Workshop ID: {workshopId}</li>
                        ))}
                    </ul>
                </div>
            )}
        </main>
    );
};

export default ModSelector;
