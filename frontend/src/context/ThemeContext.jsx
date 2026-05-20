import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

const ThemeContextProvider = (props) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Load saved theme from localStorage or default to false (light mode)
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        // Save theme preference to localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Add or remove dark class on body for global styling
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const value = {
        isDarkMode,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {props.children}
        </ThemeContext.Provider>
    );
};

export default ThemeContextProvider;