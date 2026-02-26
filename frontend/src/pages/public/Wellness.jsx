import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: 'easeOut'
        }
    })
};

const Wellness = () => {
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
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative py-24 md:py-32 bg-green-600 overflow-hidden"
            >
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                    >
                        Wellness Programs
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto font-light"
                    >
                        Discover our comprehensive range of specialized yoga programs designed for every stage of life and unique needs.
                    </motion.p>
                </div>
            </motion.section>

            {/* Programs Grid */}
            <section className="py-20 -mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

            {/* CTA Section */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Not sure which program is right for you?</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Our expert trainers are here to guide you. Contact us for a free consultation to identify the best path for your wellness journey.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-medium transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Get Free Consultation
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Wellness;
