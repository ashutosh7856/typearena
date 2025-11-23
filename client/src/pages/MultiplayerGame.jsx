import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useWebSocket } from '../hooks/useWebSocket';
import TypingArea from '../components/TypingArea';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Users, Trophy, Crown, Copy, ArrowLeft, Loader2 } from 'lucide-react';

const MultiplayerGame = () => {
    const { roomId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const name = searchParams.get('name');
    const mode = searchParams.get('mode');

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
    const { isConnected, lastMessage, sendMessage } = useWebSocket(wsUrl);

    const [roomState, setRoomState] = useState(null);
    const [gameState, setGameState] = useState('connecting');
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (isConnected) {
            if (mode === 'create' && roomId === 'new') {
                sendMessage('CREATE_ROOM', { hostId: 'temp-' + Date.now(), name, config: { difficulty: 'medium', duration: 60 } });
            } else if (mode === 'join' && roomId) {
                sendMessage('JOIN_ROOM', { roomId, player: { id: 'temp-' + Date.now(), name } });
            }
        }
    }, [isConnected, mode, roomId, name, sendMessage]);

    useEffect(() => {
        if (!lastMessage) return;

        switch (lastMessage.type) {
            case 'ROOM_STATE':
                setRoomState(lastMessage.payload);
                if (lastMessage.payload.status === 'waiting') setGameState('lobby');
                if (lastMessage.payload.status === 'playing') setGameState('playing');
                break;
            case 'GAME_START':
                setGameState('playing');
                break;
            case 'PLAYER_UPDATE':
                setRoomState(prev => {
                    if (!prev) return prev;
                    const newPlayers = prev.players.map(p =>
                        p.id === lastMessage.payload.playerId
                            ? { ...p, ...lastMessage.payload }
                            : p
                    );
                    return { ...prev, players: newPlayers };
                });
                break;
            case 'GAME_END':
                setResults(lastMessage.payload.leaderboard);
                setGameState('finished');
                break;
            case 'ERROR':
                alert(lastMessage.payload.message);
                navigate('/multi');
                break;
        }
    }, [lastMessage, navigate]);

    const handleStartGame = () => {
        sendMessage('START_GAME', {});
    };

    const handleProgress = (stats) => {
        sendMessage('UPDATE_PROGRESS', stats);
    };

    const handleComplete = (stats) => {
        sendMessage('UPDATE_PROGRESS', { ...stats, progress: 100 });
    };

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomState.id);
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                </div>
                <div className="text-gray-400 font-mono animate-pulse">ESTABLISHING UPLINK...</div>
            </div>
        );
    }

    if (gameState === 'lobby' && roomState) {
        const isHost = roomState.hostId === roomState.players.find(p => p.name === name)?.id;

        return (
            <div className="flex flex-col items-center gap-12 mt-8 animate-slide-up">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 text-sm text-success font-bold tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        LOBBY ACTIVE
                    </div>

                    <div className="flex items-center gap-6 justify-center">
                        <h1 className="text-7xl font-bold text-white tracking-tight font-mono">{roomState.id}</h1>
                        <button
                            onClick={copyRoomCode}
                            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white border border-white/5 hover:border-white/20"
                        >
                            <Copy className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-gray-500">Share this access code with your squad</p>
                </div>

                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roomState.players.map((player, idx) => (
                        <Card
                            key={idx}
                            className="flex items-center gap-6 !p-6 animate-slide-up"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-primary/20">
                                {player.name[0].toUpperCase()}
                            </div>
                            <div className="font-bold text-white text-xl">{player.name}</div>
                            {player.id === roomState.hostId && (
                                <div className="ml-auto bg-warning/10 p-2 rounded-lg border border-warning/20">
                                    <Crown className="w-5 h-5 text-warning drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                {isHost ? (
                    <Button
                        onClick={handleStartGame}
                        size="lg"
                        className="px-16 py-6 text-xl shadow-[0_0_40px_rgba(217,70,239,0.3)]"
                    >
                        INITIATE MATCH
                    </Button>
                ) : (
                    <div className="flex items-center gap-3 text-gray-500 font-mono animate-pulse bg-white/5 px-6 py-3 rounded-full">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        AWAITING HOST COMMAND...
                    </div>
                )}
            </div>
        );
    }

    if (gameState === 'playing' && roomState) {
        const words = "the quick brown fox jumps over the lazy dog"; // Fallback

        return (
            <div className="mt-8 space-y-12 animate-slide-up">
                {/* Progress Bars */}
                <Card className="space-y-8 max-w-6xl mx-auto !p-8">
                    {roomState.players.map(player => (
                        <div key={player.id} className="space-y-3">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-white flex items-center gap-2">
                                    {player.name}
                                    {player.id === roomState.hostId && <Crown className="w-3 h-3 text-warning" />}
                                </span>
                                <span className="text-primary font-mono">{player.wpm || 0} WPM</span>
                            </div>
                            <div className="h-4 bg-background rounded-full overflow-hidden border border-white/5 relative">
                                <div
                                    className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500 shadow-[0_0_15px_rgba(217,70,239,0.5)] relative z-10"
                                    style={{ width: `${player.progress || 0}%` }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50" />
                                </div>
                                {/* Grid lines for progress bar background */}
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_100%]"></div>
                            </div>
                        </div>
                    ))}
                </Card>

                <TypingArea
                    words={words}
                    duration={roomState.config.duration}
                    onComplete={handleComplete}
                    isMultiplayer={true}
                />
            </div>
        );
    }

    if (gameState === 'finished' && results) {
        return (
            <div className="flex flex-col items-center gap-12 mt-8 animate-slide-up">
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-bold text-white tracking-tight">MATCH REPORT</h1>
                    <p className="text-gray-400 font-mono">PERFORMANCE ANALYSIS COMPLETE</p>
                </div>

                <div className="w-full max-w-4xl space-y-4">
                    {results.map((player, idx) => (
                        <div
                            key={player.id}
                            className={`flex items-center justify-between p-8 rounded-3xl border transition-all ${idx === 0
                                    ? 'bg-gradient-to-r from-warning/10 to-transparent border-warning/50 shadow-[0_0_40px_rgba(234,179,8,0.15)]'
                                    : 'glass-panel border-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-8">
                                <div className={`text-4xl font-bold font-mono ${idx === 0 ? 'text-warning drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'text-gray-600'}`}>
                                    #{idx + 1}
                                </div>
                                <div className="font-bold text-2xl text-white flex items-center gap-4">
                                    {player.name}
                                    {idx === 0 && <Trophy className="w-6 h-6 text-warning" />}
                                </div>
                            </div>
                            <div className="flex gap-16 text-right">
                                <div>
                                    <div className="text-4xl font-bold text-white font-mono">{player.wpm}</div>
                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">WPM</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-gray-400 font-mono">{player.accuracy}%</div>
                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">ACC</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Button
                    onClick={() => navigate('/multi')}
                    variant="secondary"
                    size="lg"
                    className="gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Return to Lobby
                </Button>
            </div>
        );
    }

    return null;
};

export default MultiplayerGame;
