import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Box,
  Typography,
  useTheme,
  alpha,
  styled
} from "@mui/material";
import { LocalShipping, Schedule, LocationOn } from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.1)'
    }
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.1)'
    }
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
  color: 'white',
  boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)'
  }
}));

const RouteForm = ({ initialRoute, onSuccess }) => {
  const theme = useTheme();
  const [truck, setTruck] = useState("");
  const [zones, setZones] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialRoute) {
      setTruck(initialRoute.truck || "");
      setZones(initialRoute.zones ? initialRoute.zones.join(", ") : "");
      setDate(initialRoute.date || "");
      setDescription(initialRoute.description || "");
    }
  }, [initialRoute]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const routeData = {
        truck,
        zones: zones.split(",").map((zone) => zone.trim()).filter(zone => zone),
        date,
        description,
        status: 'scheduled'
      };

      if (initialRoute) {
        await api.put(`/routes/${initialRoute._id}`, routeData);
        toast.success("Route updated successfully!");
      } else {
        await api.post("/routes", routeData);
        toast.success("Route created successfully!");
      }

      setTruck("");
      setZones("");
      setDate("");
      setDescription("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error(initialRoute ? "Failed to update route." : "Failed to create route.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={4}>
        {/* First Row - Truck and Date */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            mb: 3,
            pb: 1,
            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}>
            <LocalShipping color="primary" fontSize="medium" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Truck Assignment
            </Typography>
          </Box>
          <StyledFormControl fullWidth>
            <InputLabel>Truck</InputLabel>
            <Select 
              value={truck} 
              onChange={(e) => setTruck(e.target.value)}
              label="Truck"
            >
              <MenuItem value={"Truck A"}>Truck A</MenuItem>
              <MenuItem value={"Truck B"}>Truck B</MenuItem>
              <MenuItem value={"Truck C"}>Truck C</MenuItem>
              <MenuItem value={"Truck D"}>Truck D</MenuItem>
              <MenuItem value={"Truck E"}>Truck E</MenuItem>
            </Select>
          </StyledFormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            mb: 3,
            pb: 1,
            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}>
            <Schedule color="primary" fontSize="medium" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Schedule Date
            </Typography>
          </Box>
          <StyledTextField
            label="Collection Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        {/* Second Row - Zones */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            mb: 3,
            pb: 1,
            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}>
            <LocationOn color="primary" fontSize="medium" />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Collection Zones
            </Typography>
          </Box>
          <StyledTextField
            label="Zones (comma-separated)"
            fullWidth
            value={zones}
            onChange={(e) => setZones(e.target.value)}
            placeholder="e.g., North Zone, Downtown, Residential Area A"
            multiline
            rows={3}
            sx={{ mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Separate multiple zones with commas
          </Typography>
        </Grid>

        {/* Third Row - Description */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            color: 'primary.main',
            mb: 3,
            pb: 1,
            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            Description (Optional)
          </Typography>
          <StyledTextField
            label="Route Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional notes about this route, special instructions, or any other relevant information..."
            multiline
            rows={4}
            sx={{ mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Provide any additional context or special instructions for this route
          </Typography>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            pt: 4,
            mt: 2,
            borderTop: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}>
            <StyledButton 
              type="submit" 
              disabled={loading}
              sx={{ 
                minWidth: 220,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              {loading ? 'Saving...' : (initialRoute ? 'Update Route' : 'Create Route')}
            </StyledButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RouteForm;
