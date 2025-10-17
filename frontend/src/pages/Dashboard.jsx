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
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchAnnouncements();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await wasteRequestAPI.getAll();
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementAPI.getAll();
      setAnnouncements(response.data);
    } catch (error) {
      toast.error('Failed to fetch announcements');
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