import { motion } from 'framer-motion';

const galleryImages = [
    { src: '/images/img-1.jpeg', alt: 'Sounthirarajan V — yoga session' },
    { src: '/images/img-2.jpeg', alt: 'Sounthirarajan V — training' },
    { src: '/images/img-3.jpeg', alt: 'Sounthirarajan V — practice' },
];

const credentials = [
    { icon: 'fas fa-certificate', label: 'RYT 500 Certified', sub: 'Yoga Alliance Registered' },
    { icon: 'fas fa-laptop-code', label: 'B.Sc. Information Technology', sub: 'Former Software Engineer, MNC' },
    { icon: 'fas fa-chalkboard-teacher', label: '3+ Years Teaching', sub: 'Awareness · Discipline · Transformation' },
    { icon: 'fas fa-om', label: 'Lifelong Practitioner', sub: 'Practicing since 5th grade' },
];

const Trainer = () => {
    return (
        <div className="bg-gray-50 min-h-screen">

            {/* ── Hero ── */}
            <section className="bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 py-20 px-4">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    {/* Profile photo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="flex-shrink-0"
                    >
                        <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden ring-4 ring-green-500 shadow-2xl">
                            <img
                                src="/images/trainer.jpeg"
                                alt="Sounthirarajan V — Yoga Instructor"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-center md:text-left"
                    >
                        <span className="inline-block bg-green-500/20 text-green-400 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide uppercase">
                            Meet Your Trainer
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                            Sounthirarajan V
                        </h1>
                        <p className="text-green-400 text-lg font-medium mb-6">
                            RYT 500 Certified Yoga Instructor
                        </p>
                        <p className="text-gray-300 text-base leading-relaxed max-w-lg">
                            A lifelong student of yoga, a former software engineer, and a dedicated teacher committed to guiding each practitioner toward awareness, discipline, and inner transformation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Credential Cards ── */}
            <section className="max-w-5xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {credentials.map((c, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className={`${c.icon} text-green-600 text-xl`}></i>
                            </div>
                            <h3 className="font-bold text-gray-800 text-sm mb-1">{c.label}</h3>
                            <p className="text-gray-500 text-xs">{c.sub}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── Bio ── */}
            <section className="bg-white py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                            The Journey
                        </h2>
                        <div className="space-y-5 text-gray-600 text-base leading-relaxed">
                            <p>
                                I am a <strong className="text-gray-800">RYT 500 certified yoga instructor</strong>, practicing yoga since my 5th grade. What began as a childhood introduction to asana gradually became a lifelong journey of self-discovery.
                            </p>
                            <blockquote className="border-l-4 border-green-500 pl-6 py-3 bg-green-50 rounded-r-xl italic text-gray-700">
                                "My first yoga teacher once asked me, <strong>'Who am I?'</strong> — that question stayed with me and continues to guide my practice even today."
                            </blockquote>
                            <p>
                                Although I completed my <strong className="text-gray-800">B.Sc. in Information Technology</strong> and worked as a Software Engineer in a multinational company, my inner calling led me back to yoga. I chose to dedicate myself fully to this path under the guidance of my Gurus.
                            </p>
                            <p>
                                For the past three years, I have been teaching yoga with a focus on <strong className="text-gray-800">awareness, discipline, and inner transformation</strong>. I believe yoga is not just about flexibility of the body, but clarity of the mind and stability of the self.
                            </p>
                            <p className="text-xl font-semibold text-green-600 text-center pt-4">
                                "Yoga, for me, is not a profession — it is a way of life."
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Photo Gallery ── */}
            <section className="max-w-5xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">In Action</h2>
                    <p className="text-gray-500">Moments from teaching, training, and practice.</p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {galleryImages.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-2xl overflow-hidden shadow-lg"
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Philosophy ── */}
            <section className="bg-gradient-to-r from-green-600 to-green-700 py-16 px-4 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <i className="fas fa-om text-5xl mb-6 opacity-80"></i>
                    <h2 className="text-2xl font-bold mb-4">Teaching Philosophy</h2>
                    <p className="text-green-100 leading-relaxed text-base">
                        Every student arrives at yoga through a different door. My role is to create a space where the body, breath, and mind can find their natural alignment — not through force, but through focused awareness. Whether you're a beginner or an experienced practitioner, this journey inward is always available to you.
                    </p>
                </motion.div>
            </section>

        </div>
    );
};

export default Trainer;
