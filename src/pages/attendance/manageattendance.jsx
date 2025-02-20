import React, { useState } from 'react'
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, TextField, Checkbox, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';

const ManageAttendance = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState('');
    const [page, setPage] = useState(1);

    const attendanceData = [
        { id: 1, name: 'John Doe', designation: 'Social Media', attendance: true, leaveCategory: 'Casual', checkIn: '10:00', checkOut: '16:00', status: 'Save' },
        { id: 2, name: 'John Doe', designation: 'Social Media', attendance: false, leaveCategory: 'Sick', checkIn: '10:00', checkOut: '16:00', status: 'Updated' },
        { id: 3, name: 'John Doe', designation: 'Social Media', attendance: true, leaveCategory: 'Business', checkIn: '10:00', checkOut: '16:00', status: 'Save' },
        { id: 4, name: 'John Doe', designation: 'Social Media', attendance: false, leaveCategory: 'Casual', checkIn: '10:00', checkOut: '16:00', status: 'Updated' },
        { id: 5, name: 'John Doe', designation: 'Social Media', attendance: true, leaveCategory: 'Sick', checkIn: '10:00', checkOut: '16:00', status: 'Save' },
    ];

    const handleSearch = () => {
        // Implement search functionality
        console.log('Searching:', searchQuery);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };


    return (
        <>
            <TopNavbar />
            <div className="main">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        <div onClick={() => navigate(-1)} style={{ cursor: "pointer", marginTop: '5px', display: "flex", alignItems: "center" }}>
                            <MdArrowBackIos style={{ fontSize: "20px", cursor: 'pointer' }} />
                        </div>
                        <h3 style={{ margin: 0 }}>Management Attendance</h3>
                    </div>
                    <div className="d-flex mb-4">
                        <TextField
                            size="small"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="me-2"
                            style={{ backgroundColor: 'white' }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            style={{
                                backgroundColor: '#0A2647',
                                color: 'white',
                                textTransform: 'none',
                                minWidth: '80px'
                            }}
                        >
                            Go
                        </Button>
                    </div>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead style={{ backgroundColor: '#f8f9fa' }}>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Employ Name</TableCell>
                                    <TableCell>Designation</TableCell>
                                    <TableCell>Attendance</TableCell>
                                    <TableCell>Leave Category</TableCell>
                                    <TableCell>Check-In</TableCell>
                                    <TableCell>Check-Out</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attendanceData.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.designation}</TableCell>
                                        <TableCell>
                                            <Checkbox checked={row.attendance} color="primary" />
                                        </TableCell>
                                        <TableCell>{row.leaveCategory}</TableCell>
                                        <TableCell>{row.checkIn}</TableCell>
                                        <TableCell>{row.checkOut}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                style={{
                                                    backgroundColor: row.status === 'Save' ? '#0A2647' : '#e3f2fd',
                                                    color: row.status === 'Save' ? 'white' : '#0A2647',
                                                    textTransform: 'none'
                                                }}
                                            >
                                                {row.status}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <div className="d-flex justify-content-end mt-4">
                        <Pagination
                            count={10}
                            page={page}
                            onChange={handlePageChange}
                            shape="rounded"
                            style={{ color: '#0a2647' }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageAttendance
