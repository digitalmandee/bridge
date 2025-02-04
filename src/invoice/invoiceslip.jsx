import React from 'react'
import TopNavbar from '../topNavbar'
import Sidebar from '../leftSideBar'
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";
import {
    Container,
    Box,
    Typography,
    Button,
    IconButton,
    Card,
    CardContent,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    styled
} from '@mui/material';
import {
    ChevronLeft,
    Download,
    Send
} from '@mui/icons-material';
import { color } from 'chart.js/helpers';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: theme.shadows[3],
    marginBottom: theme.spacing(2)
}));

const InfoCard = styled(Box)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2),
    textAlign: 'center',
    flex: '1 1 0',
    margin: theme.spacing(1)
}));

const InvoiceSlip = () => {

    const navigate = useNavigate();

    const invoiceData = {
        invoiceNumber: '000027',
        issuedDate: '03/07/2024',
        dueDate: '07/07/2024',
        items: [
            { description: 'Dedicated desks', qty: 1, price: 15000, total: 45000 }
        ],
        totalAmount: 115000,
        paidAmount: 70000,
        payableAmount: 25000
    };


    return (
        <>
            <TopNavbar />
            <div className='main d-flex'>
                <div className='sideBarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
                    <Container maxWidth="xl" sx={{ py: 4 }}>
                        {/* Header Section */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 4
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}>
                                    <MdArrowBackIos style={{ fontSize: "20px" }} />
                                </div>
                                <Typography variant="h5">Invoice</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: 'white',
                                        '&:hover': { bgcolor: 'grey.50' },
                                        borderRadius: '9999px',
                                        color: '#0D2B4E',
                                    }}
                                    startIcon={<Download />}
                                >
                                    PDF
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<Send />}
                                    sx={{
                                        bgcolor: 'white',
                                        '&:hover': { bgcolor: 'grey.50' },
                                        borderRadius: '9999px',
                                        color: '#0D2B4E',
                                    }}
                                >
                                    Sent
                                </Button>
                            </Box>
                        </Box>

                        {/* Customer & Amount Section */}
                        <Box sx={{
                            display: 'flex',
                            gap: 3,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            mb: 4
                        }}>
                            {/* Customer Card */}
                            <StyledCard sx={{ flex: '2 1 60%' }}>
                                <CardContent>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <Typography variant="h5">Mauro Sicard</Typography>
                                        <Avatar
                                            src="/icons/man.svg"
                                            sx={{ width: 70, height: 70, backgroundColor: '#C5DCF7', color: '#0D2B4E', }}
                                        />
                                    </Box>

                                    <Box sx={{ color: 'text.secondary' }}>
                                        <Typography variant="body2">+92 3209469594</Typography>
                                        <Typography variant="body2">contact@maurosicard.com</Typography>
                                        <Typography variant="body2">
                                            Pablo Alto, San Francisco, CA 92102, United States of America
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </StyledCard>

                            {/* Amount Card */}
                            <StyledCard sx={{ flex: '1 1 30%', backgroundColor: '#0D2B4E' }}>
                                <CardContent sx={{ textAlign: 'right', color: 'white' }}>
                                    <Typography variant="subtitle1" color="white">
                                        Paid Amount
                                    </Typography>
                                    <Typography variant="h4" sx={{ my: 1, color: 'white' }}>
                                        {invoiceData.paidAmount.toLocaleString()}.00
                                    </Typography>
                                    <Typography variant="h6" color="white">
                                        PKR
                                    </Typography>
                                    <Typography variant="caption" color="white">
                                        03 August 2024
                                    </Typography>
                                </CardContent>
                            </StyledCard>

                        </Box>

                        {/* Info Cards Section */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 3,
                            mb: 4,
                            flexWrap: 'wrap'
                        }}>
                            <InfoCard>
                                Invoice No: <Typography variant="body1" component="span" fontWeight="bold">
                                    {invoiceData.invoiceNumber}
                                </Typography>
                            </InfoCard>

                            <InfoCard>
                                Issued: <Typography variant="body1" component="span" fontWeight="bold">
                                    {invoiceData.issuedDate}
                                </Typography>
                            </InfoCard>

                            <InfoCard>
                                Due Date: <Typography variant="body1" component="span" fontWeight="bold">
                                    {invoiceData.dueDate}
                                </Typography>
                            </InfoCard>
                        </Box>

                        {/* Table Section */}
                        <StyledCard>
                            <CardContent>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Qty</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell align="right">Total Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoiceData.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell>{item.qty}</TableCell>
                                                <TableCell>{item.price.toLocaleString()}</TableCell>
                                                <TableCell align="right">
                                                    {item.total.toLocaleString()}.00
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Total Section */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mt: 4,
                                    px: 2
                                }}>
                                    <Box>
                                        <Typography variant="body1">Payable Amount</Typography>
                                        <Typography variant="h6" color="error">
                                            {invoiceData.payableAmount.toLocaleString()} PKR
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="body1">Total Amount</Typography>
                                        <Typography variant="h6" color="primary">
                                            {invoiceData.totalAmount.toLocaleString()} PKR
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Container>
                </div>
            </div>
        </>
    )
}

export default InvoiceSlip
