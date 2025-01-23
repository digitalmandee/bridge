import React from 'react'
import TopNavbar from '../topNavbar'
import Sidebar from '../leftSideBar'
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentsIcon from '@mui/icons-material/Payments';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const bookingData = [
    { id: '#123757', floor: 'Floor 1', room: 'Desk #12", Meeting Room', type: 'Hourly', startDate: 'Dec 01, 2024', endDate: 'Dec 01, 2024', status: 'Complete' },
    { id: '#141257', floor: 'Floor 1', room: 'Desk #12", Meeting Room', type: 'Daily', startDate: 'Dec 01, 2024', endDate: 'Dec 01, 2024', status: 'Pending' },
    { id: '#365615', floor: 'Floor 1', room: 'Desk #12", Meeting Room', type: 'Monthly', startDate: 'Dec 01, 2024', endDate: 'Dec 01, 2024', status: 'Complete' },
    { id: '#365615', floor: 'Floor 1', room: 'Desk #12", Meeting Room', type: 'Hourly', startDate: 'Dec 01, 2024', endDate: 'Dec 01, 2024', status: 'Cancel' },
    { id: '#365615', floor: 'Floor 1', room: 'Desk #12", Meeting Room', type: 'Monthly', startDate: 'Dec 01, 2024', endDate: 'Dec 01, 2024', status: 'Complete' },
    { id: '#638251', floor: 'Floor 1', room: 'Desk #12", Meeting Room', type: 'Hourly', startDate: 'Dec 01, 2024', endDate: 'Dec 01, 2024', status: 'Cancel' },
];

const chartData = {
    datasets: [{
        data: [62.5, 22.4, 18.9],
        backgroundColor: ['#4285F4', '#EA4335', '#34A853'],
        borderWidth: 0,
    }]
};

const chartOptions = {
    cutout: '70%',
    plugins: {
        legend: {
            position: 'right', // remove `as const`
            labels: {
                boxWidth: 10,
                padding: 20,
            },
        },
    },
};

const UserDashboard = () => {
    return (
        <>
            <TopNavbar />
            <div className='main d-flex'>
                <div className='sideBarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
                    <div className='right-content'>
                        <Box sx={{
                            p: 3, 
                            // bgcolor: '#F8F9FA' 
                            }}>
                            {/* Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    Dashboard
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            color: 'text.primary',
                                            borderColor: 'divider',
                                            bgcolor: 'white',
                                        }}
                                    >
                                        Create Booking
                                    </Button>
                                    <Select
                                        value="branch1"
                                        size="small"
                                        sx={{
                                            minWidth: 120,
                                            bgcolor: '#FFB800',
                                            color: 'white',
                                            '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        }}
                                    >
                                        <MenuItem value="branch1">Branch 1</MenuItem>
                                    </Select>
                                </Box>
                            </Box>

                            {/* Metric Cards */}
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                {[
                                    { title: 'Available Booking', value: '60', icon: DirectionsCarIcon, color: '#FFB800' },
                                    { title: 'Remaing Booking', value: '45', icon: GroupsIcon, color: '#FFB800' },
                                    { title: 'Total Amount', value: '120,000', icon: AccountBalanceWalletIcon, color: '#FFB800' },
                                    { title: 'Over Due Amount', value: '60,000', icon: PaymentsIcon, color: '#FFB800' },
                                ].map((item, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <Card sx={{
                                            boxShadow: 'none',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: '8px',
                                            height: '100%',
                                            bgcolor: 'white',
                                        }}>
                                            <CardContent>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    {item.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                        {item.value}
                                                    </Typography>
                                                    <Box sx={{
                                                        bgcolor: item.color,
                                                        borderRadius: '8px',
                                                        p: 1,
                                                    }}>
                                                        <item.icon sx={{ color: '#fff' }} />
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Main Content */}
                            <Grid container spacing={3}>
                                {/* Booking Table */}
                                <Grid item xs={12} md={8}>
                                    <TableContainer component={Paper} sx={{
                                        boxShadow: 'none',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}>
                                        <Table>
                                            <TableHead sx={{ bgcolor: '#FFB800' }}>
                                                <TableRow>
                                                    <TableCell sx={{ color: 'white' }}>Booking ID</TableCell>
                                                    <TableCell sx={{ color: 'white' }}>Floor</TableCell>
                                                    <TableCell sx={{ color: 'white' }}>Seat/Room Name</TableCell>
                                                    <TableCell sx={{ color: 'white' }}>Booking Type</TableCell>
                                                    <TableCell sx={{ color: 'white' }}>Start Date</TableCell>
                                                    <TableCell sx={{ color: 'white' }}>End Date</TableCell>
                                                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {bookingData.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{row.id}</TableCell>
                                                        <TableCell>{row.floor}</TableCell>
                                                        <TableCell>{row.room}</TableCell>
                                                        <TableCell>{row.type}</TableCell>
                                                        <TableCell>{row.startDate}</TableCell>
                                                        <TableCell>{row.endDate}</TableCell>
                                                        <TableCell>
                                                            <Box sx={{
                                                                bgcolor: row.status === 'Complete' ? '#E8F5E9' :
                                                                    row.status === 'Pending' ? '#FFF3E0' : '#FFEBEE',
                                                                color: row.status === 'Complete' ? '#2E7D32' :
                                                                    row.status === 'Pending' ? '#E65100' : '#C62828',
                                                                px: 2,
                                                                py: 0.5,
                                                                borderRadius: 1,
                                                                display: 'inline-block',
                                                            }}>
                                                                {row.status}
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Card sx={{
                                        boxShadow: 'none',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        height: '100%',
                                    }}>
                                        
                                        <CardContent sx={{ p: 2 }}>
                                            <Box sx={{ position: 'relative', height: 300, mb: 3 }}>
                                                <Doughnut data={chartData} options={chartOptions} />
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    textAlign: 'center'
                                                }}>
                                                    <Typography sx={{
                                                        fontSize: '16px',
                                                        fontWeight: 500,
                                                        color: '#000'
                                                    }}>
                                                        Booking
                                                    </Typography>
                                                    <Typography sx={{
                                                        fontSize: '16px',
                                                        fontWeight: 500,
                                                        color: '#000'
                                                    }}>
                                                        Trend
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                {[
                                                    { branch: 'Branch 1', value: '32', percentage: '62.5%', color: '#4285F4' },
                                                    { branch: 'Branch 2', value: '14', percentage: '22.4%', color: '#34A853' },
                                                    { branch: 'Branch 3', value: '8', percentage: '18.9%', color: '#EA4335' },
                                                ].map((item, index) => (
                                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            bgcolor: item.color
                                                        }} />
                                                        <Typography sx={{ flex: 1, color: '#000', fontSize: '14px' }}>
                                                            {item.branch}
                                                        </Typography>
                                                        <Typography sx={{ color: '#000', fontSize: '14px', mr: 4 }}>
                                                            {item.value}
                                                        </Typography>
                                                        <Typography sx={{ color: '#000', fontSize: '14px', width: 60 }}>
                                                            {item.percentage}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserDashboard
