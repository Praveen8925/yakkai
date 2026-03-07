import { useState, useRef } from 'react';
import api from '../../api/axios';

const ImageUpload = ({ currentImage, onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || '');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPG, PNG, or WebP)');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload file
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                onUploadComplete(response.data.url);
            } else {
                throw new Error(response.data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image: ' + (error.response?.data?.error || error.message));
            setPreview(currentImage || '');
        } finally {
            setUploading(false);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-3">
            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`
          relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all
          ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleChange}
                    className="hidden"
                    disabled={uploading}
                />

                {preview ? (
                    <div className="flex items-center justify-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-48 rounded-md object-contain"
                        />
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="text-4xl text-gray-400 mb-2">📤</div>
                        <p className="text-gray-600 font-medium mb-1">
                            {dragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-gray-500 text-sm">
                            JPG, PNG or WebP (max 5MB)
                        </p>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto mb-2"></div>
                            <p className="text-gray-600 font-medium">Uploading...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Controls */}
            {preview && !uploading && (
                <div className="flex justify-between items-center text-sm">
                    <span className="text-green-600 font-medium">✓ Image ready</span>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPreview('');
                            onUploadComplete('');
                        }}
                        className="text-red-600 hover:text-red-700 font-medium"
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
