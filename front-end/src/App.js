import React, { useState, useMemo, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './Login';
import Dashboard from './Dashboard';
import AdminLogs from './AdminLogs';
import Settings from './Settings';

// Create context for theme
export const ThemeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light'
});

//const App = () => {  

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState(() => {
    // Load saved theme preference from localStorage
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#0070f3' : '#3291ff',
            dark: '#0056b3',
            light: '#d0e2ff',
          },
          secondary: {
            main: '#7928ca',
            dark: '#4c1d95',
            light: '#f5f3ff',
          },
          background: {
            default: mode === 'light' ? '#f8fafc' : '#0a0a0a',
            paper: mode === 'light' ? '#ffffff' : '#111111',
          },
          text: {
            primary: mode === 'light' ? '#1a1a1a' : '#ededed',
            secondary: mode === 'light' ? '#666666' : '#a1a1a1',
          },
          divider: mode === 'light' ? '#e5e7eb' : '#262626',
        },
        typography: {
          fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
          h1: { fontWeight: 800 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 700 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
          button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
                padding: '8px 16px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                boxShadow: mode === 'light' 
                  ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  : '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                borderRight: mode === 'light' ? '1px solid #e5e7eb' : '1px solid #262626',
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/admin-logs" element={<AdminLogs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={isLoggedIn ? <Dashboard /> : <Login onLogin={() => setIsLoggedIn(true)} />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;