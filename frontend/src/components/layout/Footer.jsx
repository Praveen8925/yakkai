import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border-t border-gray-200 py-12"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-xl font-bold text-green-500 mb-4">Yakkai Neri</h3>
                        <p className="text-gray-600">
                            Transforming lives through authentic yoga practice since 2010. Join us on the path to holistic wellbeing.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="text-green-500 font-medium mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-600 hover:text-green-500 transition duration-300">Home</Link></li>
                            <li><Link to="/wellness" className="text-gray-600 hover:text-green-500 transition duration-300">Wellness Programs</Link></li>
                            <li><Link to="/meet-the-trainer" className="text-gray-600 hover:text-green-500 transition duration-300">Meet The Trainer</Link></li>
                            <li><Link to="/contact" className="text-gray-600 hover:text-green-500 transition duration-300">Contact</Link></li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h4 className="text-green-500 font-medium mb-4">Contact Info</h4>
                        <p className="text-gray-600">Coimbatore, Tamil Nadu</p>
                        <p className="text-gray-600">Near Hindusthan College of Arts and Science</p>
                        <p className="text-gray-600 mt-2">+91 98765 43210</p>
                        <p className="text-gray-600">info@yakkaineri.com</p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <h4 className="text-green-500 font-medium mb-4">Newsletter</h4>
                        <p className="text-gray-600 mb-4">Subscribe to receive updates on workshops, events and yoga tips.</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-500 w-full transition-all duration-300"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-md transition duration-300"
                            >
                                <i className="fas fa-paper-plane"></i>
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="border-t border-gray-300 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
                >
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2023 Yakkai Neri Yoga Academy. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link to="#" className="text-gray-500 hover:text-green-500 transition duration-300">Privacy Policy</Link>
                        <Link to="#" className="text-gray-500 hover:text-green-500 transition duration-300">Terms of Service</Link>
                        <Link to="#" className="text-gray-500 hover:text-green-500 transition duration-300">Sitemap</Link>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;
