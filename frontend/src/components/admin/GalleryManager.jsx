import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import ImageUpload from './ImageUpload';
import ConfirmDialog from './ConfirmDialog';

const GalleryManager = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [newImage, setNewImage] = useState({ url: '', caption: '' });
    const [editingImage, setEditingImage] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const response = await api.get('/gallery');
            setImages(response.data.data || []);
        } catch (error) {
            console.error('Error fetching gallery:', error);
            alert('Failed to load gallery');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (url) => {
        setNewImage({ ...newImage, url });
    };

    const handleAddImage = async () => {
        if (!newImage.url) {
            alert('Please upload an image first');
            return;
        }

        try {
            await api.post('/gallery', {
                image_url: newImage.url,
                caption: newImage.caption,
                display_order: images.length + 1
            });

            await fetchGallery();
            setShowUpload(false);
            setNewImage({ url: '', caption: '' });
            alert('Image added to gallery successfully');
        } catch (error) {
            console.error('Error adding image:', error);
            alert('Failed to add image');
        }
    };

    const handleUpdateCaption = async (id, caption) => {
        try {
            await api.put(`/gallery/${id}`, { caption });
            await fetchGallery();
            setEditingImage(null);
            alert('Caption updated successfully');
        } catch (error) {
            console.error('Error updating caption:', error);
            alert('Failed to update caption');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/gallery/${id}`);
            await fetchGallery();
            setDeleteConfirm(null);
            alert('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image');
        }
    };

    if (loading) {
        return (
            <div className="bg-white bg-opacity-95 rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading gallery...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white bg-opacity-95 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Meet the Trainer Gallery</h2>
                        <p className="text-gray-600 mt-1">{images.length} images</p>
                    </div>
                    <button
                        onClick={() => setShowUpload(!showUpload)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium transition duration-300 flex items-center"
                    >
                        <span className="mr-2">{showUpload ? '✕' : '+'}</span>
                        {showUpload ? 'Cancel' : 'Add New Image'}
                    </button>
                </div>

                {/* Upload Form */}
                {showUpload && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-6 pt-6 border-t border-gray-200"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Upload New Image</h3>
                        <div className="space-y-4">
                            <ImageUpload
                                currentImage={newImage.url}
                                onUploadComplete={handleImageUpload}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Caption
                                </label>
                                <input
                                    type="text"
                                    value={newImage.caption}
                                    onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                                    placeholder="e.g., Honored by the Government of Puducherry"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleAddImage}
                                disabled={!newImage.url}
                                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium transition duration-300 disabled:bg-gray-400"
                            >
                                Add to Gallery
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((image, index) => (
                    <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white bg-opacity-95 rounded-lg overflow-hidden shadow-md border border-gray-200 hover:border-green-500 transition-colors"
                    >
                        <div className="aspect-square overflow-hidden bg-gray-100">
                            <img
                                src={image.image_url}
                                alt={image.caption}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                                }}
                            />
                        </div>
                        <div className="p-3">
                            {editingImage === image.id ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        defaultValue={image.caption}
                                        onBlur={(e) => handleUpdateCaption(image.id, e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleUpdateCaption(image.id, e.target.value);
                                            }
                                        }}
                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-gray-700 mb-3 min-h-[40px]">{image.caption}</p>
                            )}

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setEditingImage(editingImage === image.id ? null : image.id)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium transition duration-300"
                                >
                                    {editingImage === image.id ? 'Cancel' : 'Edit'}
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(image)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {images.length === 0 && (
                <div className="bg-white bg-opacity-95 rounded-lg p-12 text-center">
                    <p className="text-gray-600 text-lg">No images in gallery</p>
                    <p className="text-gray-500 text-sm mt-2">Click "Add New Image" to upload your first image</p>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <ConfirmDialog
                    title="Delete Image"
                    message={`Are you sure you want to delete this image? "${deleteConfirm.caption}" will be permanently removed.`}
                    onConfirm={() => handleDelete(deleteConfirm.id)}
                    onCancel={() => setDeleteConfirm(null)}
                />
            )}
        </div>
    );
};

export default GalleryManager;
