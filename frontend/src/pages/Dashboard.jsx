// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  useTheme,
  alpha,
  styled,
  keyframes
} from '@mui/material';
import { 
  Add as AddIcon,
  Recycling as RecyclingIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Announcement as AnnouncementIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { wasteRequestAPI, announcementAPI } from '../services/api';
import RequestForm from '../components/waste/RequestForm';
import AdminDashboard from '../components/admin/AdminDashboard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Styled components and animations
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  animation: `${slideIn} 0.6s ease-out`,
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
  color: 'white',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)'
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
}));

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);

  // Mock household data
  const householdStats = {
    totalRequests: 3,
    completedRequests: 12,
    recyclingRate: 78,
    monthlySavings: 1250,
    environmentalImpact: {
      co2Saved: 45,
      treesSaved: 3,
      plasticBottlesRecycled: 89
    }
  };

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  useEffect(() => {
    fetchRequests();
    fetchAnnouncements();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await wasteRequestAPI.getAll();
      console.log('Waste requests response:', response);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error.response?.data || error.message);
      toast.error(`Failed to fetch requests: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementAPI.getAll();
      console.log('Announcements response:', response);
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error.response?.data || error.message);
      toast.error(`Failed to fetch announcements: ${error.response?.data?.message || error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon />;
      case 'in-progress': return <TrendingUpIcon />;
      case 'pending': return <PendingIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const getWasteTypeIcon = (wasteType) => {
    switch (wasteType?.toLowerCase()) {
      case 'glass': return '🪟';
      case 'plastic': return '🥤';
      case 'metal': return '🔩';
      case 'organic': return '🍃';
      case 'paper': return '📄';
      default: return <RecyclingIcon />;
    }
  };

  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{
              bgcolor: 'primary.main',
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              width: 64,
              height: 64
            }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5
              }}>
                Welcome, {user?.name || 'Householder'}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Manage your waste collection requests and stay updated with announcements
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* My Waste Requests Section */}
          <Grid item xs={12} lg={6}>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 4
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{
                      bgcolor: 'primary.main',
                      background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)'
                    }}>
                      <RecyclingIcon />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              My Waste Requests
                    </Typography>
                  </Box>
                  <GradientButton
                    startIcon={<AddIcon />}
                onClick={() => setShowRequestForm(true)}
              >
                New Request
                  </GradientButton>
                </Box>

                {requests.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Avatar sx={{
                      bgcolor: 'grey.100',
                      mx: 'auto',
                      mb: 2,
                      width: 80,
                      height: 80
                    }}>
                      <RecyclingIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No waste requests yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create your first waste collection request to get started
            </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
              {requests.map((request) => (
                      <Grid item xs={12} sm={6} md={4} key={request._id}>
                        <Card sx={{
                          borderRadius: '16px',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                          }
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Box sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px'
                              }}>
                                {getWasteTypeIcon(request.wasteType)}
                              </Box>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {request.wasteType}
                                </Typography>
                                <Chip
                                  label={request.status}
                                  size="small"
                                  color={getStatusColor(request.status)}
                                  icon={getStatusIcon(request.status)}
                                  sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                                />
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <ScheduleIcon fontSize="small" />
                              {new Date(request.pickupDate).toLocaleDateString()}
                            </Typography>
                            {request.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                                {request.description}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Household Stats & Tips Section */}
          <Grid item xs={12} lg={6}>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Avatar sx={{
                    bgcolor: 'info.main',
                    background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)'
                  }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Household Stats
                  </Typography>
                </Box>

                {/* Simplified Stats - Horizontal Layout */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {/* Recycling Rate */}
                  <Box sx={{
                    flex: 1,
                    p: 2,
                    width: '435px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32, mb: 1 }}>
                        <RecyclingIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
                        {householdStats.recyclingRate}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        Recycling
                      </Typography>
                    </Box>
                  </Box>

                  {/* Monthly Savings */}
                  <Box sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #FFF3E0 0%, #FFF8E1 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32, mb: 1 }}>
                        💰
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
                        LKR {householdStats.monthlySavings.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        Savings
                      </Typography>
                    </Box>
                  </Box>

                  {/* Environmental Impact */}
                  <Box sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #E3F2FD 0%, #E1F5FE 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32, mb: 1 }}>
                        🌱
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
                        Impact
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {householdStats.environmentalImpact.co2Saved}kg CO₂
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Announcements Section - Full Width Below */}
          <Grid item xs={12}>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Avatar sx={{
                    bgcolor: 'secondary.main',
                    background: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)'
                  }}>
                    <AnnouncementIcon />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Announcements
            </Typography>
                </Box>

                {announcements.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Avatar sx={{
                      bgcolor: 'grey.100',
                      mx: 'auto',
                      mb: 2,
                      width: 60,
                      height: 60
                    }}>
                      <AnnouncementIcon sx={{ fontSize: 30, color: 'grey.500' }} />
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      No announcements at the moment
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {announcements.map((announcement) => (
                      <Card key={announcement._id} sx={{
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                        }
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            mb: 2,
                            color: 'text.primary'
                          }}>
                            {announcement.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{
                            lineHeight: 1.6,
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {announcement.content}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(announcement.date).toLocaleDateString()}
                            </Typography>
                            <Chip
                              label={announcement.priority || 'medium'}
                              size="small"
                              color={announcement.priority === 'high' ? 'error' : announcement.priority === 'low' ? 'info' : 'warning'}
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>

      <RequestForm 
        open={showRequestForm} 
        onClose={() => setShowRequestForm(false)}
        onSubmitSuccess={() => {
          setShowRequestForm(false);
          fetchRequests();
        }}
      />
    </Box>
  );
};

export default Dashboard;