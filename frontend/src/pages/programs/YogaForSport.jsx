import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const benefits = [
    {
        icon: 'fas fa-running',
        color: 'bg-blue-100 text-blue-500',
        title: 'Injury Prevention',
        desc: 'Dynamic stretching and joint mobility exercises to keep athletes safe and resilient.',
    },
    {
        icon: 'fas fa-heartbeat',
        color: 'bg-green-100 text-green-500',
        title: 'Recovery & Restoration',
        desc: 'Deep relaxation techniques and restorative poses to accelerate muscle recovery.',
    },
    {
        icon: 'fas fa-brain',
        color: 'bg-purple-100 text-purple-500',
        title: 'Focus & Visualization',
        desc: 'Mental training to maintain peak performance under pressure.',
    },
    {
        icon: 'fas fa-wind',
        color: 'bg-yellow-100 text-yellow-600',
        title: 'Breath Control',
        desc: 'Pranayama techniques to increase VO2 max, endurance and oxygen efficiency.',
    },
    {
        icon: 'fas fa-bolt',
        color: 'bg-red-100 text-red-500',
        title: 'Explosive Power',
        desc: 'Core activation and dynamic asanas that transfer directly to sport-specific power.',
    },
    {
        icon: 'fas fa-shield-alt',
        color: 'bg-indigo-100 text-indigo-500',
        title: 'Resilience & Grit',
        desc: 'Overcoming discomfort in practice builds the mental toughness needed to compete.',
    },
];

const YogaForSport = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20">

            {/* Hero */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl p-10 md:p-16 text-white shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="md:w-1/2 text-left">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 text-sm mb-5">
                                <i className="fas fa-dumbbell"></i>
                                <span>Sports Performance Yoga</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-5 font-serif tracking-tight">
                                Yoga For <span className="text-yellow-300">Sport</span>
                            </h1>
                            <p className="text-xl font-light leading-relaxed mb-8 opacity-90">
                                Yoga is a powerful tool for athletes — enhancing flexibility, strength, and mental focus.
                                At Yakkai Neri, we integrate yoga into sports training to help athletes prevent injuries,
                                recover faster, and gain a decisive competitive edge.
                            </p>
                            <Link to="/contact"
                                className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-50 transition transform hover:-translate-y-1">
                                Enhance Your Performance
                            </Link>
                        </div>
                        <div className="md:w-1/2 grid grid-cols-2 gap-4">
                            <img src="/images/Facultytraining.jpg" alt="Outdoor group yoga sport training"
                                className="rounded-xl shadow-lg w-full h-44 object-cover transform rotate-2 hover:rotate-0 transition duration-500"
                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1544367563-12123d8965cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; }} />
                            <img src="/images/Adults Training.jpg" alt="Indoor sport yoga session"
                                className="rounded-xl shadow-lg w-full h-44 object-cover transform -rotate-2 hover:rotate-0 transition duration-500 mt-8"
                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; }} />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Benefits grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Yoga Gives Athletes the Edge</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Traditional sports training pushes your body. Yoga teaches your body how to recover, adapt, and perform smarter.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {benefits.map((b, i) => (
                        <motion.div key={i} whileHover={{ y: -8 }} initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                            className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
                            <div className={`w-16 h-16 ${b.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
                                <i className={b.icon}></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{b.title}</h3>
                            <p className="text-gray-600 text-sm">{b.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Sport-specific section with image */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-16">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden md:flex">
                    <div className="md:w-1/2">
                        <img src="/images/Facultytraining.jpg" alt="Outdoor athlete yoga session"
                            className="w-full h-full object-cover min-h-[280px]" />
                    </div>
                    <div className="md:w-1/2 p-8 md:p-12 border-l-8 border-yellow-400 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Sport-Specific Training</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Our programs are <span className="font-semibold text-green-600">sport-specific</span>, designed in collaboration
                            with coaches and physiotherapists, ensuring that yoga complements athletic training rather than being a generic add-on.
                        </p>
                        <div className="space-y-3">
                            {['Runners — hip flexor & ITB flexibility', 'Cricketers — shoulder, spine, hamstring care', 'Swimmers — shoulder rotation & breathing', 'Martial Artists — balance, core, flexibility'].map((s, i) => (
                                <div key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                                    {s}
                                </div>
                            ))}
                        </div>
                        <Link to="/contact"
                            className="mt-8 inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105 w-fit">
                            Start Training
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YogaForSport;
