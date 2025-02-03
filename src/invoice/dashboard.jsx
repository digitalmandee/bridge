import React, { useState } from 'react'
import {
    Box,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    IconButton,
    Select,
    MenuItem,
    Card,
    CardContent,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterAlt as FilterIcon,
    ArrowBack as ArrowBackIcon,
    Download as DownloadIcon,
    Notifications as NotificationsIcon,
    Wallet as WalletIcon,
    Assignment as AssignmentIcon,
    Timeline as TimelineIcon,
    Group as GroupIcon,
} from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import TopNavbar from '../topNavbar'
import Sidebar from '../leftSideBar'

const InvoiceDashboard = () => {

    const [month, setMonth] = useState('January');

    const stats = [
        { title: 'Invoice', value: '30', icon: <AssignmentIcon /> },
        { title: 'Paid', value: '10', icon: <WalletIcon /> },
        { title: 'Overdue', value: '4', icon: <TimelineIcon /> },
        { title: 'Payment', value: '10,000', icon: <GroupIcon /> },
    ];

    const invoices = [
        {
            id: 'INV-76',
            client: { name: 'Wade Warren', email: 'email.com' },
            issueDate: '05 Oct 2025',
            paymentDate: '05 Oct 2025',
            status: 'Paid',
            amount: '$202.87',
        },
        {
            id: 'INV-90',
            client: { name: 'Jane Cooper', email: 'email.com' },
            issueDate: '05 Oct 2025',
            paymentDate: '05 Oct 2025',
            status: 'Unpaid',
            amount: '$105.55',
        },
        // Add more invoice data as needed
    ];

    return (
        <>
            <TopNavbar />
            <div className='main d-flex'>
                <div className='sideBarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
                    <div className="container-fluid p-4">
                        {/* Header */}
                        <div className="row mb-4 align-items-center">
                            <div className="col">
                                <Box display="flex" alignItems="center" gap={2}>
                                    <ArrowBackIcon />
                                    <Typography variant="h5">Invoice Dashboard</Typography>
                                </Box>
                            </div>
                            <div className="col-auto">
                                <Box display="flex" gap={2}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<DownloadIcon />}
                                        sx={{ borderColor: '#e0e0e0', color: 'text.secondary' }}
                                    >
                                        CSV
                                    </Button>
                                    <Select
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        size="small"
                                        sx={{ minWidth: 120 }}
                                    >
                                        <MenuItem value="January">January</MenuItem>
                                        {/* Add more months */}
                                    </Select>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' } }}
                                    >
                                        Create Invoice
                                    </Button>
                                </Box>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="row mb-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="col-md-3 mb-3">
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography color="text.secondary">{stat.title}</Typography>
                                                    <Typography variant="h4">{stat.value}</Typography>
                                                </Box>
                                                <Avatar sx={{ bgcolor: '#0F172A' }}>{stat.icon}</Avatar>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>

                        {/* Search and Filter */}
                        <div className="row mb-4">
                            <div className="col">
                                <Box display="flex" gap={2}>
                                    <TextField
                                        placeholder="Search"
                                        size="small"
                                        InputProps={{
                                            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                                        }}
                                        sx={{ minWidth: 300 }}
                                    />
                                    <Button
                                        variant="outlined"
                                        startIcon={<FilterIcon />}
                                        sx={{ borderColor: '#e0e0e0', color: 'text.secondary' }}
                                    >
                                        Filter
                                    </Button>
                                </Box>
                            </div>
                        </div>

                        {/* Table */}
                        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                            <Table>
                                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                                    <TableRow>
                                        <TableCell>Invoice #</TableCell>
                                        <TableCell>Clients</TableCell>
                                        <TableCell>Issue date</TableCell>
                                        <TableCell>Payment Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell>{invoice.id}</TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Avatar sx={{ width: 32, height: 32 }}>
                                                        {invoice.client.name[0]}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2">{invoice.client.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {invoice.client.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{invoice.issueDate}</TableCell>
                                            <TableCell>{invoice.paymentDate}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    sx={{
                                                        bgcolor: invoice.status === 'Paid' ? '#0F172A' : '#E5E7EB',
                                                        color: invoice.status === 'Paid' ? 'white' : '#6B7280',
                                                        '&:hover': {
                                                            bgcolor: invoice.status === 'Paid' ? '#1E293B' : '#D1D5DB',
                                                        },
                                                    }}
                                                >
                                                    {invoice.status}
                                                </Button>
                                            </TableCell>
                                            <TableCell>{invoice.amount}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<NotificationsIcon />}
                                                    sx={{ borderColor: '#e0e0e0', color: 'text.secondary' }}
                                                >
                                                    Notify
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        <Box display="flex" justifyContent="center" mt={3} gap={1}>
                            <Button variant="outlined" disabled>
                                Previous
                            </Button>
                            {[1, 2, 3, '...', 67, 68].map((page, index) => (
                                <Button
                                    key={index}
                                    variant={page === 1 ? 'contained' : ''}
                                    sx={page === 1 ? { bgcolor: '#0F172A' } : {}}
                                >
                                    {page}
                                </Button>
                            ))}
                            <Button variant="outlined">Next</Button>
                        </Box>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InvoiceDashboard
