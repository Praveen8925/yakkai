import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Adolescence = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-6xl font-bold mb-6 font-handwriting"
                    >
                        Adolescence Yoga
                    </motion.h1>
                    <p className="text-xl md:text-2xl font-light opacity-90 max-w-3xl mx-auto">
                        Building confidence, concentration, and calm during the teenage years.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Navigating Growth with Balance</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6 text-center max-w-4xl mx-auto">
                        Adolescence is a time of rapid physical and emotional change. Our program is designed to help teenagers manage stress, improve focus for academics, and develop a positive body image through the practice of yoga.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        <div className="text-center p-6 bg-orange-50 rounded-xl">
                            <div className="text-4xl mb-4 text-orange-500"><i className="fas fa-university"></i></div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Academic Focus</h3>
                            <p className="text-gray-600">Techniques to improve concentration and memory retention.</p>
                        </div>
                        <div className="text-center p-6 bg-red-50 rounded-xl">
                            <div className="text-4xl mb-4 text-red-500"><i className="fas fa-heart"></i></div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Emotional Stability</h3>
                            <p className="text-gray-600">Tools to manage anxiety, peer pressure, and mood swings.</p>
                        </div>
                        <div className="text-center p-6 bg-yellow-50 rounded-xl">
                            <div className="text-4xl mb-4 text-yellow-500"><i className="fas fa-running"></i></div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Physical Strength</h3>
                            <p className="text-gray-600">Building a strong, flexible body for lifelong health.</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Program Highlights</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2 mt-1">✦</span>
                                <span className="text-gray-700">Exam stress relief workshops</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2 mt-1">✦</span>
                                <span className="text-gray-700">Posture correction for study habits</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2 mt-1">✦</span>
                                <span className="text-gray-700">Fun, interactive flow sequences</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-orange-500 mr-2 mt-1">✦</span>
                                <span className="text-gray-700">Group discussions & mindfulness</span>
                            </li>
                        </ul>
                        <Link to="/contact" className="inline-block mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105">
                            Enroll Your Teen
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="rounded-2xl overflow-hidden shadow-lg h-80"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1544367563-12123d8965cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="Teens Yoga"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Adolescence;
