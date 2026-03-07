import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import ProgramForm from './ProgramForm';
import ConfirmDialog from './ConfirmDialog';

const ProgramsManager = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const response = await api.get('/programs?status=all');
            setPrograms(response.data.data || []);
        } catch (error) {
            console.error('Error fetching programs:', error);
            alert('Failed to load programs');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingProgram(null);
        setShowForm(true);
    };

    const handleEdit = (program) => {
        setEditingProgram(program);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/programs/${id}`);
            await fetchPrograms();
            setDeleteConfirm(null);
            alert('Program deleted successfully');
        } catch (error) {
            console.error('Error deleting program:', error);
            alert('Failed to delete program');
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingProgram(null);
        fetchPrograms();
    };

    const filteredPrograms = programs.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="bg-white bg-opacity-95 rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading programs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white bg-opacity-95 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Programs Management</h2>
                    <button
                        onClick={handleAdd}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium transition duration-300 flex items-center"
                    >
                        <span className="mr-2">+</span>
                        Add New Program
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search programs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>

            {/* Programs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map((program, index) => (
                    <motion.div
                        key={program.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white bg-opacity-95 rounded-lg overflow-hidden shadow-md border border-gray-200 hover:border-green-500 transition-colors"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div className="text-3xl text-green-500">
                                    <i className={program.icon || 'fas fa-yoga'}></i>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${program.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {program.status}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-2">{program.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>

                            {program.highlight && (
                                <div className="bg-green-50 border-l-4 border-green-500 p-2 mb-4">
                                    <p className="text-xs text-gray-700">{program.highlight}</p>
                                </div>
                            )}

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(program)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(program)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredPrograms.length === 0 && (
                <div className="bg-white bg-opacity-95 rounded-lg p-12 text-center">
                    <p className="text-gray-600 text-lg">No programs found</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your search or add a new program</p>
                </div>
            )}

            {/* Program Form Modal */}
            {showForm && (
                <ProgramForm
                    program={editingProgram}
                    onClose={() => {
                        setShowForm(false);
                        setEditingProgram(null);
                    }}
                    onSuccess={handleFormSuccess}
                />
            )}

            {/* Delete Confirmation Dialog */}
            {deleteConfirm && (
                <ConfirmDialog
                    title="Delete Program"
                    message={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
                    onConfirm={() => handleDelete(deleteConfirm.id)}
                    onCancel={() => setDeleteConfirm(null)}
                />
            )}
        </div>
    );
};

export default ProgramsManager;
