import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed w-full bg-white bg-opacity-90 z-50 border-b border-gray-200 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex-shrink-0"
                        >
                            <Link to="/" className="text-2xl font-bold text-green-500 hover:text-green-600 transition-colors">
                                Yakkai Neri
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="hidden md:block"
                        >
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/" className="text-gray-700 hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                                    Home
                                </Link>

                                <div className="dropdown relative">
                                    <button className="text-green-500 px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none">
                                        Courses
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="dropdown-menu">
                                        <Link to="/wellness" className="dropdown-item">Wellness Programs</Link>
                                        <Link to="/therapy" className="dropdown-item">Therapy Programs</Link>
                                        <Link to="/women-seniors" className="dropdown-item">Women & Senior Programs</Link>
                                        <Link to="/professional" className="dropdown-item">Professional Training</Link>
                                        <Link to="/workshops" className="dropdown-item">Workshops</Link>
                                    </div>
                                </div>

                                <Link to="/meet-the-trainer" className="text-gray-700 hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                                    Meet The Trainer
                                </Link>
                                <Link to="/contact" className="text-gray-700 hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                                    Contact
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="hidden md:block"
                    >
                        <Link to="/contact" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 transform hover:scale-105">
                            Join Now
                        </Link>
                    </motion.div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-700 hover:text-green-500 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLine cap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', duration: 0.3 }}
                    className="md:hidden fixed inset-y-0 right-0 w-64 bg-black bg-opacity-95 z-50 border-l border-gray-800"
                >
                    <div className="flex flex-col h-full p-4">
                        <div className="flex justify-end">
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white hover:text-green-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col space-y-4 mt-8">
                            <Link to="/" className="text-white hover:text-green-500 px-3 py-2 rounded-md text-lg font-medium transition duration-300">
                                Home
                            </Link>

                            <div>
                                <button
                                    onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                                    className="text-green-500 px-3 py-2 rounded-md text-lg font-medium flex items-center w-full justify-between"
                                >
                                    <span>Courses</span>
                                    <svg className={`w-5 h-5 transition-transform ${coursesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className={`mobile-dropdown-menu ${coursesDropdownOpen ? 'show' : ''}`}>
                                    <Link to="/wellness" className="block text-white hover:text-green-500 px-3 py-2 rounded-md text-base font-medium transition duration-300">
                                        Wellness Programs
                                    </Link>
                                    <Link to="/therapy" className="block text-white hover:text-green-500 px-3 py-2 rounded-md text-base font-medium transition duration-300">
                                        Therapy Programs
                                    </Link>
                                    <Link to="/women-seniors" className="block text-white hover:text-green-500 px-3 py-2 rounded-md text-base font-medium transition duration-300">
                                        Women & Senior Programs
                                    </Link>
                                    <Link to="/professional" className="block text-white hover:text-green-500 px-3 py-2 rounded-md text-base font-medium transition duration-300">
                                        Professional Training
                                    </Link>
                                    <Link to="/workshops" className="block text-white hover:text-green-500 px-3 py-2 rounded-md text-base font-medium transition duration-300">
                                        Workshops
                                    </Link>
                                </div>
                            </div>

                            <Link to="/meet-the-trainer" className="text-white hover:text-green-500 px-3 py-2 rounded-md text-lg font-medium transition duration-300">
                                Meet The Trainer
                            </Link>
                            <Link to="/contact" className="text-white hover:text-green-500 px-3 py-2 rounded-md text-lg font-medium transition duration-300">
                                Contact
                            </Link>
                        </div>
                        <div className="mt-auto mb-8">
                            <Link to="/contact" className="block w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-md text-center font-medium transition duration-300 transform hover:scale-105">
                                Join Now
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
