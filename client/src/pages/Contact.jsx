import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real implementation, this would send to your backend
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-12 animate-slide-up">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                    <Mail className="w-3 h-3" /> Contact
                </div>
                <h1 className="text-5xl font-bold text-white mb-4">Get In Touch</h1>
                <p className="text-xl text-gray-400">We'd love to hear from you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <Card>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-primary" />
                        Send Us a Message
                    </h2>

                    {submitted ? (
                        <div className="text-center py-12">
                            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                            <p className="text-gray-400">We'll get back to you as soon as possible.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors"
                                    placeholder="What is this about?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors resize-none"
                                    placeholder="Tell us what's on your mind..."
                                ></textarea>
                            </div>

                            <Button type="submit" className="w-full gap-2">
                                <Send className="w-4 h-4" />
                                Send Message
                            </Button>
                        </form>
                    )}
                </Card>

                <div className="space-y-6">
                    <Card>
                        <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
                        <div className="space-y-4 text-gray-300">
                            <div>
                                <h3 className="font-bold text-white mb-1">Email</h3>
                                <a href="mailto:support@typearena.com" className="text-primary hover:underline">
                                    support@typearena.com
                                </a>
                            </div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Response Time</h3>
                                <p>We typically respond within 24-48 hours</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-2xl font-bold text-white mb-4">Common Topics</h2>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>Technical support and bug reports</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>Feature requests and suggestions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>Account and profile questions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>Tournament and competition inquiries</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>Partnership and collaboration opportunities</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>Privacy and data concerns</span>
                            </li>
                        </ul>
                    </Card>

                    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                        <h2 className="text-xl font-bold text-white mb-2">Quick Help</h2>
                        <p className="text-gray-300 mb-4">
                            Looking for immediate answers? Check out our documentation or visit the leaderboards to see how others are doing!
                        </p>
                        <div className="flex gap-3">
                            <a href="/about" className="text-primary hover:underline text-sm">About Us</a>
                            <a href="/privacy" className="text-primary hover:underline text-sm">Privacy Policy</a>
                            <a href="/terms" className="text-primary hover:underline text-sm">Terms</a>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Contact;
