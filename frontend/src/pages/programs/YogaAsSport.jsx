import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const photos = [
    { src: '/images/Champion-award.jpg', caption: 'All India Inter-University Yoga Championship 2019–20', tag: 'Championship' },
    { src: '/images/three.jpg', caption: 'State-Level Women\'s Team — Runner-Up Trophy', tag: 'Competition' },
    { src: '/images/victory.jpg', caption: 'International Yoga Festival 2023 — Award Ceremony', tag: 'Awards' },
    { src: '/images/two.jpg', caption: 'Young Champions with International Jury', tag: 'Kids Team' },
];

const YogaAsSport = () => {
    const [lightbox, setLightbox] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Hero */}
            <div className="relative h-[55vh] flex items-center justify-center text-center text-white overflow-hidden"
                style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(/images/Champion-award.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="max-w-4xl px-4">
                    <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-6xl font-bold mb-4 text-green-400 drop-shadow-lg">
                        Yoga as a Sport
                    </motion.h1>
                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                        className="text-lg md:text-2xl font-light opacity-90 max-w-2xl mx-auto">
                        Discipline · Precision · Championship Excellence
                    </motion.p>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                        className="mt-8 flex flex-wrap justify-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-5 py-2 text-sm font-medium">🏆 National Level Coaches</div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-5 py-2 text-sm font-medium">🥇 Championship Trained</div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-5 py-2 text-sm font-medium">👦 Kids & Adults</div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

                {/* About section */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/2">
                            <img src="/images/three.jpg" alt="Yoga as Sport"
                                className="h-full w-full object-cover min-h-[280px]" />
                        </div>
                        <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Who We Are</h2>
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                Yoga is not just a practice — at Yakkai Neri, it is a <strong>competitive sport</strong>.
                                Our students compete at state, national, and All India Inter-University levels,
                                winning trophies and recognition that reflect years of dedicated training.
                            </p>
                            <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-r-xl">
                                <h3 className="text-lg font-bold text-green-800 mb-1">The Yakkai Neri Edge</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    We blend traditional yogic values with modern sports science — structured training,
                                    performance tracking, choreography, and mental conditioning that sets our students apart.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Training cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        {
                            title: 'Competition Training',
                            icon: 'fas fa-trophy',
                            color: 'border-yellow-500',
                            items: ['Advanced asana refinement', 'Flexibility & strength conditioning', 'Mental resilience under pressure', 'Choreography & flow aesthetics']
                        },
                        {
                            title: 'Performance Psychology',
                            icon: 'fas fa-brain',
                            color: 'border-green-500',
                            items: ['Focus and concentration drills', 'Stress management techniques', 'Visualization for success', 'Breath control under pressure']
                        }
                    ].map((card, i) => (
                        <motion.div key={i} whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className={`bg-white p-8 rounded-2xl shadow-lg border-t-4 ${card.color}`}>
                            <div className="flex items-center gap-3 mb-5">
                                <i className={`${card.icon} text-2xl text-green-500`}></i>
                                <h3 className="text-xl font-bold text-gray-800">{card.title}</h3>
                            </div>
                            <ul className="space-y-3">
                                {card.items.map((item, j) => (
                                    <li key={j} className="flex items-center gap-2 text-gray-600">
                                        <span className="text-green-500 font-bold">✓</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* ── Photo Gallery ── */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">Our Champions</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Real moments from our academy — competitions, championships, and victories that define Yakkai Neri.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photos.map((photo, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.03 }}
                                className="relative cursor-pointer rounded-xl overflow-hidden shadow-md group"
                                onClick={() => setLightbox(photo)}>
                                <img src={photo.src} alt={photo.caption}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-400" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                    <p className="text-white text-xs font-medium">{photo.caption}</p>
                                </div>
                                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">{photo.tag}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-green-600 rounded-2xl p-10 text-white text-center">
                    <h2 className="text-2xl font-bold mb-8">Our Track Record</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: '5+', label: 'National Championships' },
                            { value: '50+', label: 'Competition Winners' },
                            { value: '10+', label: 'Years of Excellence' },
                            { value: 'Kids & Adults', label: 'Training Available' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                                <div className="text-3xl font-bold mb-1">{s.value}</div>
                                <div className="text-sm opacity-80">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link to="/contact" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
                        Start Your Training Journey
                    </Link>
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setLightbox(null)}>
                        <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
                            className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
                            <img src={lightbox.src} alt={lightbox.caption}
                                className="w-full rounded-2xl object-contain max-h-[80vh]" />
                            <p className="text-white text-center mt-4 text-sm opacity-80">{lightbox.caption}</p>
                        </motion.div>
                        <button onClick={() => setLightbox(null)}
                            className="absolute top-4 right-4 text-white/60 hover:text-white text-3xl">
                            <i className="fas fa-times"></i>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default YogaAsSport;
