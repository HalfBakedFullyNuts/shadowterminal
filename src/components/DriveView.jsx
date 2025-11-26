import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FolderOpen, FileText, Image, File, ExternalLink, Search, Save, Upload, Plus, ChevronRight, Music, FileIcon } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useGlitch } from '../hooks/useGlitch';

export default function DriveView() {
    const { currentUser } = useAuth();
    const [folderId, setFolderId] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditingId, setIsEditingId] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [breadcrumb, setBreadcrumb] = useState(['Root']);
    const { triggerGlitch, glitchClass } = useGlitch();

    // File type icon helper
    const getFileIcon = (mimeType) => {
        if (mimeType?.includes('folder')) return { icon: FolderOpen, color: 'text-accent-amber' };
        if (mimeType?.includes('image')) return { icon: Image, color: 'text-accent-green' };
        if (mimeType?.includes('pdf')) return { icon: FileText, color: 'text-accent-green' };
        if (mimeType?.includes('audio')) return { icon: Music, color: 'text-accent-green' };
        if (mimeType?.includes('document') || mimeType?.includes('text')) return { icon: FileText, color: 'text-accent-green' };
        return { icon: File, color: 'text-accent-green' };
    };

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
        <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col">
                    <h1 className="font-heading text-4xl font-bold uppercase tracking-wider text-primary-text">
                        Drive
                    </h1>
                    <p className="font-body text-base text-secondary-text">File and asset management</p>
                </div>
                <div className="flex gap-4">
                    {isEditingId ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={folderId}
                                onChange={(e) => setFolderId(e.target.value)}
                                placeholder="Enter Drive Folder ID"
                                className="bg-panel-background border border-border p-2 text-primary-text text-sm w-64 outline-none focus:border-accent-green rounded-sm"
                            />
                            <button
                                onClick={saveFolderId}
                                className="flex items-center justify-center gap-2 h-11 px-4 rounded-sm font-heading font-semibold bg-accent-green text-background hover:opacity-90 transition-opacity"
                            >
                                <Save className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditingId(true)}
                                onMouseEnter={triggerGlitch}
                                className={`flex items-center justify-center gap-2 h-11 px-6 rounded-sm font-heading font-semibold bg-panel-background text-accent-green border border-border hover:border-accent-green hover:shadow-[0_0_8px_var(--color-glow-green)] transition-all ${glitchClass}`}
                            >
                                <Plus className="w-5 h-5" />
                                Configure Folder
                            </button>
                            <button
                                onClick={handleAuthorize}
                                onMouseEnter={triggerGlitch}
                                className={`flex items-center justify-center gap-2 h-11 px-6 rounded-sm font-heading font-semibold bg-accent-green text-background hover:opacity-90 transition-opacity ${glitchClass}`}
                            >
                                <Upload className="w-5 h-5" />
                                {accessToken ? 'Refresh' : 'Connect'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 font-heading text-sm text-secondary-text">
                {breadcrumb.map((item, i) => (
                    <React.Fragment key={i}>
                        {i > 0 && <ChevronRight className="w-4 h-4" />}
                        <span className={i === breadcrumb.length - 1 ? 'text-primary-text' : 'hover:text-primary-text cursor-pointer'}>
                            {item}
                        </span>
                    </React.Fragment>
                ))}
            </div>

            {/* Authorization Warning */}
            {!accessToken && (
                <div className="p-4 border border-accent-amber/30 bg-accent-amber/5 text-accent-amber mb-6 flex justify-between items-center rounded-sm">
                    <span className="font-heading">ENCRYPTED CONNECTION REQUIRED</span>
                    <button
                        onClick={handleAuthorize}
                        className="px-4 py-2 bg-accent-amber/10 hover:bg-accent-amber/20 border border-accent-amber text-sm font-heading rounded-sm transition-colors"
                    >
                        ESTABLISH LINK
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-4 border border-accent-red/30 bg-accent-red/5 text-accent-red mb-6 rounded-sm">
                    ERROR: {error}
                </div>
            )}

            {/* Files Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {files.map(file => {
                    const { icon: FileTypeIcon, color } = getFileIcon(file.mimeType);
                    const isFolder = file.mimeType?.includes('folder');

                    return (
                        <a
                            key={file.id}
                            href={file.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            onMouseEnter={triggerGlitch}
                            className={`flex flex-col items-center justify-center p-4 rounded-sm bg-panel-background border border-border cursor-pointer aspect-square hover:border-accent-green/50 hover:shadow-[0_0_8px_var(--color-glow-green)] transition-all duration-300 ${glitchClass}`}
                        >
                            <FileTypeIcon className={`w-16 h-16 ${color}`} />
                            <p className="mt-2 text-center text-primary-text font-body truncate w-full text-sm" title={file.name}>
                                {file.name}
                            </p>
                        </a>
                    );
                })}

                {/* Empty State */}
                {accessToken && files.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-secondary-text">
                        <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="font-heading">NO ARTIFACTS FOUND IN SECTOR</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="col-span-full text-center py-12 text-accent-green animate-pulse">
                        <div className="flex items-center justify-center gap-2">
                            <Search className="w-5 h-5" />
                            SCANNING ARCHIVES...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
