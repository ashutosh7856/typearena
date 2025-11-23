import React, { useState } from 'react';
import TypingArea from '../components/TypingArea';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Trophy, Target, Zap, RotateCcw, Sparkles, BookOpen, Code, Type, Hash, FileText, Award, TrendingUp } from 'lucide-react';
import { LESSONS, getAllLessons } from '../data/lessons';
import { useAuth } from '../contexts/AuthContext';
import { saveMatchResult } from '../services/firebaseService';

const CATEGORY_ICONS = {
    fundamentals: BookOpen,
    capitals: Type,
    numbers: Hash,
    speed: Zap,
    words: Type,
    sentences: FileText,
    code: Code,
    realworld: FileText,
    quotes: Award
};

const CATEGORY_NAMES = {
    fundamentals: 'Typing Fundamentals',
    capitals: 'Capitals & Punctuation',
    numbers: 'Numbers & Symbols',
    speed: 'Speed Drills',
    words: 'Word Practice',
    sentences: 'Sentence Practice',
    code: 'Programming',
    realworld: 'Real-World Content',
    quotes: 'Quotes & Literature'
};

const SinglePlayer = () => {
    const { currentUser } = useAuth();
    const [gameState, setGameState] = useState('setup');
    const [config, setConfig] = useState({
        category: 'fundamentals',
        difficulty: 'beginner',
        duration: 30
    });
    const [results, setResults] = useState(null);
    const [words, setWords] = useState('');
    const [currentLesson, setCurrentLesson] = useState(null);
    const [saving, setSaving] = useState(false);

    const startGame = () => {
        const lesson = LESSONS[config.category][config.difficulty];
        if (lesson) {
            setWords(lesson.content);
            setCurrentLesson(lesson);
            setGameState('playing');
        }
    };

    const handleComplete = async (stats) => {
        setResults(stats);
        setGameState('results');

        // Save to Firebase if user is logged in
        if (currentUser) {
            setSaving(true);
            try {
                await saveMatchResult(currentUser.uid, {
                    mode: 'single',
                    lessonId: `${config.category}-${config.difficulty}`,
                    wpm: stats.wpm,
                    accuracy: stats.accuracy,
                    duration: config.duration,
                    mistakes: stats.mistakes,
                    category: config.category,
                    difficulty: config.difficulty
                });
            } catch (error) {
                console.error('Error saving match:', error);
            } finally {
                setSaving(false);
            }
        }
    };

    const availableLessons = LESSONS[config.category] || {};
    const hasLesson = availableLessons[config.difficulty];

    if (gameState === 'setup') {
        const CategoryIcon = CATEGORY_ICONS[config.category];

        return (
            <div className="flex flex-col items-center gap-12 mt-8 animate-slide-up">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3 h-3" /> Training Mode
                    </div>
                    <h1 className="text-5xl font-bold text-white">Solo Session</h1>
                    <p className="text-gray-400">Select your training category and level</p>
                </div>

                <Card className="w-full max-w-4xl space-y-8">
                    {/* Category Selection */}
                    <div className="space-y-4">
                        <label className="text-gray-400 text-sm uppercase tracking-wider font-bold flex items-center gap-2">
                            <CategoryIcon className="w-4 h-4 text-accent" /> Training Category
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.keys(LESSONS).map(category => {
                                const Icon = CATEGORY_ICONS[category];
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setConfig({ ...config, category })}
                                        className={`p-4 rounded-xl capitalize font-bold transition-all duration-300 border flex items-center gap-3 ${config.category === category
                                            ? 'bg-accent/10 border-accent text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                            : 'bg-surface border-white/5 text-gray-500 hover:bg-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm">{CATEGORY_NAMES[category]}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="space-y-4">
                        <label className="text-gray-400 text-sm uppercase tracking-wider font-bold flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" /> Difficulty Level
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['beginner', 'easy', 'medium', 'hard'].map(diff => {
                                const lesson = availableLessons[diff];
                                const isAvailable = !!lesson;

                                return (
                                    <button
                                        key={diff}
                                        onClick={() => isAvailable && setConfig({ ...config, difficulty: diff })}
                                        disabled={!isAvailable}
                                        className={`p-4 rounded-xl capitalize font-bold transition-all duration-300 border ${config.difficulty === diff && isAvailable
                                            ? 'bg-primary/10 border-primary text-white shadow-[0_0_15px_rgba(217,70,239,0.2)]'
                                            : isAvailable
                                                ? 'bg-surface border-white/5 text-gray-500 hover:bg-white/5 hover:border-white/10'
                                                : 'bg-surface/30 border-white/5 text-gray-700 cursor-not-allowed'
                                            }`}
                                    >
                                        <div className="text-sm">{diff}</div>
                                        {lesson && (
                                            <div className="text-xs text-gray-600 mt-1">Level {lesson.level}</div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        {hasLesson && (
                            <div className="p-4 bg-surface/50 rounded-xl border border-white/5">
                                <div className="text-sm text-gray-400 mb-1">Selected Lesson:</div>
                                <div className="text-white font-bold">{hasLesson.name}</div>
                            </div>
                        )}
                    </div>

                    {/* Duration Selection */}
                    <div className="space-y-4">
                        <label className="text-gray-400 text-sm uppercase tracking-wider font-bold flex items-center gap-2">
                            <Zap className="w-4 h-4 text-secondary" /> Duration
                        </label>
                        <div className="grid grid-cols-4 gap-4">
                            {[15, 30, 60, 120].map(time => (
                                <button
                                    key={time}
                                    onClick={() => setConfig({ ...config, duration: time })}
                                    className={`p-4 rounded-xl font-bold transition-all duration-300 border ${config.duration === time
                                        ? 'bg-secondary/10 border-secondary text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                                        : 'bg-surface border-white/5 text-gray-500 hover:bg-white/5 hover:border-white/10'
                                        }`}
                                >
                                    {time}s
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={startGame}
                        size="lg"
                        className="w-full shadow-lg shadow-primary/20"
                        disabled={!hasLesson}
                    >
                        {hasLesson ? 'Start Session' : 'Select a valid lesson'}
                    </Button>
                </Card>
            </div>
        );
    }

    if (gameState === 'results') {
        return (
            <div className="flex flex-col items-center gap-12 mt-8 animate-slide-up">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl text-gray-400">Session Complete</h2>
                    {currentLesson && (
                        <div className="text-sm text-gray-600">{currentLesson.name}</div>
                    )}
                    <div className="text-9xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-glow font-mono">
                        {results.wpm}
                    </div>
                    <div className="text-xl text-gray-500 uppercase tracking-widest font-bold">Words Per Minute</div>

                    {currentUser && (
                        <div className="mt-4">
                            {saving ? (
                                <div className="text-sm text-gray-400 flex items-center gap-2 justify-center">
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    Saving to profile...
                                </div>
                            ) : (
                                <div className="text-sm text-success flex items-center gap-2 justify-center">
                                    <Trophy className="w-4 h-4" />
                                    Progress saved to your profile!
                                </div>
                            )}
                        </div>
                    )}
                    {!currentUser && (
                        <div className="mt-4 text-sm text-gray-500">
                            <a href="/login" className="text-primary hover:underline">Sign in</a> to save your progress
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                    <Card className="text-center !p-6">
                        <div className="text-5xl font-bold text-white mb-2 font-mono">{results.accuracy}%</div>
                        <div className="text-gray-500 uppercase text-xs font-bold tracking-wider">Accuracy</div>
                    </Card>
                    <Card className="text-center !p-6">
                        <div className="text-5xl font-bold text-error mb-2 font-mono">{results.mistakes}</div>
                        <div className="text-gray-500 uppercase text-xs font-bold tracking-wider">Mistakes</div>
                    </Card>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={() => setGameState('setup')}
                        variant="secondary"
                        size="lg"
                        className="gap-2"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Choose Another Lesson
                    </Button>
                    <Button
                        onClick={startGame}
                        size="lg"
                        className="gap-2"
                    >
                        Retry This Lesson
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 animate-slide-up">
            {currentLesson && (
                <div className="text-center mb-6">
                    <div className="text-sm text-gray-500 uppercase tracking-wider">{CATEGORY_NAMES[config.category]}</div>
                    <div className="text-xl font-bold text-white">{currentLesson.name}</div>
                    <div className="text-xs text-gray-600">Level {currentLesson.level}</div>
                </div>
            )}
            <TypingArea
                words={words}
                duration={config.duration}
                onComplete={handleComplete}
            />
        </div>
    );
};

export default SinglePlayer;
