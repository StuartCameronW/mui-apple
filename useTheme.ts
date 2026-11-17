import { createContext, useContext } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Simple one-liner hook to set theme mode.
 * @returns A function to set the theme to 'light', 'dark', or 'system'
 * @example
 * const setTheme = useToggleTheme();
 * setTheme('dark'); // Sets theme to dark
 * setTheme('light'); // Sets theme to light
 * setTheme('system'); // Follows system preference
 */
export const useToggleTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useToggleTheme must be used within a ThemeProvider');
  }
  return context.setMode;
};