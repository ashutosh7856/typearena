import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserMatches, getLeaderboard } from '../services/firebaseService';
import { Trophy, Target, Zap, Calendar, TrendingUp, Users, Medal, Award } from 'lucide-react';
import Card from '../components/ui/Card';

const Profile = () => {
    const { currentUser, userProfile } = useAuth();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRank, setUserRank] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            if (!currentUser) return;

            try {
                const userMatches = await getUserMatches(currentUser.uid, 20);
                setMatches(userMatches);

                // Fetch user's rank from leaderboard
                const leaderboard = await getLeaderboard('allTime');
                const rankData = leaderboard.find(entry => entry.userId === currentUser.uid);
                if (rankData) {
                    setUserRank(rankData.rank);
                }
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [currentUser]);

    if (!currentUser || !userProfile) {
        return null;
    }

    const stats = userProfile.stats || {
        totalMatches: 0,
        avgWPM: 0,
        bestWPM: 0,
        avgAccuracy: 0,
        totalTimeTyped: 0
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString();
    };

    return (
        <div className="flex flex-col gap-8 mt-8 animate-slide-up">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 p-8 glass-panel rounded-2xl">
                <div className="relative">
                    {currentUser.photoURL ? (
                        <img
                            src={currentUser.photoURL}
                            alt={currentUser.displayName}
                            className="w-24 h-24 rounded-full border-4 border-primary shadow-lg"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center">
                            <Medal className="w-12 h-12 text-primary" />
                        </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-primary rounded-full text-xs font-bold shadow-lg">
                        Lvl {Math.floor((stats.totalPoints || stats.totalMatches * 50) / 500) + 1}
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-white mb-1">{currentUser.displayName}</h1>
                    <p className="text-gray-400 mb-4">{currentUser.email}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {userRank && (
                            <div className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-sm rounded-full border border-yellow-500/20">
                                <Award className="w-3 h-3 inline mr-1" />
                                Rank #{userRank}
                            </div>
                        )}
                        <div className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full border border-accent/20">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            Joined {userProfile.createdAt ? formatDate(userProfile.createdAt) : 'Recently'}
                        </div>
                        <div className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20">
                            <Trophy className="w-3 h-3 inline mr-1" />
                            {stats.totalMatches} Matches
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="text-center !p-6">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2">
                        <Zap className="w-4 h-4" />
                        <span>Average Speed</span>
                    </div>
                    <div className="text-4xl font-bold text-primary font-mono">{stats.avgWPM}</div>
                    <div className="text-xs text-gray-500 mt-1">WPM</div>
                </Card>

                <Card className="text-center !p-6">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Best Speed</span>
                    </div>
                    <div className="text-4xl font-bold text-accent font-mono">{stats.bestWPM}</div>
                    <div className="text-xs text-gray-500 mt-1">WPM</div>
                </Card>

                <Card className="text-center !p-6">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2">
                        <Target className="w-4 h-4" />
                        <span>Accuracy</span>
                    </div>
                    <div className="text-4xl font-bold text-success font-mono">{stats.avgAccuracy}%</div>
                    <div className="text-xs text-gray-500 mt-1">Average</div>
                </Card>

                <Card className="text-center !p-6">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2">
                        <Trophy className="w-4 h-4" />
                        <span>Total Points</span>
                    </div>
                    <div className="text-4xl font-bold text-yellow-500 font-mono">{Math.round(stats.totalPoints || 0)}</div>
                    <div className="text-xs text-gray-500 mt-1">All Time</div>
                </Card>

                <Card className="text-center !p-6">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2">
                        <Users className="w-4 h-4" />
                        <span>Total Time</span>
                    </div>
                    <div className="text-4xl font-bold text-white font-mono">{formatTime(stats.totalTimeTyped)}</div>
                    <div className="text-xs text-gray-500 mt-1">Typed</div>
                </Card>
            </div>

            {/* Recent Matches */}
            <Card>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Recent Matches
                </h2>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading matches...</div>
                ) : matches.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No matches yet. Start practicing to see your history!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-left text-sm text-gray-500">
                                    <th className="pb-3">Date</th>
                                    <th className="pb-3">Mode</th>
                                    <th className="pb-3">WPM</th>
                                    <th className="pb-3">Accuracy</th>
                                    <th className="pb-3">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {matches.map((match, index) => (
                                    <tr key={match.id || index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-3 text-gray-400">{formatDate(match.timestamp)}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${match.mode === 'tournament'
                                                ? 'bg-primary/10 text-primary'
                                                : match.mode === 'multi'
                                                    ? 'bg-accent/10 text-accent'
                                                    : 'bg-secondary/10 text-secondary'
                                                }`}>
                                                {match.mode || 'single'}
                                            </span>
                                        </td>
                                        <td className="py-3 font-mono font-bold text-primary">{match.wpm}</td>
                                        <td className="py-3 font-mono text-success">{match.accuracy}%</td>
                                        <td className="py-3 text-gray-400">{match.duration}s</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Profile;
