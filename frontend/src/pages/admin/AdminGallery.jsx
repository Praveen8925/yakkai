import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_GALLERY = [
    { id: 1, url: '/images/adults training.jpg', caption: 'Adults Training Session', category: 'training' },
    { id: 2, url: '/images/Facultytraining.jpg', caption: 'Faculty Training Program', category: 'training' },
    { id: 3, url: '/images/Champion-award.jpg', caption: 'Champion Award Ceremony', category: 'awards' },
    { id: 4, url: '/images/award.jpg', caption: 'Achievement Award', category: 'awards' },
    { id: 5, url: '/images/recognition.jpg', caption: 'Government Recognition', category: 'awards' },
    { id: 6, url: '/images/Inthemedia.jpg', caption: 'In The Media', category: 'media' },
    { id: 7, url: '/images/KCT.jpg', caption: 'KCT Collaboration', category: 'events' },
    { id: 8, url: '/images/Kriya.jpg', caption: 'Kriya Yoga Practice', category: 'training' },
    { id: 9, url: '/images/victory.jpg', caption: 'Victory Celebration', category: 'awards' },
];

const CATEGORIES = ['all', 'training', 'awards', 'media', 'events'];

const EMPTY_FORM = { url: '', caption: '', category: 'training' };

const AdminGallery = () => {
    const [images, setImages] = useState([]);
    const [filterCat, setFilterCat] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [lightbox, setLightbox] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('admin_gallery');
        setImages(stored ? JSON.parse(stored) : DEFAULT_GALLERY);
    }, []);

    const save = (list) => {
        setImages(list);
        localStorage.setItem('admin_gallery', JSON.stringify(list));
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

    const openEdit = (img) => {
        setEditing(img.id);
        setForm({ url: img.url, caption: img.caption, category: img.category });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.url.trim()) return;

        if (editing) {
            const updated = images.map(img => img.id === editing ? { ...img, ...form } : img);
            save(updated);
            showToast('Image updated!');
        } else {
            save([...images, { ...form, id: Date.now() }]);
            showToast('Image added to gallery!');
        }
        setShowModal(false);
    };

    const confirmDelete = () => {
        save(images.filter(img => img.id !== deleteTarget.id));
        setDeleteTarget(null);
        showToast('Image deleted.', 'error');
    };

    const filtered = filterCat === 'all' ? images : images.filter(img => img.category === filterCat);

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

            {/* Header */}
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h2 className="text-white text-xl font-bold">Gallery Manager</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{images.length} images total</p>
                </div>
                <button onClick={openAdd}
                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                    <i className="fas fa-plus text-xs"></i> Add Image
                </button>
            </div>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setFilterCat(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors
                            ${filterCat === cat ? 'bg-green-500 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Gallery grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map((img, i) => (
                    <motion.div key={img.id}
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group hover:border-green-500/50 transition-colors"
                    >
                        {/* Image */}
                        <div className="aspect-square relative overflow-hidden bg-gray-800 cursor-pointer"
                            onClick={() => setLightbox(img)}>
                            <img src={img.url} alt={img.caption}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={e => e.target.src = 'https://placehold.co/300x300/1f2937/6b7280?text=No+Image'} />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <i className="fas fa-expand text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity"></i>
                            </div>
                            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full capitalize">
                                {img.category}
                            </span>
                        </div>

                        {/* Caption + actions */}
                        <div className="p-3">
                            <p className="text-gray-400 text-xs mb-3 line-clamp-2 min-h-[32px]">{img.caption}</p>
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(img)}
                                    className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5">
                                    <i className="fas fa-pen text-xs"></i> Edit
                                </button>
                                <button onClick={() => setDeleteTarget(img)}
                                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5">
                                    <i className="fas fa-trash text-xs"></i> Del
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
                    <i className="fas fa-images text-gray-700 text-4xl mb-4"></i>
                    <p className="text-gray-400">No images in this category</p>
                </div>
            )}

            {/* ── Lightbox ── */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setLightbox(null)}
                    >
                        <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
                            className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
                            <img src={lightbox.url} alt={lightbox.caption}
                                className="w-full rounded-2xl object-contain max-h-[80vh]" />
                            <p className="text-white text-center mt-4 text-sm">{lightbox.caption}</p>
                            <button onClick={() => setLightbox(null)}
                                className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl">
                                <i className="fas fa-times"></i>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Add / Edit Modal ── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
                            className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-800">
                                <h3 className="text-white font-bold text-lg">{editing ? 'Edit Image' : 'Add New Image'}</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1.5">Image URL *</label>
                                    <input type="text" value={form.url} required
                                        onChange={e => setForm({ ...form, url: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                        placeholder="/images/photo.jpg or https://…" />
                                    {form.url && (
                                        <img src={form.url} alt="preview"
                                            className="mt-3 w-full h-40 object-cover rounded-xl"
                                            onError={e => e.target.style.display = 'none'} />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-1.5">Caption</label>
                                    <input type="text" value={form.caption}
                                        onChange={e => setForm({ ...form, caption: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500"
                                        placeholder="Describe this image…" />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-1.5">Category</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500">
                                        <option value="training">Training</option>
                                        <option value="awards">Awards</option>
                                        <option value="media">Media</option>
                                        <option value="events">Events</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl text-sm font-medium transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-medium transition-colors">
                                        {editing ? 'Save Changes' : 'Add Image'}
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
                        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
                            className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6 text-center shadow-2xl">
                            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-trash text-red-400 text-xl"></i>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Delete Image?</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                "<strong className="text-white">{deleteTarget.caption || 'this image'}</strong>" will be permanently removed.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteTarget(null)}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl text-sm font-medium">Cancel</button>
                                <button onClick={confirmDelete}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-medium">Delete</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminGallery;
