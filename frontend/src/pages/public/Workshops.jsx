import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.6,
            ease: 'easeOut'
        }
    })
};

const Workshops = () => {
    const workshops = [
        {
            title: 'Pranayama Workshop',
            subtitle: 'Learn advanced breathwork techniques to improve energy, focus, and emotional balance',
            features: [
                'Advanced breathing techniques for energy regulation',
                'Methods to enhance mental focus and clarity',
                'Breathwork for emotional balance and stress reduction',
                'Practical applications for daily life'
            ],
            outcome: 'Improved energy flow, enhanced focus, and emotional stability'
        },
        {
            title: 'Shat Kriya Workshop',
            subtitle: 'Master yogic cleansing practices for detoxification and holistic health',
            features: [
                'Six purification techniques of Hatha Yoga',
                'Methods for internal cleansing and detoxification',
                'Practices to balance the doshas (body energies)',
                'Guidance for safe and effective practice'
            ],
            outcome: 'Deep detoxification, improved organ function, and holistic wellness'
        },
        {
            title: 'Sound Healing Workshop',
            subtitle: 'Explore vibration therapy with sound bowls and mantras for stress relief and deep relaxation',
            features: [
                'Therapeutic use of singing bowls and healing instruments',
                'Mantra chanting for vibrational healing',
                'Techniques for deep meditation and relaxation',
                'Sound therapy for chakra balancing'
            ],
            outcome: 'Deep relaxation, stress relief, and energetic balance'
        },
        {
            title: 'Ashtanga Vinyasa Workshop',
            subtitle: 'A structured, dynamic practice focusing on strength, flexibility, and discipline',
            features: [
                'Primary series foundation and progression',
                'Vinyasa flow sequencing and breath synchronization',
                'Building strength and flexibility safely',
                'Traditional Ashtanga method and philosophy'
            ],
            outcome: 'Enhanced physical strength, mental discipline, and flowing practice'
        },
        {
            title: 'Advanced Surya Namaskar Workshop',
            subtitle: 'Go beyond the basics—variations and sequencing for endurance and stamina',
            features: [
                'Advanced variations of traditional sun salutations',
                'Sequencing for building endurance and stamina',
                'Incorporating mantras and mindful intention',
                'Therapeutic applications for different needs'
            ],
            outcome: 'Increased vitality, improved endurance, and mastery of advanced sequences'
        },
        {
            title: 'Advanced Asanas Workshop',
            subtitle: 'Learn challenging postures safely with step-by-step guidance for flexibility and strength',
            features: [
                'Breakdown of advanced arm balances and inversions',
                'Step-by-step progression for challenging postures',
                'Alignment principles for safety and effectiveness',
                'Use of props and modifications for different levels'
            ],
            outcome: 'Mastery of advanced postures, improved flexibility and strength'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-gray-900 to-gray-800 py-20 md:py-32"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold text-green-500 mb-6"
                    >
                        Workshops & Advanced Practices
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-xl md:text-2xl text-white mb-8"
                    >
                        Short-term intensive programs for growth and mastery
                    </motion.p>
                </div>
            </motion.section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <p className="text-lg text-gray-700">
                            Our specialized workshops are designed to deepen your practice, master advanced yogic tools, and provide a pathway to personal transformation through intensive short-term programs.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-green-500 mb-2">Our Workshop Programs</h2>
                        <div className="w-20 h-1 bg-green-500 mx-auto"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {workshops.map((workshop, index) => (
                            <motion.div
                                key={index}
                                custom={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-50px' }}
                                variants={fadeInUp}
                                whileHover={{ y: -4, scale: 1.01 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:border-green-500"
                            >
                                <h3 className="text-2xl font-bold text-green-500 mb-4">{workshop.title}</h3>
                                <p className="text-gray-700 font-medium mb-4">{workshop.subtitle}</p>
                                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                                    {workshop.features.map((feature, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 * i }}
                                        >
                                            {feature}
                                        </motion.li>
                                    ))}
                                </ul>
                                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-md">
                                    <p className="text-gray-800 font-medium">
                                        <strong>Outcome:</strong> {workshop.outcome}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-3xl font-bold text-green-500 mb-6"
                    >
                        Workshop Outcomes
                    </motion.h2>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md"
                    >
                        <p className="text-xl text-gray-800 mb-6">
                            Deepened practice, mastery of advanced yogic tools, and a pathway to personal transformation
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="bg-green-100 p-4 rounded-lg"
                            >
                                <div className="text-green-500 text-3xl mb-3">🧘</div>
                                <h3 className="font-bold text-green-700 mb-2">Deepened Practice</h3>
                                <p className="text-gray-700">Move beyond basics to advanced understanding</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="bg-green-100 p-4 rounded-lg"
                            >
                                <div className="text-green-500 text-3xl mb-3">🛠️</div>
                                <h3 className="font-bold text-green-700 mb-2">Master Advanced Tools</h3>
                                <p className="text-gray-700">Learn specialized techniques for transformation</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="bg-green-100 p-4 rounded-lg"
                            >
                                <div className="text-green-500 text-3xl mb-3">🌱</div>
                                <h3 className="font-bold text-green-700 mb-2">Personal Growth</h3>
                                <p className="text-gray-700">Experience profound personal development</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="py-16 bg-gray-800"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Begin Your Advanced Practice Today</h2>
                    <p className="text-white text-xl mb-8 max-w-3xl mx-auto">
                        Our expert instructors will guide you through specialized workshops to deepen your practice and transform your yoga journey
                    </p>
                    <Link
                        to="/contact"
                        className="inline-block bg-white text-green-500 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium transition duration-300 transform hover:scale-105"
                    >
                        Register for a Workshop
                    </Link>
                </div>
            </motion.section>
        </div>
    );
};

export default Workshops;
