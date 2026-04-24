import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(localStorage.getItem('user_role') || 'user');

    useEffect(() => {
        // Check if user is logged in on app start
        const token = localStorage.getItem('auth_token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const login = (token, userRole) => {
        localStorage.setItem('auth_token', token);
        if (userRole) {
            localStorage.setItem('user_role', userRole);
            setRole(userRole);
        }
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        setIsLoggedIn(false);
        setRole('user');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};