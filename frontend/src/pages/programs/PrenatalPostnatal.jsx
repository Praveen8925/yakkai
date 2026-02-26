import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PrenatalPostnatal = () => {
    return (
        <div className="min-h-screen bg-rose-50 pt-20">
            <div className="relative h-[50vh] flex items-center justify-center text-center text-rose-900 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544126566-475a85b9b87a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80")' }}></div>
                <div className="relative z-10 p-8 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl max-w-2xl">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-5xl font-serif font-bold mb-4"
                    >
                        Motherhood Journey
                    </motion.h1>
                    <p className="text-xl italic font-light">Prenatal & Postnatal Yoga</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-8 rounded-2xl shadow-lg border-t-8 border-rose-300"
                    >
                        <h2 className="text-2xl font-bold text-rose-800 mb-6 flex items-center">
                            <span className="bg-rose-100 p-2 rounded-full mr-3 text-2xl">🤰</span>
                            Prenatal Care
                        </h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Nurture yourself and your growing baby. Our safe, gentle practices help alleviate common discomforts like back pain and swelling, while preparing your body and mind for childbirth.
                        </p>
                        <ul className="space-y-3 text-gray-600 mb-8">
                            <li className="flex items-center"><span className="text-rose-400 mr-2">❀</span> Breathwork for labor</li>
                            <li className="flex items-center"><span className="text-rose-400 mr-2">❀</span> Pelvic floor strengthening</li>
                            <li className="flex items-center"><span className="text-rose-400 mr-2">❀</span> Connection with baby</li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-8 rounded-2xl shadow-lg border-t-8 border-purple-300"
                    >
                        <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                            <span className="bg-purple-100 p-2 rounded-full mr-3 text-2xl">👩‍🍼</span>
                            Postnatal Recovery
                        </h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Rebuild your strength gently. Our postnatal sessions focus on realigning the spine, engaging the core, and providing a supportive community for new mothers.
                        </p>
                        <ul className="space-y-3 text-gray-600 mb-8">
                            <li className="flex items-center"><span className="text-purple-400 mr-2">❀</span> Core rebuilding (Diastasis Recti safe)</li>
                            <li className="flex items-center"><span className="text-purple-400 mr-2">❀</span> Stress relief & relaxation</li>
                            <li className="flex items-center"><span className="text-purple-400 mr-2">❀</span> Mother-baby bonding poses</li>
                        </ul>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-16 text-center"
                >
                    <p className="text-2xl font-serif text-gray-700 italic mb-8">
                        "Giving birth should be your greatest achievement, not your greatest fear."
                    </p>
                    <Link to="/contact" className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 px-10 rounded-full shadow-md transition duration-300 transform hover:-translate-y-1">
                        Schedule a Consultation
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default PrenatalPostnatal;
