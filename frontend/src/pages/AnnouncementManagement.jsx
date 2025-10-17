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
    styled,
    CircularProgress,
    Alert,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    Campaign as CampaignIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Announcement as AnnouncementIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';

const StyledPageContainer = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

const StyledHeaderBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
    borderRadius: '16px',
    background: 'linear-gradient(45deg, #2E7D32 30%, #4CAF50 90%)',
    color: theme.palette.common.white,
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
}));

const StyledHeaderTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    background: 'linear-gradient(45deg, #ffffff 30%, #e0e0e0 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
}));

const StyledAddButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
    color: 'white',
    fontWeight: 600,
    borderRadius: '12px',
    padding: '10px 25px',
    boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
        boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
        transform: 'translateY(-2px)',
    },
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

const AnnouncementManagement = () => {
    const theme = useTheme();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        priority: 'medium',
        targetAudience: 'all'
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const response = await api.get('/announcements');
            setAnnouncements(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load announcements');
            console.error('Error fetching announcements:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await api.delete(`/announcements/${id}`);
                setAnnouncements(announcements.filter(announcement => announcement._id !== id));
                toast.success('Announcement deleted successfully!');
            } catch (err) {
                console.error('Error deleting announcement:', err);
                toast.error('Failed to delete announcement.');
            }
        }
    };

    const handleOpenDialog = (announcement = null) => {
        if (announcement) {
            setEditingId(announcement._id);
            setFormData({
                title: announcement.title,
                content: announcement.content,
                priority: announcement.priority || 'medium',
                targetAudience: announcement.targetAudience || 'all'
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                content: '',
                priority: 'medium',
                targetAudience: 'all'
            });
        }
        setFormErrors({});
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingId(null);
        setFormData({
            title: '',
            content: '',
            priority: 'medium',
            targetAudience: 'all'
        });
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.title.trim()) {
            errors.title = 'Title is required';
        }
        
        if (!formData.content.trim()) {
            errors.content = 'Content is required';
        }
        
        if (!formData.priority) {
            errors.priority = 'Priority is required';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            if (editingId) {
                const response = await api.put(`/announcements/${editingId}`, formData);
                setAnnouncements(announcements.map(announcement => 
                    announcement._id === editingId ? response.data : announcement
                ));
                toast.success('Announcement updated successfully');
            } else {
                const response = await api.post('/announcements', formData);
                setAnnouncements([response.data, ...announcements]);
                toast.success('Announcement created successfully');
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving announcement:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(`Failed to ${editingId ? 'update' : 'create'} announcement`);
            }
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'default';
        }
    };

    if (loading && !announcements.length) {
        return (
            <StyledPageContainer>
                <Container maxWidth="xl" sx={{ textAlign: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                        Loading announcements...
                    </Typography>
                </Container>
            </StyledPageContainer>
        );
    }

    return (
        <StyledPageContainer>
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
                            <CampaignIcon fontSize="large" />
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
                                Announcement Management
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Manage system announcements and notifications
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            {announcements.length} announcements
                        </Typography>
                        <StyledAddButton
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenDialog}
                        >
                            Create New Announcement
                        </StyledAddButton>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && announcements.length === 0 && (
                    <Paper sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}>
                        <Avatar sx={{
                            bgcolor: 'primary.main',
                            mx: 'auto',
                            mb: 2,
                            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)'
                        }}>
                            <AnnouncementIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                            No Announcements
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            No announcements have been created yet.
                        </Typography>
                    </Paper>
                )}

                {!loading && !error && announcements.length > 0 && (
                    <Grid container spacing={3} justifyContent="center">
                        {announcements.map((announcement) => (
                            <Grid item xs={12} key={announcement._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Card sx={{ 
                                    width: '800px',
                                    maxWidth: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: 'white',
                                    border: '1px solid rgba(0, 0, 0, 0.08)',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                                    }
                                }}>
                                    {/* Priority Indicator Bar */}
                                    <Box sx={{
                                        height: '4px',
                                        background: (announcement.priority || 'medium') === 'high' 
                                            ? 'linear-gradient(90deg, #f44336 0%, #ff5722 100%)'
                                            : (announcement.priority || 'medium') === 'medium'
                                            ? 'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)'
                                            : 'linear-gradient(90deg, #2196f3 0%, #03a9f4 100%)',
                                        borderTopLeftRadius: '16px',
                                        borderTopRightRadius: '16px'
                                    }} />
                                    
                                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        {/* Header */}
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="h6" sx={{ 
                                                fontWeight: 600,
                                                color: 'text.primary',
                                                mb: 1,
                                                lineHeight: 1.3
                                            }}>
                                                {announcement.title}
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Chip
                                                    label={announcement.priority || 'medium'}
                                                    size="small"
                                                    sx={{ 
                                                        textTransform: 'capitalize',
                                                        fontSize: '0.75rem',
                                                        height: '24px',
                                                        backgroundColor: (announcement.priority || 'medium') === 'high' 
                                                            ? '#f44336'
                                                            : (announcement.priority || 'medium') === 'medium'
                                                            ? '#ff9800'
                                                            : '#2196f3',
                                                        color: 'white',
                                                        fontWeight: 500
                                                    }}
                                                />
                                                <Chip
                                                    label={(announcement.targetAudience || 'all').charAt(0).toUpperCase() + (announcement.targetAudience || 'all').slice(1)}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ 
                                                        fontSize: '0.75rem',
                                                        height: '24px',
                                                        borderColor: alpha(theme.palette.secondary.main, 0.3),
                                                        color: theme.palette.secondary.main,
                                                        fontWeight: 500
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Content */}
                                        <Box sx={{ flexGrow: 1, mb: 3, overflow: 'hidden' }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ 
                                                lineHeight: 1.6,
                                                fontSize: '0.9rem',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 4,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {announcement.content}
                                            </Typography>
                                        </Box>

                                        {/* Footer */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            mt: 'auto',
                                            pt: 2,
                                            borderTop: '1px solid rgba(0, 0, 0, 0.06)'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ 
                                                    fontWeight: 500,
                                                    fontSize: '0.8rem'
                                                }}>
                                                    {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </Typography>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Box sx={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: '50%',
                                                        backgroundColor: announcement.isActive !== false ? '#4caf50' : '#f44336'
                                                    }} />
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                        {announcement.isActive !== false ? 'Active' : 'Inactive'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            
                                            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => handleOpenDialog(announcement)}
                                                    sx={{ 
                                                        width: 32,
                                                        height: 32,
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                        color: theme.palette.primary.main,
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.primary.main,
                                                            color: 'white'
                                                        },
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleDelete(announcement._id)}
                                                    sx={{ 
                                                        width: 32,
                                                        height: 32,
                                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                                        color: theme.palette.error.main,
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.error.main,
                                                            color: 'white'
                                                        },
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Create Announcement Dialog */}
                <Dialog
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '24px',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                            overflow: 'hidden'
                        }
                    }}
                >
                    <DialogTitle sx={{ 
                        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                        color: 'white',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        py: 3,
                        px: 4,
                        fontSize: '1.5rem'
                    }}>
                        <Avatar sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.2)', 
                            width: 48, 
                            height: 48 
                        }}>
                            {editingId ? <EditIcon fontSize="large" /> : <AddIcon fontSize="large" />}
                        </Avatar>
                        {editingId ? 'Edit Announcement' : 'Create New Announcement'}
                    </DialogTitle>
                    
                    <DialogContent sx={{ 
                        p: 4, 
                        backgroundColor: '#fafafa',
                        minHeight: 'auto'
                    }}>
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                                {/* Title Field */}
                                <TextField
                                    fullWidth
                                    label="Announcement Title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    error={!!formErrors.title}
                                    helperText={formErrors.title}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            backgroundColor: 'white',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                            '&:hover': { 
                                                backgroundColor: 'white',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                            },
                                            '&.Mui-focused': { 
                                                backgroundColor: 'white',
                                                boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.1)'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500
                                        }
                                    }}
                                />

                                {/* Content Field */}
                                <TextField
                                    fullWidth
                                    label="Announcement Content"
                                    multiline
                                    rows={4}
                                    value={formData.content}
                                    onChange={(e) => handleInputChange('content', e.target.value)}
                                    error={!!formErrors.content}
                                    helperText={formErrors.content}
                                    variant="outlined"
                                    placeholder="Enter the announcement message..."
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            backgroundColor: 'white',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                            '&:hover': { 
                                                backgroundColor: 'white',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                            },
                                            '&.Mui-focused': { 
                                                backgroundColor: 'white',
                                                boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.1)'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500
                                        }
                                    }}
                                />

                                {/* Priority Field */}
                                <FormControl 
                                    fullWidth 
                                    error={!!formErrors.priority}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            backgroundColor: 'white',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                            '&:hover': { 
                                                backgroundColor: 'white',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                            },
                                            '&.Mui-focused': { 
                                                backgroundColor: 'white',
                                                boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.1)'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500
                                        }
                                    }}
                                >
                                    <InputLabel>Priority Level</InputLabel>
                                    <Select
                                        value={formData.priority}
                                        onChange={(e) => handleInputChange('priority', e.target.value)}
                                        label="Priority Level"
                                    >
                                        <MenuItem value="low">Low</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="high">High</MenuItem>
                                    </Select>
                                    {formErrors.priority && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                            {formErrors.priority}
                                        </Typography>
                                    )}
                                </FormControl>

                                {/* Target Audience Field */}
                                <FormControl 
                                    fullWidth 
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            backgroundColor: 'white',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                            '&:hover': { 
                                                backgroundColor: 'white',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                            },
                                            '&.Mui-focused': { 
                                                backgroundColor: 'white',
                                                boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.1)'
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            fontWeight: 500
                                        }
                                    }}
                                >
                                    <InputLabel>Target Audience</InputLabel>
                                    <Select
                                        value={formData.targetAudience}
                                        onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                                        label="Target Audience"
                                    >
                                        <MenuItem value="all">All Users</MenuItem>
                                        <MenuItem value="admin">Admins Only</MenuItem>
                                        <MenuItem value="dispatcher">Dispatchers Only</MenuItem>
                                        <MenuItem value="collector">Collectors Only</MenuItem>
                                        <MenuItem value="householder">Householders Only</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </DialogContent>
                    
                    <DialogActions sx={{ 
                        p: 4, 
                        justifyContent: 'flex-end', 
                        gap: 2,
                        backgroundColor: '#fafafa',
                        borderTop: '1px solid rgba(0, 0, 0, 0.05)'
                    }}>
                        <Button 
                            onClick={handleCloseDialog} 
                            variant="outlined"
                            sx={{ 
                                borderRadius: '12px', 
                                minWidth: '100px',
                                height: '44px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                borderColor: theme.palette.grey[300],
                                color: theme.palette.grey[600],
                                '&:hover': {
                                    borderColor: theme.palette.grey[400],
                                    backgroundColor: theme.palette.grey[50]
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            startIcon={editingId ? <EditIcon /> : <AddIcon />}
                            sx={{
                                borderRadius: '12px',
                                minWidth: '140px',
                                height: '44px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                                    boxShadow: '0 6px 16px rgba(46, 125, 50, 0.4)',
                                    transform: 'translateY(-1px)'
                                }
                            }}
                        >
                            {editingId ? 'Update Announcement' : 'Create Announcement'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </StyledPageContainer>
    );
};

export default AnnouncementManagement;
