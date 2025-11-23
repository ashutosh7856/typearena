import React from 'react';
import Card from '../components/ui/Card';
import { Users, Target, Trophy, Zap, Heart, Globe } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 animate-slide-up">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                    <Users className="w-3 h-3" /> About
                </div>
                <h1 className="text-5xl font-bold text-white mb-4">About TypeArena</h1>
                <p className="text-xl text-gray-400">The Premier Competitive Typing Platform</p>
            </div>

            <div className="space-y-8">
                <Card>
                    <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="w-8 h-8 text-primary" />
                        Our Mission
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        TypeArena is dedicated to helping people improve their typing skills through engaging practice sessions, competitive tournaments, and comprehensive progress tracking. We believe that fast, accurate typing is an essential skill in the digital age, and we're committed to making the learning process interactive, fun, and rewarding.
                    </p>
                </Card>

                <Card>
                    <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
                        <Zap className="w-8 h-8 text-accent" />
                        What We Offer
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-surface rounded-lg">
                            <h3 className="text-xl font-bold text-white mb-2">50+ Lessons</h3>
                            <p className="text-gray-400">From fundamentals to advanced typing, covering programming, real-world content, and more.</p>
                        </div>
                        <div className="p-4 bg-surface rounded-lg">
                            <h3 className="text-xl font-bold text-white mb-2">Real-time Multiplayer</h3>
                            <p className="text-gray-400">Compete with friends and typists worldwide in live typing battles.</p>
                        </div>
                        <div className="p-4 bg-surface rounded-lg">
                            <h3 className="text-xl font-bold text-white mb-2">Tournaments</h3>
                            <p className="text-gray-400">Join public tournaments and climb the ranks to become a typing champion.</p>
                        </div>
                        <div className="p-4 bg-surface rounded-lg">
                            <h3 className="text-xl font-bold text-white mb-2">Progress Tracking</h3>
                            <p className="text-gray-400">Detailed statistics, match history, and performance analytics.</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
                        <Trophy className="w-8 h-8 text-secondary" />
                        Why TypeArena?
                    </h2>
                    <div className="space-y-4 text-gray-300 leading-relaxed">
                        <p>
                            <strong className="text-white">Modern Design:</strong> We've built TypeArena with cutting-edge web technologies to provide a smooth, beautiful, and responsive experience across all devices.
                        </p>
                        <p>
                            <strong className="text-white">Comprehensive Training:</strong> Whether you're a beginner learning the home row or an expert looking to break speed records, our extensive lesson library has something for everyone.
                        </p>
                        <p>
                            <strong className="text-white">Competitive Spirit:</strong> Challenge yourself on global leaderboards, compete in tournaments, and see how you stack up against typists worldwide.
                        </p>
                        <p>
                            <strong className="text-white">Free to Use:</strong> TypeArena is free for everyone. We're supported by advertisements to keep the platform accessible to all.
                        </p>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
                        <Globe className="w-8 h-8 text-success" />
                        Our Community
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        TypeArena is built for typists of all skill levels, from students and professionals looking to improve their productivity to competitive gamers and speedtypers pushing the limits of what's possible. Our community values:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Fair competition and sportsmanship</li>
                        <li>Continuous improvement and learning</li>
                        <li>Helping others achieve their typing goals</li>
                        <li>Celebrating milestones and achievements</li>
                    </ul>
                </Card>

                <Card>
                    <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
                        <Heart className="w-8 h-8 text-error" />
                        Built With Love
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                        TypeArena was created by passionate developers who understand the importance of typing skills in today's digital world. We're constantly working to add new features, lessons, and improvements based on community feedback. Our platform is built using modern technologies including React, Firebase, and WebSocket for real-time multiplayer experiences.
                    </p>
                </Card>

                <Card className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                    <h2 className="text-2xl font-bold text-white mb-4">Join the TypeArena Community</h2>
                    <p className="text-gray-300 mb-6">
                        Ready to improve your typing skills and compete with the best?
                    </p>
                    <div className="flex gap-4 justify-center">
                        <a href="/login" className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-colors">
                            Get Started Free
                        </a>
                        <a href="/contact" className="px-6 py-3 bg-surface hover:bg-white/10 text-white border border-white/10 rounded-lg font-bold transition-colors">
                            Contact Us
                        </a>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AboutUs;
