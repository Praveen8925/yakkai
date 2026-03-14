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

const Wellness = () => {
    const programs = [
        {
            title: 'Yoga for Adults & Young Adults',
            subtitle: 'Stress relief, focus, and balanced lifestyle',
            features: [
                'College Students: Stress relief, concentration, and resilience',
                'Adults as a Sport: Competitive yoga coaching for enthusiasts'
            ],
            outcome: 'Balanced lifestyle, sharper focus, and improved mental clarity'
        },
        {
            title: 'Yoga for Kids',
            subtitle: 'Fun and engaging yoga for wellbeing, sport, and athletic training',
            features: [
                'Wellbeing Yoga – Building healthy habits and focus early',
                'Yoga as a Sport – Training for competitions',
                'Yoga for Sports – Flexibility and endurance for young athletes'
            ],
            outcome: 'Healthy, confident, and balanced children'
        },
        {
            title: 'Yoga for Educational Institutions',
            subtitle: '1-hour, 1-week, and 1-month programs to build focus, posture, and emotional balance',
            features: [
                '1 Hour Awareness Session – Quick stress relief practices',
                '1 Week Program – Posture, breathing, and focus foundation',
                '1 Month Program – Intensive immersion into yoga, mindfulness, and emotional balance'
            ],
            outcome: 'Confident, calm, and focused students with improved wellbeing'
        },
        {
            title: 'Corporate Yoga & Wellness',
            subtitle: 'Stress management, posture care, and productivity-focused programs for employees',
            features: [
                'Posture correction & ergonomic care',
                'Stress management through breathwork & mindfulness',
                'Team self-assessment with HR wellness insights'
            ],
            outcome: 'Better focus, reduced burnout, and a thriving workplace culture'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
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
                        Wellness & Lifestyle Programs
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-xl md:text-2xl text-white mb-8"
                    >
                        For overall health, energy, and balance
                    </motion.p>
                </div>
            </motion.section>

            {/* Intro */}
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
                            Our wellness programs are designed to help you achieve optimal health, mental clarity, and emotional balance through the transformative power of yoga.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Programs Grid */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-green-500 mb-2">Our Wellness Programs</h2>
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

                    {/* Overall Outcome */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-16 bg-green-50 rounded-lg p-8 text-center"
                    >
                        <h3 className="text-2xl font-bold text-green-500 mb-4">Overall Program Outcome</h3>
                        <p className="text-xl text-gray-800 font-medium">
                            Improved physical health, sharper mind, and emotional resilience
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
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
                        className="inline-block bg-white text-green-500 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium transition duration-300 transform hover:scale-105"
                    >
                        Enroll Now
                    </Link>
                </div>
            </motion.section>
        </div>
    );
};

export default Wellness;
