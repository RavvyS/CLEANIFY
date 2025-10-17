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
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import RouteIcon from '@mui/icons-material/Route';
import GroupIcon from '@mui/icons-material/Group';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { wasteRequestAPI, announcementAPI } from '../../services/api';
import ActivityFeed from './ActivityFeed';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  }
}));

const StatBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[4],
  }
}));

const AdminDashboard = () => {
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
      icon: <LocationCityIcon sx={{ fontSize: 40 }} />,
      description: 'Manage city zones, waste types, and collection schedules',
      action: () => navigate('/admin/city-configuration'),
      buttonText: 'Manage Cities'
    },
    {
      title: 'Route Management',
      icon: <RouteIcon sx={{ fontSize: 40 }} />,
      description: 'Plan and optimize collection routes',
      action: () => navigate('/admin/routes'),
      buttonText: 'Manage Routes'
    },
    {
      title: 'User Management',
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      description: 'Manage collectors, dispatchers, and householders',
      action: () => navigate('/admin/users'),
      buttonText: 'Manage Users'
    },
    {
      title: 'Announcements',
      icon: <AnnouncementIcon sx={{ fontSize: 40 }} />,
      description: 'Create and manage system announcements',
      action: () => navigate('/admin/announcements'),
      buttonText: 'Manage Announcements'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatBox elevation={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stats.totalRequests}</Typography>
              <Chip 
                label="+12% ↑" 
                size="small" 
                color="success"
                icon={<TrendingUpIcon />} 
              />
            </Box>
            <Typography variant="body2" color="text.secondary">Total Requests</Typography>
            <LinearProgress 
              variant="determinate" 
              value={85} 
              sx={{ mt: 2, height: 6, borderRadius: 3 }} 
            />
          </StatBox>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatBox elevation={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stats.pendingRequests}</Typography>
              <Chip 
                label="Urgent" 
                size="small" 
                color="warning"
                icon={<WarningIcon />} 
              />
            </Box>
            <Typography variant="body2" color="text.secondary">Pending Requests</Typography>
            <LinearProgress 
              variant="determinate" 
              value={25} 
              color="warning"
              sx={{ mt: 2, height: 6, borderRadius: 3 }} 
            />
          </StatBox>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatBox elevation={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stats.recyclingRate}%</Typography>
              <Chip 
                label="+5% ↑" 
                size="small" 
                color="success"
                icon={<TrendingUpIcon />} 
              />
            </Box>
            <Typography variant="body2" color="text.secondary">Recycling Rate</Typography>
            <LinearProgress 
              variant="determinate" 
              value={stats.recyclingRate} 
              color="success"
              sx={{ mt: 2, height: 6, borderRadius: 3 }} 
            />
          </StatBox>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatBox elevation={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stats.binFillRate}%</Typography>
              <Chip 
                label="Normal" 
                size="small" 
                color="info"
                icon={<CheckCircleIcon />} 
              />
            </Box>
            <Typography variant="body2" color="text.secondary">Average Bin Fill Rate</Typography>
            <LinearProgress 
              variant="determinate" 
              value={stats.binFillRate} 
              color="primary"
              sx={{ mt: 2, height: 6, borderRadius: 3 }} 
            />
          </StatBox>
        </Grid>
      </Grid>

      {/* Management Cards */}
      <Grid container spacing={3}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StyledCard elevation={3}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2 
                }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: '50%', 
                    backgroundColor: 'primary.light',
                    display: 'flex'
                  }}>
                    {card.icon}
                  </Box>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Typography gutterBottom variant="h6" component="h2">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  size="large" 
                  fullWidth 
                  variant="contained" 
                  onClick={card.action}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    py: 1
                  }}
                >
                  {card.buttonText}
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Activity Feed and Insights */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <ActivityFeed activities={recentActivity} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Insights & Recommendations
            </Typography>
            <List>
              {insights.map((insight, index) => (
                <ListItem key={index} divider={index < insights.length - 1}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {insight.title}
                        <Chip
                          size="small"
                          label={insight.impact}
                          color={
                            insight.impact === 'high' ? 'error' :
                            insight.impact === 'medium' ? 'warning' : 'success'
                          }
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {insight.description}
                        </Typography>
                        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                          Recommendation: {insight.recommendation}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;