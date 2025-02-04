import React, { useState } from 'react'
import TopNavbar from '../topNavbar'
import Sidebar from '../leftSideBar'
import { useNavigate } from 'react-router-dom';
import profile from '../assets/profile.png'
import { MdArrowBackIos } from "react-icons/md";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Select,
    MenuItem,
    styled
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Download as DownloadIcon,
    FilterAlt as FilterIcon,
} from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';

// Styled components
const StatusBadge = styled(Box)(({ status }) => ({
    padding: '4px 12px',
    borderRadius: '4px',
    display: 'inline-block',
    fontSize: '12px',
    backgroundColor: status === 'Paid' ? '#0F172A' : '#E5E7EB',
    color: status === 'Paid' ? '#FFFFFF' : '#6B7280',
}));

const InvoiceDetail = () => {

    const navigate = useNavigate();

    const [month, setMonth] = useState('Month');

    const customerData = {
        name: 'Wade Warren',
        invoiceId: 'INV-76',
        phone: '000-00000-00',
        email: '@gmail.com',
        image: 'profile'
    };

    const invoices = [
        {
            invoiceNo: 'INV-76',
            type: 'Meeting room',
            customer: 'Wade Warren',
            issueDate: '05 Oct 2025',
            paymentDate: '05 Oct 2025',
            status: 'Paid',
            amount: '$202.87'
        },
        {
            invoiceNo: 'INV-90',
            type: 'Printing paper',
            customer: 'Wade Warren',
            issueDate: '05 Oct 2025',
            paymentDate: '05 Oct 2025',
            status: 'Unpaid',
            amount: '$105.55'
        },
        {
            invoiceNo: 'INV-80',
            type: 'Monthly',
            customer: 'Wade Warren',
            issueDate: '05 Oct 2025',
            paymentDate: '05 Oct 2025',
            status: 'Paid',
            amount: '$105.55'
        },
        {
            invoiceNo: 'INV-50',
            type: '20',
            customer: 'Wade Warren',
            issueDate: '05 Oct 2025',
            paymentDate: '05 Oct 2025',
            status: 'Unpaid',
            amount: '$105.55'
        },
        {
            invoiceNo: 'INV-30',
            type: '10',
            customer: 'Wade Warren',
            issueDate: '05 Oct 2025',
            paymentDate: '05 Oct 2025',
            status: 'Paid',
            amount: '$105.55'
        }
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
                                    <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}>
                                        <MdArrowBackIos style={{ fontSize: "20px" }} />
                                    </div>
                                    <Typography variant="h5">Detail</Typography>
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
                                    <Button
                                        variant="outlined"
                                        startIcon={<FilterIcon />}
                                        sx={{ borderColor: '#e0e0e0', color: 'text.secondary' }}
                                    >
                                        Filter
                                    </Button>
                                    <Select
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        size="small"
                                        sx={{ minWidth: 120 }}
                                    >
                                        <MenuItem value="Month">Month</MenuItem>
                                        <MenuItem value="January">January</MenuItem>
                                        <MenuItem value="February">February</MenuItem>
                                    </Select>
                                </Box>
                            </div>
                        </div>

                        {/* Customer Profile */}
                        <Paper sx={{ p: 3, mb: 4 }}>
                            <Box display="flex" gap={3} alignItems="center">
                                <Avatar
                                    src={customerData.image}
                                    sx={{ width: 80, height: 80 }}
                                />
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <Box display="flex" gap={2}>
                                        <Typography color="text.secondary" variant="body2">Name:</Typography>
                                        <Typography variant="body1">{customerData.name}</Typography>
                                    </Box>

                                    <Box display="flex" gap={2}>
                                        <Typography color="text.secondary" variant="body2">Invoice#:</Typography>
                                        <Typography variant="body1">{customerData.invoiceId}</Typography>
                                    </Box>

                                    <Box display="flex" gap={2}>
                                        <Typography color="text.secondary" variant="body2">Phone:</Typography>
                                        <Typography variant="body1">{customerData.phone}</Typography>
                                    </Box>

                                    <Box display="flex" gap={2}>
                                        <Typography color="text.secondary" variant="body2">Email:</Typography>
                                        <Typography variant="body1">{customerData.email}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>

                        {/* Table */}
                        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                            <Table>
                                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                                    <TableRow>
                                        <TableCell>Invoice #</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell>Issue Date</TableCell>
                                        <TableCell>Payment Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.invoiceNo}>
                                            <TableCell
                                                onClick={()=>navigate('/invoice-slip')}
                                                style={{ cursor: 'pointer' }} // Optional: change text color to indicate it's clickable
                                            >
                                                {invoice.invoiceNo}
                                            </TableCell>
                                            <TableCell>{invoice.type}</TableCell>
                                            <TableCell>{invoice.customer}</TableCell>
                                            <TableCell>{invoice.issueDate}</TableCell>
                                            <TableCell>{invoice.paymentDate}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={invoice.status}>
                                                    {invoice.status}
                                                </StatusBadge>
                                            </TableCell>
                                            <TableCell>{invoice.amount}</TableCell>
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

export default InvoiceDetail
