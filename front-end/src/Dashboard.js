import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Typography,
  Alert,
  CircularProgress,
  Toolbar,
  Divider,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Traffic as TrafficIcon,
  List as LogsIcon,
  Gavel as RulesIcon,
  Security as ThreatIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Memory as ModelIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

import DashboardHome from './DashboardHome';
import LiveTraffic from './LiveTraffic';
import FullLogs from './FullLogs';
import AdminLogs from './AdminLogs';
import Rules from './Rules';
import ThreatIntelligence from './ThreatIntelligence';
import Settings from './Settings';
import MLModelMonitor from './MLModelMonitor';

import { getLogs, getModelInfo } from './api';
import { ThemeContext } from './App';

const drawerWidth = 240;

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    blocked: 0,
    allowed: 0,
    topThreats: [],
  });
  const [modelStats, setModelStats] = useState({
    accuracy: 0,
    predictions: 0,
    threatsDetected: 0,
    modelStatus: 'active'
  });

  const theme = useTheme();
  const { mode, toggleColorMode } = useContext(ThemeContext);

  const fetchData = async () => {
    try {
      if (!logs.length && !stats.totalRequests) {
        setLoading(true);
      }
      const data = await getLogs();
      const safeLogs = Array.isArray(data) ? data : [];
      setLogs(safeLogs);

      const total = safeLogs.length;
      const blockedCount = safeLogs.filter(log => log?.action === 'BLOCKED').length;
      const allowedCount = total - blockedCount;

      const threatCount = safeLogs.reduce((acc, log) => {
        if (log?.threat_type) {
          log.threat_type.split(',').forEach(t => {
            const key = t.trim();
            acc[key] = (acc[key] || 0) + 1;
          });
        }
        return acc;
      }, {});

      const topThreats = Object.entries(threatCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      setStats({ totalRequests: total, blocked: blockedCount, allowed: allowedCount, topThreats });
      
      // Fetch ML model stats from API
      try {
        const modelData = await getModelInfo();
        setModelStats(modelData);
      } catch (modelErr) {
        console.error('Failed to fetch model stats:', modelErr);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 80000);
    return () => clearInterval(interval);
  }, []);

  const getThreatChip = (threat) => {
    if (!threat) return <Chip label="None" color="success" size="small" />;
    const type = threat.toLowerCase();
    let color = 'default';
    if (type.includes('sqli') || type.includes('xss') || type.includes('rfi')) color = 'error';
    if (type.includes('csrf') || type.includes('ddos')) color = 'warning';
    return <Chip label={threat} color={color} size="small" />;
  };

  const handleNavigation = (section) => {
    setActiveSection(section);
  };

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'logs',      text: 'Logs',      icon: <LogsIcon /> },
    { id: 'adminLogs', text: 'Admin Logs', icon: <LogsIcon/>},
    { id: 'rules',     text: 'Rules',     icon: <RulesIcon /> },
    { id: 'threats',   text: 'Threats',   icon: <ThreatIcon /> },
    { id: 'model',     text: ' Models', icon: <ModelIcon /> },
    { id: 'settings',  text: 'Settings',  icon: <SettingsIcon /> },
  ];

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
              Dashboard Overview
            </Typography>
            <DashboardHome
              stats={stats}
              logs={logs}
              getThreatChip={getThreatChip}
              onNavigate={handleNavigation}
              modelStats={modelStats}
            />
          </>
        );

      case 'traffic':
        return (
          <>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
              Traffic Monitoring
            </Typography>
            <LiveTraffic logs={logs} getThreatChip={getThreatChip} />
          </>
        );

      case 'logs':
        return (
          <>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
              Security Logs
            </Typography>
            <FullLogs logs={logs} getThreatChip={getThreatChip} />
          </>
        );

      case 'adminLogs':
        return (
          <>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
              Admin Logs
            </Typography>
            <AdminLogs/>
          </>
        );

      case 'rules':
        return (
          <>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
              Firewall Rules
            </Typography>
            <Rules />
          </>
        );

      case 'threats':
        return (
          <>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
              Threat Intelligence
            </Typography>
            <ThreatIntelligence />
          </>
        );

      case 'model':
        return <MLModelMonitor />;

      case 'settings':
        return (
          <>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
              Settings
            </Typography>
            <Settings />
          </>
        );

      default:
        return <Typography>Section not found</Typography>;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#0a0a0a',
            color: theme.palette.text.primary,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', px: [1], justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            <SecurityIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: theme.palette.primary.main }}>
              SWAF
            </Typography>
          </Box>
          <IconButton onClick={toggleColorMode}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
        <Divider />
        <List sx={{ px: 1.5, py: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={activeSection === item.id}
                onClick={() => setActiveSection(item.id)}
                sx={{
                  borderRadius: '8px',
                  '&.Mui-selected': { 
                    backgroundColor: theme.palette.mode === 'light' ? '#f0f7ff' : '#1e293b',
                    color: theme.palette.primary.main,
                    '& .MuiListItemIcon-root': { color: theme.palette.primary.main }
                  },
                  '&:hover': { 
                    backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : '#1a1a1a',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: activeSection === item.id ? theme.palette.primary.main : theme.palette.text.secondary 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: activeSection === item.id ? 600 : 500,
                    fontSize: '0.9rem'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: theme.palette.background.default }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            size="small"
            sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '8px',
              p: 1
            }}
          >
            {refreshing ? <CircularProgress size={20} /> : <RefreshIcon fontSize="small" />}
          </IconButton>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {renderContent()}
      </Box>
    </Box>
  );
}