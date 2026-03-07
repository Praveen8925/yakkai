import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

const Home = () => {
    const programs = [
        {
            title: 'Yoga as a Sport',
            description: 'Competitive yoga training focusing on strength, flexibility, and performance excellence.',
            icon: 'fas fa-trophy',
            link: '/programs/yoga-as-sport',
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            title: 'Corporate Yoga',
            description: 'Stress management and productivity enhancement programs tailored for the workplace.',
            icon: 'fas fa-briefcase',
            link: '/programs/corporate-yoga',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            title: 'Yoga for Sport',
            description: 'Specialized training for athletes to prevent injury and improve recovery.',
            icon: 'fas fa-running',
            link: '/programs/yoga-for-sport',
            color: 'bg-green-100 text-green-600'
        },
        {
            title: 'Women Wellness',
            description: 'Holistic health practices for hormonal balance and emotional well-being.',
            icon: 'fas fa-female',
            link: '/programs/women-wellness',
            color: 'bg-pink-100 text-pink-600'
        },
        {
            title: 'Tech-Supported Yoga',
            description: 'AI-driven posture analysis and virtual sessions for modern practitioners.',
            icon: 'fas fa-microchip',
            link: '/programs/tech-supported-yoga',
            color: 'bg-indigo-100 text-indigo-600'
        },
        {
            title: 'Therapy',
            description: 'Therapeutic applications of yoga for specific health conditions and recovery.',
            icon: 'fas fa-heartbeat',
            link: '/therapy',
            color: 'bg-red-100 text-red-600'
        },
        {
            title: 'Adolescence',
            description: 'Yoga for teens to build focus, confidence, and emotional stability.',
            icon: 'fas fa-user-graduate',
            link: '/programs/adolescence',
            color: 'bg-orange-100 text-orange-600'
        },
        {
            title: 'Prenatal & Postnatal',
            description: 'Gentle care for expecting and new mothers to navigate the journey of motherhood.',
            icon: 'fas fa-baby-carriage',
            link: '/programs/prenatal-postnatal',
            color: 'bg-rose-100 text-rose-600'
        }
    ];

    return (
        <div className="min-h-screen">
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                id="home"
                className="relative min-h-screen flex items-center justify-center"
            >
                {/* Banner Image */}
                <img
                    src="/images/banner.jpg"
                    alt="Yoga Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-70"></div>

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <motion.h1
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-4xl md:text-6xl font-bold text-white mb-4"
                        >
                            Yakkai Neri Yoga Academy
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="text-xl md:text-2xl text-white mb-8"
                        >
                            Transform Your Life Through the Power of Yoga
                        </motion.p>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                        >
                            <Link
                                to="/wellness"
                                className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-md text-lg font-medium transition duration-300 transform hover:scale-105"
                            >
                                Explore Courses
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            <section id="topics" className="py-20 bg-gray-50">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-green-500 mb-4">Our Programs</h2>
                        <div className="w-20 h-1 bg-green-500 mx-auto"></div>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {programs.map((program, index) => (
                            <Link to={program.link} key={index} className="block group">
                                <motion.div
                                    custom={index}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-50px' }}
                                    variants={fadeInUp}
                                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border-b-4 border-transparent hover:border-green-500"
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-6 ${program.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <i className={program.icon}></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                                        {program.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {program.description}
                                    </p>
                                    <div className="mt-6 flex items-center text-green-500 font-medium text-sm group-hover:translate-x-2 transition-transform">
                                        Learn More <i className="fas fa-arrow-right ml-2"></i>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } } }}
                id="contact"
                className="py-20 bg-white"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-green-500 mb-4">Get In Touch</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Ready to begin your yoga journey? Contact us for more information or to schedule a visit
                        </p>
                        <div className="w-20 h-1 bg-green-500 mx-auto mt-4"></div>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/contact"
                            className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-md text-lg font-medium transition duration-300 transform hover:scale-105"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default Home;
