import React, { useState } from 'react';
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import colors from '@/assets/styles/color';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ToggleButtonGroup,
    ToggleButton,
    Chip
} from '@mui/material';

const GrocerySupply = () => {
    const [timeFilter, setTimeFilter] = useState('weekly');

    const handleTimeFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setTimeFilter(newFilter);
        }
    };

    // Table data
    const rows = [
        { id: '#01', name: 'Coffee', description: 'Coffee, tea, snacks', qty: '03', amount: '200', date: 'Dec 01, 2024', status: 'Paid' },
        { id: '#02', name: 'Tea', description: 'Coffee, tea, snacks', qty: '02', amount: '400', date: 'Dec 01, 2024', status: 'Pending' },
        { id: '#03', name: 'snacks', description: 'Coffee, tea, snacks', qty: '04', amount: '250', date: 'Dec 01, 2024', status: 'Received' },
        { id: '#04', name: 'Tea', description: 'Coffee, tea, snacks', qty: '01', amount: '460', date: 'Dec 01, 2024', status: 'Paid' },
        { id: '#05', name: 'Snacks', description: 'Coffee, tea, snacks', qty: '02', amount: '200', date: 'Dec 01, 2024', status: 'Received' },
    ];

    // Get status chip color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid':
                return { bg: '#e6f7ff', text: '#0c4a6e' };
            case 'Pending':
                return { bg: '#fff7e6', text: '#d97706' };
            case 'Received':
                return { bg: '#f0fdf4', text: '#166534' };
            default:
                return { bg: '#f3f4f6', text: '#6b7280' };
        }
    };

    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => setTimeFilter('weekly')}
                                sx={{
                                    px: 3,
                                    bgcolor: timeFilter === 'weekly' ? colors.primary : 'white',
                                    color: timeFilter === 'weekly' ? 'white' : '#64748b',
                                    '&:hover': {
                                        bgcolor: timeFilter === 'weekly' ? colors.primary : '#f1f5f9',
                                    },
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '10px', // Fully rounded corners
                                    boxShadow: timeFilter === 'weekly' ? '0px 2px 4px rgba(0, 0, 0, 0.2)' : 'none',
                                }}
                            >
                                Weekly
                            </Button>

                            <Button
                                variant="contained"
                                onClick={() => setTimeFilter('daily')}
                                sx={{
                                    px: 3,
                                    bgcolor: timeFilter === 'daily' ? colors.primary : 'white',
                                    color: timeFilter === 'daily' ? 'white' : '#64748b',
                                    '&:hover': {
                                        bgcolor: timeFilter === 'daily' ? colors.primary : '#f1f5f9',
                                    },
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '10px', // Fully rounded corners
                                    boxShadow: timeFilter === 'daily' ? '0px 2px 4px rgba(0, 0, 0, 0.2)' : 'none',
                                }}
                            >
                                Daily
                            </Button>
                        </Box>

                        <TableContainer
                            component={Paper}
                            sx={{
                                boxShadow: 'none',
                                borderRadius: 2,
                                overflow: 'hidden'
                            }}
                        >
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#FFF2C6' }}>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#000000', py: 2 }}>SL No</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#000000', py: 2 }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#000000', py: 2 }}>Description</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#000000', py: 2 }}>Qty</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#000000', py: 2 }}>Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#000000', py: 2 }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#000000', py: 2 }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{
                                                '&:nth-of-type(even)': { bgcolor: '#f8fafc' },
                                                '&:last-child td, &:last-child th': { border: 0 }
                                            }}
                                        >
                                            <TableCell component="th" scope="row" sx={{ py: 2 }}>
                                                {row.id}
                                            </TableCell>
                                            <TableCell sx={{ py: 2 }}>{row.name}</TableCell>
                                            <TableCell sx={{ py: 2 }}>{row.description}</TableCell>
                                            <TableCell sx={{ py: 2 }}>{row.qty}</TableCell>
                                            <TableCell sx={{ py: 2 }}>{row.amount}</TableCell>
                                            <TableCell sx={{ py: 2 }}>{row.date}</TableCell>
                                            <TableCell sx={{ py: 2 }}>
                                                <Chip
                                                    label={row.status}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: getStatusColor(row.status).bg,
                                                        color: getStatusColor(row.status).text,
                                                        fontWeight: 500,
                                                        borderRadius: 1,
                                                        px: 0.5
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </div>
            </div>
        </>
    );
};

export default GrocerySupply;