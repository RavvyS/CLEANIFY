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
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import RouteIcon from '@mui/icons-material/Route';
import GroupIcon from '@mui/icons-material/Group';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { wasteRequestAPI, announcementAPI } from '@/services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    activeCollectors: 0,
    activeRoutes: 0
  });

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
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">{stats.totalRequests}</Typography>
            <Typography variant="body2" color="text.secondary">Total Requests</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">{stats.pendingRequests}</Typography>
            <Typography variant="body2" color="text.secondary">Pending Requests</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">{stats.activeCollectors}</Typography>
            <Typography variant="body2" color="text.secondary">Active Collectors</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">{stats.activeRoutes}</Typography>
            <Typography variant="body2" color="text.secondary">Active Routes</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Management Cards */}
      <Grid container spacing={3}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography gutterBottom variant="h6" component="h2" align="center">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  fullWidth 
                  variant="contained" 
                  onClick={card.action}
                >
                  {card.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;