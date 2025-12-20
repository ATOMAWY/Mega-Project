import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

const DARK_MODE_STORAGE_KEY = "darkMode";

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize dark mode from localStorage
  const getInitialDarkMode = (): boolean => {
    const saved = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Default to false (light mode)
    return false;
  };

  const initialDarkMode = getInitialDarkMode();
  
  // Set theme immediately on initialization to prevent flash
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute(
      "data-theme",
      initialDarkMode ? "dark" : "light"
    );
  }

  const [darkMode, setDarkModeState] = useState<boolean>(initialDarkMode);

  useEffect(() => {
    // Update the HTML data-theme attribute when darkMode changes
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.setAttribute("data-theme", "dark");
    } else {
      htmlElement.setAttribute("data-theme", "light");
    }
    // Save to localStorage
    localStorage.setItem(DARK_MODE_STORAGE_KEY, JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkModeState((prev) => !prev);
  };

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

