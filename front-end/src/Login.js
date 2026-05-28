import React, { useState } from 'react';
import { login } from './api'; 
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  CircularProgress,
  useTheme,
  InputAdornment,
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  Person as PersonIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      onLogin(); // successful login → go to dashboard
    } catch (err) {
      setError('Invalid username or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : '#0a0a0a',
      backgroundImage: theme.palette.mode === 'light' 
        ? 'radial-gradient(#e2e8f0 1px, transparent 1px)' 
        : 'radial-gradient(#1e293b 1px, transparent 1px)',
      backgroundSize: '32px 32px'
    }}>
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '16px',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            textAlign: 'center'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Box sx={{ 
              display: 'inline-flex', 
              p: 2, 
              borderRadius: '16px', 
              bgcolor: `${theme.palette.primary.main}10`, 
              color: theme.palette.primary.main,
              mb: 2
            }}>
              <ShieldIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 1 }}>
              SWAF
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Smart Web Application Firewall
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" variant="outlined" sx={{ mb: 3, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <Button
              fullWidth
              size="large"
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ 
                mt: 4, 
                py: 1.5, 
                borderRadius: '12px',
                boxShadow: `0 8px 16px -4px ${theme.palette.primary.main}40`,
                fontWeight: 700
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4 }}>
            Secure Access Portal • Authorized Personnel Only
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
