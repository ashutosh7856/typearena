import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Keyboard, Zap, User, LogOut, Trophy, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const { currentUser, signOut } = useAuth();

    const NavLink = ({ to, children }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${isActive
                    ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                {children}
                {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary shadow-[0_0_10px_#d946ef]" />
                )}
            </Link>
        );
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-gray-200 font-sans selection:bg-primary/30 selection:text-primary">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

            <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                                <Keyboard className="w-8 h-8 text-white relative z-10" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight group-hover:to-white transition-all">
                                TypeArena
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <NavLink to="/single">Single Player</NavLink>
                        <NavLink to="/multi">Multiplayer</NavLink>
                        <NavLink to="/tournaments">
                            <Trophy className="w-4 h-4 inline mr-1" />
                            Tournaments
                        </NavLink>
                        <NavLink to="/leaderboards">
                            <BarChart3 className="w-4 h-4 inline mr-1" />
                            Leaderboards
                        </NavLink>

                        {currentUser ? (
                            <div className="flex items-center gap-2 ml-2">
                                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                                    {currentUser.photoURL ? (
                                        <img
                                            src={currentUser.photoURL}
                                            alt={currentUser.displayName}
                                            className="w-8 h-8 rounded-full border-2 border-primary"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-300 hidden lg:inline">{currentUser.displayName}</span>
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                                    title="Sign out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="ml-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <User className="w-4 h-4" />
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 relative z-10 flex flex-col justify-center">
                {children}
            </main>


            <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm relative z-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                        <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                        <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                        <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>v1.0.0</span>
                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                        <span>&copy; 2025 TypeArena</span>
                        <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                        <a href="https://typearena.campusly.tech" className="hover:text-primary transition-colors">typearena.campusly.tech</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
