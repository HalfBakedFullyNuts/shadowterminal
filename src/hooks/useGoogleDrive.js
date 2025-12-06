import { useState, useEffect, useCallback } from 'react';

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

export function useGoogleDrive() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initGapiClient = async () => {
            try {
                const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY;

                if (!apiKey) {
                    throw new Error('Missing API key. Set VITE_GOOGLE_API_KEY in .env');
                }

                // Initialize gapi client with just API key first
                await window.gapi.client.init({
                    apiKey: apiKey,
                });

                // Manual Discovery Loading Strategy
                // We fetch the discovery doc manually because gapi.client.load() was failing with 502s
                // when trying to fetch it internally via content.googleapis.com
                try {
                    console.log("Initializing: Fetching discovery doc manually...");
                    const discoveryResponse = await fetch(DISCOVERY_DOCS[0]);

                    if (!discoveryResponse.ok) {
                        throw new Error(`Discovery fetch failed: ${discoveryResponse.status} ${discoveryResponse.statusText}`);
                    }

                    const discoveryJson = await discoveryResponse.json();
                    console.log("Initializing: Loading discovery doc into GAPI...");

                    // Pass the JSON object directly to load()
                    // This bypasses the network request that was failing
                    await window.gapi.client.load(discoveryJson);

                } catch (loadErr) {
                    console.error("Manual Load Error:", loadErr);
                    throw new Error(`Failed to load Drive API: ${loadErr.message}`);
                }

                setIsInitialized(true);
            } catch (err) {
                console.error("GAPI Init Error", err);
                const message = err?.result?.error?.message || err.message || "Unknown error";
                setError(`Failed to initialize Google API: ${message}`);
            }
        };

        const loadGapi = () => {
            // Check if script already exists
            if (document.querySelector('script[src="https://apis.google.com/js/api.js"]')) {
                if (window.gapi?.client) {
                    // GAPI already loaded, just init if needed
                    if (!window.gapi.client.drive) {
                        window.gapi.load('client', initGapiClient);
                    } else {
                        setIsInitialized(true);
                    }
                }
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                window.gapi.load('client', initGapiClient);
            };
            document.body.appendChild(script);
        };

        const loadGis = () => {
            if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            document.body.appendChild(script);
        };

        loadGapi();
        loadGis();
    }, []);

    const login = useCallback(() => {
        return new Promise((resolve, reject) => {
            try {
                const tokenClient = window.google.accounts.oauth2.initTokenClient({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    scope: SCOPES,
                    callback: (response) => {
                        if (response.error) {
                            reject(response);
                            return;
                        }
                        if (response.access_token) {
                            setAccessToken(response.access_token);
                            // Ensure gapi client has the token
                            if (window.gapi.client) {
                                window.gapi.client.setToken({ access_token: response.access_token });
                            }
                            resolve(response.access_token);
                        }
                    },
                });
                tokenClient.requestAccessToken();
            } catch (err) {
                reject(err);
            }
        });
    }, []);

    const listFiles = useCallback(async (folderId) => {
        if (!folderId) return [];
        setLoading(true);
        setError(null);
        try {
            // Ensure token is set if we have it
            if (accessToken && window.gapi?.client) {
                if (!window.gapi.client.getToken()) {
                    window.gapi.client.setToken({ access_token: accessToken });
                }
            }

            // Check if Drive API is loaded
            if (!window.gapi?.client?.drive) {
                throw new Error('Google Drive API not loaded. Please refresh the page.');
            }

            const response = await window.gapi.client.drive.files.list({
                q: `'${folderId}' in parents and trashed = false`,
                fields: 'files(id, name, mimeType, webViewLink, thumbnailLink, iconLink)',
                pageSize: 50,
                orderBy: 'folder, name'
            });

            setLoading(false);

            // Safely access files with fallback
            if (!response?.result) {
                console.error("Unexpected API response:", response);
                return [];
            }

            return response.result.files || [];
        } catch (err) {
            console.error("Drive List Error Details:", JSON.stringify(err, null, 2));
            if (err.result) {
                console.error("Drive List Error Result:", JSON.stringify(err.result, null, 2));
            }

            const errorMessage = err?.result?.error?.message || err.message || "Failed to fetch files";
            setError(errorMessage);
            setLoading(false);
            throw err;
        }
    }, [accessToken]);

    return {
        isInitialized,
        accessToken,
        login,
        listFiles,
        loading,
        error
    };
}
