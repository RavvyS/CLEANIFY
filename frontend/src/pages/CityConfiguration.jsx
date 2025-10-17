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
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import ConfigEditor from '../components/admin/ConfigEditor';
import ConfigList from '../components/admin/ConfigList';
import api from '../services/api';

const CityConfiguration = () => {
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
            const response = await api.put(`/configs/${selectedConfig._id}`, configData);
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
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    City Configurations
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setIsEditorOpen(true)}
                >
                    Add New City
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <ConfigList
                configs={configs}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
            />

            <Dialog
                open={isEditorOpen}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {selectedConfig ? 'Edit City Configuration' : 'Create New City Configuration'}
                </DialogTitle>
                <DialogContent>
                    <ConfigEditor
                        initialConfig={selectedConfig}
                        onSubmit={selectedConfig ? handleUpdate : handleCreate}
                        loading={loading}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CityConfiguration;