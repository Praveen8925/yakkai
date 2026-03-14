import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const PAGES = [
    {
        id: 'home',
        label: 'Home Page',
        route: '/',
        icon: 'fas fa-home',
        color: 'from-green-400 to-green-600',
        description: 'Hero banner, programs section, contact CTA',
        fields: [
            { key: 'heroTitle', label: 'Hero Title', type: 'text', default: 'Yakkai Neri Yoga Academy' },
            { key: 'heroSubtitle', label: 'Hero Subtitle', type: 'text', default: 'Transform Your Life Through the Power of Yoga' },
            { key: 'heroBtn', label: 'Hero Button Text', type: 'text', default: 'Explore Courses' },
            { key: 'sectionTitle', label: 'Programs Section Title', type: 'text', default: 'Our Programs' },
        ]
    },
    {
        id: 'wellness',
        label: 'Wellness Page',
        route: '/wellness',
        icon: 'fas fa-spa',
        color: 'from-teal-400 to-teal-600',
        description: 'Hero section, all program cards',
        fields: [
            { key: 'heroTitle', label: 'Page Title', type: 'text', default: 'Wellness Programs' },
            { key: 'heroSubtitle', label: 'Page Subtitle', type: 'textarea', default: 'Discover our comprehensive range of specialized yoga programs designed for every stage of life and unique needs.' },
            { key: 'ctaTitle', label: 'CTA Heading', type: 'text', default: 'Not sure which program is right for you?' },
            { key: 'ctaBtn', label: 'CTA Button', type: 'text', default: 'Get Free Consultation' },
        ]
    },
    {
        id: 'contact',
        label: 'Contact Page',
        route: '/contact',
        icon: 'fas fa-envelope',
        color: 'from-blue-400 to-blue-600',
        description: 'Contact form, address, phone, email',
        fields: [
            { key: 'heading', label: 'Page Heading', type: 'text', default: 'Get In Touch' },
            { key: 'subtext', label: 'Sub Text', type: 'textarea', default: 'We\'d love to hear from you. Reach out with any questions.' },
            { key: 'phone', label: 'Phone Number', type: 'text', default: '+91 90900 80180' },
            { key: 'email', label: 'Email Address', type: 'text', default: 'contact@yakkaineri.com' },
            { key: 'address', label: 'Address', type: 'textarea', default: 'No 86, Sengupta Street, Ramnagar, Coimbatore 641009' },
        ]
    },
    {
        id: 'therapy',
        label: 'Therapy Page',
        route: '/therapy',
        icon: 'fas fa-heartbeat',
        color: 'from-red-400 to-red-600',
        description: 'Therapy programs, conditions treated',
        fields: [
            { key: 'heroTitle', label: 'Page Title', type: 'text', default: 'Yoga Therapy' },
            { key: 'heroSubtitle', label: 'Page Subtitle', type: 'textarea', default: 'Healing through the ancient science of yoga, tailored for your specific health conditions.' },
        ]
    },
    {
        id: 'workshops',
        label: 'Workshops Page',
        route: '/workshops',
        icon: 'fas fa-chalkboard-teacher',
        color: 'from-orange-400 to-orange-600',
        description: 'Upcoming workshops, registration',
        fields: [
            { key: 'heroTitle', label: 'Page Title', type: 'text', default: 'Workshops & Events' },
            { key: 'heroSubtitle', label: 'Page Subtitle', type: 'textarea', default: 'Join our transformative workshops led by expert yoga practitioners.' },
        ]
    },
];

const AdminPages = () => {
    const [selected, setSelected] = useState(null);  // id of page being edited
    const [formData, setFormData] = useState({});
    const [toast, setToast] = useState(null);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const openEditor = (page) => {
        const stored = JSON.parse(localStorage.getItem(`page_${page.id}`) || '{}');
        const initialData = {};
        page.fields.forEach(f => {
            initialData[f.key] = stored[f.key] ?? f.default;
        });
        setFormData(initialData);
        setSelected(page.id);
    };

    const handleSave = () => {
        localStorage.setItem(`page_${selected}`, JSON.stringify(formData));
        showToast('Page content saved successfully!');
        setSelected(null);
    };

    const handleReset = () => {
        const page = PAGES.find(p => p.id === selected);
        const initialData = {};
        page.fields.forEach(f => { initialData[f.key] = f.default; });
        setFormData(initialData);
        localStorage.removeItem(`page_${selected}`);
        showToast('Page reset to defaults.');
    };

    const selectedPage = PAGES.find(p => p.id === selected);

    return (
        <div className="space-y-6">

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl bg-green-600 text-white text-sm font-medium flex items-center gap-2">
                        <i className="fas fa-check-circle"></i> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Section header */}
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
                <h2 className="text-white text-xl font-bold">Web Pages Editor</h2>
                <p className="text-gray-500 text-sm mt-0.5">Select a page below to edit its content</p>
            </div>

            {/* Pages list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {PAGES.map((page, i) => {
                    const hasCustom = !!localStorage.getItem(`page_${page.id}`);
                    return (
                        <motion.div key={page.id}
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-green-500/40 transition-colors"
                        >
                            <div className={`h-2 bg-gradient-to-r ${page.color}`}></div>
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${page.color} flex items-center justify-center`}>
                                        <i className={`${page.icon} text-white text-base`}></i>
                                    </div>
                                    {hasCustom && (
                                        <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded-full font-medium">
                                            Edited
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-white font-semibold text-base mb-1">{page.label}</h3>
                                <p className="text-gray-500 text-xs mb-4">{page.description}</p>

                                <div className="flex gap-2">
                                    <button onClick={() => openEditor(page)}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                        <i className="fas fa-pen text-xs"></i> Edit Content
                                    </button>
                                    <Link to={page.route} target="_blank"
                                        className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-3 rounded-xl transition-colors flex items-center justify-center">
                                        <i className="fas fa-external-link-alt text-xs"></i>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Page Editor Modal ── */}
            <AnimatePresence>
                {selected && selectedPage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                        onClick={() => setSelected(null)}
                    >
                        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
                            className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal header */}
                            <div className={`h-1.5 bg-gradient-to-r ${selectedPage.color} rounded-t-2xl`}></div>
                            <div className="flex items-center justify-between p-6 border-b border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${selectedPage.color} flex items-center justify-center`}>
                                        <i className={`${selectedPage.icon} text-white text-sm`}></i>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">{selectedPage.label}</h3>
                                        <p className="text-gray-500 text-xs">{selectedPage.route}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Fields */}
                            <div className="p-6 space-y-5">
                                {selectedPage.fields.map(field => (
                                    <div key={field.key}>
                                        <label className="block text-gray-400 text-sm mb-1.5">{field.label}</label>
                                        {field.type === 'textarea' ? (
                                            <textarea rows={3} value={formData[field.key] || ''}
                                                onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 resize-none" />
                                        ) : (
                                            <input type="text" value={formData[field.key] || ''}
                                                onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500" />
                                        )}
                                    </div>
                                ))}

                                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                                    <p className="text-blue-400 text-xs flex items-start gap-2">
                                        <i className="fas fa-info-circle mt-0.5 flex-shrink-0"></i>
                                        Changes are saved to your browser. To apply them to the live website, the page components need to read from localStorage or this data needs to be integrated with a backend.
                                    </p>
                                </div>
                            </div>

                            {/* Footer actions */}
                            <div className="p-6 border-t border-gray-800 flex gap-3">
                                <button onClick={handleReset}
                                    className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                                    <i className="fas fa-undo text-xs"></i> Reset
                                </button>
                                <button onClick={() => setSelected(null)}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl text-sm font-medium transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleSave}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                    <i className="fas fa-save text-xs"></i> Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPages;
