import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Terminal } from 'lucide-react';
import CyberButton from './CyberButton';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [jackingIn, setJackingIn] = useState(false);

    async function handleLogin() {
        try {
            setError('');
            setLoading(true);
            await login();
            // Trigger jacking in animation
            setJackingIn(true);
            // Wait for animation then navigate
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            console.error('Login error:', err);
            setError('ACCESS DENIED: ' + (err.message || 'Authentication failed'));
            setLoading(false);
        }
    }

    // Jacking In overlay
    if (jackingIn) {
        return (
            <div className="min-h-screen bg-background text-primary-text font-body flex items-center justify-center relative overflow-hidden">
                {/* Matrix Background - Intensified */}
                <div className="matrix-bg jacking-in-bg">
                    <div className="matrix-grid" />
                    <div className="matrix-scanbeam" style={{ animationDuration: '0.5s' }} />
                    <div className="matrix-glow glow-1" />
                    <div className="matrix-glow glow-2" />
                    <div className="matrix-glow glow-3" />
                    <div className="matrix-corner top-left" />
                    <div className="matrix-corner top-right" />
                    <div className="matrix-corner bottom-left" />
                    <div className="matrix-corner bottom-right" />
                    <div className="matrix-vignette" />
                </div>

                {/* Jacking In Animation */}
                <div className="relative z-10 text-center animate-pulse">
                    <div className="mb-8">
                        <Terminal className="w-20 h-20 text-accent-green mx-auto animate-bounce" />
                    </div>
                    <h1 className="text-4xl font-heading font-bold text-accent-green text-glow-green mb-4 animate-pulse">
                        ESTABLISHING CONNECTION
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-accent-amber">
                        <span className="inline-block w-2 h-2 bg-accent-green rounded-full animate-ping" />
                        <span className="inline-block w-2 h-2 bg-accent-green rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                        <span className="inline-block w-2 h-2 bg-accent-green rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <p className="mt-4 text-secondary-text font-mono text-sm tracking-widest">
                        SYNCHRONIZING NEURAL INTERFACE...
                    </p>
                </div>

                {/* Screen flash effect */}
                <div className="fixed inset-0 bg-accent-green/20 animate-pulse pointer-events-none" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-primary-text font-body flex items-center justify-center relative overflow-hidden">
            {/* Matrix Background */}
            <div className="matrix-bg">
                <div className="matrix-grid" />
                <div className="matrix-scanbeam" />
                <div className="matrix-glow glow-1" />
                <div className="matrix-glow glow-2" />
                <div className="matrix-glow glow-3" />
                <div className="matrix-corner top-left" />
                <div className="matrix-corner top-right" />
                <div className="matrix-corner bottom-left" />
                <div className="matrix-corner bottom-right" />
                <div className="matrix-vignette" />
            </div>

            {/* Login Panel */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="border border-border bg-panel-background/80 backdrop-blur-md p-8 rounded-sm">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Shield className="w-10 h-10 text-accent-green" />
                            <Terminal className="w-10 h-10 text-accent-amber" />
                        </div>
                        <h1 className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-accent-amber text-glow-green mb-2">
                            SHADOWTERMINAL
                        </h1>
                        <p className="text-secondary-text text-sm tracking-widest font-heading">
                            SECURE ACCESS PROTOCOL
                        </p>
                    </div>

                    {/* Status Display */}
                    <div className="border border-border bg-background/50 p-4 mb-6 rounded-sm">
                        <div className="flex items-center gap-2 text-sm text-secondary-text mb-2">
                            <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                            <span className="tracking-wider">SYSTEM STATUS: ONLINE</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-secondary-text">
                            <span className="w-2 h-2 bg-accent-amber rounded-full" />
                            <span className="tracking-wider">AWAITING AUTHENTICATION...</span>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="border border-accent-red bg-accent-red/10 p-4 mb-6 rounded-sm">
                            <p className="text-accent-red text-sm font-mono">{error}</p>
                        </div>
                    )}

                    {/* Login Button */}
                    <div className="flex justify-center">
                        <CyberButton
                            onClick={handleLogin}
                            disabled={loading}
                            tag="AUTH"
                        >
                            {loading ? 'JACKING IN...' : 'JACK IN'}
                        </CyberButton>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-secondary-text text-xs tracking-wider">
                            ENCRYPTED CONNECTION ESTABLISHED
                        </p>
                        <p className="text-secondary-text/50 text-xs mt-1">
                            V.2.1.0.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
