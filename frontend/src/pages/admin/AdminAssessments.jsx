import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const AdminAssessments = ({ isDark }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, individual, employee
    const [searchTerm, setSearchTerm] = useState('');

    const t = {
        card: isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
        cardTitle: isDark ? 'text-white' : 'text-gray-800',
        cardTxt: isDark ? 'text-gray-400' : 'text-gray-500',
        input: isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400',
        table: isDark ? 'bg-gray-900' : 'bg-white',
        tableHead: isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600',
        tableRow: isDark ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50',
        tableTxt: isDark ? 'text-gray-300' : 'text-gray-700',
    };

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/assessment/results');
            setResults(res.data.data || []);
        } catch (err) {
            setError('Failed to load assessment results. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryStyle = (category) => {
        switch (category) {
            case 'Excellent': return 'bg-green-100 text-green-700 border-green-200';
            case 'Good': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Needs Attention': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredResults = results.filter(r => {
        if (filter !== 'all' && r.type !== filter) return false;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return r.name?.toLowerCase().includes(term) ||
                   r.email?.toLowerCase().includes(term) ||
                   r.city?.toLowerCase().includes(term) ||
                   r.campaign_name?.toLowerCase().includes(term);
        }
        return true;
    });

    const individualCount = results.filter(r => r.type === 'individual').length;
    const employeeCount = results.filter(r => r.type === 'employee').length;

    const avgScore = results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length)
        : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-3xl text-green-500 mb-3"></i>
                    <p className={t.cardTxt}>Loading assessments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Assessments', value: results.length, icon: 'fas fa-clipboard-list', color: 'from-green-400 to-green-600' },
                    { label: 'Individual', value: individualCount, icon: 'fas fa-user', color: 'from-blue-400 to-blue-600' },
                    { label: 'HR / Team', value: employeeCount, icon: 'fas fa-users', color: 'from-purple-400 to-purple-600' },
                    { label: 'Avg Score', value: `${avgScore}%`, icon: 'fas fa-chart-line', color: 'from-orange-400 to-orange-600' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`rounded-xl p-4 border ${t.card}`}
                    >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                            <i className={`${stat.icon} text-white`}></i>
                        </div>
                        <p className={`text-2xl font-bold ${t.cardTitle}`}>{stat.value}</p>
                        <p className={`text-sm ${t.cardTxt}`}>{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    <i className="fas fa-exclamation-circle mr-2"></i>{error}
                    <button onClick={loadResults} className="ml-3 underline">Retry</button>
                </div>
            )}

            {/* Filters */}
            <div className={`rounded-xl p-4 border ${t.card}`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by name, email, city, or campaign..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${t.input}`}
                        />
                    </div>
                    <div className="flex gap-2">
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'individual', label: 'Individual' },
                            { key: 'employee', label: 'HR / Team' },
                        ].map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                    ${filter === f.key
                                        ? 'bg-green-500 text-white'
                                        : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Table */}
            <div className={`rounded-xl border overflow-hidden ${t.card}`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={t.tableHead}>
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Mobile</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">City</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Physical</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Emotional</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className={`px-4 py-8 text-center ${t.cardTxt}`}>
                                        <i className="fas fa-inbox text-3xl mb-2 opacity-50"></i>
                                        <p>No assessment results found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredResults.map((r, i) => (
                                    <tr key={r.id || i} className={`border-t ${t.tableRow}`}>
                                        <td className={`px-4 py-3 text-sm font-medium ${t.tableTxt}`}>{r.name}</td>
                                        <td className={`px-4 py-3 text-sm ${t.cardTxt}`}>{r.email}</td>
                                        <td className={`px-4 py-3 text-sm ${t.cardTxt}`}>{r.mobile || '-'}</td>
                                        <td className={`px-4 py-3 text-sm ${t.cardTxt}`}>{r.city || '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium
                                                ${r.type === 'individual' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                {r.type === 'individual' ? 'Individual' : 'HR/Team'}
                                            </span>
                                        </td>
                                        <td className={`px-4 py-3 text-sm ${t.cardTxt}`}>{r.campaign_name || '-'}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-sm font-medium ${t.tableTxt}`}>
                                                {r.physical_score}/{r.physical_max}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-sm font-medium ${t.tableTxt}`}>
                                                {r.emotional_score}/{r.emotional_max}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-sm font-bold text-green-600">
                                                {r.percentage}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-0.5 rounded border text-xs font-medium ${getCategoryStyle(r.wellness_category)}`}>
                                                {r.wellness_category}
                                            </span>
                                        </td>
                                        <td className={`px-4 py-3 text-sm ${t.cardTxt}`}>
                                            {r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Export hint */}
            <p className={`text-sm text-center ${t.cardTxt}`}>
                Showing {filteredResults.length} of {results.length} results
            </p>
        </div>
    );
};

export default AdminAssessments;
