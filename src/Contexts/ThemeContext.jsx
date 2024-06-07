import React, { createContext, useContext, useEffect, useState } from 'react'
const ThemeContext = createContext(null);
const { Provider } = ThemeContext;

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('vm_theme') ?? "light");
    const setThemeData = (theme) => {
        localStorage.setItem('vm_theme', theme);
        document.getElementsByTagName("html")[0].setAttribute("data-theme", theme);
        setTheme(theme);
    }
    useEffect(() => {
        localStorage.setItem('vm_theme', theme);
        document.getElementsByTagName("html")[0].setAttribute("data-theme", theme);
    }, [theme]);
    return (
        <Provider value={{
            theme,
            setTheme: (theme) => setThemeData(theme)
        }}>
            {children}
        </Provider>
    );
}

export default function useTheme() {
    return useContext(ThemeContext);
}