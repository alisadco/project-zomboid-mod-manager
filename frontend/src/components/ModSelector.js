import React, { useState } from 'react';
import ModSection from './ModSection';
import MapSection from './MapSection';
import LoadingSpinner from './LoadingSpinner';

const ModSelector = () => {
    const [collectionId, setCollectionId] = useState('');
    const [individualModId, setIndividualModId] = useState('');
    const [mods, setMods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [invalidMods, setInvalidMods] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL;

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const fetchModsByCollectionId = async () => {
        if (!collectionId.trim()) {
            setErrorMessage("Please enter a collection ID.");
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(`${apiUrl}/api/mods/getWorkshopIds?collectionId=${collectionId}`, {
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Failed to fetch mods');
            }

            const data = await response.json();
            const validMods = [];
            const invalidModList = [];

            data.forEach(mod => {
                if (!mod.modName || !mod.thumbnailUrl || !mod.maps) {
                    invalidModList.push(mod.workshopId);
                } else {
                    validMods.push({
                        modName: mod.modName,
                        workshopId: mod.workshopId,
                        thumbnail: mod.thumbnailUrl,
                        maps: mod.maps,
                    });
                }
            });

            setMods(validMods);
            setInvalidMods(invalidModList);
            setCollectionId('');
            showSuccess(`Successfully loaded ${validMods.length} mods from collection!`);
        } catch (error) {
            console.error('Error fetching mods:', error);
            if (error.name === 'AbortError') {
                setErrorMessage('The request timed out. Please try again.');
            } else {
                setErrorMessage('Failed to fetch mod details. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchModById = async () => {
        if (!individualModId.trim()) {
            setErrorMessage("Please enter a mod ID.");
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 150000);

            const response = await fetch(`${apiUrl}/api/mods/getModDetails?workshopID=${individualModId}`, {
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Failed to fetch mod details or mod not found.');
            }

            const modDetails = await response.json();

            if (!modDetails.modName || !modDetails.workshopId || !modDetails.thumbnailUrl) {
                console.log('Invalid mod data, not adding.');
                setInvalidMods((prevList) => [...prevList, modDetails.workshopId]);
                setErrorMessage('Mod data is incomplete and cannot be added.');
                return;
            }

            const newMod = {
                modName: modDetails.modName,
                workshopId: modDetails.workshopId,
                thumbnail: modDetails.thumbnailUrl,
                maps: modDetails.maps,
            };

            setMods((prevMods) => [...prevMods, newMod]);
            setIndividualModId('');
            showSuccess(`Successfully added "${modDetails.modName}"!`);
        } catch (error) {
            console.error('Error fetching mod by ID:', error);
            if (error.name === 'AbortError') {
                setErrorMessage('The request timed out. Please try again.');
            } else {
                setErrorMessage('Failed to fetch mod details. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const removeMod = (workshopId) => {
        const modToRemove = mods.find(mod => mod.workshopId === workshopId);
        setMods((prevMods) => prevMods.filter((mod) => mod.workshopId !== workshopId));
        if (modToRemove) {
            showSuccess(`Removed "${modToRemove.modName}"`);
        }
    };

    const removeMap = (workshopId, mapName) => {
        setMods((prevMods) =>
            prevMods.map((mod) =>
                mod.workshopId === workshopId
                    ? { ...mod, maps: mod.maps.filter((map) => map !== mapName) }
                    : mod
            )
        );
        showSuccess(`Removed map "${mapName}"`);
    };

    const copyToClipboard = () => {
        const modsNames = mods.map(mod => mod.modName).join('; ');
        const maps = ['Muldraugh, KY', ...mods.flatMap(mod => mod.maps)].join('; ');
        const workshopIds = mods.map(mod => mod.workshopId).join('; ');

        const data = `Mods=${modsNames}\nMap=${maps}\nWorkshopItems=${workshopIds}`.trim();

        navigator.clipboard.writeText(data).then(() => {
            showSuccess('Mod details copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = data;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showSuccess('Mod details copied to clipboard!');
        });
    };

    const clearAllMods = () => {
        if (window.confirm('Are you sure you want to remove all mods?')) {
            setMods([]);
            setInvalidMods([]);
            showSuccess('All mods cleared!');
        }
    };

    return (
        <>
            {loading && <LoadingSpinner message="Fetching mod data..." />}

            {successMessage && (
                <div className="notification success">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="notification error">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {errorMessage}
                </div>
            )}

            <div className="controls-section">
                <div className="controls-header">
                    <h2>Add Mods</h2>
                    <p>Import mods from Steam Workshop collections or add individual mods</p>
                </div>

                <div className="controls-grid">
                    <div className="control-card">
                        <div className="control-header">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71867 9.79619 2.24618C11.8996 1.77369 14.1003 1.98914 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h3>Collection Import</h3>
                        </div>
                        <p>Import all mods from a Steam Workshop collection</p>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Enter Collection ID"
                                value={collectionId}
                                onChange={(e) => setCollectionId(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && fetchModsByCollectionId()}
                                disabled={loading}
                            />
                            <button
                                className="btn-primary"
                                onClick={fetchModsByCollectionId}
                                disabled={loading || !collectionId.trim()}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Import Collection
                            </button>
                        </div>
                    </div>

                    <div className="control-card">
                        <div className="control-header">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h3>Individual Mod</h3>
                        </div>
                        <p>Add a single mod by its Workshop ID</p>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Enter Mod ID"
                                value={individualModId}
                                onChange={(e) => setIndividualModId(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && fetchModById()}
                                disabled={loading}
                            />
                            <button
                                className="btn-primary"
                                onClick={fetchModById}
                                disabled={loading || !individualModId.trim()}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Add Mod
                            </button>
                        </div>
                    </div>
                </div>

                {mods.length > 0 && (
                    <div className="action-bar">
                        <button
                            className="btn-secondary"
                            onClick={copyToClipboard}
                            disabled={loading}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Copy Configuration
                        </button>
                        <button
                            className="btn-danger"
                            onClick={clearAllMods}
                            disabled={loading}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            <ModSection mods={mods} removeMod={removeMod} removeMap={removeMap} />
            <MapSection mods={mods} removeMap={removeMap} />

            {invalidMods.length > 0 && (
                <div className="invalid-mods-section">
                    <div className="invalid-mods-card">
                        <div className="invalid-header">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.29 3.86L1.82 18C1.64466 18.3024 1.55611 18.6453 1.56331 18.9945C1.57051 19.3437 1.67319 19.6828 1.86 19.9788C2.04681 20.2747 2.31259 20.5157 2.62618 20.6754C2.93977 20.8351 3.28746 20.9068 3.64 20.88H20.36C20.7125 20.9068 21.0602 20.8351 21.3738 20.6754C21.6874 20.5157 21.9532 20.2747 22.14 19.9788C22.3268 19.6828 22.4295 19.3437 22.4367 18.9945C22.4439 18.6453 22.3553 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3438 2.89725 12 2.89725C11.6562 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86V3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h3>Incomplete Mods</h3>
                        </div>
                        <p>The following mods have missing information and couldn't be fully loaded:</p>
                        <div className="invalid-list">
                            {invalidMods.map((workshopId) => (
                                <div key={workshopId} className="invalid-item">
                                    <span>Workshop ID: {workshopId}</span>
                                    <a
                                        href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="view-link"
                                    >
                                        View on Steam
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModSelector;