import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/axios';

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

const CorporateYoga = () => {

    const [enquiry, setEnquiry] = useState({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        employee_count: '',
        program_type: 'demo',
        preferred_schedule: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setEnquiry({ ...enquiry, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormStatus({ type: '', message: '' });
        try {
            await api.post('/corporate', enquiry);
            setFormStatus({
                type: 'success',
                message: 'Your enquiry has been received! We will contact you within 24 hours.'
            });
            setEnquiry({
                company_name: '', contact_name: '', email: '', phone: '',
                employee_count: '', program_type: 'demo', preferred_schedule: '', message: ''
            });
        } catch (error) {
            setFormStatus({
                type: 'error',
                message: error.response?.data?.error || 'Failed to submit enquiry. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="relative h-[60vh] flex items-center justify-center text-center text-white"
                style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #052e16 100%)' }}>
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
                            <Link to="/assessment/individual"
                                className="bg-white border-2 border-green-500 text-green-500 hover:bg-green-50 px-8 py-3 rounded-md font-medium transition">
                                I'm an Individual
                            </Link>
                            <Link to="/assessment/hr-login"
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-md font-medium transition">
                                I'm an HR / Team Lead
                            </Link>
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

                {/* ── Session Highlights ── */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">From Our Sessions</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Real results from our corporate, faculty, and institutional yoga programs.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Rooftop Corporate Session', 'Indoor Group Training', 'Institution Wellness', 'Faculty & Staff Training'].map((label, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 text-center shadow-sm">
                                <i className="fas fa-users text-green-500 text-2xl mb-3"></i>
                                <p className="text-gray-700 font-semibold text-sm">{label}</p>
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
                            <div className="rounded-xl shadow-lg w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center h-48">
                                <div className="text-center text-white p-6">
                                    <i className="fas fa-newspaper text-4xl text-blue-300 mb-3"></i>
                                    <p className="font-bold text-lg">The Hindu</p>
                                    <p className="text-gray-400 text-sm">12 December 2023</p>
                                </div>
                            </div>
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

                {/* ── Corporate Enquiry Form ── */}
                <section id="corporate-onboarding" className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 bg-green-600 text-white text-center">
                        <h2 className="text-3xl font-bold mb-2">Book Your Corporate Yoga Programme</h2>
                        <p className="text-green-100 text-lg">Fill in the details below and we'll get back to you within 24 hours.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
                        {formStatus.message && (
                            <div className={`rounded-lg px-5 py-4 text-sm font-medium ${
                                formStatus.type === 'success'
                                    ? 'bg-green-50 border border-green-300 text-green-800'
                                    : 'bg-red-50 border border-red-300 text-red-800'
                            }`}>
                                {formStatus.message}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company / Organisation Name <span className="text-red-500">*</span></label>
                                <input type="text" name="company_name" value={enquiry.company_name} onChange={handleChange} required
                                    placeholder="e.g. Infosys, Anna University"
                                    autoComplete="organization"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name <span className="text-red-500">*</span></label>
                                <input type="text" name="contact_name" value={enquiry.contact_name} onChange={handleChange} required
                                    placeholder="HR Manager / Point of Contact"
                                    autoComplete="name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                <input type="email" name="email" value={enquiry.email} onChange={handleChange} required
                                    placeholder="you@company.com"
                                    autoComplete="email"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                <input type="tel" name="phone" value={enquiry.phone} onChange={handleChange} required
                                    placeholder="+91 9XXXXXXXXX"
                                    autoComplete="tel"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
                                <select name="employee_count" value={enquiry.employee_count} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800">
                                    <option value="">Select range</option>
                                    <option value="1-25">1 – 25</option>
                                    <option value="26-50">26 – 50</option>
                                    <option value="51-100">51 – 100</option>
                                    <option value="101-250">101 – 250</option>
                                    <option value="250+">250+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Programme Type <span className="text-red-500">*</span></label>
                                <select name="program_type" value={enquiry.program_type} onChange={handleChange} required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800">
                                    <option value="demo">1-Hour Onsite Demo</option>
                                    <option value="week_trial">1-Week Trial Programme</option>
                                    <option value="month_program">1-Month Corporate Programme</option>
                                    <option value="custom">Custom / Discuss with Trainer</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Schedule</label>
                                <select name="preferred_schedule" value={enquiry.preferred_schedule} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800">
                                    <option value="">Select preference</option>
                                    <option value="weekday_morning">Weekday – Morning (7 am – 9 am)</option>
                                    <option value="weekday_lunch">Weekday – Lunch Break (12 pm – 2 pm)</option>
                                    <option value="weekday_evening">Weekday – Evening (5 pm – 7 pm)</option>
                                    <option value="weekend">Weekend</option>
                                    <option value="flexible">Flexible / Open to Discussion</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                                <textarea name="message" value={enquiry.message} onChange={handleChange} rows={4}
                                    placeholder="Any specific requirements, health considerations for the team, or questions..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 resize-none" />
                            </div>
                        </div>

                        <div className="text-center pt-2">
                            <button type="submit" disabled={isSubmitting}
                                className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-12 py-4 rounded-md text-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:shadow-none">
                                {isSubmitting ? 'Submitting…' : 'Send Enquiry'}
                            </button>
                        </div>
                    </form>
                </section>
            </div>

        </div>
    );
};

export default CorporateYoga;
