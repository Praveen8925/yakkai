import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.6,
            ease: 'easeOut'
        }
    })
};

const WomenSeniors = () => {
    const programs = [
        {
            title: 'Yoga for Women',
            subtitle: 'Empowering women through every stage of life',
            features: [
                'Prenatal & postnatal support',
                'Hormonal balance & PCOS care',
                'Menopause transition wellness',
                'Stress and lifestyle management'
            ],
            outcome: 'Energy, confidence, and harmony within'
        },
        {
            title: 'Senior Citizen Yoga',
            subtitle: 'Gentle yoga for mobility, balance, and longevity',
            features: [
                'Improved mobility and flexibility',
                'Balance and fall prevention',
                'Joint health and pain management',
                'Memory and cognitive function support'
            ],
            outcome: 'Enhanced vitality, independence, and quality of life'
        }
    ];

    return (
        <div className="min-h-screen bg-pink-50">
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
                        className="text-4xl md:text-5xl font-bold text-pink-400 mb-6"
                    >
                        Yoga for Women & Seniors
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-xl md:text-2xl text-white mb-8"
                    >
                        Tailored programs for different life stages, promoting strength, vitality, and calmness
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
                            Our women and senior yoga programs are carefully designed to address the unique physical and emotional needs at different stages of life, providing supportive practices that enhance wellbeing and quality of life.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 bg-pink-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-pink-500 mb-2">Our Specialized Programs</h2>
                        <div className="w-20 h-1 bg-pink-500 mx-auto"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {programs.map((program, index) => (
                            <motion.div
                                key={index}
                                custom={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-50px' }}
                                variants={fadeInUp}
                                whileHover={{ y: -4, scale: 1.01 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:border-pink-500"
                            >
                                <h3 className="text-2xl font-bold text-pink-500 mb-4">{program.title}</h3>
                                <p className="text-gray-700 font-medium mb-4">{program.subtitle}</p>
                                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                                    {program.features.map((feature, i) => (
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
                                <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-pink-100 border-l-4 border-pink-500 rounded-md">
                                    <p className="text-gray-800 font-medium">
                                        <strong>Outcome:</strong> {program.outcome}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg p-8 shadow-md"
                    >
                        <h3 className="text-2xl font-bold text-pink-500 mb-4 text-center">Program Outcome</h3>
                        <p className="text-xl text-gray-800 font-medium text-center">
                            Supporting women and seniors with strength, vitality, and calmness
                        </p>
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
                    <h2 className="text-3xl font-bold text-white mb-6">Begin Your Wellness Journey Today</h2>
                    <p className="text-white text-xl mb-8 max-w-3xl mx-auto">
                        Our certified yoga instructors will create a personalized program to help you achieve optimal health and balance
                    </p>
                    <Link
                        to="/contact"
                        className="inline-block bg-white text-pink-500 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium transition duration-300 transform hover:scale-105"
                    >
                        Enroll Now
                    </Link>
                </div>
            </motion.section>
        </div>
    );
};

export default WomenSeniors;
