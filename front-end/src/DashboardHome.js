import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  LinearProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Traffic as TrafficIcon,
  List as LogsIcon,
  Gavel as RulesIcon,
  Security as ThreatIcon,
  Settings as SettingsIcon,
  Memory as ModelIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

export default function DashboardHome({ stats, logs, getThreatChip, onNavigate, modelStats }) {
  const theme = useTheme();

  const navigationCards = [
    {
      id: 'logs',
      title: 'Security Logs',
      value: stats.totalRequests,
      valueLabel: 'Total Logs',
      icon: <LogsIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.success.main,
      description: 'Review blocked and allowed traffic'
    },
    {
      id: 'adminLogs',
      title: 'Admin Logs',
      icon: <LogsIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.secondary.main,
      description: 'Admin activity tracking',
      value: 'View',
      valueLabel: ''
    },
    {
      id: 'rules',
      title: 'Firewall Rules',
      value: 'Configure',
      icon: <RulesIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.warning.main,
      description: 'Manage security patterns'
    },
    {
      id: 'threats',
      title: 'Threat Intelligence',
      value: stats.topThreats.length,
      valueLabel: 'Total Threat types',
      icon: <ThreatIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.error.main,
      description: 'Analyze attack vectors'
    },
    {
      id: 'model',
      title: 'ML Models',
      value: modelStats?.accuracy ? `${(modelStats.accuracy * 100).toFixed(1)}%` : 'Active',
      icon: <ModelIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.primary.main,
      description: 'Monitor detection engines',
      modelData: modelStats
    },
    {
      id: 'settings',
      title: 'Settings',
      value: 'Configure',
      icon: <SettingsIcon sx={{ fontSize: 32 }} />,
      color: theme.palette.text.secondary,
      description: 'System configuration'
    }
  ];

  const handleCardClick = (sectionId) => {
    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  const renderCard = (card) => (
    <Card 
      elevation={0}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: theme.palette.background.paper,
        height: '100%',
        width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '12px',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
          borderColor: card.color,
        }
      }}
      onClick={() => handleCardClick(card.id)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: '10px', 
            backgroundColor: `${card.color}15`, 
            color: card.color,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {card.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.text.primary, lineHeight: 1.2 }}>
              {card.title}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {card.description}
            </Typography>
          </Box>
          {card.id === 'model' && (
            <Chip 
              size="small" 
              label={card.modelData?.modelStatus === 'active' ? 'Active' : 'Standby'}
              color={card.modelData?.modelStatus === 'active' ? 'success' : 'warning'}
              sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
            />
          )}
        </Box>
        
        <Box>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500, display: 'block' }}>
            {card.valueLabel}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
            {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
          </Typography>
        </Box>

        {card.modelData && card.id === 'model' && (
          <Box sx={{ mt: 2, pt: 2, borderTop: `1px dashed ${theme.palette.divider}` }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                  Predictions
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {card.modelData?.predictions?.toLocaleString() || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                  Threats
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                  {card.modelData?.threatsDetected?.toLocaleString() || 0}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      {navigationCards.map((card) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
          {renderCard(card)}
        </Grid>
      ))}
    </Grid>
  );
}