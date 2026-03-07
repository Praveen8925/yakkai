import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const generateId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'IND-';
    for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
};

const GenerateAssessmentLink = () => {
    const [linkId, setLinkId] = useState('');
    const [copied, setCopied] = useState(false);
    const [label, setLabel] = useState('');

    const assessmentUrl = linkId
        ? `${window.location.origin}/assessment/individual?lid=${linkId}`
        : '';

    const handleGenerate = () => {
        setLinkId(generateId());
        setCopied(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(assessmentUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback for older browsers
            const el = document.createElement('textarea');
            el.value = assessmentUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Yakkai Neri — Wellness Assessment',
                text: `${label ? label + ' — ' : ''}Take your personal wellness assessment with Yakkai Neri`,
                url: assessmentUrl,
            });
        } else {
            handleCopy();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-lg">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                        <i className="fas fa-link text-green-400 text-2xl"></i>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">Generate Assessment Link</h1>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Create a unique wellness assessment link and share it with anyone.
                        Each link records one submission — track results in the admin panel.
                    </p>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-2xl p-8"
                >
                    {/* Optional label */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Label <span className="text-gray-400 font-normal">(optional — for your reference)</span>
                        </label>
                        <input
                            type="text"
                            value={label}
                            onChange={e => setLabel(e.target.value)}
                            placeholder="e.g. Team A, John Doe, Workshop April 2026"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    {/* Generate button */}
                    <button
                        onClick={handleGenerate}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
                    >
                        <i className="fas fa-magic mr-2"></i>
                        {linkId ? 'Generate New Link' : 'Generate Link'}
                    </button>

                    {/* Generated link display */}
                    {linkId && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6"
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <i className="fas fa-check-circle text-green-500 mr-1"></i>
                                Your Shareable Link
                            </label>

                            {/* Link ID badge */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full tracking-widest">
                                    {linkId}
                                </span>
                                {label && (
                                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                        {label}
                                    </span>
                                )}
                            </div>

                            {/* URL box */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600 break-all select-all font-mono">
                                {assessmentUrl}
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleCopy}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition ${
                                        copied
                                            ? 'bg-green-100 text-green-700 border border-green-300'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                                    }`}
                                >
                                    <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition"
                                >
                                    <i className="fas fa-share-alt"></i>
                                    Share
                                </button>
                            </div>

                            {/* Preview link */}
                            <div className="mt-4 text-center">
                                <a
                                    href={assessmentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-green-600 hover:text-green-700 text-xs underline underline-offset-2"
                                >
                                    <i className="fas fa-external-link-alt mr-1"></i>
                                    Preview the assessment link
                                </a>
                            </div>
                        </motion.div>
                    )}

                    {/* Info note */}
                    <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-700 leading-relaxed">
                        <i className="fas fa-info-circle mr-1"></i>
                        Share this link with one person. When they complete the assessment, their results will
                        be recorded with link ID <strong>{linkId || 'IND-XXXXXXXX'}</strong> and visible in the admin backend.
                    </div>
                </motion.div>

                {/* Back links */}
                <div className="flex justify-center gap-6 mt-8 text-sm">
                    <Link to="/" className="text-gray-400 hover:text-white transition">
                        <i className="fas fa-home mr-1"></i> Home
                    </Link>
                    <a
                        href="/assessment/individual"
                        className="text-gray-400 hover:text-white transition"
                    >
                        <i className="fas fa-clipboard-list mr-1"></i> Take Assessment
                    </a>
                </div>
            </div>
        </div>
    );
};

export default GenerateAssessmentLink;
