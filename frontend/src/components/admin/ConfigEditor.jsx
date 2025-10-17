import { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Paper,
    Typography,
    Alert,
    IconButton,
    useTheme,
    alpha,
    styled,
    Divider,
    Avatar,
    Card,
    CardContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import RecyclingIcon from '@mui/icons-material/Recycling';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SettingsIcon from '@mui/icons-material/Settings';
import { toast } from 'react-toastify';

const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
}));

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

const StyledButton = styled(Button)(({ theme, variant = 'primary' }) => ({
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '12px 24px',
    transition: 'all 0.3s ease',
    ...(variant === 'primary' && {
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        color: 'white',
        boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
        '&:hover': {
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)'
        }
    }),
    ...(variant === 'secondary' && {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
        border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
        }
    })
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.12)'
    }
}));

const WASTE_TYPES = ['general', 'recyclable', 'e-waste', 'organic'];
const PICKUP_FREQUENCIES = ['daily', 'weekly', 'bi-weekly', 'monthly'];
const PRICING_MODELS = ['flat', 'weight-based'];

const ConfigEditor = ({ initialConfig, onSubmit, loading }) => {
    const theme = useTheme();
    const [config, setConfig] = useState({
        cityId: '',
        cityName: '',
        wasteTypes: [],
        pricingModel: 'weight-based',
        baseRate: 0,
        recyclingCredit: 0,
        pickupFrequency: {},
        version: 1,
        isActive: true
    });
    const [zones, setZones] = useState([]);
    const [newZone, setNewZone] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialConfig) {
            setConfig(initialConfig);
            setZones(Object.keys(initialConfig.pickupFrequency || {}));
        }
    }, [initialConfig]);

    const validateForm = () => {
        const newErrors = {};

        if (!config.cityName) newErrors.cityName = 'City name is required';
        if (!config.cityId) newErrors.cityId = 'City ID is required';
        if (config.wasteTypes.length === 0) newErrors.wasteTypes = 'At least one waste type is required';
        if (config.baseRate < 0) newErrors.baseRate = 'Base rate cannot be negative';
        if (config.recyclingCredit < 0) newErrors.recyclingCredit = 'Recycling credit cannot be negative';
        if (zones.length === 0) newErrors.zones = 'At least one zone is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Convert zones and frequencies to pickupFrequency map
            const pickupFrequency = zones.reduce((acc, zone) => {
                acc[zone] = config.pickupFrequency[zone] || 'weekly';
                return acc;
            }, {});

            onSubmit({ ...config, pickupFrequency });
        }
    };

    const handleAddZone = () => {
        if (newZone && !zones.includes(newZone)) {
            setZones([...zones, newZone]);
            setNewZone('');
        }
    };

    const handleRemoveZone = (zoneToRemove) => {
        setZones(zones.filter(zone => zone !== zoneToRemove));
    };

    const handleFrequencyChange = (zone, frequency) => {
        setConfig(prev => ({
            ...prev,
            pickupFrequency: {
                ...prev.pickupFrequency,
                [zone]: frequency
            }
        }));
    };

    return (
        <StyledPaper sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 4,
                pb: 2,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}>
                <Avatar sx={{ 
                    bgcolor: 'primary.main',
                    background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                    width: 56,
                    height: 56
                }}>
                    <SettingsIcon fontSize="large" />
                </Avatar>
                <Box>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 0.5
                    }}>
                        {initialConfig ? 'Edit City Configuration' : 'Create New City Configuration'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {initialConfig ? 'Update the city configuration settings' : 'Set up waste management configuration for a new city'}
                    </Typography>
                </Box>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    {/* Basic Information Section */}
                    <Grid item xs={12}>
                        <StyledCard>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <LocationCityIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Basic Information
                                    </Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <StyledTextField
                                            fullWidth
                                            label="City ID"
                                            value={config.cityId}
                                            onChange={(e) => setConfig({ ...config, cityId: e.target.value })}
                                            error={!!errors.cityId}
                                            helperText={errors.cityId}
                                            disabled={initialConfig}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <StyledTextField
                                            fullWidth
                                            label="City Name"
                                            value={config.cityName}
                                            onChange={(e) => setConfig({ ...config, cityName: e.target.value })}
                                            error={!!errors.cityName}
                                            helperText={errors.cityName}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </StyledCard>
                    </Grid>

                    {/* Waste Types Section */}
                    <Grid item xs={12}>
                        <StyledCard>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <RecyclingIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Waste Types
                                    </Typography>
                                </Box>
                                <StyledFormControl fullWidth error={!!errors.wasteTypes}>
                                    <InputLabel>Select Waste Types</InputLabel>
                                    <Select
                                        multiple
                                        value={config.wasteTypes}
                                        onChange={(e) => setConfig({ ...config, wasteTypes: e.target.value })}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip 
                                                        key={value} 
                                                        label={value}
                                                        sx={{
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                            color: theme.palette.primary.main,
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {WASTE_TYPES.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.wasteTypes && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                            {errors.wasteTypes}
                                        </Typography>
                                    )}
                                </StyledFormControl>
                            </CardContent>
                        </StyledCard>
                    </Grid>

                    {/* Pricing Section */}
                    <Grid item xs={12}>
                        <StyledCard>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <AttachMoneyIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Pricing Configuration
                                    </Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={4}>
                                        <StyledFormControl fullWidth>
                                            <InputLabel>Pricing Model</InputLabel>
                                            <Select
                                                value={config.pricingModel}
                                                onChange={(e) => setConfig({ ...config, pricingModel: e.target.value })}
                                            >
                                                {PRICING_MODELS.map((model) => (
                                                    <MenuItem key={model} value={model}>
                                                        {model}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </StyledFormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <StyledTextField
                                            fullWidth
                                            type="number"
                                            label="Base Rate (LKR)"
                                            value={config.baseRate}
                                            onChange={(e) => setConfig({ ...config, baseRate: Number(e.target.value) })}
                                            error={!!errors.baseRate}
                                            helperText={errors.baseRate}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <StyledTextField
                                            fullWidth
                                            type="number"
                                            label="Recycling Credit (LKR)"
                                            value={config.recyclingCredit}
                                            onChange={(e) => setConfig({ ...config, recyclingCredit: Number(e.target.value) })}
                                            error={!!errors.recyclingCredit}
                                            helperText={errors.recyclingCredit}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </StyledCard>
                    </Grid>

                    {/* Zones Section */}
                    <Grid item xs={12}>
                        <StyledCard>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <ScheduleIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Zones and Pickup Frequency
                                    </Typography>
                                </Box>
                                
                                {errors.zones && (
                                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                        {errors.zones}
                                    </Alert>
                                )}
                                
                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <StyledTextField
                                        label="New Zone Name"
                                        value={newZone}
                                        onChange={(e) => setNewZone(e.target.value)}
                                        sx={{ flexGrow: 1 }}
                                        placeholder="Enter zone name (e.g., North, South, Downtown)"
                                    />
                                    <StyledButton
                                        variant="secondary"
                                        onClick={handleAddZone}
                                        startIcon={<AddIcon />}
                                        sx={{ minWidth: 140 }}
                                    >
                                        Add Zone
                                    </StyledButton>
                                </Box>

                                {zones.length > 0 && (
                                    <Grid container spacing={2}>
                                        {zones.map((zone) => (
                                            <Grid item xs={12} sm={6} key={zone}>
                                                <Paper sx={{ 
                                                    p: 3, 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 2,
                                                    borderRadius: '12px',
                                                    border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                                    }
                                                }}>
                                                    <Typography sx={{ 
                                                        flexGrow: 1, 
                                                        fontWeight: 600,
                                                        color: 'primary.main'
                                                    }}>
                                                        {zone}
                                                    </Typography>
                                                    <StyledFormControl sx={{ minWidth: 140 }}>
                                                        <InputLabel>Frequency</InputLabel>
                                                        <Select
                                                            size="small"
                                                            value={config.pickupFrequency[zone] || 'weekly'}
                                                            onChange={(e) => handleFrequencyChange(zone, e.target.value)}
                                                        >
                                                            {PICKUP_FREQUENCIES.map((freq) => (
                                                                <MenuItem key={freq} value={freq}>
                                                                    {freq}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </StyledFormControl>
                                                    <IconButton 
                                                        onClick={() => handleRemoveZone(zone)} 
                                                        sx={{
                                                            color: 'error.main',
                                                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                                                            '&:hover': {
                                                                backgroundColor: alpha(theme.palette.error.main, 0.2),
                                                                transform: 'scale(1.1)'
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </CardContent>
                        </StyledCard>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            justifyContent: 'center',
                            pt: 2,
                            borderTop: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
                        }}>
                            <StyledButton
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                sx={{ minWidth: 200 }}
                            >
                                {loading ? 'Saving...' : (initialConfig ? 'Update Configuration' : 'Create Configuration')}
                            </StyledButton>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </StyledPaper>
    );
};

export default ConfigEditor;