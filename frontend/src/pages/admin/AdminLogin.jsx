import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: 'url(/images/login-banner.png)' }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
            >
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-green-500 mb-2">Yakkai Neri Admin</h1>
                    <p className="text-gray-600">Manage Your Yoga Programs</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            <i className="fas fa-user mr-2"></i>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                            placeholder="admin@yakkaineri.com"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            <i className="fas fa-lock mr-2"></i>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                            placeholder="••••••••"
                        />
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium transition duration-300 disabled:opacity-50"
                    >
                        <i className="fas fa-sign-in-alt mr-2"></i>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </motion.button>
                </form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-sm text-gray-500 mt-6"
                >
                    Default credentials: admin@yakkaineri.com / admin123
                </motion.p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
