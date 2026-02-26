import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Local admin credentials
const ADMIN_EMAIL = 'admin@yakkaineri.com';
const ADMIN_PASSWORD = 'admin123';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Local credential validation (no backend required)
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const userData = {
                id: 1,
                name: 'Admin',
                email: ADMIN_EMAIL,
                role: 'admin',
            };
            const fakeToken = 'local-admin-token-' + Date.now();

            localStorage.setItem('token', fakeToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return userData;
        } else {
            throw { response: { data: { error: 'Invalid email or password' } } };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
