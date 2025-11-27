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
        // Ensure rank is a number and handle edge cases
        const rankNum = parseInt(rank);
        if (isNaN(rankNum) || rankNum <= 0) {
            return <span className="text-gray-500 font-mono text-sm">#-</span>;
        }

        switch (rankNum) {
            case 1:
                return <Trophy className="w-5 h-5 text-yellow-400" />;
            case 2:
                return <Medal className="w-5 h-5 text-gray-400" />;
            case 3:
                return <Award className="w-5 h-5 text-orange-600" />;
            default:
                return <span className="text-gray-500 font-mono text-sm">#{rankNum}</span>;
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
                <p className="text-gray-400 mb-8">Compete with typists worldwide - Ranked by Total Points</p>
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
                        {!currentUser ? (
                            <>
                                <p className="text-xl font-semibold text-white mb-2">Sign in to view rankings</p>
                                <p className="mb-4">Login to see how you compare with other typists!</p>
                                <a
                                    href="/login"
                                    className="inline-block px-6 py-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-bold transition-colors"
                                >
                                    Sign In Now
                                </a>
                            </>
                        ) : (
                            <p>No rankings available yet. Be the first to compete!</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {leaderboard.map((player, index) => {
                            const isCurrentUser = currentUser && player.userId === currentUser.uid;

                            return (
                                <div
                                    key={player.userId}
                                    className={`
                                        relative overflow-hidden rounded-lg transition-all duration-300
                                        ${isCurrentUser
                                            ? 'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 shadow-lg'
                                            : 'bg-surface/50 border border-white/5 hover:border-primary/20 hover:bg-surface/70'
                                        }
                                    `}
                                >
                                    {/* Rank Badge */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center ${isCurrentUser ? 'bg-primary/20' : 'bg-white/5'
                                        }`}>
                                        {getRankIcon(player.rank)}
                                    </div>

                                    {/* Main Content */}
                                    <div className="pl-20 pr-4 py-3 flex items-center justify-between gap-4">
                                        {/* Player Info */}
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            {player.photoURL ? (
                                                <img
                                                    src={player.photoURL}
                                                    alt={player.displayName}
                                                    className="w-10 h-10 rounded-lg border-2 border-white/10 flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-primary/20 border-2 border-white/10 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-primary font-bold text-sm">
                                                        {player.displayName?.charAt(0) || '?'}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-white truncate">
                                                        {player.displayName}
                                                    </h3>
                                                    {isCurrentUser && (
                                                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full whitespace-nowrap">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {player.totalMatches || 0} matches
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="hidden md:flex items-center gap-6">
                                            {/* Total Points */}
                                            <div className="text-center">
                                                <div className="text-xs text-gray-500 mb-0.5">Points</div>
                                                <div className="text-lg font-bold text-yellow-500 font-mono">
                                                    {Math.round(player.totalPoints) || 0}
                                                </div>
                                            </div>

                                            {/* Avg WPM */}
                                            <div className="text-center">
                                                <div className="text-xs text-gray-500 mb-0.5">Avg WPM</div>
                                                <div className="text-lg font-bold text-primary font-mono">
                                                    {Math.round(player.avgWPM) || 0}
                                                </div>
                                            </div>

                                            {/* Best WPM */}
                                            <div className="text-center">
                                                <div className="text-xs text-gray-500 mb-0.5">Best</div>
                                                <div className="text-lg font-bold text-accent font-mono">
                                                    {Math.round(player.bestWPM) || 0}
                                                </div>
                                            </div>

                                            {/* Accuracy */}
                                            <div className="text-center">
                                                <div className="text-xs text-gray-500 mb-0.5">Accuracy</div>
                                                <div className="text-lg font-bold text-success font-mono">
                                                    {Math.round(player.avgAccuracy) || 0}%
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile: Just Points */}
                                        <div className="md:hidden text-right">
                                            <div className="text-xs text-gray-500">Points</div>
                                            <div className="text-xl font-bold text-yellow-500 font-mono">
                                                {Math.round(player.totalPoints) || 0}
                                            </div>
                                        </div>
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
