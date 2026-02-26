import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_PROGRAMS = [
    { id: 1, title: 'Yoga as a Sport', description: 'Competitive yoga training focusing on strength, flexibility, and performance excellence.', icon: 'fas fa-trophy', color: 'bg-yellow-100 text-yellow-600', link: '/programs/yoga-as-sport', status: 'active' },
    { id: 2, title: 'Corporate Yoga', description: 'Stress management and productivity enhancement programs tailored for the workplace.', icon: 'fas fa-briefcase', color: 'bg-blue-100 text-blue-600', link: '/programs/corporate-yoga', status: 'active' },
    { id: 3, title: 'Yoga for Sport', description: 'Specialized training for athletes to prevent injury and improve recovery.', icon: 'fas fa-running', color: 'bg-green-100 text-green-600', link: '/programs/yoga-for-sport', status: 'active' },
    { id: 4, title: 'Women Wellness', description: 'Holistic health practices for hormonal balance and emotional well-being.', icon: 'fas fa-female', color: 'bg-pink-100 text-pink-600', link: '/programs/women-wellness', status: 'active' },
    { id: 5, title: 'Tech-Supported Yoga', description: 'AI-driven posture analysis and virtual sessions for modern practitioners.', icon: 'fas fa-microchip', color: 'bg-indigo-100 text-indigo-600', link: '/programs/tech-supported-yoga', status: 'active' },
    { id: 6, title: 'Therapy', description: 'Therapeutic applications of yoga for specific health conditions and recovery.', icon: 'fas fa-heartbeat', color: 'bg-red-100 text-red-600', link: '/therapy', status: 'active' },
    { id: 7, title: 'Adolescence', description: 'Yoga for teens to build focus, confidence, and emotional stability.', icon: 'fas fa-user-graduate', color: 'bg-orange-100 text-orange-600', link: '/programs/adolescence', status: 'active' },
    { id: 8, title: 'Prenatal & Postnatal', description: 'Gentle care for expecting and new mothers to navigate the journey of motherhood.', icon: 'fas fa-baby-carriage', color: 'bg-rose-100 text-rose-600', link: '/programs/prenatal-postnatal', status: 'active' },
];

const COLOR_OPTIONS = [
    { label: 'Yellow', value: 'bg-yellow-100 text-yellow-600' },
    { label: 'Blue', value: 'bg-blue-100 text-blue-600' },
    { label: 'Green', value: 'bg-green-100 text-green-600' },
    { label: 'Pink', value: 'bg-pink-100 text-pink-600' },
    { label: 'Indigo', value: 'bg-indigo-100 text-indigo-600' },
    { label: 'Red', value: 'bg-red-100 text-red-600' },
    { label: 'Orange', value: 'bg-orange-100 text-orange-600' },
    { label: 'Rose', value: 'bg-rose-100 text-rose-600' },
    { label: 'Purple', value: 'bg-purple-100 text-purple-600' },
    { label: 'Teal', value: 'bg-teal-100 text-teal-600' },
];

const EMPTY_FORM = { title: '', description: '', icon: 'fas fa-leaf', color: 'bg-green-100 text-green-600', link: '', status: 'active' };

const AdminPrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null); // null = add new
    const [form, setForm] = useState(EMPTY_FORM);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState(null);

    // Load from localStorage (fallback to defaults)
    useEffect(() => {
        const stored = localStorage.getItem('admin_programs');
        setPrograms(stored ? JSON.parse(stored) : DEFAULT_PROGRAMS);
    }, []);

    const save = (list) => {
        setPrograms(list);
        localStorage.setItem('admin_programs', JSON.stringify(list));
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const openAdd = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditing(p.id);
        setForm({ title: p.title, description: p.description, icon: p.icon, color: p.color, link: p.link, status: p.status });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim()) return;

        if (editing) {
            const updated = programs.map(p => p.id === editing ? { ...p, ...form } : p);
            save(updated);
            showToast('Program updated successfully!');
        } else {
            const newP = { ...form, id: Date.now() };
            save([...programs, newP]);
            showToast('Program added successfully!');
        }
        setShowModal(false);
    };

    const confirmDelete = () => {
        const updated = programs.filter(p => p.id !== deleteTarget.id);
        save(updated);
        setDeleteTarget(null);
        showToast('Program deleted.', 'error');
    };

    const filtered = programs.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium flex items-center gap-2
                            ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
                        <i className={`fas ${toast.type === 'error' ? 'fa-trash' : 'fa-check-circle'}`}></i>
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header bar */}
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-white text-xl font-bold">Programs Manager</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{programs.length} programs total</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
                        <input type="text" placeholder="Search programs…" value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
                    </div>
                    <button onClick={openAdd}
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
                        <i className="fas fa-plus text-xs"></i> Add Program
                    </button>
                </div>
            </div>

            {/* Programs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((p, i) => (
                    <motion.div key={p.id}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-green-500/50 transition-colors group"
                    >
                        <div className="p-5">
                            {/* Icon + status */}
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${p.color}`}>
                                    <i className={p.icon}></i>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.status === 'active' ? 'bg-green-900/60 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                                    {p.status}
                                </span>
                            </div>

                            <h3 className="text-white font-semibold text-base mb-2 leading-tight">{p.title}</h3>
                            <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{p.description}</p>

                            {p.link && (
                                <p className="text-green-500/70 text-xs mt-2 truncate font-mono">{p.link}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="border-t border-gray-800 flex">
                            <button onClick={() => openEdit(p)}
                                className="flex-1 py-3 text-sm text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-2 font-medium">
                                <i className="fas fa-pen text-xs"></i> Edit
                            </button>
                            <div className="w-px bg-gray-800"></div>
                            <button onClick={() => setDeleteTarget(p)}
                                className="flex-1 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 font-medium">
                                <i className="fas fa-trash text-xs"></i> Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
                    <i className="fas fa-layer-group text-gray-700 text-4xl mb-4"></i>
                    <p className="text-gray-400">No programs found</p>
                    <p className="text-gray-600 text-sm mt-1">Try a different search or add a new program</p>
                </div>
            )}

            {/* ── Add / Edit Modal ── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
                            className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-800">
                                <h3 className="text-white font-bold text-lg">
                                    {editing ? 'Edit Program' : 'Add New Program'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1.5">Program Title *</label>
                                    <input type="text" value={form.title} required
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                        placeholder="e.g., Corporate Yoga" />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-1.5">Description *</label>
                                    <textarea value={form.description} required rows={3}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 resize-none"
                                        placeholder="Describe this program…" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1.5">Font Awesome Icon</label>
                                        <input type="text" value={form.icon}
                                            onChange={e => setForm({ ...form, icon: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                            placeholder="fas fa-leaf" />
                                        <p className="text-gray-600 text-xs mt-1">Preview: <i className={`${form.icon} text-green-400`}></i></p>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1.5">Card Color</label>
                                        <select value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500">
                                            {COLOR_OPTIONS.map(c => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1.5">Page Link</label>
                                        <input type="text" value={form.link}
                                            onChange={e => setForm({ ...form, link: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                            placeholder="/programs/my-program" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1.5">Status</label>
                                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl text-sm font-medium transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-medium transition-colors">
                                        {editing ? 'Save Changes' : 'Add Program'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Delete Confirm ── */}
            <AnimatePresence>
                {deleteTarget && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                    >
                        <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
                            className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center"
                        >
                            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-trash text-red-400 text-xl"></i>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Delete Program?</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                "<strong className="text-white">{deleteTarget.title}</strong>" will be permanently removed. This cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteTarget(null)}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl text-sm font-medium transition-colors">
                                    Cancel
                                </button>
                                <button onClick={confirmDelete}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-medium transition-colors">
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPrograms;
