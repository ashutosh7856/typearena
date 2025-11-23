import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Swords,
    User,
    Trophy,
    Zap,
    Target,
    Activity,
    Users,
    ArrowRight,
    Play
} from 'lucide-react';

const Landing = () => {
    const [wpm, setWpm] = useState(0);
    const [progress, setProgress] = useState(0);

    // Simulate live stats animation
    useEffect(() => {
        const interval = setInterval(() => {
            setWpm(Math.floor(Math.random() * (120 - 60) + 60));
            setProgress(Math.floor(Math.random() * (100 - 40) + 40));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-16">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Left Column: Hero Text & CTAs */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-in">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            The Next-Gen Competitive Typing Platform
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
                            <span className="text-white">Master the</span>
                            <br />
                            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-xy">
                                Digital Arena
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                            Compete in real-time multiplayer battles, track your progress with advanced analytics, and climb the global leaderboards.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/multi"
                            className="group relative px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                            <span className="relative flex items-center gap-2">
                                ENTER ARENA <Swords className="w-5 h-5" />
                            </span>
                        </Link>

                        <Link
                            to="/single"
                            className="px-8 py-4 bg-surfaceHighlight hover:bg-surfaceHighlight/80 text-white border border-white/10 rounded-xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:border-white/30 flex items-center gap-2"
                        >
                            TRAINING MODE <Target className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Right Column: Analytics & Stats Card */}
                <div className="lg:col-span-5 relative">
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-slow delay-1000 pointer-events-none"></div>

                    <div className="glass-panel rounded-2xl p-6 relative z-10 transform transition-all duration-500 hover:scale-[1.02]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-accent" /> Live Analytics
                            </h3>
                            <span className="text-xs text-gray-500 font-mono">SESSION ID: #8X92</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-surface/50 rounded-xl p-4 border border-white/5">
                                <div className="text-gray-400 text-xs mb-1">AVG SPEED</div>
                                <div className="text-3xl font-bold text-white font-mono flex items-end gap-2">
                                    {wpm} <span className="text-sm text-gray-500 mb-1">WPM</span>
                                </div>
                            </div>
                            <div className="bg-surface/50 rounded-xl p-4 border border-white/5">
                                <div className="text-gray-400 text-xs mb-1">PRECISION</div>
                                <div className="text-3xl font-bold text-accent font-mono">98.5%</div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>XP Progress</span>
                                <span>Lvl 42</span>
                            </div>
                            <div className="h-2 bg-surface rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <div className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Live Lobby Leaderboard</div>
                            <div className="space-y-3">
                                {[
                                    { name: 'NeonRider', wpm: 142, rank: 1 },
                                    { name: 'CyberPunk', wpm: 138, rank: 2 },
                                    { name: 'Glitch', wpm: 125, rank: 3 },
                                ].map((player, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className={`font-mono w-4 ${i === 0 ? 'text-yellow-400' : 'text-gray-500'}`}>#{player.rank}</span>
                                            <span className="text-gray-300 group-hover:text-white transition-colors">{player.name}</span>
                                        </div>
                                        <span className="font-mono text-accent">{player.wpm} WPM</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mode Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Multiplayer Card */}
                <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-primary/50 hover:to-secondary/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative h-full bg-surface/80 backdrop-blur-xl rounded-xl p-8 border border-white/5 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                            <Users className="w-32 h-32" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Swords className="w-6 h-6 text-primary" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Multiplayer Arena</h3>
                            <p className="text-gray-400 mb-8 h-12">Challenge friends or random opponents in real-time typing battles.</p>

                            <div className="flex gap-3">
                                <Link to="/multi" className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 text-primary text-center rounded-lg font-medium transition-colors text-sm">
                                    Create Room
                                </Link>
                                <Link to="/multi" className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-center rounded-lg font-medium transition-colors text-sm">
                                    Join Room
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Solo Card */}
                <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-accent/50 hover:to-success/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-success/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative h-full bg-surface/80 backdrop-blur-xl rounded-xl p-8 border border-white/5 overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                            <User className="w-32 h-32" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Target className="w-6 h-6 text-accent" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Solo Training</h3>
                            <p className="text-gray-400 mb-8 h-12">Adaptive difficulty levels to push your speed and accuracy limits.</p>

                            <div className="flex gap-3">
                                <Link to="/single" className="flex-1 py-2 bg-accent/20 hover:bg-accent/30 text-accent text-center rounded-lg font-medium transition-colors text-sm">
                                    Start Training
                                </Link>
                                <Link to="/single" className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-center rounded-lg font-medium transition-colors text-sm">
                                    Custom Setup
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
