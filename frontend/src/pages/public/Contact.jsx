import { motion } from 'framer-motion';
import { useState } from 'react';
import api from '../../api/axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        interest: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await api.post('/contacts', formData);
            setStatus({
                type: 'success',
                message: 'Thank you! Your message has been submitted successfully.'
            });
            setFormData({ name: '', email: '', phone: '', interest: '', message: '' });
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.error || 'Failed to submit message. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-green-600 to-green-500 py-20"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Get In Touch
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-white"
                    >
                        Ready to begin your yoga journey? Contact us for more information
                    </motion.p>
                </div>
            </motion.section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
                                        Interested In
                                    </label>
                                    <select
                                        id="interest"
                                        name="interest"
                                        value={formData.interest}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition-all duration-300"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="wellness">Wellness Yoga</option>
                                        <option value="therapy">Therapeutic Yoga</option>
                                        <option value="women">Women's Yoga</option>
                                        <option value="training">Teacher Training</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 transition-all duration-300"
                                    ></textarea>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium transition duration-300 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </motion.button>

                                {status.message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-md ${status.type === 'success'
                                            ? 'bg-green-50 text-green-800 border border-green-200'
                                            : 'bg-red-50 text-red-800 border border-red-200'
                                            }`}
                                    >
                                        {status.message}
                                    </motion.div>
                                )}
                            </form>
                        </motion.div>

                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="bg-green-50 p-6 rounded-lg h-full border border-green-100"
                        >
                            <h3 className="text-xl font-bold text-green-700 mb-6">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-green-500 p-2 rounded-full mr-4">
                                        <i className="fas fa-map-marker-alt text-white"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-green-800 font-medium mb-1">Our Location</h4>
                                        <p className="text-green-700">
                                            Coimbatore, Tamil Nadu<br />
                                            Near Hindusthan College of Arts and Science
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-green-500 p-2 rounded-full mr-4">
                                        <i className="fas fa-phone-alt text-white"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-green-800 font-medium mb-1">Call Us</h4>
                                        <p className="text-green-700">
                                            +91 98765 43210<br />
                                            Mon-Sat: 8:00 AM - 8:00PM
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-green-500 p-2 rounded-full mr-4">
                                        <i className="fas fa-envelope text-white"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-green-800 font-medium mb-1">Email Us</h4>
                                        <p className="text-green-700">
                                            info@yakkaineri.com<br />
                                            support@yakkaineri.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-green-500 p-2 rounded-full mr-4">
                                        <i className="fas fa-clock text-white"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-green-800 font-medium mb-1">Opening Hours</h4>
                                        <p className="text-green-700">
                                            Monday - Friday: 6:00 AM - 9:00 PM<br />
                                            Saturday - Sunday: 7:00 AM - 8:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-green-800 font-semibold mb-4 flex items-center gap-2">
                                    🌐 Follow Us
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Facebook */}
                                    <a href="#"
                                        className="group flex items-center gap-3 bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-xl px-3 py-2.5 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md">
                                        <span className="w-9 h-9 rounded-lg bg-blue-600 group-hover:bg-white flex items-center justify-center flex-shrink-0 transition-colors">
                                            <i className="fab fa-facebook-f text-white group-hover:text-blue-600 text-sm"></i>
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-blue-700 group-hover:text-white leading-none">📘 Facebook</p>
                                            <p className="text-xs text-blue-400 group-hover:text-blue-100 leading-none mt-0.5">Yakkai Neri</p>
                                        </div>
                                    </a>

                                    {/* Instagram */}
                                    <a href="#"
                                        className="group flex items-center gap-3 bg-pink-50 hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 border border-pink-200 hover:border-pink-500 rounded-xl px-3 py-2.5 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md">
                                        <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 group-hover:bg-white flex items-center justify-center flex-shrink-0 transition-colors">
                                            <i className="fab fa-instagram text-white text-sm"></i>
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-pink-700 group-hover:text-white leading-none">📸 Instagram</p>
                                            <p className="text-xs text-pink-400 group-hover:text-pink-100 leading-none mt-0.5">@yakkaineri</p>
                                        </div>
                                    </a>

                                    {/* LinkedIn */}
                                    <a href="https://www.linkedin.com/company/yakkaineri/posts/?feedView=all"
                                        target="_blank" rel="noopener noreferrer"
                                        className="group flex items-center gap-3 bg-sky-50 hover:bg-sky-700 border border-sky-200 hover:border-sky-700 rounded-xl px-3 py-2.5 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md">
                                        <span className="w-9 h-9 rounded-lg bg-sky-700 group-hover:bg-white flex items-center justify-center flex-shrink-0 transition-colors">
                                            <i className="fab fa-linkedin-in text-white group-hover:text-sky-700 text-sm"></i>
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-sky-700 group-hover:text-white leading-none">💼 LinkedIn</p>
                                            <p className="text-xs text-sky-400 group-hover:text-sky-200 leading-none mt-0.5">Yakkai Neri</p>
                                        </div>
                                    </a>

                                    {/* WhatsApp */}
                                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                                        className="group flex items-center gap-3 bg-emerald-50 hover:bg-emerald-500 border border-emerald-200 hover:border-emerald-500 rounded-xl px-3 py-2.5 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md">
                                        <span className="w-9 h-9 rounded-lg bg-emerald-500 group-hover:bg-white flex items-center justify-center flex-shrink-0 transition-colors">
                                            <i className="fab fa-whatsapp text-white group-hover:text-emerald-500 text-sm"></i>
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-emerald-700 group-hover:text-white leading-none">💬 WhatsApp</p>
                                            <p className="text-xs text-emerald-400 group-hover:text-emerald-100 leading-none mt-0.5">Chat with us</p>
                                        </div>
                                    </a>
                                </div>

                                {/* YouTube bonus row */}
                                <a href="#"
                                    className="group mt-3 flex items-center gap-3 bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-xl px-3 py-2.5 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md w-full">
                                    <span className="w-9 h-9 rounded-lg bg-red-600 group-hover:bg-white flex items-center justify-center flex-shrink-0 transition-colors">
                                        <i className="fab fa-youtube text-white group-hover:text-red-600 text-sm"></i>
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-red-700 group-hover:text-white leading-none">▶️ YouTube</p>
                                        <p className="text-xs text-red-400 group-hover:text-red-100 leading-none mt-0.5">Watch our classes & sessions</p>
                                    </div>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
