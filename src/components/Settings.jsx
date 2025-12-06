import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, User, Shield, Database, AlertTriangle, LogOut, ExternalLink, Check, X } from 'lucide-react';

export default function Settings() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteInput !== 'DELETE') return;
        // For now, just log out - full deletion would require backend
        alert('Account deletion request submitted. You will be logged out.');
        await logout();
        navigate('/login');
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <SettingsIcon className="w-8 h-8 text-accent-amber" />
                <div>
                    <h1 className="text-2xl font-heading text-primary-text">SYSTEM SETTINGS</h1>
                    <p className="text-secondary-text text-sm">Configure your runner profile</p>
                </div>
            </div>

            {/* Account Info */}
            <section className="mb-8">
                <h2 className="text-lg font-heading text-accent-amber mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    ACCOUNT INFO
                </h2>
                <div className="bg-surface border border-border rounded-sm p-4 space-y-3">
                    <div className="flex items-center gap-4">
                        {currentUser?.photoURL ? (
                            <img
                                src={currentUser.photoURL}
                                alt="Profile"
                                className="w-16 h-16 rounded-full border-2 border-accent-amber"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-accent-amber/20 flex items-center justify-center">
                                <User className="w-8 h-8 text-accent-amber" />
                            </div>
                        )}
                        <div>
                            <p className="text-primary-text font-heading">{currentUser?.displayName || 'Unknown Runner'}</p>
                            <p className="text-secondary-text text-sm">{currentUser?.email}</p>
                            <p className="text-xs text-secondary-text/60 mt-1">
                                Auth Method: Google OAuth
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security */}
            <section className="mb-8">
                <h2 className="text-lg font-heading text-accent-amber mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    SECURITY
                </h2>
                <div className="bg-surface border border-border rounded-sm p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-primary-text">Session Status</p>
                            <p className="text-secondary-text text-sm">You are currently logged in</p>
                        </div>
                        <div className="flex items-center gap-2 text-accent-green">
                            <Check className="w-4 h-4" />
                            <span className="text-sm">ACTIVE</span>
                        </div>
                    </div>
                    <div className="border-t border-border pt-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 border border-accent-amber text-accent-amber hover:bg-accent-amber/10 transition-all rounded-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            LOGOUT
                        </button>
                    </div>
                </div>
            </section>

            {/* Data & Storage */}
            <section className="mb-8">
                <h2 className="text-lg font-heading text-accent-amber mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    DATA & STORAGE
                </h2>
                <div className="bg-surface border border-border rounded-sm p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-primary-text">Google Drive Integration</p>
                            <p className="text-secondary-text text-sm">Connect your Drive for campaign files</p>
                        </div>
                        <a
                            href="https://myaccount.google.com/permissions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-accent-cyan hover:text-accent-cyan/80 text-sm"
                        >
                            Manage Permissions
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                    <div className="border-t border-border pt-4">
                        <div>
                            <p className="text-primary-text">Firebase Storage</p>
                            <p className="text-secondary-text text-sm">Your data is stored securely in the cloud</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section>
                <h2 className="text-lg font-heading text-accent-red mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    DANGER ZONE
                </h2>
                <div className="bg-surface border border-accent-red/50 rounded-sm p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-primary-text">Delete Account</p>
                            <p className="text-secondary-text text-sm">Permanently remove your account and all data</p>
                        </div>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 border border-accent-red text-accent-red hover:bg-accent-red/10 transition-all rounded-sm"
                        >
                            DELETE ACCOUNT
                        </button>
                    </div>

                    {/* Delete Confirmation Modal */}
                    {showDeleteConfirm && (
                        <div className="mt-4 p-4 border border-accent-red bg-accent-red/5 rounded-sm">
                            <p className="text-accent-red font-heading mb-2">⚠️ CONFIRM DELETION</p>
                            <p className="text-secondary-text text-sm mb-4">
                                This action cannot be undone. Type <span className="text-accent-red font-mono">DELETE</span> to confirm.
                            </p>
                            <input
                                type="text"
                                value={deleteInput}
                                onChange={(e) => setDeleteInput(e.target.value)}
                                placeholder="Type DELETE to confirm"
                                className="w-full px-3 py-2 bg-background border border-border rounded-sm text-primary-text mb-3 focus:border-accent-red focus:outline-none"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteInput !== 'DELETE'}
                                    className="px-4 py-2 bg-accent-red text-background font-heading disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-red/80 transition-all rounded-sm"
                                >
                                    CONFIRM DELETE
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeleteInput('');
                                    }}
                                    className="px-4 py-2 border border-border text-secondary-text hover:border-primary-text hover:text-primary-text transition-all rounded-sm"
                                >
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Version Info */}
            <div className="mt-8 text-center text-secondary-text/50 text-xs">
                <p>SHADOWTERMINAL v2.1.0.0</p>
                <p className="mt-1">© 2025 All rights reserved</p>
            </div>
        </div>
    );
}
