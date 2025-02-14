import React from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PrintIcon from '@mui/icons-material/Print';
import { ArrowDownIcon, ArrowUpIcon, Bell, Building2, FileText, Building } from "lucide-react"
import { useNavigate } from "react-router-dom";

const bookingData = [
    { id: '#123', name: 'Ali', department: 'Digital Marketing', designation: 'Assistant', startDate: 'Jan 01, 2024', email: 'ali@gmail.com', branch:'Gulberg', status: 'Confirmed' },
    { id: '#123', name: 'Anas', department: 'Web Development', designation: 'Associate', startDate: 'Jan 15, 2024', email: 'ali@gmail.com', branch:'Gulberg', status: 'Confirmed' },
    { id: '#123', name: 'Arif', department: 'Manager', designation: 'Manager', startDate: 'Feb 01, 2024', email: 'ali@gmail.com', branch:'DHA', status: 'Cancelled' },
    { id: '#123', name: 'Ali', department: 'HR Management', designation: 'HR Officer', startDate: 'Feb 05, 2024', email: 'ali@gmail.com', branch:'Gulberg', status: 'Pending' },
    { id: '#123', name: 'Faraz', department: 'Social Media', designation: 'Associate', startDate: 'Feb 10, 2024', email: 'ali@gmail.com', branch:'DHA', status: 'Confirmed' },
    { id: '#123', name: 'Aisha', department: 'Office', designation: 'Office Boy', startDate: 'Feb 12, 2024', email: 'ali@gmail.com', branch:'DHA', status: 'Confirmed' },
    { id: '#123', name: 'Ash', department: 'Finance', designation: 'CFO', startDate: 'Feb 20, 2024', email: 'ali@gmail.com', branch:'Gulberg', status: 'Confirmed' },
    { id: '#123', name: 'Winnie', department: 'Admin', designation: 'Manager', startDate: 'Feb 25, 2024', email: 'ali@gmail.com', branch:'Gulberg', status: 'Confirmed' },
];

const EmployeeDashboard = () => {

    const navigate = useNavigate();

    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <div style={{ paddingTop: '1rem', backgroundColor: 'transparent' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', width: '98%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <Typography variant="h5" style={{ fontWeight: 'bold' }}>Employee Management</Typography>
                            <Button style={{ color: 'white', backgroundColor: '#0D2B4E' }}
                                onClick={() => navigate("/branch/employee/create")}>Add Employee</Button>
                        </div>

                        {/* Metric Cards */}
                        <div style={{ display: 'flex', width:'98%', justifyContent: 'space-between', gap:'1rem', marginBottom: '24px' }}>
                            {[
                                { title: 'Total Employees', value: '60', icon: EventSeatIcon, color: '#0D2B4E' },
                                { title: 'Total Present', value: '45', icon: PeopleIcon, color: '#0D2B4E' },
                                { title: 'Total Absent', value: '08', icon: AssignmentIcon, color: '#0D2B4E' },
                                { title: 'Late Arrival', value: '05', icon: PrintIcon, color: '#0D2B4E' },
                            ].map((item, index) => (
                                <div key={index} style={{ flex: 1, }}>
                                    <Card style={{ boxShadow: 'none', border: '1px solid #ccc', borderRadius: '8px', height: '100%', backgroundColor: 'white' }}>
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>{item.title}</Typography>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="h5" style={{ fontWeight: 'bold' }}>{item.value}</Typography>
                                                <div style={{ backgroundColor: item.color, borderRadius: '8px', padding: '0.5rem' }}>
                                                    <item.icon style={{ color: '#fff', width: '40px', height: '40px' }} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', marginBottom: '1rem', }}>
                            {/* Booking Table */}
                            <TableContainer component={Paper} style={{ width: '98%', backgroundColor: '#FFFFFF', borderRadius: '1rem', boxShadow: 'none', border: '1px solid #ccc', marginBottom: '24px' }}>
                                <Table>
                                    <TableHead style={{ backgroundColor: '#C5D9F0' }}>
                                        <TableRow>
                                            <TableCell style={{ color: 'black', fontWeight: '700' }}>EMP ID</TableCell>
                                            <TableCell style={{ color: 'black', fontWeight: '700' }}>Name</TableCell>
                                            <TableCell style={{ color: 'black', fontWeight: '700' }}>Department</TableCell>
                                            <TableCell style={{ color: 'black', fontWeight: '700' }}>Designation</TableCell>
                                            <TableCell style={{ color: 'black', fontWeight: '700' }}>Joining Date</TableCell>
                                            <TableCell style={{ color: 'black', fontWeight: '700' }}>Email Address</TableCell>
                                            <TableCell style={{ color: 'black', fontWeight: '700' }}>Branch Name</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bookingData.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.department}</TableCell>
                                                <TableCell>{row.designation}</TableCell>
                                                <TableCell>{row.startDate}</TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                <TableCell>{row.branch}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmployeeDashboard