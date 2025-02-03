import React from 'react'
import TopNavbar from '../topNavbar'
import Sidebar from '../leftSideBar'
import colors from '../styles/color'
import { ArrowDownIcon, ArrowUpIcon, Bell, Building2, FileText, Building } from "lucide-react"
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
import { color } from '@mui/system';

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

const notifications = [
    {
        icon: FileText,
        title: "Booking Confirmation",
        message: "Your booking for Desk #12 at Downtown Branch is confirmed for Jan 10, 2025, 9:00 AM",
        time: "2 min ago",
    },
    {
        icon: FileText,
        title: "Upcoming Booking Reminder",
        message: "Reminder: You have an upcoming booking for Meeting Room",
        time: "10 min ago",
    },
    {
        icon: Building2,
        title: "New Amenities Added",
        message: "*New* High-speed internet and ergonomic chairs are now available at Branch 1",
        time: "2 days ago",
    },
    {
        icon: Building,
        title: "Payment Reminder",
        message: "Payment overdue! Please complete payment for your monthly booking",
        time: "3 days ago",
    },
]

const notificationsStyle = {
    marginTop:'1.5rem',
    backgroundColor: '#FFFFFF',
    borderRadius: '1rem',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E5E7EB',
    height: '30rem',
    width: '21rem',
    padding: '1rem',
    marginLeft: '1rem'
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
                    <div style={{ marginTop: '0.5rem', backgroundColor: 'transparent' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', width: '98%' }}>
                            <Typography variant="h5" style={{ fontWeight: 'bold' }}>Dashboard</Typography>
                            <Button variant="outlined" style={{ color: '#000', borderColor: '#ccc', backgroundColor: '#fff' }}>Create Booking</Button>
                        </div>

                        {/* Metric Cards */}
                        <Grid container spacing={3} style={{ marginBottom: '24px' }}>
                            {[
                                { title: 'Available Booking', value: '60', icon: DirectionsCarIcon, color: '#0D2B4E' },
                                { title: 'Remaining Booking', value: '45', icon: GroupsIcon, color: '#0D2B4E' },
                                { title: 'Printing Paper', value: '150', icon: AccountBalanceWalletIcon, color: '#0D2B4E' },
                                { title: 'Over Due Amount', value: '60,000', icon: PaymentsIcon, color: '#0D2B4E' },
                            ].map((item, index) => (
                                <Grid item xs={10} sm={6} md={2.8} key={index}>
                                    <Card style={{ boxShadow: 'none', border: '1px solid #ccc', borderRadius: '8px', height: '100%', backgroundColor: 'white' }}>
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>{item.title}</Typography>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="h5" style={{ fontWeight: 'bold' }}>{item.value}</Typography>
                                                <div style={{ backgroundColor: item.color, borderRadius: '8px', padding: '8px' }}>
                                                    <item.icon style={{ color: '#fff' }} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Main Content: Table and Notifications */}
                        <Grid container spacing={3}>
                            {/* Booking Table */}
                            <Grid item xs={12} md={8}>
                                <TableContainer component={Paper} style={{ boxShadow: 'none', borderRadius:'1rem', border: '1px solid #ccc' }}>
                                    <Table>
                                        <TableHead style={{ backgroundColor: '#C5D9F0' }}>
                                            <TableRow>
                                                <TableCell style={{ color: 'black' }}>Booking ID</TableCell>
                                                <TableCell style={{ color: 'black' }}>Floor</TableCell>
                                                <TableCell style={{ color: 'black' }}>Seat/Room Name</TableCell>
                                                <TableCell style={{ color: 'black' }}>Booking Type</TableCell>
                                                <TableCell style={{ color: 'black' }}>Start Date</TableCell>
                                                <TableCell style={{ color: 'black' }}>End Date</TableCell>
                                                <TableCell style={{ color: 'black' }}>Status</TableCell>
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
                                                        <div style={{
                                                            backgroundColor: row.status === 'Complete' ? '#E8F5E9' :
                                                                row.status === 'Pending' ? '#FFF3E0' : '#FFEBEE',
                                                            color: row.status === 'Complete' ? '#2E7D32' :
                                                                row.status === 'Pending' ? '#E65100' : '#C62828',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            display: 'inline-block',
                                                        }}>
                                                            {row.status}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>

                            {/* Notifications Section */}
                            <div style={notificationsStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Notifications</h2>
                                    <div style={{ backgroundColor: '#0A2156', padding: '0.5rem', borderRadius: '0.375rem' }}>
                                        <Bell style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                                    </div>
                                </div>
                                <div style={{ marginTop: '0.5rem' }}>
                                    {notifications.map((notification, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                            <div style={{ marginTop: '0.05rem' }}>
                                                <notification.icon style={{ width: '1.25rem', height: '1.25rem', color: '#0A2156' }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <span style={{ fontWeight: '500', fontSize: '0.875rem', color: '#111827' }}>{notification.title}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#6B7280', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>{notification.time}</span>
                                                </div>
                                                <p style={{ fontSize: '0.875rem', color: '#4B5563', marginTop: '0.25rem', lineHeight: '1.25' }}>{notification.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Grid>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserDashboard
