import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const healthConditions = [
    {
        id: 'menstrual',
        label: 'Menstrual Cycle',
        emoji: '🌸',
        color: 'border-pink-400 bg-pink-50',
        accent: 'text-pink-600',
        badge: 'bg-pink-100 text-pink-700',
        description: 'Yoga helps regulate cycle irregularities, ease cramps, and reduce mood swings through targeted pranayama and gentle asanas.',
        practices: ['Supta Baddha Konasana — opens the pelvic region', 'Viparita Karani — reduces cramps & bloating', 'Bhramari Pranayama — calms nervous system', 'Balasana — relieves lower back tension'],
        benefit: 'Cycle regulation within 3–6 months of consistent practice',
    },
    {
        id: 'pcod',
        label: 'PCOD / PCOS',
        emoji: '🌺',
        color: 'border-rose-400 bg-rose-50',
        accent: 'text-rose-600',
        badge: 'bg-rose-100 text-rose-700',
        description: 'A specifically curated PCOS yoga protocol to stimulate the endocrine system, regulate insulin resistance, and aid hormonal balance.',
        practices: ['Surya Namaskar — thyroid and ovarian stimulation', 'Dhanurasana — compresses reproductive organs', 'Shalabhasana — strengthens pelvic floor', 'Kapalbhati — detoxes and stimulates abdominal organs'],
        benefit: 'Improved insulin sensitivity & menstrual regularity',
    },
    {
        id: 'premenopause',
        label: 'Pre-Menopause',
        emoji: '🌷',
        color: 'border-purple-400 bg-purple-50',
        accent: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-700',
        description: 'As the body transitions, our program addresses mood fluctuations, irregular cycles, and early bone density concerns with restorative yoga.',
        practices: ['Virabhadrasana — strengthens bones and legs', 'Setu Bandhasana — supports adrenal function', 'Nadi Shodhana — balances hormonal surges', 'Yoga Nidra — deep relaxation for mood stability'],
        benefit: 'Symptom relief and smoother hormonal transition',
    },
    {
        id: 'menopause',
        label: 'Post-Menopause',
        emoji: '🪷',
        color: 'border-violet-400 bg-violet-50',
        accent: 'text-violet-600',
        badge: 'bg-violet-100 text-violet-700',
        description: 'Post-menopausal yoga focuses on protecting bone health, improving cardiovascular function, and maintaining vitality and energy.',
        practices: ['Tadasana & Vrkshasana — weight-bearing for bone health', 'Bhujangasana — spinal flexibility', 'Sitali Pranayama — cools hot flashes', 'Anulom Vilom — cardiovascular balance'],
        benefit: 'Better bone density, energy, and quality of life',
    },
];

const WomenWellness = () => {
    const [active, setActive] = useState('menstrual');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const selected = healthConditions.find(c => c.id === active);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you! Our team will contact you shortly with a personalised plan.');
    };

    return (
        <div className="min-h-screen bg-pink-50">

            {/* Hero */}
            <div className="relative h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                    style={{ background: 'linear-gradient(135deg, #831843 0%, #9d174d 50%, #500724 100%)' }} />
                <div className="relative z-10 max-w-4xl px-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-1.5 text-sm mb-6">
                        <span>🌸</span><span>Women's Wellness Program</span>
                    </motion.div>
                    <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Yoga for Every Stage<br />
                        <span className="text-pink-300">of a Woman's Life</span>
                    </motion.h1>
                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
                        From menstrual health to menopause — Yakkai Neri offers targeted yoga protocols
                        for PCOD, PCOS, pre & post-menopause, and holistic women's wellness.
                    </motion.p>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="mt-8">
                        <a href="#conditions"
                            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full text-lg font-medium transition duration-300 inline-block">
                            Explore Your Program
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Feature pills */}
            <div className="bg-white border-b border-pink-100 py-5">
                <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-4">
                    {[
                        { icon: '🌸', text: 'Hormonal Balance' },
                        { icon: '💪', text: 'Core & Pelvic Health' },
                        { icon: '🧘‍♀️', text: 'Stress Management' },
                        { icon: '✨', text: 'Cycle Regulation' },
                        { icon: '🩺', text: 'PCOS / PCOD Support' },
                        { icon: '🌙', text: 'Menopause Care' },
                    ].map((f, i) => (
                        <div key={i} className="flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-full px-4 py-1.5 text-sm text-pink-700">
                            <span>{f.icon}</span><span>{f.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Specific Conditions Tabs ── */}
            <div id="conditions" className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Condition-Specific Yoga Programs</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Our programs are not generic. Select your condition and discover the specific asanas, pranayamas, and benefits tailored for you.
                    </p>
                </div>

                {/* Tab buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {healthConditions.map(c => (
                        <button key={c.id} onClick={() => setActive(c.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200
                                ${active === c.id
                                    ? 'bg-pink-500 border-pink-500 text-white shadow-md scale-105'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-600'
                                }`}>
                            <span>{c.emoji}</span>{c.label}
                        </button>
                    ))}
                </div>

                {/* Active condition panel */}
                <AnimatePresence mode="wait">
                    <motion.div key={active}
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className={`bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 ${selected.color.split(' ')[0]}`}>
                        <div className="md:flex">
                            <div className="md:w-2/3 p-8 md:p-10">
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="text-4xl">{selected.emoji}</span>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800">{selected.label}</h3>
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${selected.badge}`}>
                                            Specialised Program
                                        </span>
                                    </div>
                                </div>
                                <p className={`text-gray-600 leading-relaxed mb-6 text-base`}>
                                    {selected.description}
                                </p>
                                <h4 className={`font-bold text-sm uppercase tracking-wider mb-3 ${selected.accent}`}>
                                    Recommended Practices
                                </h4>
                                <ul className="space-y-2">
                                    {selected.practices.map((p, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                            <span className={`mt-0.5 ${selected.accent} font-bold text-base`}>✦</span>
                                            <span>{p}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className={`md:w-1/3 flex flex-col items-center justify-center p-8 ${selected.color.split(' ')[1]}`}>
                                <div className="text-6xl mb-4">{selected.emoji}</div>
                                <div className={`text-xs font-semibold uppercase tracking-widest mb-2 ${selected.accent}`}>
                                    Expected Outcome
                                </div>
                                <p className="text-gray-700 text-center text-sm leading-relaxed font-medium">
                                    {selected.benefit}
                                </p>
                                <Link to="/contact"
                                    className="mt-6 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition">
                                    Book This Program
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* General feature cards */}
            <div className="max-w-6xl mx-auto px-4 pb-16">
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { icon: '🌸', title: 'Hormonal Balance', desc: 'Specific asanas to regulate endocrine function and mood.', color: 'border-pink-400' },
                        { icon: '💪', title: 'Core & Pelvic Health', desc: 'Strengthening exercises to support posture and vitality.', color: 'border-rose-400' },
                        { icon: '🧘‍♀️', title: 'Stress Management', desc: 'Mindfulness techniques for emotional resilience.', color: 'border-purple-400' },
                    ].map((f, i) => (
                        <motion.div key={i} whileHover={{ y: -5 }} initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                            className={`bg-white p-6 rounded-xl shadow-md text-center border-t-4 ${f.color}`}>
                            <div className="text-4xl mb-4">{f.icon}</div>
                            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                            <p className="text-sm text-gray-600">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Gallery strip */}
            <div className="bg-white py-12">
                <div className="max-w-6xl mx-auto px-4 text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Community Sessions</h2>
                    <p className="text-gray-500">Hundreds of women transforming their health together at Yakkai Neri.</p>
                </div>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center h-72 md:h-96">
                        <div className="text-center text-white p-10">
                            <i className="fas fa-female text-6xl text-pink-100 mb-4"></i>
                            <p className="text-2xl font-bold">Institution-Wide Women&apos;s Yoga</p>
                            <p className="text-pink-200 text-sm mt-2">Mass sessions conducted by Yakkai Neri</p>
                        </div>
                    </div>
                    <p className="text-center text-gray-400 text-sm mt-3 italic">Institution-wide women's yoga session conducted by Yakkai Neri</p>
                </div>
            </div>

            {/* Assessment form */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-pink-500 p-6 text-white text-center">
                        <h2 className="text-2xl font-bold">Personalised Wellness Assessment</h2>
                        <p className="opacity-90 text-sm mt-1">Tell us about yourself — we'll match you with the right program</p>
                    </div>
                    <div className="p-8">
                        {/* Progress */}
                        <div className="flex justify-between mb-8 relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                                    ${step >= s ? 'bg-pink-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
                                    {s}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }} className="space-y-5">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Health Background</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Which best describes your current health focus?</label>
                                            <select name="condition" onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 focus:ring-pink-500 focus:border-pink-500">
                                                <option value="">Select...</option>
                                                <option>Menstrual irregularity / cramps</option>
                                                <option>PCOS / PCOD management</option>
                                                <option>Pre-menopause symptoms</option>
                                                <option>Post-menopause wellness</option>
                                                <option>General women's wellness</option>
                                                <option>Prenatal / Postnatal care</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Average sleep per night?</label>
                                            <select name="sleep" onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 focus:ring-pink-500 focus:border-pink-500">
                                                <option value="">Select...</option>
                                                <option>Less than 4 hours</option>
                                                <option>4–6 hours</option>
                                                <option>6–8 hours</option>
                                                <option>More than 8 hours</option>
                                            </select>
                                        </div>
                                        <div className="flex justify-end">
                                            <button type="button" onClick={() => setStep(2)}
                                                className="bg-pink-500 text-white px-6 py-2.5 rounded-md hover:bg-pink-600 transition font-medium">
                                                Next →
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                                {step === 2 && (
                                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }} className="space-y-5">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Lifestyle & Energy</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Afternoon energy levels?</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Low', 'Moderate', 'High', 'Fatigued'].map(opt => (
                                                    <label key={opt} className="flex items-center gap-2 border p-3 rounded-md cursor-pointer hover:bg-pink-50 transition">
                                                        <input type="radio" name="energy" value={opt} onChange={handleChange} className="accent-pink-500" />
                                                        <span className="text-sm">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Current stress level?</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Low', 'Moderate', 'High', 'Very High'].map(opt => (
                                                    <label key={opt} className="flex items-center gap-2 border p-3 rounded-md cursor-pointer hover:bg-pink-50 transition">
                                                        <input type="radio" name="stress" value={opt} onChange={handleChange} className="accent-pink-500" />
                                                        <span className="text-sm">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700 px-4 py-2">← Back</button>
                                            <button type="button" onClick={() => setStep(3)}
                                                className="bg-pink-500 text-white px-6 py-2.5 rounded-md hover:bg-pink-600 transition font-medium">
                                                Next →
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                                {step === 3 && (
                                    <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Details</h3>
                                        <input type="text" name="name" placeholder="Full Name" required onChange={handleChange}
                                            autoComplete="name"
                                            className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 focus:ring-pink-500 focus:border-pink-500" />
                                        <input type="email" name="email" placeholder="Email Address" required onChange={handleChange}
                                            autoComplete="email"
                                            className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 focus:ring-pink-500 focus:border-pink-500" />
                                        <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleChange}
                                            autoComplete="tel"
                                            className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 focus:ring-pink-500 focus:border-pink-500" />
                                        <div className="flex justify-between items-center mt-4">
                                            <button type="button" onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-700 px-4 py-2">← Back</button>
                                            <button type="submit"
                                                className="bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600 transition shadow-lg font-bold">
                                                Submit Assessment ✓
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WomenWellness;
