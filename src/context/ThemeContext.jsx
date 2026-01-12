import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Check local storage or default to 'light'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("app-theme") || "light";
    });

    useEffect(() => {
        localStorage.setItem("app-theme", theme);
        // Remove old classes
        document.documentElement.classList.remove("theme-light", "theme-gradient");
        // Add new class
        document.documentElement.classList.add(`theme-${theme}`);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "gradient" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
