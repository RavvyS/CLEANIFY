import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    IconButton,
    useTheme,
    alpha,
    styled
} from '@mui/material';
import {
    Route as RouteIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    LocalShipping as TruckIcon,
    Schedule as ScheduleIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import RouteForm from '../components/routes/routeForm';
import api from '../services/api';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
    }
}));

const RouteManagement = () => {
    const theme = useTheme();
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/routes');
            setRoutes(response.data);
        } catch (error) {
            console.error('Error fetching routes:', error);
            toast.error('Failed to fetch routes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoute = () => {
        setEditingRoute(null);
        setIsDialogOpen(true);
    };

    const handleEditRoute = (route) => {
        setEditingRoute(route);
        setIsDialogOpen(true);
    };

    const handleDeleteRoute = async (routeId) => {
        if (window.confirm('Are you sure you want to delete this route?')) {
            try {
                await api.delete(`/routes/${routeId}`);
                toast.success('Route deleted successfully');
                fetchRoutes();
            } catch (error) {
                console.error('Error deleting route:', error);
                toast.error('Failed to delete route');
            }
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setEditingRoute(null);
        fetchRoutes(); // Refresh routes after form submission
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled':
                return 'primary';
            case 'in-progress':
                return 'warning';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
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
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ 
                            bgcolor: 'primary.main',
                            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                            width: 64,
                            height: 64
                        }}>
                            <RouteIcon fontSize="large" />
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
                                Route Management
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Manage waste collection routes and schedules
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            {routes.length} routes configured
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreateRoute}
                            sx={{
                                background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                                borderRadius: '12px',
                                px: 3,
                                py: 1.5,
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)'
                                }
                            }}
                        >
                            Create New Route
                        </Button>
                    </Box>
                </Box>

                {/* Routes Grid */}
                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            Loading routes...
                        </Typography>
                    </Box>
                ) : routes.length === 0 ? (
                    <Paper sx={{ 
                        p: 8, 
                        textAlign: 'center',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}>
                        <Avatar sx={{ 
                            bgcolor: 'primary.main', 
                            mx: 'auto', 
                            mb: 3,
                            width: 80,
                            height: 80,
                            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)'
                        }}>
                            <RouteIcon fontSize="large" />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                            No Routes Found
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Get started by creating your first waste collection route
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreateRoute}
                            sx={{
                                background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                                borderRadius: '12px',
                                px: 4,
                                py: 1.5,
                                fontWeight: 600
                            }}
                        >
                            Create First Route
                        </Button>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {routes.map((route) => (
                            <Grid item xs={12} sm={6} lg={4} key={route._id}>
                                <StyledCard>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Avatar sx={{ 
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: 'primary.main'
                                            }}>
                                                <TruckIcon />
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {route.truck || 'Unassigned Truck'}
                                                </Typography>
                                                <Chip
                                                    label={route.status || 'scheduled'}
                                                    size="small"
                                                    color={getStatusColor(route.status)}
                                                    sx={{ fontWeight: 500 }}
                                                />
                                            </Box>
                                            <Box>
                                                <IconButton
                                                    onClick={() => handleEditRoute(route)}
                                                    sx={{
                                                        color: 'primary.main',
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.primary.main,
                                                            color: 'white'
                                                        }
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDeleteRoute(route._id)}
                                                    sx={{
                                                        color: 'error.main',
                                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                                        ml: 1,
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.error.main,
                                                            color: 'white'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <ScheduleIcon color="primary" fontSize="small" />
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(route.date)}
                                            </Typography>
                                        </Box>

                                        {route.zones && route.zones.length > 0 && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <LocationIcon color="primary" fontSize="small" />
                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                    {route.zones.slice(0, 3).map((zone, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={zone}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: alpha(theme.palette.info.main, 0.1),
                                                                color: theme.palette.info.main,
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    ))}
                                                    {route.zones.length > 3 && (
                                                        <Chip
                                                            label={`+${route.zones.length - 3} more`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontWeight: 500 }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        )}

                                        {route.description && (
                                            <Typography variant="body2" color="text.secondary">
                                                {route.description}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Create/Edit Route Dialog */}
                <Dialog 
                    open={isDialogOpen} 
                    onClose={handleDialogClose}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '20px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }
                    }}
                >
                    <DialogTitle sx={{ 
                        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                        color: 'white',
                        fontWeight: 600
                    }}>
                        {editingRoute ? 'Edit Route' : 'Create New Route'}
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        <RouteForm 
                            initialRoute={editingRoute}
                            onSuccess={handleDialogClose}
                        />
                    </DialogContent>
                </Dialog>
            </Container>
        </Box>
    );
};

export default RouteManagement;
