import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Experiments from './pages/Experiments';
import Data from './pages/Data';
import Community from './pages/Community';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5465FF',
    },
    secondary: {
      main: '#00ffff',
    },
    background: {
      default: '#0a0a1a',
      paper: '#1a1a3a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(26, 26, 58, 0.8)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/experiments" element={<Experiments />} />
                <Route path="/data" element={<Data />} />
                <Route path="/community" element={<Community />} />
              </Routes>
            </Box>
          </Box>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 