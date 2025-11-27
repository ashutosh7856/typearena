import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { joinTournament, startTournament } from '../services/firebaseService';
import { Trophy, Users, Clock, Sparkles, ArrowLeft, Play, Zap, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../config/api';

const TournamentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [starting, setStarting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        fetchTournament();
    }, [id]);

    const fetchTournament = async () => {
        try {
            const tournamentRef = doc(db, 'tournaments', id);
            const tournamentSnap = await getDoc(tournamentRef);

            if (tournamentSnap.exists()) {
                setTournament({ id: tournamentSnap.id, ...tournamentSnap.data() });
            }
        } catch (error) {
            console.error('Error fetching tournament:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        setJoining(true);
        try {
            await joinTournament(id, currentUser.uid);
            await fetchTournament(); // Refresh
        } catch (error) {
            console.error('Error joining tournament:', error);
            alert(error.message || 'Failed to join tournament');
        } finally {
            setJoining(false);
        }
    };

    const handleStart = async () => {
        if (!currentUser) return;

        setStarting(true);
        try {
            await startTournament(id, currentUser.uid);
            await fetchTournament(); // Refresh
        } catch (error) {
            console.error('Error starting tournament:', error);
            alert(error.message || 'Failed to start tournament');
        } finally {
            setStarting(false);
        }
    };

    const handleDelete = async () => {
        if (!currentUser || deleting) return;

        setDeleting(true);
        try {
            const response = await fetch(`${API_URL}/api/tournaments/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete');

            navigate('/tournaments');
        } catch (error) {
            console.error('Error deleting tournament:', error);
            alert('Failed to delete tournament: ' + error.message);
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading tournament...</p>
                </div>
            </div>
        );
    }

    if (!tournament) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="text-center">
                    <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20 text-gray-500" />
                    <h2 className="text-2xl font-bold text-white mb-2">Tournament Not Found</h2>
                    <p className="text-gray-400 mb-6">This tournament doesn't exist or has been removed.</p>
                    <Button onClick={() => navigate('/tournaments')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Tournaments
                    </Button>
                </Card>
            </div>
        );
    }

    const isParticipating = currentUser && tournament.participants?.includes(currentUser.uid);
    const isFull = tournament.config?.maxPlayers && tournament.participants?.length >= tournament.config.maxPlayers;

    return (
        <div className="flex flex-col gap-8 mt-8 animate-slide-up max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="secondary" size="sm" onClick={() => navigate('/tournaments')} className="w-fit gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Tournaments
            </Button>

            {/* Tournament Header */}
            <Card className="!p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{tournament.name}</h1>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${tournament.status === 'waiting' ? 'bg-secondary/10 text-secondary' :
                                tournament.status === 'active' ? 'bg-accent/10 text-accent' :
                                    'bg-success/10 text-success'
                                }`}>
                                {tournament.status === 'waiting' ? 'Open for Registration' :
                                    tournament.status === 'active' ? 'In Progress' : 'Completed'}
                            </span>
                        </div>
                    </div>
                    <Trophy className="w-12 h-12 text-primary opacity-50" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-surface rounded-lg">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <Users className="w-4 h-4" />
                            <span>Players</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {tournament.participants?.length || 0} / {tournament.config?.maxPlayers || '∞'}
                        </div>
                    </div>

                    <div className="p-4 bg-surface rounded-lg">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <Clock className="w-4 h-4" />
                            <span>Duration</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {tournament.config?.duration || 60}s
                        </div>
                    </div>

                    <div className="p-4 bg-surface rounded-lg">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <Sparkles className="w-4 h-4" />
                            <span>Difficulty</span>
                        </div>
                        <div className="text-2xl font-bold text-white capitalize">
                            {tournament.config?.difficulty || 'Medium'}
                        </div>
                    </div>

                    <div className="p-4 bg-surface rounded-lg">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <Trophy className="w-4 h-4" />
                            <span>Status</span>
                        </div>
                        <div className="text-2xl font-bold text-white capitalize">
                            {tournament.status}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {tournament.status === 'waiting' && currentUser && (
                    <Card className="bg-primary/5 border-primary/20">
                        <h3 className="text-lg font-bold text-white mb-4">Actions</h3>

                        {/* Creator Actions */}
                        {currentUser.uid === tournament.createdBy ? (
                            <div className="space-y-3">
                                {/* Start Button */}
                                <Button
                                    onClick={handleStart}
                                    disabled={starting || !tournament.participants || tournament.participants.length < 2}
                                    className="w-full gap-2"
                                >
                                    {starting ? (
                                        <>Loading...</>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4" />
                                            Start Tournament
                                        </>
                                    )}
                                </Button>

                                {tournament.participants && tournament.participants.length < 2 && (
                                    <p className="text-sm text-yellow-500 text-center">
                                        ⚠️ Need at least 2 participants to start
                                    </p>
                                )}

                                {/* Delete Button */}
                                {!showDeleteConfirm ? (
                                    <Button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="w-full gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Tournament
                                    </Button>
                                ) : (
                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg space-y-3">
                                        <p className="text-sm text-red-400 font-semibold text-center">
                                            ⚠️ Are you sure? This cannot be undone.
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleDelete}
                                                disabled={deleting}
                                                className="flex-1 bg-red-500 hover:bg-red-600"
                                            >
                                                {deleting ? 'Deleting...' : 'Yes, Delete'}
                                            </Button>
                                            <Button
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="flex-1 bg-gray-600 hover:bg-gray-700"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : tournament.participants && tournament.participants.includes(currentUser.uid) ? (
                            /* Already Joined */
                            <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <p className="text-green-500 font-semibold text-sm">✓ You're registered!</p>
                                <p className="text-gray-400 text-xs mt-1">Waiting for host to start...</p>
                            </div>
                        ) : (
                            /* Join Button */
                            <Button
                                onClick={handleJoin}
                                disabled={joining}
                                className="w-full gap-2"
                            >
                                <Play className="w-4 h-4" />
                                {joining ? 'Joining...' : 'Join Tournament'}
                            </Button>
                        )}
                    </Card>
                )}
            </Card>

            {/* Participants */}
            <Card>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Participants ({tournament.participants?.length || 0})
                </h2>

                {(!tournament.participants || tournament.participants.length === 0) ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No participants yet. Be the first to join!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tournament.participants.map((userId, index) => (
                            <div key={userId} className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-primary font-bold">#{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-medium">
                                        Player {index + 1}
                                        {currentUser && userId === currentUser.uid && (
                                            <span className="ml-2 text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                                                You
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500">Ready</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Results (if completed) */}
            {tournament.status === 'completed' && tournament.results && tournament.results.length > 0 && (
                <Card>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Final Results
                    </h2>

                    <div className="space-y-3">
                        {tournament.results.map((result, index) => (
                            <div
                                key={result.userId}
                                className={`flex items-center gap-4 p-4 rounded-lg ${index === 0 ? 'bg-yellow-500/10 border-2 border-yellow-500/30' :
                                    index === 1 ? 'bg-gray-400/10 border-2 border-gray-400/30' :
                                        index === 2 ? 'bg-orange-600/10 border-2 border-orange-600/30' :
                                            'bg-surface border border-white/10'
                                    }`}
                            >
                                <div className="text-2xl font-bold w-12 text-center">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-white">Player {index + 1}</div>
                                    <div className="text-sm text-gray-400">{result.accuracy}% accuracy</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary font-mono">{result.wpm}</div>
                                    <div className="text-xs text-gray-500">WPM</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default TournamentDetails;
