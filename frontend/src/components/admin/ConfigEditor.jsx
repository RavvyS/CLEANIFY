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
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';

const WASTE_TYPES = ['general', 'recyclable', 'e-waste', 'organic'];
const PICKUP_FREQUENCIES = ['daily', 'weekly', 'bi-weekly', 'monthly'];
const PRICING_MODELS = ['flat', 'weight-based'];

const ConfigEditor = ({ initialConfig, onSubmit, loading }) => {
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
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                City Configuration
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                    {/* Basic Information */}
                    <Grid item xs={12} sm={6}>
                        <TextField
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
                        <TextField
                            fullWidth
                            label="City Name"
                            value={config.cityName}
                            onChange={(e) => setConfig({ ...config, cityName: e.target.value })}
                            error={!!errors.cityName}
                            helperText={errors.cityName}
                        />
                    </Grid>

                    {/* Waste Types */}
                    <Grid item xs={12}>
                        <FormControl fullWidth error={!!errors.wasteTypes}>
                            <InputLabel>Waste Types</InputLabel>
                            <Select
                                multiple
                                value={config.wasteTypes}
                                onChange={(e) => setConfig({ ...config, wasteTypes: e.target.value })}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
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
                        </FormControl>
                    </Grid>

                    {/* Pricing */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
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
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
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
                        <TextField
                            fullWidth
                            type="number"
                            label="Recycling Credit (LKR)"
                            value={config.recyclingCredit}
                            onChange={(e) => setConfig({ ...config, recyclingCredit: Number(e.target.value) })}
                            error={!!errors.recyclingCredit}
                            helperText={errors.recyclingCredit}
                        />
                    </Grid>

                    {/* Zones */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Zones and Pickup Frequency
                        </Typography>
                        {errors.zones && <Alert severity="error">{errors.zones}</Alert>}
                        
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                label="New Zone"
                                value={newZone}
                                onChange={(e) => setNewZone(e.target.value)}
                                sx={{ flexGrow: 1 }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleAddZone}
                                startIcon={<AddIcon />}
                            >
                                Add Zone
                            </Button>
                        </Box>

                        <Grid container spacing={2}>
                            {zones.map((zone) => (
                                <Grid item xs={12} sm={6} key={zone}>
                                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography sx={{ flexGrow: 1 }}>{zone}</Typography>
                                        <FormControl sx={{ minWidth: 120 }}>
                                            <Select
                                                size="small"
                                                value={config.pickupFrequency[zone] || 'weekly'}
                                                onChange={(e) => handleFrequencyChange(zone, e.target.value)}
                                            >
                                                {PICKUP_FREQUENCIES.map((freq) => (
                                                    <MenuItem key={freq} value={freq}>{freq}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <IconButton onClick={() => handleRemoveZone(zone)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{ mt: 2 }}
                        >
                            {loading ? 'Saving...' : (initialConfig ? 'Update Configuration' : 'Create Configuration')}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default ConfigEditor;