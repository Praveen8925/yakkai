import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const AdminHRUsers = ({ isDark }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [expandedUser, setExpandedUser] = useState(null);
    const [userStats, setUserStats] = useState({});

    const [form, setForm] = useState({
        username: '',
        password: '',
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        status: 'active',
    });

    const t = {
        card: isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
        cardTitle: isDark ? 'text-white' : 'text-gray-800',
        cardTxt: isDark ? 'text-gray-400' : 'text-gray-500',
        input: isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400',
        tableHead: isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600',
        tableRow: isDark ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50',
        tableTxt: isDark ? 'text-gray-300' : 'text-gray-700',
        modal: isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/hr-users');
            setUsers(res.data.data || []);
        } catch (err) {
            setError('Failed to load HR users. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const loadUserStats = async (userId) => {
        if (userStats[userId]) {
            setExpandedUser(expandedUser === userId ? null : userId);
            return;
        }
        try {
            const res = await api.get(`/hr-users/stats/${userId}`);
            setUserStats(prev => ({ ...prev, [userId]: res.data }));
            setExpandedUser(userId);
        } catch (err) {
            console.error('Failed to load user stats', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            if (editingUser) {
                await api.put(`/hr-users/${editingUser.id}`, form);
            } else {
                await api.post('/hr-users', form);
            }
            setShowForm(false);
            setEditingUser(null);
            resetForm();
            loadUsers();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save HR user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setForm({
            username: user.username,
            password: '', // Don't show password
            company_name: user.company_name,
            contact_person: user.contact_person,
            email: user.email,
            phone: user.phone || '',
            status: user.status,
        });
        setShowForm(true);
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this HR user? This will NOT delete their assessment data.')) return;
        try {
            await api.delete(`/hr-users/${userId}`);
            loadUsers();
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    const resetForm = () => {
        setForm({
            username: '',
            password: '',
            company_name: '',
            contact_person: '',
            email: '',
            phone: '',
            status: 'active',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-3xl text-green-500 mb-3"></i>
                    <p className={t.cardTxt}>Loading HR users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-xl font-bold ${t.cardTitle}`}>HR User Management</h2>
                    <p className={`text-sm ${t.cardTxt}`}>Create login accounts for companies to access corporate yoga assessments</p>
                </div>
                <button
                    onClick={() => { resetForm(); setEditingUser(null); setShowForm(true); }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <i className="fas fa-plus"></i>
                    Add HR User
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    <i className="fas fa-exclamation-circle mr-2"></i>{error}
                </div>
            )}

            {/* Users List */}
            <div className="space-y-4">
                {users.length === 0 ? (
                    <div className={`rounded-xl p-8 border text-center ${t.card}`}>
                        <i className="fas fa-building text-4xl text-gray-400 mb-3"></i>
                        <p className={t.cardTxt}>No HR users created yet</p>
                        <p className={`text-sm mt-1 ${t.cardTxt}`}>Click "Add HR User" to create the first company account</p>
                    </div>
                ) : (
                    users.map((user, i) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`rounded-xl border ${t.card}`}
                        >
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                                        <i className="fas fa-building text-white text-lg"></i>
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${t.cardTitle}`}>{user.company_name}</h3>
                                        <p className={`text-sm ${t.cardTxt}`}>
                                            <i className="fas fa-user mr-1"></i>{user.contact_person} &nbsp;|&nbsp;
                                            <i className="fas fa-at mr-1"></i>{user.username}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium
                                        ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {user.status}
                                    </span>
                                    <span className={`text-sm ${t.cardTxt}`}>
                                        {user.campaign_count || 0} campaigns
                                    </span>
                                    <span className={`text-sm ${t.cardTxt}`}>
                                        {user.assessment_count || 0} assessments
                                    </span>
                                    <button
                                        onClick={() => loadUserStats(user.id)}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors
                                            ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                                    >
                                        <i className={`fas fa-chevron-${expandedUser === user.id ? 'up' : 'down'} mr-1`}></i>
                                        Details
                                    </button>
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {expandedUser === user.id && userStats[user.id] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className={`border-t p-4 space-y-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                                            {/* Stats Row */}
                                            <div className="grid grid-cols-4 gap-4">
                                                <div className={`rounded-lg p-3 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                                    <p className={`text-2xl font-bold ${t.cardTitle}`}>{userStats[user.id]?.stats?.total_campaigns || 0}</p>
                                                    <p className={`text-xs ${t.cardTxt}`}>Campaigns</p>
                                                </div>
                                                <div className={`rounded-lg p-3 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                                    <p className={`text-2xl font-bold ${t.cardTitle}`}>{userStats[user.id]?.stats?.total_invited || 0}</p>
                                                    <p className={`text-xs ${t.cardTxt}`}>Employees Invited</p>
                                                </div>
                                                <div className={`rounded-lg p-3 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                                    <p className={`text-2xl font-bold ${t.cardTitle}`}>{userStats[user.id]?.stats?.total_completed || 0}</p>
                                                    <p className={`text-xs ${t.cardTxt}`}>Completed</p>
                                                </div>
                                                <div className={`rounded-lg p-3 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                                    <p className={`text-2xl font-bold text-green-500`}>{userStats[user.id]?.stats?.completion_rate || 0}%</p>
                                                    <p className={`text-xs ${t.cardTxt}`}>Completion Rate</p>
                                                </div>
                                            </div>

                                            {/* Contact Info */}
                                            <div className={`rounded-lg p-3 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                                <p className={`text-sm ${t.cardTxt}`}>
                                                    <i className="fas fa-envelope mr-2"></i>{user.email}
                                                    {user.phone && <span className="ml-4"><i className="fas fa-phone mr-2"></i>{user.phone}</span>}
                                                </p>
                                            </div>

                                            {/* Results Table */}
                                            {userStats[user.id]?.results?.length > 0 && (
                                                <div>
                                                    <h4 className={`font-semibold mb-2 ${t.cardTitle}`}>Recent Assessment Results</h4>
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-sm">
                                                            <thead className={t.tableHead}>
                                                                <tr>
                                                                    <th className="px-3 py-2 text-left">Name</th>
                                                                    <th className="px-3 py-2 text-left">Email</th>
                                                                    <th className="px-3 py-2 text-left">Campaign</th>
                                                                    <th className="px-3 py-2 text-center">Score</th>
                                                                    <th className="px-3 py-2 text-left">Category</th>
                                                                    <th className="px-3 py-2 text-left">Date</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {userStats[user.id].results.slice(0, 10).map((r, ri) => (
                                                                    <tr key={ri} className={`border-t ${t.tableRow}`}>
                                                                        <td className={`px-3 py-2 ${t.tableTxt}`}>{r.name}</td>
                                                                        <td className={`px-3 py-2 ${t.cardTxt}`}>{r.email}</td>
                                                                        <td className={`px-3 py-2 ${t.cardTxt}`}>{r.campaign_name}</td>
                                                                        <td className="px-3 py-2 text-center font-bold text-green-500">{r.percentage}%</td>
                                                                        <td className="px-3 py-2">
                                                                            <span className={`px-2 py-0.5 rounded text-xs font-medium
                                                                                ${r.wellness_category === 'Excellent' ? 'bg-green-100 text-green-700' :
                                                                                  r.wellness_category === 'Good' ? 'bg-blue-100 text-blue-700' :
                                                                                  r.wellness_category === 'Needs Attention' ? 'bg-amber-100 text-amber-700' :
                                                                                  'bg-red-100 text-red-700'}`}>
                                                                                {r.wellness_category}
                                                                            </span>
                                                                        </td>
                                                                        <td className={`px-3 py-2 ${t.cardTxt}`}>
                                                                            {new Date(r.submitted_at).toLocaleDateString()}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-md rounded-2xl border p-6 ${t.modal}`}
                        >
                            <h3 className={`text-lg font-bold mb-4 ${t.cardTitle}`}>
                                {editingUser ? 'Edit HR User' : 'Create New HR User'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${t.cardTxt}`}>Username *</label>
                                    <input
                                        type="text"
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                        required
                                        disabled={editingUser}
                                        placeholder="e.g., techcorp_hr"
                                        autoComplete="username"
                                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${t.input} ${editingUser ? 'opacity-60' : ''}`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${t.cardTxt}`}>
                                        Password {editingUser ? '(leave blank to keep current)' : '*'}
                                    </label>
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        required={!editingUser}
                                        minLength={6}
                                        placeholder="Min 6 characters"
                                        autoComplete={editingUser ? 'new-password' : 'new-password'}
                                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${t.input}`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${t.cardTxt}`}>Company Name *</label>
                                    <input
                                        type="text"
                                        value={form.company_name}
                                        onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                                        required
                                        placeholder="e.g., TechCorp Solutions"
                                        autoComplete="organization"
                                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${t.input}`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${t.cardTxt}`}>Contact Person *</label>
                                    <input
                                        type="text"
                                        value={form.contact_person}
                                        onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                                        required
                                        placeholder="e.g., John Doe (HR Manager)"
                                        autoComplete="name"
                                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${t.input}`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${t.cardTxt}`}>Email *</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                        placeholder="hr@company.com"
                                        autoComplete="email"
                                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${t.input}`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${t.cardTxt}`}>Phone</label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="+91 9876543210"
                                        autoComplete="tel"
                                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${t.input}`}
                                    />
                                </div>

                                {editingUser && (
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${t.cardTxt}`}>Status</label>
                                        <select
                                            value={form.status}
                                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${t.input}`}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className={`flex-1 py-2 rounded-lg font-medium transition-colors
                                            ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminHRUsers;
