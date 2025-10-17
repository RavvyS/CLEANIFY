// src/components/waste/RequestForm.jsx
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box
} from '@mui/material';
import { wasteRequestAPI } from '../../services/api';
import { toast } from 'react-toastify';

const wasteTypes = ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'Electronic'];

const RequestForm = ({ open, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    wasteType: '',
    quantity: '',
    pickupDate: '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await wasteRequestAPI.create(formData);
      toast.success('Waste request created successfully');
      onSubmitSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create request');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Waste Request</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Waste Type"
            value={formData.wasteType}
            onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
            required
          >
            {wasteTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Quantity (kg)"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Pickup Date"
            type="datetime-local"
            value={formData.pickupDate}
            onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Pickup Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestForm;