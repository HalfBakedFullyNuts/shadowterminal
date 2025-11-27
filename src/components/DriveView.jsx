import React, { useState, useEffect } from 'react';
import { FolderOpen, FileText, Image, File, ExternalLink, Search, Save, Upload, Plus, ChevronRight, Music, Lock, HardDrive } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useGlitch } from '../hooks/useGlitch';
import { useGoogleDrive } from '../hooks/useGoogleDrive';

export default function DriveView() {
    const { isInitialized, accessToken, login, listFiles, loading: driveLoading, error: driveError } = useGoogleDrive();
    const [folderId, setFolderId] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditingId, setIsEditingId] = useState(false);
    const [breadcrumb, setBreadcrumb] = useState([{ id: null, name: 'Root' }]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const { triggerGlitch, glitchClass } = useGlitch();

    // File type icon helper
    const getFileIcon = (mimeType) => {
        if (mimeType?.includes('folder')) return { icon: FolderOpen, color: 'text-accent-amber' };
        if (mimeType?.includes('image')) return { icon: Image, color: 'text-accent-green' };
        if (mimeType?.includes('pdf')) return { icon: FileText, color: 'text-accent-red' };
        if (mimeType?.includes('audio')) return { icon: Music, color: 'text-accent-cyan' };
        if (mimeType?.includes('document') || mimeType?.includes('text')) return { icon: FileText, color: 'text-accent-green' };
        return { icon: File, color: 'text-secondary-text' };
    };

    // Load saved folder ID
    useEffect(() => {
        const fetchSettings = async () => {
            const docRef = doc(db, 'settings', 'drive');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const savedFolderId = docSnap.data().folderId;
                setFolderId(savedFolderId);
                setCurrentFolderId(savedFolderId);
            }
        };
        fetchSettings();
    }, []);

    // Fetch files when currentFolderId or accessToken changes
    useEffect(() => {
        if (!currentFolderId || !accessToken || !isInitialized) return;
        fetchFiles(currentFolderId);
    }, [currentFolderId, accessToken, isInitialized]);

    const handleAuthorize = async () => {
        try {
            await login();
        } catch (err) {
            setError('Authorization failed: ' + err.message);
        }
    };

    const fetchFiles = async (targetFolderId) => {
        if (!targetFolderId) return;
        setLoading(true);
        setError('');
        try {
            const fetchedFiles = await listFiles(targetFolderId);
            setFiles(fetchedFiles || []);
        } catch (err) {
            console.error("Drive API Error", err);
            setError('Failed to fetch files. ' + (err.message || 'Unknown error'));
        }
        setLoading(false);
    };

    const saveFolderId = async () => {
        await setDoc(doc(db, 'settings', 'drive'), { folderId });
        setIsEditingId(false);
        setCurrentFolderId(folderId);
        setBreadcrumb([{ id: folderId, name: 'Root' }]);
        if (accessToken) fetchFiles(folderId);
    };

    const navigateToFolder = (file) => {
        if (!file.mimeType?.includes('folder')) return;
        setCurrentFolderId(file.id);
        setBreadcrumb(prev => [...prev, { id: file.id, name: file.name }]);
    };

    const navigateToBreadcrumb = (index) => {
        const target = breadcrumb[index];
        if (index === 0) {
            setCurrentFolderId(folderId);
        } else {
            setCurrentFolderId(target.id);
        }
        setBreadcrumb(prev => prev.slice(0, index + 1));
    };

    const combinedError = error || driveError;
    const isLoading = loading || driveLoading;

    return (
        <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col">
                    <h1 className="font-heading text-4xl font-bold uppercase tracking-wider text-primary-text flex items-center gap-3">
                        <HardDrive className="w-10 h-10 text-accent-green" />
                        ARCHIVES
                    </h1>
                    <p className="font-body text-base text-secondary-text mt-1">Secure file repository // Google Drive integration</p>
                </div>
                <div className="flex gap-3">
                    {isEditingId ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={folderId}
                                onChange={(e) => setFolderId(e.target.value)}
                                placeholder="Enter Drive Folder ID"
                                className="bg-background border border-border p-3 text-primary-text text-sm w-72 outline-none focus:border-accent-amber focus:shadow-[0_0_8px_var(--color-glow-amber)] rounded-sm font-mono transition-all"
                            />
                            <button
                                onClick={saveFolderId}
                                className="flex items-center justify-center gap-2 px-4 rounded-sm font-heading font-semibold bg-accent-green text-background hover:shadow-[0_0_10px_var(--color-glow-green)] transition-all"
                            >
                                <Save className="w-4 h-4" />
                                SAVE
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditingId(true)}
                                onMouseEnter={triggerGlitch}
                                className={`flex items-center justify-center gap-2 h-11 px-5 rounded-sm font-heading text-sm bg-panel-background text-secondary-text border border-border hover:border-accent-amber hover:text-accent-amber hover:shadow-[0_0_8px_var(--color-glow-amber)] transition-all ${glitchClass}`}
                            >
                                <Plus className="w-4 h-4" />
                                CONFIG
                            </button>
                            <button
                                onClick={handleAuthorize}
                                onMouseEnter={triggerGlitch}
                                disabled={!isInitialized}
                                className={`flex items-center justify-center gap-2 h-11 px-5 rounded-sm font-heading text-sm transition-all ${
                                    accessToken
                                        ? 'bg-accent-green/20 text-accent-green border border-accent-green hover:bg-accent-green/30'
                                        : 'bg-accent-amber text-background hover:shadow-[0_0_10px_var(--color-glow-amber)]'
                                } ${!isInitialized ? 'opacity-50 cursor-not-allowed' : ''} ${glitchClass}`}
                            >
                                {accessToken ? (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        LINKED
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        CONNECT
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="mb-6 flex items-center gap-2 font-heading text-sm text-secondary-text border border-border bg-panel-background/50 p-3 rounded-sm">
                <FolderOpen className="w-4 h-4 text-accent-amber" />
                {breadcrumb.map((item, i) => (
                    <React.Fragment key={i}>
                        {i > 0 && <ChevronRight className="w-4 h-4 text-border" />}
                        <button
                            onClick={() => navigateToBreadcrumb(i)}
                            className={`hover:text-accent-green transition-colors ${
                                i === breadcrumb.length - 1 ? 'text-accent-green' : ''
                            }`}
                        >
                            {item.name}
                        </button>
                    </React.Fragment>
                ))}
            </div>

            {/* Authorization Warning */}
            {!accessToken && isInitialized && (
                <div className="p-5 border border-accent-amber/50 bg-accent-amber/5 text-accent-amber mb-6 flex justify-between items-center rounded-sm">
                    <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5" />
                        <span className="font-heading">ENCRYPTED CONNECTION REQUIRED TO ACCESS ARCHIVES</span>
                    </div>
                    <button
                        onClick={handleAuthorize}
                        className="px-4 py-2 bg-accent-amber text-background text-sm font-heading rounded-sm hover:shadow-[0_0_10px_var(--color-glow-amber)] transition-all"
                    >
                        ESTABLISH LINK
                    </button>
                </div>
            )}

            {/* Initializing State */}
            {!isInitialized && (
                <div className="p-5 border border-border bg-panel-background/50 text-secondary-text mb-6 flex items-center justify-center gap-3 rounded-sm">
                    <div className="w-4 h-4 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
                    <span className="font-heading">INITIALIZING SECURE PROTOCOLS...</span>
                </div>
            )}

            {/* Error Message */}
            {combinedError && (
                <div className="p-4 border border-accent-red/50 bg-accent-red/10 text-accent-red mb-6 rounded-sm font-mono text-sm">
                    <span className="font-heading">ERROR:</span> {combinedError}
                </div>
            )}

            {/* No Folder Configured */}
            {!folderId && accessToken && (
                <div className="p-8 border border-dashed border-border bg-panel-background/30 text-center rounded-sm">
                    <FolderOpen className="w-16 h-16 mx-auto mb-4 text-secondary-text opacity-50" />
                    <p className="font-heading text-secondary-text mb-4">NO ARCHIVE SECTOR CONFIGURED</p>
                    <button
                        onClick={() => setIsEditingId(true)}
                        className="px-6 py-2 bg-accent-green/10 border border-accent-green text-accent-green font-heading text-sm rounded-sm hover:bg-accent-green/20 transition-all"
                    >
                        CONFIGURE FOLDER ID
                    </button>
                </div>
            )}

            {/* Files Grid */}
            {folderId && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {files.map(file => {
                        const { icon: FileTypeIcon, color } = getFileIcon(file.mimeType);
                        const isFolder = file.mimeType?.includes('folder');

                        return (
                            <div
                                key={file.id}
                                onClick={() => isFolder ? navigateToFolder(file) : window.open(file.webViewLink, '_blank')}
                                onMouseEnter={triggerGlitch}
                                className={`group flex flex-col items-center justify-center p-4 rounded-sm bg-panel-background border border-border cursor-pointer aspect-square hover:border-accent-green/50 hover:shadow-[0_0_10px_var(--color-glow-green)] transition-all duration-300 ${glitchClass}`}
                            >
                                <div className="relative">
                                    <FileTypeIcon className={`w-12 h-12 ${color} group-hover:scale-110 transition-transform`} />
                                    {!isFolder && (
                                        <ExternalLink className="w-4 h-4 absolute -top-1 -right-1 text-secondary-text opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </div>
                                <p className="mt-3 text-center text-primary-text font-body truncate w-full text-xs group-hover:text-accent-green transition-colors" title={file.name}>
                                    {file.name}
                                </p>
                                <span className="text-[10px] text-secondary-text/60 font-mono mt-1 uppercase">
                                    {isFolder ? 'FOLDER' : file.mimeType?.split('.').pop()?.replace('vnd.google-apps.', '').slice(0, 10)}
                                </span>
                            </div>
                        );
                    })}

                    {/* Empty State */}
                    {accessToken && folderId && files.length === 0 && !isLoading && (
                        <div className="col-span-full text-center py-16 text-secondary-text border border-dashed border-border rounded-sm">
                            <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p className="font-heading">NO ARTIFACTS FOUND IN SECTOR</p>
                            <p className="text-sm mt-2 opacity-60">This folder appears to be empty</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="col-span-full text-center py-16 text-accent-green">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
                                <span className="font-heading animate-pulse">SCANNING ARCHIVES...</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
