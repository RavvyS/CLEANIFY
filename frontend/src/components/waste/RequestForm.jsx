import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Avatar,
  useTheme,
  alpha,
  styled,
  keyframes,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Recycling as RecyclingIcon,
  Scale as ScaleIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Add as AddIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { wasteRequestAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const wasteTypes = ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'Electronic'];

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
    animation: `${slideIn} 0.4s ease-out`,
    overflow: 'hidden'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.1)'
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    color: theme.palette.text.secondary
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
  color: 'white',
  borderRadius: '16px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '14px 32px',
  fontSize: '1rem',
  boxShadow: '0 6px 20px rgba(46, 125, 50, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(46, 125, 50, 0.4)'
  }
}));

const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '14px 32px',
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  border: `2px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.text.secondary, 0.1),
    borderColor: theme.palette.text.secondary,
    transform: 'translateY(-2px)'
  }
}));

const RequestForm = ({ open, onClose, onSubmitSuccess }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    wasteType: '',
    quantity: '',
    pickupDate: '',
    address: '',
    userId: user?._id
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await wasteRequestAPI.create(formData);
      toast.success('Waste request created successfully! 🎉');
      onSubmitSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const getWasteTypeIcon = (wasteType) => {
    switch (wasteType?.toLowerCase()) {
      case 'glass': return '🪟';
      case 'plastic': return '🥤';
      case 'metal': return '🔩';
      case 'organic': return '🍃';
      case 'paper': return '📄';
      case 'electronic': return '📱';
      default: return '♻️';
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        color: 'white',
        fontWeight: 600,
        py: 3,
        px: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            width: 48,
            height: 48
          }}>
            <AddIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            New Waste Request
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ 
        p: 0,
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
      }}>
        <Box sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Waste Type */}
              <Card sx={{ 
                borderRadius: '20px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                background: 'white'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{
                      bgcolor: 'primary.main',
                      background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                      width: 40,
                      height: 40
                    }}>
                      <RecyclingIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Waste Type
                    </Typography>
                  </Box>
                  <StyledTextField
                    select
                    fullWidth
                    label="Select Waste Type"
                    value={formData.wasteType}
                    onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                    required
                    InputProps={{
                      startAdornment: formData.wasteType && (
                        <InputAdornment position="start">
                          <Typography sx={{ fontSize: '1.2rem' }}>
                            {getWasteTypeIcon(formData.wasteType)}
                          </Typography>
                        </InputAdornment>
                      )
                    }}
                  >
                    {wasteTypes.map((type) => (
                      <MenuItem key={type} value={type} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '1.2rem', mr: 1 }}>{getWasteTypeIcon(type)}</Typography>
                        {type}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </CardContent>
              </Card>

              {/* Quantity */}
              <Card sx={{ 
                borderRadius: '20px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                background: 'white'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{
                      bgcolor: 'warning.main',
                      width: 40,
                      height: 40
                    }}>
                      <ScaleIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                      Quantity
                    </Typography>
                  </Box>
                  <StyledTextField
                    fullWidth
                    label="Weight"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>
                    }}
                  />
                </CardContent>
              </Card>

              {/* Pickup Date */}
              <Card sx={{ 
                borderRadius: '20px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                background: 'white'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{
                      bgcolor: 'info.main',
                      width: 40,
                      height: 40
                    }}>
                      <ScheduleIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main' }}>
                      Pickup Schedule
                    </Typography>
                  </Box>
                  <StyledTextField
                    fullWidth
                    label="Pickup Date & Time"
                    type="datetime-local"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><CalendarIcon /></InputAdornment>
                    }}
                  />
                </CardContent>
              </Card>

              {/* Address */}
              <Card sx={{ 
                borderRadius: '20px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                background: 'white'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{
                      bgcolor: 'secondary.main',
                      width: 40,
                      height: 40
                    }}>
                      <LocationIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                      Pickup Location
                    </Typography>
                  </Box>
                  <StyledTextField
                    fullWidth
                    label="Pickup Address"
                    multiline
                    rows={4}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    placeholder="Enter your complete address for waste pickup"
                  />
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 4, 
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
        justifyContent: 'center',
        gap: 2
      }}>
        <CancelButton onClick={onClose}>
          Cancel
        </CancelButton>
        <GradientButton 
          onClick={handleSubmit}
          disabled={loading}
          startIcon={<AddIcon />}
        >
          {loading ? 'Creating Request...' : 'Submit Request'}
        </GradientButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default RequestForm;