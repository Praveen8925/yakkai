import { motion } from 'framer-motion';

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg max-w-md w-full p-6"
            >
                <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition duration-300"
                    >
                        Delete
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ConfirmDialog;
