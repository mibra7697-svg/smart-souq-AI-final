import React, { createContext, useContext, useState, useMemo, useEffect, memo, useCallback } from 'react';

export const fallbackTheme = {
  palette: {
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0', contrastText: '#fff' },
    secondary: { main: '#dc004e', light: '#ff4081', dark: '#c51162', contrastText: '#fff' },
    background: { default: '#f5f5f5', paper: '#fff' },
    text: { primary: 'rgba(0, 0, 0, 0.87)', secondary: 'rgba(0, 0, 0, 0.6)' }
  }
};

export const ThemeContext = createContext({
  theme: fallbackTheme,
  setTheme: () => {}
});

export const ThemeContextProvider = memo(({ children, initialTheme = fallbackTheme }) => {
  const [themeState, setThemeState] = useState(initialTheme);

  const normalizedTheme = useMemo(() => {
    if (!themeState || typeof themeState !== 'object') return fallbackTheme;
    
    const palette = {
      ...fallbackTheme.palette,
      ...(themeState.palette || {})
    };

    // Ensure nested properties are safe
    palette.primary = { ...fallbackTheme.palette.primary, ...(palette.primary || {}) };
    palette.secondary = { ...fallbackTheme.palette.secondary, ...(palette.secondary || {}) };
    palette.background = { ...fallbackTheme.palette.background, ...(palette.background || {}) };
    palette.text = { ...fallbackTheme.palette.text, ...(palette.text || {}) };

    return { ...themeState, palette };
  }, [themeState]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(prevTheme => ({
      ...prevTheme,
      ...newTheme
    }));
  }, []);

  const value = useMemo(() => ({
    theme: normalizedTheme,
    setTheme
  }), [normalizedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
});

// Memoized ThemeProvider to prevent excessive re-renders
export const ThemeProvider = memo(({ children }) => {
  const context = useContext(ThemeContext);
  
  // Defensive context access with fallback
  const theme = context?.theme || fallbackTheme;
  
  // Defensive palette access with complete fallback
  const safePalette = useMemo(() => ({
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0', contrastText: '#fff' },
    secondary: { main: '#dc004e', light: '#ff4081', dark: '#c51162', contrastText: '#fff' },
    background: { default: '#f5f5f5', paper: '#fff' },
    text: { primary: 'rgba(0, 0, 0, 0.87)', secondary: 'rgba(0, 0, 0, 0.6)' },
    ...theme?.palette
  }), [theme?.palette]);

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply primary and secondary colors as CSS variables for non-MUI components
    if (safePalette.primary?.main) {
      root.style.setProperty('--color-primary', safePalette.primary.main);
    }
    if (safePalette.secondary?.main) {
      root.style.setProperty('--color-secondary', safePalette.secondary.main);
    }
    if (safePalette.background?.default) {
      root.style.setProperty('--bg-default', safePalette.background.default);
    }
    if (safePalette.text?.primary) {
      root.style.setProperty('--text-primary', safePalette.text.primary);
    }
    if (safePalette.text?.secondary) {
      root.style.setProperty('--text-secondary', safePalette.text.secondary);
    }
  }, [safePalette]);

  return <>{children}</>;
});

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};

// Alias for convenience as requested
export const useTheme = useThemeContext;
