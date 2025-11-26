import React, { useState, useEffect } from 'react';
import { useGoogleDrive } from '../../hooks/useGoogleDrive';
import { FolderOpen, FileText, Image, File, ExternalLink, HardDrive, Lock } from 'lucide-react';

export default function DriveBrowser({ folderId, title = "ARCHIVES" }) {
    const { isInitialized, accessToken, login, listFiles, loading, error } = useGoogleDrive();
    const [files, setFiles] = useState([]);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

    useEffect(() => {
        if (isInitialized && accessToken && folderId) {
            loadFiles();
        }
    }, [isInitialized, accessToken, folderId]);

    const loadFiles = async () => {
        try {
            const fetchedFiles = await listFiles(folderId);
            setFiles(fetchedFiles);
            setHasAttemptedFetch(true);
        } catch (err) {
            // Error handled in hook
        }
    };

    if (!folderId) return null;

    return (
        <div className="border border-border bg-panel-background/30 p-6 rounded-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-heading text-accent-green flex items-center gap-2">
                    <HardDrive className="w-5 h-5" />
                    {title}
                </h3>

                {!accessToken && (
                    <button
                        onClick={login}
                        className="flex items-center gap-2 px-3 py-1 bg-accent-amber/10 border border-accent-amber text-accent-amber text-xs font-bold hover:bg-accent-amber/20 transition-all rounded-sm"
                    >
                        <Lock className="w-3 h-3" />
                        AUTHENTICATE LINK
                    </button>
                )}
            </div>

            {error && (
                <div className="p-3 border border-accent-red/30 bg-accent-red/5 text-accent-red text-sm mb-4 rounded-sm">
                    CONNECTION ERROR: {error}
                </div>
            )}

            {!accessToken ? (
                <div className="text-center py-8 text-secondary-text font-mono text-sm border border-dashed border-border rounded-sm">
                    SECURE CONNECTION REQUIRED TO ACCESS ARCHIVES.
                </div>
            ) : loading ? (
                <div className="text-center py-8 text-accent-green animate-pulse font-mono text-sm">
                    DECRYPTING FILE SYSTEM...
                </div>
            ) : files.length === 0 && hasAttemptedFetch ? (
                <div className="text-center py-8 text-secondary-text font-mono text-sm border border-dashed border-border rounded-sm">
                    NO ARTIFACTS FOUND IN SECTOR.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {files.map(file => (
                        <a
                            key={file.id}
                            href={file.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="group block"
                        >
                            <div className="border border-border bg-background/40 p-3 hover:bg-accent-green/5 transition-all duration-300 group-hover:border-accent-green/50 flex items-center gap-3 rounded-sm">
                                <div className="p-2 bg-accent-green/10 rounded text-accent-green group-hover:text-primary-text transition-colors">
                                    {file.mimeType.includes('image') ? <Image className="w-4 h-4" /> :
                                        file.mimeType.includes('pdf') ? <FileText className="w-4 h-4" /> :
                                            file.mimeType.includes('folder') ? <FolderOpen className="w-4 h-4" /> :
                                                <File className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-body font-bold text-secondary-text group-hover:text-accent-green truncate">
                                        {file.name}
                                    </h4>
                                    <p className="text-[10px] text-secondary-text/70 font-mono truncate">
                                        {file.mimeType.split('.').pop().toUpperCase().replace('VND.GOOGLE-APPS.', '')}
                                    </p>
                                </div>
                                <ExternalLink className="w-3 h-3 text-secondary-text group-hover:text-accent-green opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
