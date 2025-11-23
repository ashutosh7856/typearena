import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/firebaseService';
import { Trophy, Medal, Award, TrendingUp, Target, Zap } from 'lucide-react';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

const Leaderboards = () => {
    const { currentUser } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('allTime');

    useEffect(() => {
        fetchLeaderboard();
    }, [activeTab]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const data = await getLeaderboard(activeTab);
            setLeaderboard(data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="w-5 h-5 text-yellow-400" />;
            case 2:
                return <Medal className="w-5 h-5 text-gray-400" />;
            case 3:
                return <Award className="w-5 h-5 text-orange-600" />;
            default:
                return <span className="text-gray-500 font-mono text-sm">#{rank}</span>;
        }
    };

    const getRankBg = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-yellow-500/10 border-yellow-500/20';
            case 2:
                return 'bg-gray-400/10 border-gray-400/20';
            case 3:
                return 'bg-orange-600/10 border-orange-600/20';
            default:
                return 'bg-white/5 border-white/10';
        }
    };

    return (
        <div className="flex flex-col gap-8 mt-8 animate-slide-up">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                    <Trophy className="w-3 h-3" /> Global Rankings
                </div>
                <h1 className="text-5xl font-bold text-white">Leaderboards</h1>
                <p className="text-gray-400">Compete with the best typists worldwide</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-2">
                {[
                    { id: 'allTime', label: 'All Time' },
                    { id: 'daily', label: 'Daily' },
                    { id: 'weekly', label: 'Weekly' },
                    { id: 'monthly', label: 'Monthly' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-primary/20 text-primary border-2 border-primary shadow-[0_0_15px_rgba(217,70,239,0.2)]'
                                : 'bg-surface border-2 border-white/5 text-gray-500 hover:bg-white/5 hover:border-white/10'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Leaderboard */}
            <Card>
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading leaderboard...</p>
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>No rankings available yet. Be the first to compete!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {leaderboard.map((player, index) => {
                            const isCurrentUser = currentUser && player.userId === currentUser.uid;

                            return (
                                <div
                                    key={player.userId}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${isCurrentUser
                                            ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(217,70,239,0.3)]'
                                            : getRankBg(player.rank)
                                        } hover:scale-[1.02]`}
                                >
                                    {/* Rank */}
                                    <div className="w-12 flex items-center justify-center">
                                        {getRankIcon(player.rank)}
                                    </div>

                                    {/* Player Info */}
                                    <div className="flex items-center gap-3 flex-1">
                                        {player.photoURL ? (
                                            <img
                                                src={player.photoURL}
                                                alt={player.displayName}
                                                className="w-12 h-12 rounded-full border-2 border-primary"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                                <span className="text-primary font-bold">
                                                    {player.displayName?.charAt(0) || '?'}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-white flex items-center gap-2">
                                                {player.displayName}
                                                {isCurrentUser && (
                                                    <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                                                        You
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {player.totalMatches} matches played
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="hidden md:flex items-center gap-6">
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                <Zap className="w-3 h-3" />
                                                Avg WPM
                                            </div>
                                            <div className="text-xl font-bold text-primary font-mono">
                                                {player.avgWPM}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                <TrendingUp className="w-3 h-3" />
                                                Best WPM
                                            </div>
                                            <div className="text-xl font-bold text-accent font-mono">
                                                {player.bestWPM}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                <Target className="w-3 h-3" />
                                                Accuracy
                                            </div>
                                            <div className="text-xl font-bold text-success font-mono">
                                                {player.avgAccuracy}%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Stats */}
                                    <div className="md:hidden text-right">
                                        <div className="text-2xl font-bold text-primary font-mono">
                                            {player.avgWPM}
                                        </div>
                                        <div className="text-xs text-gray-500">WPM</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            {/* Info Card */}
            {!currentUser && (
                <div className="text-center p-6 glass-panel rounded-2xl">
                    <p className="text-gray-400 mb-4">
                        Sign in to track your progress and compete on the leaderboards!
                    </p>
                    <a
                        href="/login"
                        className="inline-block px-6 py-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-bold transition-colors"
                    >
                        Sign In Now
                    </a>
                </div>
            )}
        </div>
    );
};

export default Leaderboards;
