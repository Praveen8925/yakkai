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

const Professional = () => {
    const programs = [
        {
            title: 'Yoga Teacher Training',
            subtitle: 'For aspiring yoga professionals who want to teach with confidence and depth',
            features: [
                'Foundations of yoga philosophy & anatomy',
                'Practical teaching methodology',
                'Specialization in therapy, women\'s health, or corporate wellness',
                'Certification to begin your yoga teaching journey'
            ],
            outcome: 'Skilled, certified yoga instructors ready to inspire others'
        },
        {
            title: 'Yoga as a Sport',
            subtitle: 'Training to compete in state and national level yoga competitions',
            features: [
                'Adults: Competitive yoga coaching for enthusiasts',
                'Kids: Training for competitions and skill development',
                'Performance techniques and competition preparation'
            ],
            outcome: 'Build your career as a skilled, certified yoga professional'
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
                        Professional Training Programs
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-xl md:text-2xl text-white mb-8"
                    >
                        For aspiring yoga teachers and professionals
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
                            Our professional training programs are designed to build skilled, certified yoga professionals who can inspire others with confidence and depth.
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
                        <h2 className="text-3xl font-bold text-green-500 mb-2">Our Professional Programs</h2>
                        <div className="w-20 h-1 bg-green-500 mx-auto"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:border-green-500"
                            >
                                <h3 className="text-2xl font-bold text-green-500 mb-4">{program.title}</h3>
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
                                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-md">
                                    <p className="text-gray-800 font-medium">
                                        <strong>Outcome:</strong> {program.outcome}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="py-16 bg-gray-800"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Start Your Professional Yoga Journey Today</h2>
                    <p className="text-white text-xl mb-8 max-w-3xl mx-auto">
                        Our certified trainers will guide you to become a skilled yoga professional
                    </p>
                    <Link
                        to="/contact"
                        className="inline-block bg-white text-green-500 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium transition duration-300 transform hover:scale-105"
                    >
                        Enroll Now
                    </Link>
                </div>
            </motion.section>
        </div>
    );
};

export default Professional;
