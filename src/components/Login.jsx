import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Terminal } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        try {
            setError('');
            setLoading(true);
            await login();
            navigate('/');
        } catch (err) {
            setError('Failed to log in: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-dark bg-grid-pattern relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-cyber-cyan/5 pointer-events-none" />

            <div className="max-w-md w-full p-8 relative z-10">
                <div className="cyber-border bg-cyber-gray/90 backdrop-blur-xl p-8 shadow-2xl shadow-cyber-cyan/20">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-cyber-dark/50 rounded-full border border-cyber-cyan/50 box-glow">
                            <Shield className="w-12 h-12 text-cyber-cyan" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-orbitron text-center mb-2 text-white text-glow">
                        ACCESS CONTROL
                    </h2>
                    <p className="text-center text-cyber-cyan/70 font-rajdhani mb-8 tracking-widest">
                        RESTRICTED AREA // AUTH REQUIRED
                    </p>

                    {error && (
                        <div className="mb-6 p-3 border border-cyber-magenta/50 bg-cyber-magenta/10 text-cyber-magenta text-sm font-rajdhani flex items-center gap-2">
                            <Terminal className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-4 px-6 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-orbitron tracking-wider transition-all duration-300 hover:box-glow disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? 'AUTHENTICATING...' : 'INITIATE NEURAL LINK'}
                        </span>
                        <div className="absolute inset-0 bg-cyber-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500 font-rajdhani">
                            SECURE CONNECTION ESTABLISHED via GOOGLE PROTOCOL
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
