import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateId() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getWellnessLabel(score, max) {
    const pct = (score / max) * 100;
    if (pct >= 80) return { label: 'Excellent', color: '#16a34a', bg: 'bg-green-100 text-green-700' };
    if (pct >= 60) return { label: 'Good', color: '#2563eb', bg: 'bg-blue-100 text-blue-700' };
    if (pct >= 40) return { label: 'Needs Attention', color: '#d97706', bg: 'bg-amber-100 text-amber-700' };
    return { label: 'Critical', color: '#dc2626', bg: 'bg-red-100 text-red-700' };
}

// Normalize API result row → shape the table/chart expects
function normalizeResult(r) {
    return {
        ...r,
        score: r.total_score ?? r.score ?? 0,
        max: r.total_max ?? r.max ?? 48,
        physicalScore: r.physical_score ?? r.physicalScore ?? 0,
        physicalMax: r.physical_max ?? r.physicalMax ?? 24,
        emotionalScore: r.emotional_score ?? r.emotionalScore ?? 0,
        emotionalMax: r.emotional_max ?? r.emotionalMax ?? 24,
        percentage: r.percentage ?? 0,
        category: r.wellness_category ?? r.category ?? '',
        date: r.submitted_at ?? r.date ?? null,
        answers: r.answers ?? null,
    };
}

// Normalize API campaign row → shape the links tab expects
function normalizeCampaign(c) {
    return {
        ...c,
        createdAt: c.created_at ?? c.createdAt ?? new Date().toISOString(),
        employees: Array.isArray(c.employees) ? c.employees : JSON.parse(c.employees || '[]'),
    };
}
const HRDashboard = () => {
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [activeTab, setActiveTab] = useState('create');
    const [campaigns, setCampaigns] = useState([]);
    const [results, setResults] = useState([]);
    const [copied, setCopied] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [loadError, setLoadError] = useState('');

    const [form, setForm] = useState({
        campaignName: '',
        department: '',
        deadline: '',
        employees: '',
    });

    const loadData = async (currentSession) => {
        try {
            const company = currentSession.company || currentSession.company_name || '';
            const createdBy = currentSession.name || currentSession.contact_person || '';
            const [campRes, resRes] = await Promise.all([
                api.get(`/assessment/campaigns?company=${encodeURIComponent(company)}`),
                api.get(`/assessment/results?company=${encodeURIComponent(company)}`).catch(() => ({ data: { data: [] } })),
            ]);
            setCampaigns((campRes.data.data || []).map(normalizeCampaign));
            setResults((resRes.data.data || []).map(normalizeResult));
        } catch {
            // Fallback to localStorage if API unreachable
            setLoadError('Could not load data from server — showing cached data.');
            const saved = JSON.parse(localStorage.getItem('hr_campaigns') || '[]');
            setCampaigns(saved);
            const savedRes = JSON.parse(localStorage.getItem('wellness_results') || '[]');
            setResults(savedRes);
        }
    };

    useEffect(() => {
        // Check for HR authentication
        const token = localStorage.getItem('hr_token');
        const storedUser = localStorage.getItem('hr_user');
        const sess = sessionStorage.getItem('hr_session');

        if (!token || (!storedUser && !sess)) {
            navigate('/assessment/hr-login');
            return;
        }

        // Prefer hr_user (set at login), fall back to sess
        let parsed;
        if (storedUser) {
            const u = JSON.parse(storedUser);
            parsed = {
                ...u,
                name: u.contact_person,
                company: u.company_name,
                loginAt: new Date().toISOString(),
            };
            // Keep sessionStorage in sync
            sessionStorage.setItem('hr_session', JSON.stringify(parsed));
        } else {
            parsed = JSON.parse(sess);
        }
        setSession(parsed);
        loadData(parsed);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('hr_token');
        localStorage.removeItem('hr_user');
        sessionStorage.removeItem('hr_session');
        navigate('/assessment/hr-login');
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        const emails = form.employees.split(',').map(e => e.trim()).filter(Boolean);
        const campaign = {
            id: generateId(),
            name: form.campaignName,
            department: form.department,
            deadline: form.deadline || null,
            createdAt: new Date().toISOString(),
            createdBy: session.name,
            company: session.company || '',
            employees: emails.map(email => ({ email, linkId: generateId(), status: 'Pending' })),
        };

        try {
            await api.post('/assessment/campaign', campaign);
        } catch {
            // Save offline if API fails
        }

        // Always update local state + localStorage cache
        const updated = [...campaigns, campaign];
        setCampaigns(updated);
        localStorage.setItem('hr_campaigns', JSON.stringify(updated));
        setForm({ campaignName: '', department: '', deadline: '', employees: '' });
        setIsCreating(false);
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); setActiveTab('links'); }, 1800);
    };

    const getAssessmentUrl = (linkId) => `${window.location.origin}/assessment/employee/${linkId}`;

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const avgScore = results.length > 0
        ? Math.round(results.reduce((s, r) => s + Math.round((r.score / r.max) * 100), 0) / results.length)
        : 0;

    if (!session) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navbar */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow">
                            {session.name[0]}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm leading-none">{session.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{session.company}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/programs/corporate-yoga" className="text-xs text-gray-500 hover:text-gray-700 hidden sm:block">
                            ← Programs
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {loadError && (
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-amber-700 text-xs">
                    {loadError}
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: '📋', value: campaigns.length, label: 'Campaigns Created' },
                        { icon: '👥', value: campaigns.reduce((s, c) => s + c.employees.length, 0), label: 'Employees Invited' },
                        { icon: '✅', value: results.length, label: 'Assessments Done' },
                        { icon: '📊', value: `${avgScore}%`, label: 'Avg Wellness Score' },
                    ].map(stat => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                        >
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-sm border border-gray-100 w-fit">
                    {[
                        { key: 'create', label: '+ Create Assessment', icon: '📝' },
                        { key: 'links', label: 'Assessment Links', icon: '🔗' },
                        { key: 'results', label: 'Team Results', icon: '📊' },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                                ${activeTab === tab.key
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* ── TAB: Create Campaign ── */}
                    {activeTab === 'create' && (
                        <motion.div key="create" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Form */}
                                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6">Create Assessment Campaign</h2>
                                    <form onSubmit={handleCreate} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Campaign Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.campaignName}
                                                onChange={e => setForm(p => ({ ...p, campaignName: e.target.value }))}
                                                placeholder="e.g., Q1 Wellness Check – Engineering"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none bg-gray-50 text-gray-800 placeholder-gray-400 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department / Team</label>
                                            <input
                                                type="text"
                                                value={form.department}
                                                onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                                                placeholder="e.g., Engineering, Marketing, HR"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none bg-gray-50 text-gray-800 placeholder-gray-400 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deadline</label>
                                            <input
                                                type="date"
                                                value={form.deadline}
                                                min={new Date().toISOString().split('T')[0]}
                                                onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none bg-gray-50 text-gray-800 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                Employee Emails * <span className="text-gray-400 font-normal">(comma-separated)</span>
                                            </label>
                                            <textarea
                                                required
                                                value={form.employees}
                                                onChange={e => setForm(p => ({ ...p, employees: e.target.value }))}
                                                placeholder="alice@company.com, bob@company.com, charlie@company.com"
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none bg-gray-50 text-gray-800 placeholder-gray-400 transition resize-none"
                                            />
                                            {form.employees && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {form.employees.split(',').filter(e => e.trim()).length} employee(s) listed
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isCreating}
                                            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {isCreating ? 'Creating...' : '🚀 Generate Assessment Links'}
                                        </button>
                                    </form>
                                    {showSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mt-4 bg-green-50 border border-green-300 rounded-xl px-4 py-3 flex items-center gap-2"
                                        >
                                            <span className="text-green-600 text-lg">✅</span>
                                            <p className="text-green-700 font-semibold text-sm">Campaign created! Redirecting to links…</p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Instructions */}
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                                        <h3 className="font-bold text-green-800 text-lg mb-4">How It Works</h3>
                                        {[
                                            { step: '1', title: 'Create a Campaign', desc: 'Enter your team details and employee emails.' },
                                            { step: '2', title: 'Get Unique Links', desc: 'Each employee gets a unique assessment link.' },
                                            { step: '3', title: 'Share with Team', desc: 'Copy & send links via email or chat.' },
                                            { step: '4', title: 'View Team Results', desc: 'See scores and wellness insights per employee.' },
                                        ].map(s => (
                                            <div key={s.step} className="flex items-start gap-3 mb-4">
                                                <div className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                    {s.step}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-green-900 text-sm">{s.title}</p>
                                                    <p className="text-green-700 text-xs mt-0.5">{s.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                                        <p className="text-blue-800 text-sm font-semibold mb-2">📌 Assessment Covers</p>
                                        <ul className="text-blue-700 text-xs space-y-1">
                                            <li>• 6 Physical Health questions (posture, pain, sleep)</li>
                                            <li>• 6 Emotional Wellbeing questions (energy, stress, clarity)</li>
                                            <li>• Scored on a scale of 12–48 points</li>
                                            <li>• Personalized wellness category & program recommendations</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── TAB: Assessment Links ── */}
                    {activeTab === 'links' && (
                        <motion.div key="links" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {campaigns.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                                    <div className="text-5xl mb-4">📭</div>
                                    <h3 className="text-xl font-bold text-gray-700 mb-2">No campaigns yet</h3>
                                    <p className="text-gray-400 mb-6">Create your first assessment campaign to generate employee links.</p>
                                    <button onClick={() => setActiveTab('create')} className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                                        + Create Campaign
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {campaigns.map(campaign => (
                                        <div key={campaign.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                                            <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3"
                                                style={{ background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)' }}>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg">{campaign.name}</h3>
                                                    <div className="flex flex-wrap gap-3 mt-1">
                                                        {campaign.department && (
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                                🏢 {campaign.department}
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-400">Created {formatDate(campaign.createdAt)}</span>
                                                        {campaign.deadline && (
                                                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                                                ⏰ Due {formatDate(campaign.deadline)}
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-400">by {campaign.createdBy}</span>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                    {campaign.employees.length} employees
                                                </span>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {campaign.employees.map((emp) => {
                                                    const url = getAssessmentUrl(emp.linkId);
                                                    const isCopied = copied === emp.linkId;
                                                    const empResult = results.find(r => r.linkId === emp.linkId);
                                                    return (
                                                        <div key={emp.linkId} className="px-5 py-4 flex flex-wrap items-center gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-gray-800">{emp.email}</p>
                                                                <p className="text-xs text-gray-400 truncate mt-0.5 font-mono">{url}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {empResult ? (
                                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getWellnessLabel(empResult.score, empResult.max).bg}`}>
                                                                        ✅ {Math.round((empResult.score / empResult.max) * 100)}%
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">⏳ Pending</span>
                                                                )}
                                                                <button
                                                                    onClick={() => handleCopy(url, emp.linkId)}
                                                                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all
                                                                        ${isCopied
                                                                            ? 'bg-green-500 border-green-500 text-white'
                                                                            : 'border-green-300 text-green-700 hover:bg-green-50'
                                                                        }`}
                                                                >
                                                                    {isCopied ? '✓ Copied' : '📋 Copy Link'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── TAB: Team Results ── */}
                    {activeTab === 'results' && (
                        <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {results.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                                    <div className="text-5xl mb-4">📊</div>
                                    <h3 className="text-xl font-bold text-gray-700 mb-2">No assessments submitted yet</h3>
                                    <p className="text-gray-400">Results will appear here once employees complete their assessments.</p>
                                </div>
                            ) : (
                                <div>
                                    {/* Summary */}
                                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
                                        <h3 className="font-bold text-gray-800 text-lg mb-4">Team Wellness Overview</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {['Excellent', 'Good', 'Needs Attention', 'Critical'].map((cat, i) => {
                                                const colors = ['text-green-700 bg-green-100', 'text-blue-700 bg-blue-100', 'text-amber-700 bg-amber-100', 'text-red-700 bg-red-100'];
                                                const count = results.filter(r => {
                                                    const pct = (r.score / r.max) * 100;
                                                    if (i === 0) return pct >= 80;
                                                    if (i === 1) return pct >= 60 && pct < 80;
                                                    if (i === 2) return pct >= 40 && pct < 60;
                                                    return pct < 40;
                                                }).length;
                                                return (
                                                    <div key={cat} className={`rounded-xl p-4 text-center ${colors[i]}`}>
                                                        <div className="text-2xl font-bold">{count}</div>
                                                        <div className="text-xs mt-1 font-medium">{cat}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Results Table */}
                                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                                        <div className="p-5 border-b border-gray-100">
                                            <h3 className="font-bold text-gray-800">Individual Results</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-200">
                                                        {['Name', 'Email', 'Designation', '🧘 Physical', '💚 Emotional', '📊 Total Score', 'Category', 'Type', 'Date'].map(h => (
                                                            <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {results.map((r, i) => {
                                                        const cat = getWellnessLabel(r.score, r.max);
                                                        const physPct = r.physicalMax > 0 ? Math.round((r.physicalScore / r.physicalMax) * 100) : 0;
                                                        const emotPct = r.emotionalMax > 0 ? Math.round((r.emotionalScore / r.emotionalMax) * 100) : 0;
                                                        const totalPct = r.max > 0 ? Math.round((r.score / r.max) * 100) : 0;
                                                        // Build per-question tooltip text if answers available
                                                        const answerTip = r.answers
                                                            ? Object.entries(r.answers).map(([k, v]) => `${k}:${v}`).join('  ')
                                                            : null;
                                                        return (
                                                            <tr key={i} className="hover:bg-gray-50 transition">
                                                                <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{r.name}</td>
                                                                <td className="px-4 py-3 text-gray-500 text-xs">{r.email}</td>
                                                                <td className="px-4 py-3 text-gray-500 text-xs">{r.designation || '—'}</td>

                                                                {/* Physical sub-score */}
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="font-bold text-green-700">{r.physicalScore}</span>
                                                                        <span className="text-gray-400 text-xs">/{r.physicalMax}</span>
                                                                    </div>
                                                                    <div className="w-16 bg-gray-100 rounded-full h-1.5 mt-1">
                                                                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${physPct}%` }} />
                                                                    </div>
                                                                    <span className="text-xs text-gray-400">{physPct}%</span>
                                                                </td>

                                                                {/* Emotional sub-score */}
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="font-bold text-blue-700">{r.emotionalScore}</span>
                                                                        <span className="text-gray-400 text-xs">/{r.emotionalMax}</span>
                                                                    </div>
                                                                    <div className="w-16 bg-gray-100 rounded-full h-1.5 mt-1">
                                                                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${emotPct}%` }} />
                                                                    </div>
                                                                    <span className="text-xs text-gray-400">{emotPct}%</span>
                                                                </td>

                                                                {/* Total score + per-question points tooltip */}
                                                                <td className="px-4 py-3">
                                                                    <div
                                                                        className="cursor-help"
                                                                        title={answerTip ? `Per-question points:\n${answerTip}` : 'No per-question data'}
                                                                    >
                                                                        <span className="font-bold text-gray-800 text-base">{r.score}</span>
                                                                        <span className="text-gray-400 text-xs">/{r.max}</span>
                                                                        <span className="ml-1 text-gray-500 text-xs">({totalPct}%)</span>
                                                                        {answerTip && <span className="ml-1 text-gray-300 text-xs">ℹ</span>}
                                                                    </div>
                                                                </td>

                                                                <td className="px-4 py-3">
                                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${cat.bg}`}>{cat.label}</span>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${r.type === 'employee' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                                        {r.type === 'employee' ? '🏢 Employee' : '👤 Individual'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{r.date ? formatDate(r.date) : '—'}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default HRDashboard;
