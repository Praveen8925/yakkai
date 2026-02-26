import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import AdminPrograms from './AdminPrograms';
import AdminGallery from './AdminGallery';
import AdminPages from './AdminPages';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-th-large' },
    { id: 'programs', label: 'Programs', icon: 'fas fa-layer-group' },
    { id: 'gallery', label: 'Gallery', icon: 'fas fa-images' },
    { id: 'pages', label: 'Web Pages', icon: 'fas fa-file-alt' },
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // ── Dark / Light mode ──
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem('admin_theme');
        return stored ? stored === 'dark' : true; // default: dark
    });

    const toggleTheme = () => {
        setIsDark(prev => {
            const next = !prev;
            localStorage.setItem('admin_theme', next ? 'dark' : 'light');
            return next;
        });
    };

    // Theme token helpers
    const t = {
        // root
        root: isDark ? 'bg-gray-950' : 'bg-slate-100',
        // sidebar
        sidebar: isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
        sidebarTxt: isDark ? 'text-white' : 'text-gray-800',
        sidebarSub: isDark ? 'text-green-400' : 'text-green-600',
        navInact: isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
        collapse: isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800',
        userBorder: isDark ? 'border-gray-800' : 'border-gray-200',
        userTxt: isDark ? 'text-white' : 'text-gray-800',
        userSub: isDark ? 'text-gray-500' : 'text-gray-400',
        logoutBtn: isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500',
        // topbar
        topbar: isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
        topTitle: isDark ? 'text-white' : 'text-gray-800',
        topSub: isDark ? 'text-gray-500' : 'text-gray-400',
        viewBtn: isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900',
        // main
        main: isDark ? 'bg-gray-950' : 'bg-slate-100',
        // cards
        card: isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
        cardTitle: isDark ? 'text-white' : 'text-gray-800',
        cardTxt: isDark ? 'text-gray-400' : 'text-gray-500',
        cardStrong: isDark ? 'text-white' : 'text-gray-900',
        // toggle button
        toggleBg: isDark ? 'bg-gray-800 hover:bg-gray-700 text-yellow-300' : 'bg-gray-100 hover:bg-gray-200 text-indigo-600',
    };

    useEffect(() => {
        if (!user || user.role !== 'admin') navigate('/admin/login');
    }, [user, navigate]);

    const handleLogout = () => { logout(); navigate('/admin/login'); };

    const programs = JSON.parse(localStorage.getItem('admin_programs') || '[]');
    const gallery = JSON.parse(localStorage.getItem('admin_gallery') || '[]');

    const stats = [
        { label: 'Total Programs', value: programs.length || 8, icon: 'fas fa-layer-group', color: 'from-green-400 to-green-600' },
        { label: 'Gallery Images', value: gallery.length || 0, icon: 'fas fa-images', color: 'from-blue-400 to-blue-600' },
        { label: 'Active Pages', value: 6, icon: 'fas fa-file-alt', color: 'from-purple-400 to-purple-600' },
        { label: 'Website Status', value: 'Live', icon: 'fas fa-globe', color: 'from-orange-400 to-orange-600' },
    ];

    return (
        <div className={`min-h-screen flex font-sans transition-colors duration-300 ${t.root}`}>

            {/* ── Sidebar ── */}
            <motion.aside
                animate={{ width: sidebarOpen ? 260 : 72 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`relative flex-shrink-0 border-r flex flex-col overflow-hidden transition-colors duration-300 ${t.sidebar}`}
            >
                {/* Logo */}
                <div className={`flex items-center gap-3 px-4 py-5 border-b ${t.userBorder}`}>
                    <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-leaf text-white text-lg"></i>
                    </div>
                    {sidebarOpen && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className={`font-bold text-lg leading-tight whitespace-nowrap ${t.sidebarTxt}`}>
                            Yakkai Neri<br />
                            <span className={`text-xs font-normal ${t.sidebarSub}`}>Admin Panel</span>
                        </motion.span>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 space-y-1 px-2">
                    {NAV_ITEMS.map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)}
                            title={!sidebarOpen ? item.label : ''}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative
                                ${activeTab === item.id
                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                    : t.navInact}`}>
                            <i className={`${item.icon} text-base w-5 text-center flex-shrink-0`}></i>
                            {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                            {activeTab === item.id && (
                                <motion.div layoutId="activeTab"
                                    className="absolute inset-0 bg-green-500 rounded-xl -z-10" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Collapse toggle */}
                <button onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`m-3 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-colors text-sm ${t.collapse}`}>
                    <i className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'} text-xs`}></i>
                    {sidebarOpen && <span className="whitespace-nowrap">Collapse</span>}
                </button>

                {/* User card */}
                <div className={`border-t p-3 flex items-center gap-3 ${t.userBorder} ${!sidebarOpen ? 'justify-center' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">A</span>
                    </div>
                    {sidebarOpen && (
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${t.userTxt}`}>{user?.name || 'Admin'}</p>
                            <p className={`text-xs truncate ${t.userSub}`}>{user?.email}</p>
                        </div>
                    )}
                    {sidebarOpen && (
                        <button onClick={handleLogout} title="Logout"
                            className={`transition-colors p-1 ${t.logoutBtn}`}>
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    )}
                </div>
            </motion.aside>

            {/* ── Main content ── */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Topbar */}
                <header className={`border-b px-6 py-4 flex items-center justify-between transition-colors duration-300 ${t.topbar}`}>
                    <div>
                        <h1 className={`font-semibold text-xl capitalize ${t.topTitle}`}>
                            {NAV_ITEMS.find(n => n.id === activeTab)?.label || 'Dashboard'}
                        </h1>
                        <p className={`text-sm ${t.topSub}`}>Manage your yoga academy website</p>
                    </div>
                    <div className="flex items-center gap-3">

                        {/* ── Dark / Light toggle ── */}
                        <motion.button
                            onClick={toggleTheme}
                            whileTap={{ scale: 0.92 }}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${t.toggleBg}`}
                        >
                            <AnimatePresence mode="wait">
                                {isDark ? (
                                    <motion.span key="sun"
                                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex items-center gap-2">
                                        <i className="fas fa-sun text-yellow-300 text-base"></i>
                                        <span className="hidden sm:inline text-yellow-300">Light Mode</span>
                                    </motion.span>
                                ) : (
                                    <motion.span key="moon"
                                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex items-center gap-2">
                                        <i className="fas fa-moon text-indigo-600 text-base"></i>
                                        <span className="hidden sm:inline text-indigo-600">Dark Mode</span>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        <a href="/" target="_blank" rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${t.viewBtn}`}>
                            <i className="fas fa-external-link-alt text-xs"></i>
                            View Site
                        </a>
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            <i className="fas fa-sign-out-alt text-xs"></i>
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className={`flex-1 overflow-y-auto p-6 transition-colors duration-300 ${t.main}`}>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.25 }}>

                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    {/* Stats */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                        {stats.map((s, i) => (
                                            <motion.div key={i}
                                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.08 }}
                                                className={`rounded-2xl p-5 border transition-colors duration-300 ${t.card}`}>
                                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4`}>
                                                    <i className={`${s.icon} text-white text-base`}></i>
                                                </div>
                                                <p className={`text-3xl font-bold ${t.cardTitle}`}>{s.value}</p>
                                                <p className={`text-sm mt-1 ${t.cardTxt}`}>{s.label}</p>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Theme preview strip */}
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 }}
                                        className={`rounded-2xl p-5 border flex items-center justify-between transition-colors duration-300 ${t.card}`}>
                                        <div>
                                            <p className={`font-semibold ${t.cardTitle}`}>
                                                {isDark ? '🌙 Dark Mode Active' : '☀️ Light Mode Active'}
                                            </p>
                                            <p className={`text-sm mt-0.5 ${t.cardTxt}`}>
                                                Toggle between dark and light themes using the button in the top bar.
                                            </p>
                                        </div>
                                        <button onClick={toggleTheme}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${t.toggleBg}`}>
                                            {isDark ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
                                        </button>
                                    </motion.div>

                                    {/* Quick actions */}
                                    <div className={`rounded-2xl p-6 border transition-colors duration-300 ${t.card}`}>
                                        <h2 className={`font-semibold text-lg mb-5 ${t.cardTitle}`}>Quick Actions</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {[
                                                { label: 'Manage Programs', icon: 'fas fa-layer-group', tab: 'programs', color: 'bg-green-500 hover:bg-green-600' },
                                                { label: 'Manage Gallery', icon: 'fas fa-images', tab: 'gallery', color: 'bg-blue-500 hover:bg-blue-600' },
                                                { label: 'Edit Web Pages', icon: 'fas fa-file-alt', tab: 'pages', color: 'bg-purple-500 hover:bg-purple-600' },
                                            ].map(a => (
                                                <button key={a.tab} onClick={() => setActiveTab(a.tab)}
                                                    className={`${a.color} text-white rounded-xl p-4 flex items-center gap-3 transition-colors`}>
                                                    <i className={`${a.icon} text-lg`}></i>
                                                    <span className="font-medium">{a.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className={`rounded-2xl p-6 border transition-colors duration-300 ${t.card}`}>
                                        <h2 className={`font-semibold text-lg mb-3 ${t.cardTitle}`}>About This Dashboard</h2>
                                        <p className={`text-sm leading-relaxed ${t.cardTxt}`}>
                                            Use the sidebar to navigate between sections. You can{' '}
                                            <strong className={t.cardStrong}>add, edit, and delete</strong> programs
                                            and gallery images. Changes are saved locally in your browser and reflected on the main website.
                                            Use <strong className={t.cardStrong}>Web Pages</strong> to edit the content of individual public pages.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'programs' && <AdminPrograms isDark={isDark} />}
                            {activeTab === 'gallery' && <AdminGallery isDark={isDark} />}
                            {activeTab === 'pages' && <AdminPages isDark={isDark} />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
