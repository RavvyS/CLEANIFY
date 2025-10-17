import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Typography,
    CircularProgress,
    Alert,
    Container,
    useTheme,
    alpha,
    styled,
    Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { toast } from 'react-toastify';
import ConfigEditor from '../components/admin/ConfigEditor';
import ConfigList from '../components/admin/ConfigList';
import api from '../services/api';

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '12px 24px',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)'
    }
}));

const CityConfiguration = () => {
    const theme = useTheme();
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const fetchConfigs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/configs');
            setConfigs(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load city configurations');
            console.error('Error fetching configs:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    const handleCreate = async (configData) => {
        try {
            const response = await api.post('/configs', configData);
            setConfigs([...configs, response.data]);
            setIsEditorOpen(false);
            toast.success('City configuration created successfully');
        } catch (err) {
            toast.error('Failed to create city configuration');
            console.error('Error creating config:', err);
        }
    };

    const handleUpdate = async (configData) => {
        try {
            // Use the ID-based route for updates to maintain the same record
            const response = await api.put(`/configs/${selectedConfig._id}`, configData);
            // Update the specific config in the list
            setConfigs(configs.map(config => 
                config._id === selectedConfig._id ? response.data : config
            ));
            setIsEditorOpen(false);
            toast.success('City configuration updated successfully');
        } catch (err) {
            toast.error('Failed to update city configuration');
            console.error('Error updating config:', err);
        }
    };

    const handleDelete = async (configId) => {
        if (window.confirm('Are you sure you want to delete this configuration?')) {
            try {
                await api.delete(`/configs/${configId}`);
                setConfigs(configs.filter(config => config._id !== configId));
                toast.success('City configuration deleted successfully');
            } catch (err) {
                toast.error('Failed to delete city configuration');
                console.error('Error deleting config:', err);
            }
        }
    };

    const handleToggleActive = async (configId) => {
        const config = configs.find(c => c._id === configId);
        try {
            const response = await api.patch(`/configs/${configId}`, {
                isActive: !config.isActive
            });
            setConfigs(configs.map(c => 
                c._id === configId ? response.data : c
            ));
            toast.success(`City configuration ${response.data.isActive ? 'activated' : 'deactivated'} successfully`);
        } catch (err) {
            toast.error('Failed to update configuration status');
            console.error('Error toggling config status:', err);
        }
    };

    const handleEdit = (config) => {
        setSelectedConfig(config);
        setIsEditorOpen(true);
    };

    const handleClose = () => {
        setSelectedConfig(null);
        setIsEditorOpen(false);
    };

    if (loading && !configs.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

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
                            <SettingsIcon fontSize="large" />
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
                                City Configurations
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Manage city-specific waste collection settings and configurations
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            {configs.length} city configurations
                        </Typography>
                        <StyledButton
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsEditorOpen(true)}
                        >
                            Create New Configuration
                        </StyledButton>
                    </Box>
                </Box>

                {loading && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <CircularProgress />
                        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                            Loading city configurations...
                        </Typography>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <ConfigList
                        configs={configs}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                    />
                )}

                <Dialog
                    open={isEditorOpen}
                    onClose={handleClose}
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
                        {selectedConfig ? 'Edit City Configuration' : 'Create New City Configuration'}
                    </DialogTitle>
                    <DialogContent sx={{ p: 4, background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' }}>
                        <ConfigEditor
                            initialConfig={selectedConfig}
                            onSubmit={selectedConfig ? handleUpdate : handleCreate}
                            loading={loading}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2, justifyContent: 'center', borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                        <Button 
                            onClick={handleClose} 
                            color="secondary" 
                            variant="outlined"
                            sx={{ borderRadius: '8px' }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default CityConfiguration;