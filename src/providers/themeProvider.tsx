import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Check localStorage for saved theme preference
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    return savedMode || 'light';
  });

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            // Dark theme colors
            primary: {
              main: '#90caf9',
            },
            secondary: {
              main: '#f48fb1',
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#ffffff',
              secondary: '#b3b3b3',
            },
          }
        : {
            // Light theme colors (default Material-UI colors)
            primary: {
              main: '#1976d2',
            },
            secondary: {
              main: '#dc004e',
            },
            background: {
              default: '#ffffff',
              paper: '#ffffff',
            },
            text: {
              primary: '#000000',
              secondary: '#666666',
            },
          }),
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            color: mode === 'dark' ? '#ffffff' : '#000000',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
