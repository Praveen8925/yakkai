import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TechSupportedYoga = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-mono"
                    >
                        Tech-Supported <span className="text-blue-600">Yoga</span>
                    </motion.h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Blending ancient wisdom with modern technology. Experience yoga like never before with AI-driven posture correction, bio-feedback, and immersive virtual sessions.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1544367563-12123d8965cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="Tech Yoga"
                            className="rounded-2xl shadow-2xl"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 p-3 rounded-lg text-blue-600 text-2xl">
                                <i className="fas fa-robot"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">AI Posture Analysis</h3>
                                <p className="text-gray-600">Real-time feedback on your alignment using computer vision technology to prevent injury and improve form.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="bg-purple-100 p-3 rounded-lg text-purple-600 text-2xl">
                                <i className="fas fa-vr-cardboard"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Immersive Classes</h3>
                                <p className="text-gray-600">Virtual reality sessions that transport you to serene landscapes for deeper meditation and focus.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="bg-green-100 p-3 rounded-lg text-green-600 text-2xl">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Progress Tracking</h3>
                                <p className="text-gray-600">Smart wearables integration to track your heart rate, stress levels, and flexibility improvements over time.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-blue-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/images/circuit-board.png')]"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-6">Experience the Future of Wellness</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                            Join our pilot program for tech-supported yoga and be part of the revolution in personal health.
                        </p>
                        <Link to="/contact" className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105">
                            Join Pilot Program
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TechSupportedYoga;
