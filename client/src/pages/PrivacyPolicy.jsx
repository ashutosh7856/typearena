import React from 'react';
import Card from '../components/ui/Card';
import { Shield, Lock, Database, Eye, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 animate-slide-up">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                    <Shield className="w-3 h-3" /> Legal
                </div>
                <h1 className="text-5xl font-bold text-white mb-4">Privacy Policy</h1>
                <p className="text-gray-400">Last updated: November 23, 2025</p>
            </div>

            <Card className="prose prose-invert max-w-none">
                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Eye className="w-6 h-6 text-primary" />
                            Introduction
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Welcome to TypeArena ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our typing practice and competition platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Database className="w-6 h-6 text-primary" />
                            Information We Collect
                        </h2>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">Personal Information</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            When you sign in with Google, we collect:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                            <li>Your name and email address</li>
                            <li>Your Google profile picture</li>
                            <li>A unique user identifier</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">Usage Data</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We automatically collect certain information when you use our service:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>Typing performance metrics (WPM, accuracy, mistakes)</li>
                            <li>Practice session history and statistics</li>
                            <li>Tournament participation and results</li>
                            <li>Browser type and version</li>
                            <li>Device information</li>
                            <li>IP address and general location data</li>
                            <li>Pages visited and time spent on our site</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>Provide and maintain our typing practice service</li>
                            <li>Track your progress and display personalized statistics</li>
                            <li>Enable multiplayer features and tournaments</li>
                            <li>Display leaderboards and rankings</li>
                            <li>Improve our website and user experience</li>
                            <li>Communicate with you about updates and features</li>
                            <li>Detect and prevent fraud or abuse</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Lock className="w-6 h-6 text-primary" />
                            Data Security
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            We use Google Firebase for data storage and authentication, which provides industry-standard security measures. Your data is encrypted in transit and at rest. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We use the following third-party services:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li><strong>Google Firebase</strong> - Authentication and database services</li>
                            <li><strong>Google Analytics</strong> - Website analytics and performance monitoring</li>
                            <li><strong>Google AdSense</strong> - Displaying advertisements</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed mt-4">
                            These services have their own privacy policies. We encourage you to review their policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We use cookies and similar tracking technologies to:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>Keep you signed in</li>
                            <li>Remember your preferences</li>
                            <li>Analyze site traffic and usage patterns</li>
                            <li>Serve personalized advertisements through Google AdSense</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed mt-4">
                            You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Object to processing of your data</li>
                            <li>Export your data</li>
                            <li>Withdraw consent at any time</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Mail className="w-6 h-6 text-primary" />
                            Contact Us
                        </h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>
                        <div className="bg-surface p-4 rounded-lg">
                            <p className="text-gray-300">Email: <a href="mailto:privacy@typearena.com" className="text-primary hover:underline">privacy@typearena.com</a></p>
                            <p className="text-gray-300 mt-2">Or visit our <a href="/contact" className="text-primary hover:underline">Contact Page</a></p>
                        </div>
                    </section>
                </div>
            </Card>
        </div>
    );
};

export default PrivacyPolicy;
