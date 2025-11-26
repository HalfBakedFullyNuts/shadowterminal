import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Calendar, FolderOpen, Settings, Users, Shield, LayoutDashboard } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
    const { currentUser, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'DASHBOARD', path: '/' },
        { icon: Shield, label: 'CAMPAIGNS', path: '/campaigns' },
        { icon: Users, label: 'PERSONNEL', path: '/characters' },
        { icon: FolderOpen, label: 'ARCHIVES', path: '/drive' },
        { icon: Settings, label: 'SYSTEM', path: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-background text-primary-text font-body selection:bg-accent-green selection:text-background">
            <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/80" />

            <header className="relative z-10 p-6 border-b border-border backdrop-blur-sm bg-panel-background/70">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-accent-amber text-glow-green">
                            SHADOWTERMINAL
                        </h1>
                        <span className="border border-accent-green/30 px-2 py-0.5 text-xs text-accent-green tracking-widest hidden sm:block font-heading">
                            V.2.1.0.0
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 text-sm text-secondary-text">
                            <span className="tracking-widest font-heading">USER: {currentUser?.displayName?.toUpperCase() || 'UNKNOWN_ENTITY'}</span>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="p-2 hover:text-accent-red transition-colors glow-red-hover rounded-sm"
                            title="Disconnect"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <nav className="md:w-20 flex-shrink-0">
                    <div className="bg-panel-background/70 backdrop-blur-md p-2 space-y-4 border border-border rounded-sm flex flex-col items-center">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    title={item.label}
                                    className={`flex items-center justify-center w-12 h-12 rounded-sm transition-all duration-200 group relative ${isActive
                                        ? 'text-accent-amber border border-accent-amber nav-item-glow-active'
                                        : 'text-secondary-text border border-border hover:text-accent-amber hover:border-accent-amber nav-item-glow-hover'
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 ${isActive ? 'text-glow-amber' : ''}`} />
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
