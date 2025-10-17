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
  Divider
} from '@mui/material';
import { wasteRequestAPI, announcementAPI } from '../services/api';
import RequestForm from '../components/waste/RequestForm';
import AdminDashboard from '../components/admin/AdminDashboard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              My Waste Requests
              <Button 
                variant="contained" 
                sx={{ float: 'right' }}
                onClick={() => setShowRequestForm(true)}
              >
                New Request
              </Button>
            </Typography>
            <List>
              {requests.map((request) => (
                <ListItem key={request._id}>
                  <ListItemText
                    primary={`Waste Type: ${request.wasteType}`}
                    secondary={`Status: ${request.status} | Pickup Date: ${new Date(request.pickupDate).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Announcements
            </Typography>
            <List>
              {announcements.map((announcement) => (
                <ListItem key={announcement._id}>
                  <ListItemText
                    primary={announcement.title}
                    secondary={announcement.content}
                  />
                  <Divider />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      <RequestForm 
        open={showRequestForm} 
        onClose={() => setShowRequestForm(false)}
        onSubmitSuccess={() => {
          setShowRequestForm(false);
          fetchRequests();
        }}
      />
    </Container>
  );
};

export default Dashboard;