import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Get base URL from env, removing trailing slash
const RAW_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const API_BASE_URL = RAW_API_URL.replace(/\/$/, '') + '/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize Telegram Web App
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.expand();
        }

        const initAuth = async () => {
            let tgUser = tg?.initDataUnsafe?.user;
            
            // Fallback for local testing outside Telegram
            if (!tgUser) {
                tgUser = {
                    id: 12345678,
                    username: "TestUser_" + Math.floor(Math.random() * 1000),
                };
            }

            try {
                const payload = { 
                    telegram_id: tgUser.id.toString(), 
                    username: tgUser.username || tgUser.first_name || 'Anonymous'
                };
                
                const res = await axios.post(`${API_BASE_URL}/auth`, payload);
                if (res.data.user) {
                    setCurrentUser(res.data.user);
                }
            } catch (error) {
                console.error('Auth failed', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
