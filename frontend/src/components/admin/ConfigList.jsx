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
    Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ConfigList = ({ configs, onEdit, onDelete, onToggleActive }) => {
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
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1">No city configurations found.</Typography>
            </Paper>
        );
    }

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>City ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Waste Types</TableCell>
                            <TableCell>Pricing Model</TableCell>
                            <TableCell>Base Rate</TableCell>
                            <TableCell>Zones</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {configs
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((config) => (
                                <TableRow key={config._id}>
                                    <TableCell>{config.cityId}</TableCell>
                                    <TableCell>{config.cityName}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {config.wasteTypes.map((type) => (
                                                <Chip
                                                    key={type}
                                                    label={type}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{config.pricingModel}</TableCell>
                                    <TableCell>LKR {config.baseRate}</TableCell>
                                    <TableCell>
                                        {Object.entries(config.pickupFrequency).map(([zone, frequency]) => (
                                            <Chip
                                                key={zone}
                                                label={`${zone} (${frequency})`}
                                                size="small"
                                                sx={{ mr: 0.5, mb: 0.5 }}
                                            />
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={config.isActive}
                                            onChange={() => onToggleActive(config._id)}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => onEdit(config)}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => onDelete(config._id)}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={configs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default ConfigList;