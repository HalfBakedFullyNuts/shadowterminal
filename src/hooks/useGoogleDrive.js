import { useState, useEffect, useCallback } from 'react';

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

export function useGoogleDrive() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadGapi = () => {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                window.gapi.load('client', async () => {
                    try {
                        await window.gapi.client.init({
                            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                            discoveryDocs: DISCOVERY_DOCS,
                        });
                        setIsInitialized(true);
                    } catch (err) {
                        console.error("GAPI Init Error", err);
                        setError("Failed to initialize Google API");
                    }
                });
            };
            document.body.appendChild(script);
        };

        const loadGis = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            document.body.appendChild(script);
        };

        if (!window.gapi) loadGapi();
        else setIsInitialized(true);

        if (!window.google) loadGis();
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
            if (accessToken && window.gapi.client) {
                // Check if token is already set in gapi, if not set it
                // Note: gapi.client.getToken() might be null if not set
                if (!window.gapi.client.getToken()) {
                    window.gapi.client.setToken({ access_token: accessToken });
                }
            }

            const response = await window.gapi.client.drive.files.list({
                q: `'${folderId}' in parents and trashed = false`,
                fields: 'files(id, name, mimeType, webViewLink, thumbnailLink, iconLink)',
                pageSize: 50,
                orderBy: 'folder, name'
            });
            setLoading(false);
            return response.result.files;
        } catch (err) {
            console.error("Drive List Error", err);
            setError(err.message || "Failed to fetch files");
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
