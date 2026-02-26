import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import ImageUpload from './ImageUpload';

const ProgramForm = ({ program, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        icon: 'fas fa-yoga',
        description: '',
        content: '',
        highlight: '',
        status: 'active',
        image_url: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (program) {
            setFormData({
                title: program.title || '',
                icon: program.icon || 'fas fa-yoga',
                description: program.description || '',
                content: program.content || '',
                highlight: program.highlight || '',
                status: program.status || 'active',
                image_url: program.image_url || ''
            });
        }
    }, [program]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = (url) => {
        setFormData({
            ...formData,
            image_url: url
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Please enter a program title');
            return;
        }

        try {
            setLoading(true);

            if (program) {
                // Update existing program
                await api.put(`/programs/${program.id}`, formData);
            } else {
                // Create new program
                await api.post('/programs', formData);
            }

            alert(program ? 'Program updated successfully' : 'Program created successfully');
            onSuccess();
        } catch (error) {
            console.error('Error saving program:', error);
            alert('Failed to save program: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const iconOptions = [
        'fas fa-yoga',
        'fas fa-child',
        'fas fa-users',
        'fas fa-heart',
        'fas fa-spa',
        'fas fa-leaf',
        'fas fa-sun',
        'fas fa-moon',
        'fas fa-star',
        'fas fa-hands'
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg max-w-3xl w-full my-8"
            >
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-800">
                        {program ? 'Edit Program' : 'Add New Program'}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Yoga for Adults"
                        />
                    </div>

                    {/* Icon */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Icon
                        </label>
                        <div className="flex items-center space-x-2">
                            <select
                                name="icon"
                                value={formData.icon}
                                onChange={handleChange}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                {iconOptions.map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                            <div className="text-3xl text-green-500 w-12 text-center">
                                <i className={formData.icon}></i>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Short Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Brief description for card preview"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Content
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Detailed program information"
                        />
                    </div>

                    {/* Highlight */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Highlight/Outcome
                        </label>
                        <input
                            type="text"
                            name="highlight"
                            value={formData.highlight}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Key benefit or outcome"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Program Image
                        </label>
                        <ImageUpload
                            currentImage={formData.image_url}
                            onUploadComplete={handleImageUpload}
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </form>

                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition duration-300 disabled:bg-gray-400"
                    >
                        {loading ? 'Saving...' : (program ? 'Update Program' : 'Create Program')}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ProgramForm;
