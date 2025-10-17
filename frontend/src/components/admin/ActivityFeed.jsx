import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Chip,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BuildIcon from '@mui/icons-material/Build';
import WarningIcon from '@mui/icons-material/Warning';
import RouteIcon from '@mui/icons-material/Route';

const ActivityItem = styled(ListItem)(({ theme }) => ({
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const getActivityIcon = (type) => {
  switch (type) {
    case 'collection':
      return <LocalShippingIcon color="primary" />;
    case 'maintenance':
      return <BuildIcon color="warning" />;
    case 'alert':
      return <WarningIcon color="error" />;
    case 'route':
      return <RouteIcon color="info" />;
    default:
      return null;
  }
};

const getStatusChip = (status) => {
  const statusColors = {
    success: 'success',
    pending: 'warning',
    warning: 'error',
    info: 'info'
  };

  return (
    <Chip
      size="small"
      color={statusColors[status]}
      label={status.toUpperCase()}
      sx={{ ml: 1 }}
    />
  );
};

const ActivityFeed = ({ activities }) => {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      <List>
        {activities.map((activity) => (
          <ActivityItem key={activity.id} divider>
            <ListItemIcon>
              {getActivityIcon(activity.type)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" component="span">
                    {activity.description}
                  </Typography>
                  {getStatusChip(activity.status)}
                </Box>
              }
              secondary={new Date(activity.timestamp).toLocaleString()}
            />
          </ActivityItem>
        ))}
      </List>
    </Paper>
  );
};

export default ActivityFeed;