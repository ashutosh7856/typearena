import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTournaments, createTournament } from '../services/firebaseService';
import { Trophy, Users, Clock, Play, Plus, Filter, Sparkles } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const TournamentBrowser = () => {
    const { currentUser } = useAuth();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, waiting, active, completed
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchTournaments();
    }, [filter]);

    const fetchTournaments = async () => {
        setLoading(true);
        try {
            const filters = {};
            if (filter !== 'all') {
                filters.status = filter;
            }
            filters.isPublic = true;

            const data = await getTournaments(filters);
            setTournaments(data);
        } catch (error) {
            console.error('Error fetching tournaments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            waiting: { bg: 'bg-secondary/10', text: 'text-secondary', label: 'Waiting' },
            active: { bg: 'bg-accent/10', text: 'text-accent', label: 'In Progress' },
            completed: { bg: 'bg-success/10', text: 'text-success', label: 'Completed' }
        };
        const badge = badges[status] || badges.waiting;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    return (
        <div className="flex flex-col gap-8 mt-8 animate-slide-up">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                    <Trophy className="w-3 h-3" /> Competitive Arena
                </div>
                <h1 className="text-5xl font-bold text-white">Tournaments</h1>
                <p className="text-gray-400">Join or create typing tournaments</p>
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Filters */}
                <div className="flex gap-2">
                    {['all', 'waiting', 'active', 'completed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${filter === f
                                    ? 'bg-primary/20 text-primary border border-primary/50'
                                    : 'bg-surface text-gray-500 hover:bg-white/5 border border-white/10'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Create Tournament Button */}
                {currentUser ? (
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create Tournament
                    </Button>
                ) : (
                    <Link to="/login">
                        <Button className="gap-2">
                            <Plus className="w-5 h-5" />
                            Sign In to Create
                        </Button>
                    </Link>
                )}
            </div>

            {/* Tournament List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading tournaments...</p>
                </div>
            ) : tournaments.length === 0 ? (
                <Card className="text-center py-12">
                    <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20 text-gray-500" />
                    <h3 className="text-xl font-bold text-white mb-2">No Tournaments Found</h3>
                    <p className="text-gray-400 mb-6">Be the first to create a tournament!</p>
                    {currentUser && (
                        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                            <Plus className="w-5 h-5" />
                            Create Tournament
                        </Button>
                    )}
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tournaments.map((tournament) => (
                        <Card key={tournament.id} className="!p-6 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2">{tournament.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Users className="w-4 h-4" />
                                        <span>{tournament.participants?.length || 0} / {tournament.config?.maxPlayers || '∞'} players</span>
                                    </div>
                                </div>
                                {getStatusBadge(tournament.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span>{tournament.config?.duration || 60}s</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="capitalize">{tournament.config?.difficulty || 'medium'}</span>
                                </div>
                            </div>

                            <Link to={`/tournaments/${tournament.id}`}>
                                <Button
                                    variant={tournament.status === 'waiting' ? 'primary' : 'secondary'}
                                    size="sm"
                                    className="w-full gap-2"
                                >
                                    {tournament.status === 'waiting' ? (
                                        <>
                                            <Play className="w-4 h-4" />
                                            Join Tournament
                                        </>
                                    ) : tournament.status === 'active' ? (
                                        'View Live'
                                    ) : (
                                        'View Results'
                                    )}
                                </Button>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}

            {/* Simple Create Modal (can be enhanced) */}
            {showCreateModal && (
                <CreateTournamentModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {
                        setShowCreateModal(false);
                        fetchTournaments();
                    }}
                />
            )}
        </div>
    );
};

// Simple Create Tournament Modal
const CreateTournamentModal = ({ onClose, onCreated }) => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        duration: 60,
        difficulty: 'medium',
        maxPlayers: 10
    });
    const [creating, setCreating] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        setCreating(true);
        try {
            await createTournament({
                ...formData,
                createdBy: currentUser.uid,
                isPublic: true,
                config: {
                    duration: formData.duration,
                    difficulty: formData.difficulty,
                    maxPlayers: formData.maxPlayers
                }
            });
            onCreated();
        } catch (error) {
            console.error('Error creating tournament:', error);
            alert('Failed to create tournament. Please try again.');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <h2 className="text-2xl font-bold text-white mb-6">Create Tournament</h2>

                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Tournament Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Epic Typing Battle"
                            className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Duration (seconds)</label>
                        <select
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
                        >
                            <option value={30}>30s</option>
                            <option value={60}>60s</option>
                            <option value={120}>120s</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
                        <select
                            value={formData.difficulty}
                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                            className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Max Players</label>
                        <input
                            type="number"
                            value={formData.maxPlayers}
                            onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
                            min="2"
                            max="50"
                            className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                            disabled={creating}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={creating}
                        >
                            {creating ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default TournamentBrowser;
