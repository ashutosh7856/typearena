import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Play, Hash, User, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const MultiplayerLobby = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');

    const handleCreate = () => {
        if (!name) {
            setError('Please enter your name');
            return;
        }
        navigate(`/game/new?name=${encodeURIComponent(name)}&mode=create`);
    };

    const handleJoin = () => {
        if (!name || !roomId) {
            setError('Please enter name and room code');
            return;
        }
        navigate(`/game/${roomId}?name=${encodeURIComponent(name)}&mode=join`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-12 animate-slide-up">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold text-white tracking-tight">
                    Multiplayer <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Arena</span>
                </h1>
                <p className="text-gray-400 text-lg">Join the battle. Prove your speed.</p>
            </div>

            <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-start">
                {/* Left: Profile Setup */}
                <Card className="space-y-8 h-full">
                    <div className="space-y-4">
                        <label className="text-gray-400 text-sm uppercase tracking-wider font-bold flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" /> Identity
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-4 bg-background/50 text-white rounded-xl border border-white/10 focus:border-primary focus:outline-none transition-all placeholder:text-gray-700 focus:shadow-[0_0_15px_rgba(217,70,239,0.2)]"
                                placeholder="Enter your codename"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10 blur-xl" />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-center text-sm font-bold animate-pulse flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-error" />
                            {error}
                        </div>
                    )}
                </Card>

                {/* Right: Actions */}
                <div className="space-y-6">
                    <button
                        onClick={handleCreate}
                        className="w-full p-8 glass-panel rounded-3xl border border-white/10 hover:border-primary/50 transition-all group text-left relative overflow-hidden hover:shadow-[0_0_30px_rgba(217,70,239,0.15)]"
                    >
                        <div className="absolute right-0 top-0 p-32 bg-primary/10 blur-[60px] rounded-full -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <Play className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-2xl font-bold text-white">Create Room</h3>
                                <p className="text-gray-500 mt-2">Host a new match and invite friends.</p>
                            </div>
                            <ArrowRight className="w-6 h-6 text-gray-600 group-hover:text-white group-hover:translate-x-2 transition-all" />
                        </div>
                    </button>

                    <Card className="space-y-4 !bg-surface/30">
                        <div className="flex gap-4">
                            <div className="relative flex-1 group">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-secondary transition-colors" />
                                <input
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                    className="w-full p-4 pl-12 bg-background/50 text-white rounded-xl border border-white/10 focus:border-secondary focus:outline-none transition-all uppercase tracking-widest font-mono focus:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                                    placeholder="CODE"
                                    maxLength={6}
                                />
                            </div>
                            <Button
                                onClick={handleJoin}
                                variant="secondary"
                                className="px-8 shadow-lg shadow-secondary/10"
                            >
                                Join
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MultiplayerLobby;
