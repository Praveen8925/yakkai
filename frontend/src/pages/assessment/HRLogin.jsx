import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const HRLogin = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        // Don't clear error immediately on input change
        if (error && e.target.value.length > 0) {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/hr-users/login', {
                username: form.username.trim(),
                password: form.password,
            });

            if (response.data.success) {
                const { token, user } = response.data;
                
                // Store token and user data
                localStorage.setItem('hr_token', token);
                localStorage.setItem('hr_user', JSON.stringify(user));
                
                // Also store in sessionStorage for backward compatibility
                sessionStorage.setItem('hr_session', JSON.stringify({
                    ...user,
                    name: user.contact_person,
                    company: user.company_name,
                    loginAt: new Date().toISOString(),
                }));
                
                // Navigate to dashboard
                navigate('/assessment/hr-dashboard');
            } else {
                setError('Login failed. Please try again.');
                setLoading(false);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Invalid username/email or password. Please try again.';
            setError(errorMsg);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #0f766e 100%)' }}>
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-16 text-white">
                <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                    <div className="text-6xl mb-6">🧘‍♀️</div>
                    <h1 className="text-4xl font-bold mb-4 leading-tight">
                        Yakkai Neri<br />
                        <span style={{ color: '#6ee7b7' }}>Wellness Portal</span>
                    </h1>
                    <p className="text-green-100 text-lg leading-relaxed mb-10 max-w-md">
                        Empower your team with data-driven wellness insights. Create assessments, track team health, and build a healthier workplace.
                    </p>
                    <div className="space-y-4">
                        {['📊 Create & share team assessments', '📧 Send unique links to employees', '📈 View aggregated team scores', '🌿 Get personalized program recommendations'].map(item => (
                            <div key={item} className="flex items-center gap-3 text-green-100">
                                <span className="text-lg">{item.slice(0, 2)}</span>
                                <span>{item.slice(3)}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Panel – Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Card Header */}
                        <div className="p-8 text-center" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' }}>
                            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <span className="text-white text-2xl">🏢</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">HR / Team Lead Portal</h2>
                            <p className="text-gray-500 text-sm mt-1">Sign in to manage employee wellness assessments</p>
                        </div>

                        {/* Form */}
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Username or Email
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        required
                                        autoComplete="username"
                                        placeholder="Username or email address"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none bg-gray-50 text-gray-800 placeholder-gray-400 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            required
                                            autoComplete="current-password"
                                            placeholder="Enter your password"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none bg-gray-50 text-gray-800 placeholder-gray-400 transition-colors pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2"
                                    >
                                        <span className="text-red-500">⚠️</span>
                                        <p className="text-red-600 text-sm">{error}</p>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 shadow-md
                                        ${loading
                                            ? 'bg-green-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Signing in…
                                        </span>
                                    ) : 'Sign In to Dashboard →'}
                                </button>
                            </form>

                            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <p className="text-xs font-semibold text-blue-700 mb-2">ℹ️ Need Access?</p>
                                <p className="text-xs text-blue-600">Contact your admin to create an HR account for your company.</p>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-500">
                                    Want an individual assessment?{' '}
                                    <Link to="/assessment/individual" className="text-green-600 hover:text-green-700 font-medium">
                                        Take it here →
                                    </Link>
                                </p>
                                <Link to="/programs/corporate-yoga" className="block mt-3 text-xs text-gray-400 hover:text-gray-600 transition">
                                    ← Back to Corporate Yoga
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HRLogin;
