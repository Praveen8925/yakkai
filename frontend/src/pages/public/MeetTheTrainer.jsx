import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.08,
            duration: 0.6,
            ease: 'easeOut'
        }
    })
};

const MeetTheTrainer = () => {
    const [lightboxImage, setLightboxImage] = useState(null);

    const galleryImages = [
        { src: '/images/award.jpg', caption: 'Honored by the Government of Puducherry' },
        { src: '/images/victory.jpg', caption: 'With the Champion of Champions' },
        { src: '/images/Champion-award.jpg', caption: 'Anna University Yoga Team Coach' },
        { src: '/images/Facultytraining.jpg', caption: 'Corporate Training Expert' },
        { src: '/images/Inthemedia.jpg', caption: 'In the Media Spotlight' },
        { src: '/images/Kriya.jpg', caption: 'Master of Shat Kriya' },
        { src: '/images/recognition.jpg', caption: 'Recognized on International Yoga Day' },
        { src: '/images/KCT.jpg', caption: 'At Youth Development Camp – Strengthening Youths' },
        { src: '/images/Adults Training.jpg', caption: 'Adults Training' },
        { src: '/images/one.jpg', caption: 'Yoga Excellence' },
        { src: '/images/two.jpg', caption: 'Community Engagement' },
        { src: '/images/three.jpg', caption: 'Training & Development' }
    ];

    const openLightbox = (imageSrc) => {
        setLightboxImage(imageSrc);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxImage(null);
        document.body.style.overflow = 'auto';
    };

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
                        Meet The Trainer
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-xl md:text-2xl text-white mb-8"
                    >
                        Mr. Rathnavelpandian - Guiding Light of Yakkai Neri
                    </motion.p>
                </div>
            </motion.section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-md border border-gray-200"
                    >
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Guiding Light of Yakkai Neri</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            <strong>Mr. Rathnavelpandian</strong>, a celebrated yoga trainer, has dedicated his life to{' '}
                            <strong>holistic well-being through yoga</strong>. His{' '}
                            <strong>expertise in kriya, posture refinement, and mindfulness techniques</strong> has helped individuals unlock their{' '}
                            <strong>inner potential and physical wellness</strong>.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-3xl font-bold text-green-500 mb-2 text-center"
                    >
                        Achievements & Recognition
                    </motion.h2>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="w-20 h-1 bg-green-500 mx-auto mb-12"
                    ></motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {galleryImages.map((image, index) => (
                            <motion.div
                                key={index}
                                custom={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-50px' }}
                                variants={fadeInUp}
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer border border-gray-200 hover:border-green-500"
                                onClick={() => openLightbox(image.src)}
                            >
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={image.src}
                                        alt={image.caption}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                </div>
                                <div className="p-3">
                                    <p className="text-sm font-medium text-gray-700 text-center">{image.caption}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white text-4xl hover:text-green-500 transition-colors z-10"
                        >
                            &times;
                        </button>
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            src={lightboxImage}
                            alt="Enlarged view"
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MeetTheTrainer;
