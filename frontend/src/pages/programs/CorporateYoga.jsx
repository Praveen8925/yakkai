import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const stats = [
    { value: '82%', label: 'Reported Better Focus' },
    { value: '76%', label: 'Lower Stress Levels' },
    { value: '1500+', label: 'Employees Reached' },
    { value: '25+', label: 'Corporate Clients' },
];

const weekPlan = [
    { day: 'Day 1', focus: 'Body Awakening & Spine Activation', flow: 'Centering breath, Sukshma Vyayama', pose: 'Tadasana' },
    { day: 'Day 2', focus: 'Posture Correction & Shoulder Release', flow: 'Hasta Uttanasana, Bhramari Pranayama', pose: 'Vrikshasana' },
    { day: 'Day 3', focus: 'Spine & Hip Mobility', flow: 'Hip stretches, Butterfly, Body Scan', pose: 'Setu Bandhasana' },
    { day: 'Day 4', focus: 'Tech Tension Release', flow: 'Bhujangasana, Shalabhasana, Twists', pose: 'Bhujangasana' },
    { day: 'Day 5', focus: 'Hamstring & Back Stretching', flow: 'Forward bends, Prone twists', pose: 'Janu Sirsasana' },
    { day: 'Day 6', focus: 'Balance & Confidence Building', flow: 'Tree prep, Leg drills', pose: 'Veerabadrasana' },
    { day: 'Day 7', focus: 'Integration & Posture Achievement', flow: 'Flow review, Achieve-your-posture', pose: 'Final Showcase' },
];

const monthPlan = [
    { week: 'Week 1', focus: 'Emotional Upliftment & Stress Relief', practice: 'Sukshma Vyayama, Bhramari, Tadasana', result: 'Less anxiety, better sleep' },
    { week: 'Week 2', focus: 'Digestive Health & Core Strength', practice: 'Bhastrika, Kapalabhati, Twists', result: 'Improved digestion, core strength' },
    { week: 'Week 3', focus: 'Circadian Rhythm Alignment', practice: 'Surya Namaskar, Chandra Bhedana', result: 'Balanced sleep cycle' },
    { week: 'Week 4', focus: 'Holistic Well-being', practice: 'Sitali Pranayama, Asana flow', result: 'Focus, resilience' },
];

const galleryPhotos = [
    { src: '/images/one.jpg', caption: 'Rooftop Corporate Yoga Session', tag: 'Session' },
    { src: '/images/Adults Training.jpg', caption: 'Indoor Group Training', tag: 'Training' },
    { src: '/images/KCT.jpg', caption: 'Institution-Wide Wellness Program', tag: 'Institution' },
    { src: '/images/Facultytraining.jpg', caption: 'Faculty & Staff Training', tag: 'Faculty' },
];

const CorporateYoga = () => {
    const [lightbox, setLightbox] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="relative h-[60vh] flex items-center justify-center text-center text-white bg-cover bg-center"
                style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(/images/one.jpg)' }}>
                <div className="max-w-4xl px-4">
                    <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-6xl font-bold mb-4 text-green-400">
                        CORPORATE WELLNESS
                    </motion.h1>
                    <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                        className="text-2xl md:text-3xl font-light mb-6">
                        BLISSFULNESS
                    </motion.h2>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}
                        className="flex justify-center space-x-4 text-xl font-light tracking-wide mb-8">
                        <span>Breathe</span><span>•</span><span>Bend</span><span>•</span><span>Balance</span>
                    </motion.div>
                    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                        <a href="#corporate-onboarding"
                            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-medium transition duration-300">
                            Join Our Journey
                        </a>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 space-y-14">

                {/* Wellness score card */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Check Your Wellness Score</h2>
                        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                            Take our short assessment to evaluate stress levels, posture, and flexibility. Understand where you stand in your wellness journey!
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/contact"
                                className="bg-white border-2 border-green-500 text-green-500 hover:bg-green-50 px-8 py-3 rounded-md font-medium transition">
                                I'm an Individual
                            </Link>
                            <a href="#corporate-onboarding"
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-md font-medium transition">
                                I'm an HR / Team Lead
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Demo session */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-l-8 border-green-500">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">1 Hour — Onsite Demo</h2>
                    <p className="text-gray-600 text-lg">
                        A power-packed onsite demo session to introduce your team to posture correction, de-stressing and breath awareness.
                    </p>
                </motion.div>

                {/* 1-week table */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 bg-gray-50 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">1 Week Trial: De-Stress & Stretch</h2>
                        <p className="text-gray-600">A focused 7-day trial to experience posture improvement, stress relief, and full-body vitality.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-green-500 text-white">
                                    {['Day', 'Focus', 'Practice Flow', 'Posture of the Day'].map(h => (
                                        <th key={h} className="p-4 font-semibold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {weekPlan.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900 border-r border-gray-100">{row.day}</td>
                                        <td className="p-4 text-gray-700">{row.focus}</td>
                                        <td className="p-4 text-gray-700">{row.flow}</td>
                                        <td className="p-4 text-green-600 font-medium">{row.pose}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Monthly table */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 bg-gray-50 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">1 Month Corporate Yoga Program</h2>
                        <p className="text-gray-600">A comprehensive 4-week wellness journey crafted for IT professionals.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-green-500 text-white">
                                    {['Week', 'Focus Area', 'Practices & Techniques', 'Expected Results'].map(h => (
                                        <th key={h} className="p-4 font-semibold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {monthPlan.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900 border-r border-gray-100">{row.week}</td>
                                        <td className="p-4 text-gray-700">{row.focus}</td>
                                        <td className="p-4 text-gray-700">{row.practice}</td>
                                        <td className="p-4 text-green-600 font-medium">{row.result}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* ── Photo Gallery ── */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">From Our Sessions</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Real photos from our corporate, faculty, and institutional yoga programs.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryPhotos.map((photo, i) => (
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
                                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{photo.tag}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── Media Coverage ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                        <i className="fas fa-newspaper text-green-500 text-2xl"></i>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">As Seen In The Media</h2>
                            <p className="text-gray-500 text-sm mt-0.5">Our work recognized by leading publications</p>
                        </div>
                    </div>
                    <div className="md:flex items-center gap-8 p-8">
                        <div className="md:w-1/2 mb-6 md:mb-0">
                            <img src="/images/Inthemedia.jpg" alt="The Hindu Coverage — Yakkai Neri"
                                className="rounded-xl shadow-lg w-full object-cover cursor-pointer hover:opacity-90 transition"
                                onClick={() => setLightbox({ src: '/images/Inthemedia.jpg', caption: 'The Hindu, 12 December 2023 — South West Zone Inter-University Yoga Competition' })} />
                        </div>
                        <div className="md:w-1/2 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <i className="fas fa-newspaper text-blue-500"></i>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">The Hindu</p>
                                    <p className="text-gray-500 text-sm">12 December 2023</p>
                                </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                Yakkai Neri's training produced the <strong>South West Zone Inter-University Yoga Competition</strong> women's
                                section winners at Anna University, Chennai — covered by India's leading English daily, The Hindu.
                            </p>
                            <div className="flex gap-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-center">
                                    <p className="text-green-700 font-bold text-lg">National</p>
                                    <p className="text-green-600 text-xs">Level Coverage</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-center">
                                    <p className="text-blue-700 font-bold text-lg">Anna Univ.</p>
                                    <p className="text-blue-600 text-xs">Competition Win</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Impact stats */}
                <section className="bg-green-600 rounded-2xl py-14 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
                    <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
                        Yakkai Neri's workplace wellness programs have transformed stress management, focus, and flexibility for thousands.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto px-4">
                        {stats.map((s, i) => (
                            <div key={i} className="p-5 bg-white/10 rounded-xl backdrop-blur-sm">
                                <div className="text-4xl font-bold mb-2">{s.value}</div>
                                <div className="text-sm uppercase tracking-wide opacity-80">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section id="corporate-onboarding" className="bg-white rounded-2xl p-12 text-center shadow-xl">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to transform your workplace?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Contact us to schedule your demo session or discuss a customized wellness plan for your team.
                    </p>
                    <Link to="/contact"
                        className="inline-block bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-md text-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Get in Touch
                    </Link>
                </section>
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

export default CorporateYoga;
