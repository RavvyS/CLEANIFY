import { useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Switch,
    TablePagination,
    Typography,
    Box,
    Avatar,
    Tooltip,
    useTheme,
    alpha,
    styled
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import RecyclingIcon from '@mui/icons-material/Recycling';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';

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

const ConfigList = ({ configs, onEdit, onDelete, onToggleActive }) => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (!configs.length) {
        return (
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
                    <LocationCityIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                    No City Configurations Found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Get started by creating your first city configuration
                </Typography>
            </Paper>
        );
    }

    return (
        <Box>
            <StyledTableContainer>
                <Table>
                    <StyledTableHead>
                        <TableRow>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationCityIcon fontSize="small" />
                                    City ID
                                </Box>
                            </TableCell>
                            <TableCell>City Name</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <RecyclingIcon fontSize="small" />
                                    Waste Types
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AttachMoneyIcon fontSize="small" />
                                    Pricing
                                </Box>
                            </TableCell>
                            <TableCell>Base Rate</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ScheduleIcon fontSize="small" />
                                    Zones
                                </Box>
                            </TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </StyledTableHead>
                    <TableBody>
                        {configs
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((config) => (
                                <StyledTableRow key={config._id}>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ 
                                            fontWeight: 600,
                                            fontFamily: 'monospace',
                                            color: 'primary.main'
                                        }}>
                                            {config.cityId}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            {config.cityName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 200 }}>
                                            {config.wasteTypes.map((type) => (
                                                <Chip
                                                    key={type}
                                                    label={type}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                        color: theme.palette.primary.main,
                                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                                        fontWeight: 500
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={config.pricingModel}
                                            size="small"
                                            sx={{
                                                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                                color: theme.palette.secondary.main,
                                                fontWeight: 600,
                                                textTransform: 'capitalize'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                                            LKR {config.baseRate}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 250 }}>
                                            {Object.entries(config.pickupFrequency).map(([zone, frequency]) => (
                                                <Tooltip key={zone} title={`${zone}: ${frequency}`}>
                                                    <Chip
                                                        label={`${zone}`}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: alpha(theme.palette.info.main, 0.1),
                                                            color: theme.palette.info.main,
                                                            fontWeight: 500,
                                                            '&:hover': {
                                                                backgroundColor: alpha(theme.palette.info.main, 0.2)
                                                            }
                                                        }}
                                                    />
                                                </Tooltip>
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip
                                                label={config.isActive ? 'Active' : 'Inactive'}
                                                size="small"
                                                color={config.isActive ? 'success' : 'default'}
                                                sx={{ fontWeight: 600 }}
                                            />
                                            <Switch
                                                checked={config.isActive}
                                                onChange={() => onToggleActive(config._id)}
                                                color="primary"
                                                size="small"
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <Tooltip title="Edit Configuration">
                                                <ActionButton
                                                    variant="primary"
                                                    onClick={() => onEdit(config)}
                                                    size="small"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </ActionButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Configuration">
                                                <ActionButton
                                                    variant="error"
                                                    onClick={() => onDelete(config._id)}
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
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={configs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    '& .MuiTablePagination-toolbar': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                        fontWeight: 500
                    }
                }}
            />
        </Box>
    );
};

export default ConfigList;