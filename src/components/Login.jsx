import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Terminal } from 'lucide-react';
import CyberButton from './CyberButton';

// Node definitions for the signal path - positioned around where Google popup appears (center)
const NODES = [
    { id: 'init', x: 10, y: 85, label: 'INIT SEQUENCE' },
    { id: 'encrypt', x: 10, y: 50, label: 'ENCRYPTING CHANNEL' },
    { id: 'route', x: 10, y: 15, label: 'ROUTING SIGNAL' },
    { id: 'proxy', x: 50, y: 8, label: 'PROXY BYPASS' },
    { id: 'spoof', x: 90, y: 15, label: 'SPOOFING LOGIN ID' },
    { id: 'auth', x: 90, y: 50, label: 'AWAITING AUTH...' },
    { id: 'confirm', x: 90, y: 85, label: 'SPOOF SUCCESSFUL' },
];

// Signal path connections (node indices)
const SIGNAL_PATH = [0, 1, 2, 3, 4, 5, 6];

function SignalNode({ node, isActive, isComplete, isPulsing }) {
    return (
        <div
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
            {/* Node circle */}
            <div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                    isComplete
                        ? 'bg-accent-green border-accent-green shadow-[0_0_10px_var(--color-accent-green)]'
                        : isActive
                        ? 'bg-accent-amber border-accent-amber shadow-[0_0_15px_var(--color-accent-amber)] animate-pulse'
                        : 'bg-transparent border-border'
                }`}
            />
            {/* Node label */}
            <div
                className={`absolute whitespace-nowrap text-xs font-mono transition-all duration-300 ${
                    node.x < 50 ? 'left-5' : 'right-5'
                } top-1/2 -translate-y-1/2 ${
                    isComplete
                        ? 'text-accent-green'
                        : isActive
                        ? 'text-accent-amber'
                        : 'text-secondary-text/50'
                }`}
            >
                {isComplete && node.id === 'confirm' ? 'SPOOF SUCCESSFUL' :
                 isComplete && node.id === 'spoof' ? 'ID SPOOFED' :
                 isActive && node.id === 'auth' ? 'AWAITING AUTH...' :
                 isComplete && node.id === 'auth' ? 'AUTH CONFIRMED' :
                 node.label}
            </div>
        </div>
    );
}

function SignalLine({ from, to, isActive, progress }) {
    const x1 = from.x;
    const y1 = from.y;
    const x2 = to.x;
    const y2 = to.y;

    return (
        <line
            x1={`${x1}%`}
            y1={`${y1}%`}
            x2={`${x2}%`}
            y2={`${y2}%`}
            stroke={isActive ? 'var(--color-accent-green)' : 'var(--color-border)'}
            strokeWidth={isActive ? 2 : 1}
            strokeDasharray={isActive ? 'none' : '4 4'}
            className={`transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-30'}`}
            style={{
                filter: isActive ? 'drop-shadow(0 0 4px var(--color-accent-green))' : 'none'
            }}
        />
    );
}

function SignalAnimation({ isActive, authConfirmed, onComplete }) {
    const [currentNodeIndex, setCurrentNodeIndex] = useState(-1);
    const [completedNodes, setCompletedNodes] = useState(new Set());
    const [waitingForAuth, setWaitingForAuth] = useState(false);

    useEffect(() => {
        if (!isActive) {
            setCurrentNodeIndex(-1);
            setCompletedNodes(new Set());
            setWaitingForAuth(false);
            return;
        }

        // Start the signal path
        let nodeIndex = 0;
        const advanceNode = () => {
            if (nodeIndex < SIGNAL_PATH.length) {
                const currentNode = NODES[SIGNAL_PATH[nodeIndex]];
                setCurrentNodeIndex(nodeIndex);

                // Check if we're at the auth node (index 5)
                if (nodeIndex === 5) {
                    setWaitingForAuth(true);
                    // Don't advance automatically - wait for authConfirmed
                    return;
                }

                // Mark previous node as complete
                if (nodeIndex > 0) {
                    setCompletedNodes(prev => new Set([...prev, SIGNAL_PATH[nodeIndex - 1]]));
                }

                nodeIndex++;

                // Time between nodes (faster at start, slower in middle)
                const delay = nodeIndex <= 2 ? 250 : nodeIndex <= 4 ? 350 : 300;
                setTimeout(advanceNode, delay);
            }
        };

        // Small initial delay before starting
        setTimeout(advanceNode, 200);
    }, [isActive]);

    // Handle auth confirmation
    useEffect(() => {
        if (waitingForAuth && authConfirmed) {
            setWaitingForAuth(false);
            // Mark auth node as complete
            setCompletedNodes(prev => new Set([...prev, SIGNAL_PATH[5]]));
            setCurrentNodeIndex(6);

            // Complete final node after brief delay
            setTimeout(() => {
                setCompletedNodes(prev => new Set([...prev, SIGNAL_PATH[6]]));
                // Signal animation complete
                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 500);
            }, 400);
        }
    }, [waitingForAuth, authConfirmed, onComplete]);

    if (!isActive) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-40">
            {/* SVG for connection lines */}
            <svg className="absolute inset-0 w-full h-full">
                {SIGNAL_PATH.slice(0, -1).map((nodeIdx, i) => {
                    const nextNodeIdx = SIGNAL_PATH[i + 1];
                    const isLineActive = completedNodes.has(nodeIdx) || currentNodeIndex > i;
                    return (
                        <SignalLine
                            key={`${nodeIdx}-${nextNodeIdx}`}
                            from={NODES[nodeIdx]}
                            to={NODES[nextNodeIdx]}
                            isActive={isLineActive}
                        />
                    );
                })}
            </svg>

            {/* Nodes */}
            {NODES.map((node, idx) => (
                <SignalNode
                    key={node.id}
                    node={node}
                    isActive={SIGNAL_PATH[currentNodeIndex] === idx}
                    isComplete={completedNodes.has(idx)}
                    isPulsing={waitingForAuth && node.id === 'auth'}
                />
            ))}

            {/* Traveling signal dot */}
            {currentNodeIndex >= 0 && currentNodeIndex < SIGNAL_PATH.length && (
                <div
                    className="absolute w-2 h-2 bg-accent-green rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_var(--color-accent-green),0_0_20px_var(--color-accent-green)]"
                    style={{
                        left: `${NODES[SIGNAL_PATH[currentNodeIndex]].x}%`,
                        top: `${NODES[SIGNAL_PATH[currentNodeIndex]].y}%`,
                        transition: 'left 0.25s ease-out, top 0.25s ease-out'
                    }}
                />
            )}
        </div>
    );
}

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [signalActive, setSignalActive] = useState(false);
    const [authConfirmed, setAuthConfirmed] = useState(false);

    async function handleLogin() {
        try {
            setError('');
            setLoading(true);
            setSignalActive(true);
            setAuthConfirmed(false);

            // Start the login process
            await login();

            // Auth successful - signal to animation
            setAuthConfirmed(true);

        } catch (err) {
            setError('Failed to log in: ' + err.message);
            setSignalActive(false);
            setAuthConfirmed(false);
            setLoading(false);
        }
    }

    const handleAnimationComplete = () => {
        // Navigate after animation completes
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-dark bg-grid-pattern relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-cyber-cyan/5 pointer-events-none" />

            <div className="max-w-lg w-full p-8 relative z-10">
                <div className="cyber-border bg-cyber-gray/90 backdrop-blur-xl p-8 shadow-2xl shadow-cyber-cyan/20 relative min-h-[400px]">
                    {/* Signal Animation Overlay */}
                    <SignalAnimation
                        isActive={signalActive}
                        authConfirmed={authConfirmed}
                        onComplete={handleAnimationComplete}
                    />

                    <div className={`transition-opacity duration-300 ${signalActive ? 'opacity-30' : 'opacity-100'}`}>
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

                        <div className="flex justify-center">
                            <CyberButton
                                onClick={handleLogin}
                                disabled={loading}
                                tag="AUTH_V2"
                                className="w-full"
                            >
                                {loading ? 'AUTHENTICATING...' : 'INITIATE NEURAL LINK'}
                            </CyberButton>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500 font-rajdhani">
                                SECURE CONNECTION ESTABLISHED via GOOGLE PROTOCOL
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
