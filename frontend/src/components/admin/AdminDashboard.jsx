import { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
  Avatar,
  Badge,
  useTheme,
  alpha
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RecyclingIcon from '@mui/icons-material/Recycling';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import RouteIcon from '@mui/icons-material/Route';
import GroupIcon from '@mui/icons-material/Group';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { wasteRequestAPI, announcementAPI } from '../../services/api';
import ActivityFeed from './ActivityFeed';

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  height: '320px',
  width: '330px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  animation: `${slideIn} 0.6s ease-out`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(46, 125, 50, 0.2)',
  }
}));

const StatBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '180px',
  width: '280px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${slideIn} 0.6s ease-out`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #2E7D32, #4CAF50)',
  },
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const IconContainer = styled(Box)(({ theme, color = 'primary' }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.2)} 100%)`,
  border: `2px solid ${alpha(theme.palette[color].main, 0.2)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.2)} 0%, ${alpha(theme.palette[color].main, 0.3)} 100%)`,
    transform: 'scale(1.1)',
    animation: `${pulse} 1s infinite`,
  }
}));

const StatIconContainer = styled(Box)(({ theme, bgcolor }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: bgcolor || `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
  color: 'white',
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
    boxShadow: '0 8px 25px rgba(46, 125, 50, 0.4)',
    transform: 'translateY(-2px)',
  }
}));

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRequests: 245,
    pendingRequests: 18,
    activeCollectors: 12,
    activeRoutes: 8,
    recyclingRate: 42,
    binFillRate: 68
  });

  // Sample recent activity data
  const recentActivity = [
    {
      id: 1,
      type: 'collection',
      description: 'Zone A collection completed',
      status: 'success',
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'route',
      description: 'New route created for Zone B',
      status: 'info',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      type: 'alert',
      description: 'Bin overflow reported at Beach Road',
      status: 'warning',
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: 4,
      type: 'maintenance',
      description: 'Truck TRK-001 scheduled for maintenance',
      status: 'pending',
      timestamp: new Date(Date.now() - 10800000)
    }
  ];

  // Sample insights data
  const insights = [
    {
      title: 'Recycling Rate Increase',
      description: 'Zone B shows 15% increase in recycling participation',
      recommendation: 'Expand awareness programs to other zones',
      impact: 'high'
    },
    {
      title: 'Collection Efficiency',
      description: 'Average collection time reduced by 20 minutes',
      recommendation: 'Apply optimized routes to remaining zones',
      impact: 'medium'
    },
    {
      title: 'Bin Maintenance',
      description: '5 bins require immediate attention',
      recommendation: 'Schedule maintenance team for this week',
      impact: 'medium'
    }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const requestsResponse = await wasteRequestAPI.getAll();
      setStats(prev => ({
        ...prev,
        totalRequests: requestsResponse.data.length,
        pendingRequests: requestsResponse.data.filter(r => r.status === 'pending').length
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const dashboardCards = [
    {
      title: 'City Configuration',
      icon: <LocationCityIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />,
      description: 'Manage city zones, waste types, and collection schedules',
      action: () => navigate('/admin/city-configuration'),
      buttonText: 'Manage Cities',
      color: 'primary',
      gradient: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)'
    },
    {
      title: 'Route Management',
      icon: <RouteIcon sx={{ fontSize: 32, color: theme.palette.secondary.main }} />,
      description: 'Plan, optimize, and manage efficient waste collection routes',
      action: () => navigate('/admin/routes'),
      buttonText: 'Manage Routes',
      color: 'secondary',
      gradient: 'linear-gradient(135deg, #00796B 0%, #00BCD4 100%)'
    },
    {
      title: 'User Management',
      icon: <GroupIcon sx={{ fontSize: 32, color: theme.palette.info.main }} />,
      description: 'Manage collectors, dispatchers, and householders',
      action: () => navigate('/admin/users'),
      buttonText: 'Manage Users',
      color: 'info',
      gradient: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)'
    },
    {
      title: 'Announcements',
      icon: <AnnouncementIcon sx={{ fontSize: 32, color: theme.palette.warning.main }} />,
      description: 'Create and manage system announcements',
      action: () => navigate('/admin/announcements'),
      buttonText: 'Manage Announcements',
      color: 'warning',
      gradient: 'linear-gradient(135deg, #F57C00 0%, #FFB74D 100%)'
    }
  ];

  const statCards = [
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: <AssignmentIcon sx={{ fontSize: 28 }} />,
      trend: '+12%',
      trendIcon: <TrendingUpIcon />,
      color: 'success',
      progress: 85,
      bgGradient: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.2) 100%)'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: <WarningIcon sx={{ fontSize: 28 }} />,
      trend: 'Urgent',
      color: 'warning',
      progress: 25,
      bgGradient: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.2) 100%)'
    },
    {
      title: 'Recycling Rate',
      value: `${stats.recyclingRate}%`,
      icon: <RecyclingIcon sx={{ fontSize: 28 }} />,
      trend: '+5%',
      trendIcon: <TrendingUpIcon />,
      color: 'success',
      progress: stats.recyclingRate,
      bgGradient: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.2) 100%)'
    },
    {
      title: 'Bin Fill Rate',
      value: `${stats.binFillRate}%`,
      icon: <LocalShippingIcon sx={{ fontSize: 28 }} />,
      trend: 'Normal',
      color: 'info',
      progress: stats.binFillRate,
      bgGradient: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.2) 100%)'
    }
  ];

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              color: 'primary.main',
              textAlign: 'center',
              mb: 1,
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ textAlign: 'center', opacity: 0.8 }}
          >
            Welcome back! Here's what's happening with your waste management system.
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <StatBox>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StatIconContainer bgcolor={stat.bgGradient}>
                    {stat.icon}
                  </StatIconContainer>
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={stat.trend} 
                    size="small" 
                    color={stat.color}
                    icon={stat.trendIcon}
                    sx={{ fontWeight: 600 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {stat.progress}% of target
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stat.progress} 
                  color={stat.color}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette[stat.color].main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    }
                  }} 
                />
              </StatBox>
            </Grid>
          ))}
        </Grid>

        {/* Management Cards */}
        <Box sx={{ mb: 6, mt: 6 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            mb: 4, 
            color: 'text.primary',
            textAlign: 'center'
          }}>
            Management Modules
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {dashboardCards.map((card, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                <StyledCard>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      mb: 3 
                    }}>
                      <IconContainer color={card.color}>
                        {card.icon}
                      </IconContainer>
                      <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <GradientButton 
                      size="large" 
                      fullWidth 
                      onClick={card.action}
                    >
                      {card.buttonText}
                    </GradientButton>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Activity Feed and Insights */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            mb: 4, 
            color: 'text.primary',
            textAlign: 'center'
          }}>
            System Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <ActivityFeed activities={recentActivity} />
            </Grid>
            <Grid item xs={12} lg={5}>
              <Paper sx={{ 
                p: 3, 
                height: '100%', 
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ 
                    bgcolor: 'primary.main', 
                    mr: 2,
                    background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)'
                  }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Insights & Recommendations
                  </Typography>
                </Box>
                <List sx={{ '& .MuiListItem-root': { px: 0 } }}>
                  {insights.map((insight, index) => (
                    <ListItem key={index} divider={index < insights.length - 1} sx={{ pb: 2, pt: 2 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {insight.title}
                            </Typography>
                            <Chip
                              size="small"
                              label={insight.impact}
                              color={
                                insight.impact === 'high' ? 'error' :
                                insight.impact === 'medium' ? 'warning' : 'success'
                              }
                              sx={{ ml: 1, fontWeight: 600 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {insight.description}
                            </Typography>
                            <Typography variant="body2" color="primary" sx={{ 
                              fontWeight: 500,
                              background: alpha(theme.palette.primary.main, 0.1),
                              padding: 1,
                              borderRadius: 1
                            }}>
                              💡 {insight.recommendation}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;