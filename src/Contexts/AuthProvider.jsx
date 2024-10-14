import { TokenManager } from '../lib';
import React, { useState, createContext, useEffect, useContext } from 'react';
const AuthContext = createContext({});
const { Provider } = AuthContext;

export function AuthProvider({ children }) {
    const savedToken = () => localStorage.getItem("token");
    const savedExpiration = (token) => {
        if (token) {
            const { exp } = TokenManager.decodeToken(token);
            return exp * 1000;
        }
        return "";
    };
    const savedUser = (token) => {
        if (token) {
            const { data: user } = TokenManager.decodeToken(token);
            return user;
        }
        return "";
    };
    const [token, setToken] = useState(savedToken());
    const [user, setUser] = useState(savedUser(token));
    const [expiration, setExpiration] = useState(savedExpiration(token));
    useEffect(() => {
        const interval = setInterval(() => {
            setStates();
            validateToken();
        }, 1000);
        return () => {
            clearInterval(interval)
        }
       
    }, [token, expiration]);
    const validateToken = () => {
        if (isAutenticated() && (savedToken() === null)) {
            LogOut();
        }
    }
    const setStates = () => {
        setToken(savedToken());
        setExpiration(savedExpiration(token));
    }
    const isAutenticated = () => {
        if (!token || !expiration) {
            return false;
        }
        if (Date.now() / 1000 >= expiration) {
            return false;
        }
        return true;
    }
    const Login = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem('userId', data.id);
        setUser(savedUser(data.token));
        setToken(data.token);
        setExpiration(data.expiresAt);
    }
    const LogOut = () => {
        localStorage.removeItem("token");
        setToken(null);
        setExpiration(null);
    }

    return (
        <Provider value={{
            token,
            user,
            validateToken,
            isAutenticated,
            Login,
            LogOut
        }}>
            {children}
        </Provider>
    );
}
export function useAuth() {
    return useContext(AuthContext);
}