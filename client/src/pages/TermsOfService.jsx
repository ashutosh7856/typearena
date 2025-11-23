import React from 'react';
import Card from '../components/ui/Card';
import { FileText, Scale, Shield } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 animate-slide-up">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                    <FileText className="w-3 h-3" /> Legal
                </div>
                <h1 className="text-5xl font-bold text-white mb-4">Terms of Service</h1>
                <p className="text-gray-400">Last updated: November 23, 2025</p>
            </div>

            <Card className="prose prose-invert max-w-none">
                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
                        <p className="text-gray-300 leading-relaxed">
                            By accessing or using TypeArena ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Scale className="w-6 h-6 text-primary" />
                            Use of Service
                        </h2>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">Permitted Use</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            You may use TypeArena for:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>Improving your typing skills through practice</li>
                            <li>Competing in tournaments and challenges</li>
                            <li>Tracking your progress and statistics</li>
                            <li>Participating in multiplayer typing games</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">Prohibited Activities</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            You agree NOT to:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>Use automated scripts, bots, or cheating tools</li>
                            <li>Manipulate rankings or statistics artificially</li>
                            <li>Harass, abuse, or harm other users</li>
                            <li>Attempt to hack or compromise the Service</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Impersonate others or create fake accounts</li>
                            <li>Scrape or copy content without permission</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">User Accounts</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            When you create an account with us through Google Authentication:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>You are responsible for maintaining account security</li>
                            <li>You must provide accurate information</li>
                            <li>You must be at least 13 years old</li>
                            <li>One person may only have one account</li>
                            <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            The Service and its original content, features, and functionality are owned by TypeArena and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            You may not copy, modify, distribute, sell, or lease any part of our Service without our explicit written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">User-Generated Content</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Your typing data, statistics, and tournament results are considered user-generated content. By using the Service:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>You retain ownership of your data</li>
                            <li>You grant us a license to use, display, and share your statistics publicly (leaderboards, tournaments, etc.)</li>
                            <li>You may request deletion of your data at any time</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-primary" />
                            Disclaimer of Warranties
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                        <p className="text-gray-300 leading-relaxed">
                            IN NO EVENT SHALL TYPEARENA, ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Advertisements</h2>
                        <p className="text-gray-300 leading-relaxed">
                            TypeArena displays advertisements through Google AdSense to support the free service. By using the Service, you acknowledge and agree to the display of such advertisements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including but not limited to breach of these Terms. Upon termination, your right to use the Service will immediately cease.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes by posting on the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
                        <p className="text-gray-300 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these Terms shall be resolved through binding arbitration.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            If you have any questions about these Terms, please contact us:
                        </p>
                        <div className="bg-surface p-4 rounded-lg">
                            <p className="text-gray-300">Email: <a href="mailto:legal@typearena.com" className="text-primary hover:underline">legal@typearena.com</a></p>
                            <p className="text-gray-300 mt-2">Or visit our <a href="/contact" className="text-primary hover:underline">Contact Page</a></p>
                        </div>
                    </section>

                    <section className="border-t border-white/10 pt-6">
                        <p className="text-sm text-gray-500 italic">
                            By using TypeArena, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                        </p>
                    </section>
                </div>
            </Card>
        </div>
    );
};

export default TermsOfService;
