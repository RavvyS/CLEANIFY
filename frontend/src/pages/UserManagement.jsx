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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Switch,
    Tooltip,
    CircularProgress,
    Alert,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    People as PeopleIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon,
    LocalShipping as DispatcherIcon,
    Recycling as CollectorIcon,
    Home as HouseholderIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    overflow: 'hidden'
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    '& .MuiTableCell-head': {
        fontWeight: 600,
        color: theme.palette.primary.main,
        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        transform: 'scale(1.01)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    '&:nth-of-type(even)': {
        backgroundColor: alpha(theme.palette.grey[50], 0.5)
    }
}));

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

const ActionButton = styled(IconButton)(({ theme, variant = 'primary' }) => ({
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    ...(variant === 'primary' && {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            transform: 'scale(1.1)'
        }
    }),
    ...(variant === 'error' && {
        backgroundColor: alpha(theme.palette.error.main, 0.1),
        color: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.main,
            color: 'white',
            transform: 'scale(1.1)'
        }
    })
}));

const UserManagement = () => {
    const theme = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'householder',
        phone: '',
        address: '',
        isActive: true
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const response = await api.patch(`/users/${userId}`, {
                isActive: !currentStatus
            });
            setUsers(users.map(user => 
                user._id === userId ? response.data : user
            ));
            toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error('Failed to update user status');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${userId}`);
                setUsers(users.filter(user => user._id !== userId));
                toast.success('User deleted successfully');
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    const handleOpenDialog = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'householder',
            phone: '',
            address: '',
            isActive: true
        });
        setFormErrors({});
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'householder',
            phone: '',
            address: '',
            isActive: true
        });
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        
        if (!formData.password.trim()) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        
        if (!formData.role) {
            errors.role = 'Role is required';
        }
        
        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        }
        
        if (!formData.address.trim()) {
            errors.address = 'Address is required';
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
            const response = await api.post('/users', formData);
            setUsers([response.data, ...users]);
            handleCloseDialog();
            toast.success('User created successfully');
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to create user');
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

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin':
                return <AdminIcon color="primary" />;
            case 'dispatcher':
                return <DispatcherIcon color="primary" />;
            case 'collector':
                return <CollectorIcon color="primary" />;
            case 'householder':
                return <HouseholderIcon color="primary" />;
            default:
                return <PersonIcon color="primary" />;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return 'error';
            case 'dispatcher':
                return 'warning';
            case 'collector':
                return 'info';
            case 'householder':
                return 'success';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                            <PeopleIcon fontSize="large" />
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
                                User Management
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Manage system users, roles, and permissions
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            {users.length} users registered
                        </Typography>
                        <StyledButton
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenDialog}
                        >
                            Add New User
                        </StyledButton>
                    </Box>
                </Box>

                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <CircularProgress />
                        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                            Loading users...
                        </Typography>
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                ) : users.length === 0 ? (
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
                            <PeopleIcon fontSize="large" />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                            No Users Found
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            No users have been registered in the system yet
                        </Typography>
                        <StyledButton
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenDialog}
                        >
                            Add First User
                        </StyledButton>
                    </Paper>
                ) : (
                    <StyledTableContainer>
                        <Table>
                            <StyledTableHead>
                                <TableRow>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PersonIcon fontSize="small" />
                                            User
                                        </Box>
                                    </TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Joined</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </StyledTableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <StyledTableRow key={user._id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: 'primary.main',
                                                    width: 40,
                                                    height: 40
                                                }}>
                                                    {user.name?.charAt(0) || 'U'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                        {user.name || 'Unknown User'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        ID: {user._id?.slice(-6)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                {user.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {getRoleIcon(user.role)}
                                                <Chip
                                                    label={user.role}
                                                    size="small"
                                                    color={getRoleColor(user.role)}
                                                    sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip
                                                    label={user.isActive ? 'Active' : 'Inactive'}
                                                    size="small"
                                                    color={user.isActive ? 'success' : 'default'}
                                                    sx={{ fontWeight: 600 }}
                                                />
                                                <Switch
                                                    checked={user.isActive}
                                                    onChange={() => handleToggleStatus(user._id, user.isActive)}
                                                    color="primary"
                                                    size="small"
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(user.createdAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <Tooltip title="Edit User">
                                                    <ActionButton
                                                        variant="primary"
                                                        onClick={() => {
                                                            toast.info('Edit user functionality coming soon!');
                                                        }}
                                                        size="small"
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </ActionButton>
                                                </Tooltip>
                                                <Tooltip title="Delete User">
                                                    <ActionButton
                                                        variant="error"
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        size="small"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </ActionButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
                )}

                {/* Add User Dialog */}
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
                            <AddIcon fontSize="large" />
                        </Avatar>
                        Create New User
                    </DialogTitle>
                    
                    <DialogContent sx={{ 
                        p: 4, 
                        backgroundColor: '#fafafa',
                        minHeight: 'auto'
                    }}>
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                                {/* Full Name Field */}
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    error={!!formErrors.name}
                                    helperText={formErrors.name}
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

                                {/* Email Address Field */}
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    error={!!formErrors.email}
                                    helperText={formErrors.email}
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

                                {/* Password Field */}
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    error={!!formErrors.password}
                                    helperText={formErrors.password}
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

                                {/* User Role Field */}
                                <FormControl 
                                    fullWidth 
                                    error={!!formErrors.role}
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
                                    <InputLabel>User Role</InputLabel>
                                    <Select
                                        value={formData.role}
                                        onChange={(e) => handleInputChange('role', e.target.value)}
                                        label="User Role"
                                    >
                                        <MenuItem value="admin">Admin</MenuItem>
                                        <MenuItem value="dispatcher">Dispatcher</MenuItem>
                                        <MenuItem value="collector">Collector</MenuItem>
                                        <MenuItem value="householder">Householder</MenuItem>
                                    </Select>
                                    {formErrors.role && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                            {formErrors.role}
                                        </Typography>
                                    )}
                                </FormControl>

                                {/* Phone Number Field */}
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    error={!!formErrors.phone}
                                    helperText={formErrors.phone}
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

                                {/* Address Field - Full Width */}
                                <TextField
                                    fullWidth
                                    label="Address"
                                    multiline
                                    rows={4}
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    error={!!formErrors.address}
                                    helperText={formErrors.address}
                                    variant="outlined"
                                    placeholder="Enter complete address including street, city, postal code, etc."
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
                            startIcon={<AddIcon />}
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
                            Create User
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default UserManagement;
