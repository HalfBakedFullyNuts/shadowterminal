import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FolderOpen, FileText, Image, File, ExternalLink, Search, Save } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function DriveView() {
    const { currentUser } = useAuth();
    const [folderId, setFolderId] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditingId, setIsEditingId] = useState(false);
    const [accessToken, setAccessToken] = useState(null);

    // Load saved folder ID
    useEffect(() => {
        const fetchSettings = async () => {
            const docRef = doc(db, 'settings', 'drive');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFolderId(docSnap.data().folderId);
            }
        };
        fetchSettings();
    }, []);

    // Load GAPI & GIS
    useEffect(() => {
        const loadGapi = () => {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                window.gapi.load('client', async () => {
                    await window.gapi.client.init({
                        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
                    });
                });
            };
            document.body.appendChild(script);
        };

        const loadGis = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            document.body.appendChild(script);
        };

        loadGapi();
        loadGis();
    }, []);

    // Fetch files when folderId changes
    useEffect(() => {
        if (!folderId || !accessToken) return;
        fetchFiles();
    }, [folderId, accessToken]);

    const handleAuthorize = () => {
        const tokenClient = window.google?.accounts.oauth2.initTokenClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/drive.readonly',
            callback: (response) => {
                if (response.access_token) {
                    setAccessToken(response.access_token);
                    window.gapi.client.setToken({ access_token: response.access_token });
                }
            },
        });
        tokenClient.requestAccessToken();
    };

    const fetchFiles = async () => {
        if (!folderId) return;
        setLoading(true);
        setError('');
        try {
            const response = await window.gapi.client.drive.files.list({
                q: `'${folderId}' in parents and trashed = false`,
                fields: 'files(id, name, mimeType, webViewLink, thumbnailLink)',
                pageSize: 20,
            });
            setFiles(response.result.files);
        } catch (err) {
            console.error("Drive API Error", err);
            setError('Failed to fetch files. ' + err.message);
        }
        setLoading(false);
    };

    const saveFolderId = async () => {
        await setDoc(doc(db, 'settings', 'drive'), { folderId });
        setIsEditingId(false);
        if (accessToken) fetchFiles();
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="cyber-border bg-cyber-gray/50 backdrop-blur-md p-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-orbitron text-white text-glow flex items-center gap-3">
                        <FolderOpen className="w-8 h-8 text-cyber-cyan" />
                        ARCHIVES
                    </h1>

                    <div className="flex items-center gap-2">
                        {isEditingId ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={folderId}
                                    onChange={(e) => setFolderId(e.target.value)}
                                    placeholder="Enter Drive Folder ID"
                                    className="bg-cyber-dark border border-cyber-cyan/30 p-2 text-white text-sm w-64 outline-none focus:border-cyber-cyan"
                                />
                                <button onClick={saveFolderId} className="p-2 bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/80">
                                    <Save className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditingId(true)}
                                className="text-sm text-cyber-cyan/70 hover:text-cyber-cyan font-mono"
                            >
                                ID: {folderId || 'NOT_SET'}
                            </button>
                        )}
                    </div>
                </div>

                {!accessToken && (
                    <div className="p-4 border border-cyber-yellow/30 bg-cyber-yellow/5 text-cyber-yellow mb-6 flex justify-between items-center">
                        <span>ENCRYPTED CONNECTION REQUIRED</span>
                        <button
                            onClick={handleAuthorize}
                            className="px-4 py-2 bg-cyber-yellow/10 hover:bg-cyber-yellow/20 border border-cyber-yellow text-sm font-orbitron"
                        >
                            ESTABLISH LINK
                        </button>
                    </div>
                )}

                {error && (
                    <div className="p-4 border border-cyber-magenta/30 bg-cyber-magenta/5 text-cyber-magenta mb-6">
                        ERROR: {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map(file => (
                        <a
                            key={file.id}
                            href={file.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="group block"
                        >
                            <div className="cyber-border bg-cyber-dark/50 p-4 hover:bg-cyber-cyan/5 transition-all duration-300 group-hover:box-glow h-full flex flex-col justify-between">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-cyber-cyan/10 rounded-lg text-cyber-cyan group-hover:text-white transition-colors">
                                        {file.mimeType.includes('image') ? <Image className="w-6 h-6" /> :
                                            file.mimeType.includes('pdf') ? <FileText className="w-6 h-6" /> :
                                                <File className="w-6 h-6" />}
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyber-cyan" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-rajdhani font-bold text-gray-200 group-hover:text-cyber-cyan truncate" title={file.name}>
                                        {file.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 font-mono">
                                        {file.mimeType.split('.').pop().toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}

                    {accessToken && files.length === 0 && !loading && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            NO ARTIFACTS FOUND IN SECTOR
                        </div>
                    )}

                    {loading && (
                        <div className="col-span-full text-center py-12 text-cyber-cyan animate-pulse">
                            SCANNING ARCHIVES...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
