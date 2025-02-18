import React, { useState } from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useLocation } from 'react-router-dom';
import {
    Grid, Typography, Card, IconButton, FormControlLabel, Radio, RadioGroup, Select, Chip,
    FormControl, CardContent, TableCell, TableHead, Link, TableContainer, Table, TableBody, TableRow, Avatar, Button, Divider, List, ListItem, ListItemText, Paper, TextField, MenuItem
} from "@mui/material";
import user from '../../assets/profile user.png';
import { FileDownload } from "@mui/icons-material"
import MoreVertIcon from "@mui/icons-material/MoreVert"

const salaryDetails = [
    { category: "Basic Salary", amount: 30000 },
    { category: "Bonus", amount: 200 },
    { category: "Deductions", amount: -100 },
    { category: "Net Salary", amount: 30000 },
]

const paymentInfo = {
    method: "Bank transfer",
    accountNumber: "1234 5678 9012",
    date: "Dec 01, 2024",
    status: "Paid",
}

const noticeInfo = {
    method: "Bank Transfer Problem",
    date: "Dec 01, 2024",
    status: "Read",
}

function MembershipCard({ userData }) {
    return (
        <Card
            style={{
                borderRadius: "16px",
                boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.25)",
                position: "relative",
            }}
        >
            <IconButton
                style={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                }}
            >
                <MoreVertIcon />
            </IconButton>

            <CardContent>
                <Grid container direction="column" alignItems="center" style={{ marginBottom: "20px" }}>
                    <Grid item>
                        <Avatar
                            src={userData.avatar}
                            style={{
                                width: 80,
                                height: 80,
                                marginBottom: 16,
                                border: "2px solid #fff",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" style={{ fontWeight: 500, marginBottom: "4px" }}>
                            {userData.name}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography style={{ color: "#64748B", fontSize: "14px" }}>{userData.type}</Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography style={{ color: "#64748B", fontSize: "14px" }}>Membership ID</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography style={{ color: "#64748B", fontSize: "14px", textAlign: 'right' }}>Membership Type</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography style={{ fontSize: "14px" }}>{userData.membershipId}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography style={{ fontSize: "14px", textAlign: "right" }}>{userData.membershipType}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography style={{ color: "#64748B", fontSize: "14px" }}>Expiration</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography style={{ color: "#64748B", fontSize: "14px", textAlign:'right' }}>Status</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography style={{ fontSize: "14px" }}>{userData.expiration}</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography
                            style={{
                                fontSize: "14px",
                                textAlign: "right",
                                color: userData.status === "Active" ? "#2E7D32" : "#D32F2F",
                            }}
                        >
                            {userData.status}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

const EmployeeDetails = () => {

    const location = useLocation();
    const employee = location.state?.employee || {};
    const [selectedTab, setSelectedTab] = useState("personal");
    const [month, setMonth] = useState("January")
    const [filter, setFilter] = useState("all")

    const attendanceData = [
        {
            id: "01",
            date: "Jan 01, 2024",
            checkIn: "09:00",
            checkOut: "16:00",
            status: "Present",
        },
        {
            id: "02",
            date: "Jan 01, 2024",
            checkIn: "10:00",
            checkOut: "16:00",
            status: "Absent",
        },
        {
            id: "02",
            date: "Jan 01, 2024",
            checkIn: "11:00",
            checkOut: "16:00",
            status: "Present",
        },
    ]

    const membersData = [
        {
            id: 1,
            name: "User Name",
            type: "Company/Individual",
            membershipId: "021",
            membershipType: "Gold",
            expiration: "Jan/10/25",
            status: "Active",
            avatar: "user",
        },
        {
            id: 2,
            name: "User Name",
            type: "Company/Individual",
            membershipId: "021",
            membershipType: "Gold",
            expiration: "Jan/10/25",
            status: "Active",
            avatar: "user",
        },
        {
            id: 3,
            name: "User Name",
            type: "Company/Individual",
            membershipId: "021",
            membershipType: "Gold",
            expiration: "Jan/10/25",
            status: "Active",
            avatar: "user",
        },
    ]

    const getStatusChipColor = (status) => {
        return {
            backgroundColor: status === "Present" ? "#E2E8F0" : "#FFF3E0",
            color: status === "Present" ? "#64748B" : "#ED6C02",
        }
    }

    const menuOptions = [
        { key: "personal", label: "Personal Details" },
        { key: "salary", label: "Salary" },
        { key: "notice", label: "Notice Period" },
        { key: "attendance", label: "Attendance" },
        { key: "membership", label: "Membership" }
    ];

    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    {/* <div style={{ display: "flex", padding: "2rem", backgroundColor:'white', width: "100%", height: "100vh" }}> */}
                    <Grid container spacing={0} style={{
                        padding: '3rem',
                        display: "flex", width: "100%", height: "100vh", alignItems: "stretch"
                    }}>
                        {/* Left Panel - Profile Section */}
                        <Grid item xs={12} md={3.5} style={{
                            display: "flex", flexDirection: "column", height: "100%"
                        }}>
                            <Paper style={{ paddingTop: '2rem', textAlign: "center", height: "100%", display: "flex", flexDirection: "column" }}>
                                <Avatar
                                    src={user}
                                    alt="Profile"
                                    sx={{ width: 100, height: 100, margin: "auto", }}
                                />
                                <Typography variant="text" sx={{ mt: 2, fontWeight: "600", fontSize: '20px', font: 'Nunito Sans' }}>
                                    {employee.name}
                                </Typography>
                                {/* Navigation Menu */}
                                <List sx={{ flexGrow: 1, mt: 1 }}>
                                    {menuOptions.map((option) => (
                                        <ListItem
                                            button
                                            key={option.key}
                                            onClick={() => setSelectedTab(option.key)}
                                            selected={selectedTab === option.key}
                                            sx={{
                                                width: '100%',
                                                background: selectedTab === option.key
                                                    ? "linear-gradient(to right, silver 98%, #0D2B4E 2%)"
                                                    : "transparent",
                                                paddingLeft: '2rem', // Remove any horizontal padding
                                                paddingBottom: '1rem',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <ListItemText primary={option.label} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>

                        {/* Right Panel - Dynamic Form Section */}
                        <Grid item xs={12} md={8} style={{ display: "flex", flexDirection: "column", height: "100%", marginBottom: '1rem' }}>
                            <Paper style={{ padding: "1.5rem", height: "100%", display: "flex", flexDirection: "column" }}>
                                <div style={{ flexGrow: 1, overflowY: "auto", paddingRight: "1rem" }}>
                                    {selectedTab === "personal" && (
                                        <>
                                            <Typography variant="h6">Personal Detail</Typography>
                                            <Divider sx={{ backgroundColor: 'black', height: 2, marginTop: 1 }} />
                                            <Grid container spacing={2} style={{
                                                marginTop: '0.5rem'
                                            }}>
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="body2" fontWeight="bold">Employee Name</Typography>
                                                    <TextField
                                                        fullWidth
                                                        value={employee.name || "N/A"}
                                                        margin="normal"
                                                        disabled
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="body2" fontWeight="bold">Employee ID</Typography>
                                                    <TextField
                                                        fullWidth
                                                        value={employee.id || "N/A"}
                                                        margin="normal"
                                                        disabled
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="body2" fontWeight="bold">National ID</Typography>
                                                    <TextField
                                                        fullWidth
                                                        value={employee.nationalID || "N/A"}
                                                        margin="normal"
                                                        disabled
                                                        variant="outlined"
                                                    />
                                                </Grid>

                                                {/* Bank Account Number */}
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="body2" fontWeight="bold">Bank Account Number</Typography>
                                                    <TextField
                                                        fullWidth
                                                        value={employee.bankAccount || "N/A"}
                                                        margin="normal"
                                                        disabled
                                                        variant="outlined"
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="body2" fontWeight="bold">Gender</Typography>
                                                    <TextField fullWidth value={employee.gender || "N/A"} margin="normal" disabled variant="outlined" />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="body2" fontWeight="bold">Marital Status</Typography>
                                                    <TextField fullWidth value={employee.maritalStatus || "N/A"} margin="normal" disabled variant="outlined" />
                                                </Grid>



                                                <Grid item xs={12}>
                                                    <Divider sx={{ backgroundColor: 'black', height: 0.01, marginY: 1 }} />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Typography variant="h6" fontWeight="">Contact Detail</Typography>
                                                    <Divider sx={{ backgroundColor: 'black', height: 2, marginTop: 1 }} />
                                                </Grid>



                                                {/* Email */}
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="body2" fontWeight="bold">Email</Typography>
                                                    <TextField
                                                        fullWidth
                                                        value={employee.email || "N/A"}
                                                        margin="normal"
                                                        disabled
                                                        variant="outlined"
                                                    />
                                                </Grid>

                                                {/* Contact Number */}
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="body2" fontWeight="bold">Contact Number</Typography>
                                                    <TextField
                                                        fullWidth
                                                        value={employee.contact || "N/A"}
                                                        margin="normal"
                                                        disabled
                                                        variant="outlined"
                                                    />
                                                </Grid>

                                                {/* Emergency Contact */}
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="body2" fontWeight="bold">Emergency Number</Typography>
                                                    <TextField
                                                        fullWidth
                                                        value={employee.emergencyContact || "N/A"}
                                                        margin="normal"
                                                        disabled
                                                        variant="outlined"
                                                    />
                                                </Grid>

                                                <Divider sx={{ backgroundColor: 'black', height: 5, marginTop: 1 }} />

                                                {/* Address (Full width to avoid cramping) */}
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="body2" fontWeight="bold">Address</Typography>
                                                    <TextField
                                                        fullWidth
                                                        value={employee.address || "N/A"}
                                                        margin="normal"
                                                        disabled
                                                        variant="outlined"

                                                    />
                                                </Grid>

                                                <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                                                    <Button
                                                        variant="contained"
                                                        sx={{ backgroundColor: "#0D2B4E", "&:hover": { backgroundColor: "#0A223D" } }}
                                                    >
                                                        Save
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </>
                                    )}

                                    {selectedTab === "salary" && (
                                        <>
                                            <Grid container justifyContent="center">
                                                <Grid item xs={12}>
                                                    {/* Salary Detail Section */}

                                                    <CardContent>
                                                        <Typography variant="h6" gutterBottom>
                                                            Salary Detail
                                                        </Typography>
                                                        <Divider sx={{ backgroundColor: 'black', height: 0.01, marginTop: 1 }} />

                                                        <TableContainer component={Paper} elevation={0} sx={{ marginTop: '1rem' }}>
                                                            <Table>
                                                                {/* Table Header */}
                                                                <TableHead>
                                                                    <TableRow sx={{ backgroundColor: "#DDEAFB" }}>
                                                                        <TableCell sx={{ fontWeight: "bold", border: "1px solid #B0BEC5" }}>Category</TableCell>
                                                                        <TableCell sx={{ fontWeight: "bold", border: "1px solid #B0BEC5" }} align="left">Amount</TableCell>
                                                                    </TableRow>
                                                                </TableHead>

                                                                {/* Table Body */}
                                                                <TableBody>
                                                                    {salaryDetails.map((row) => (
                                                                        <TableRow key={row.category}>
                                                                            <TableCell
                                                                                component="th"
                                                                                scope="row"
                                                                                sx={{

                                                                                    width: "50%",
                                                                                    border: "1px solid #B0BEC5"
                                                                                }}
                                                                            >
                                                                                {row.category}
                                                                            </TableCell>
                                                                            <TableCell align="left" sx={{ border: "1px solid #B0BEC5" }}>
                                                                                {row.amount.toLocaleString()}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </CardContent>



                                                    {/* Payment Information Section */}
                                                    <Grid item xs={12}>

                                                        <CardContent>
                                                            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                                                <Grid item>
                                                                    <Typography variant="h6">Payment Information</Typography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Link href="#" underline="show" sx={{ color: "black" }}>
                                                                        View all
                                                                    </Link>
                                                                </Grid>

                                                            </Grid>
                                                            <Divider sx={{ backgroundColor: 'black', height: 0.01, marginTop: 1 }} />

                                                            <TableContainer component={Paper} elevation={0} style={{
                                                                marginTop: '1rem'
                                                            }}>
                                                                <Table>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell sx={{ backgroundColor: "#DDEAFB" }}>Payment Method</TableCell>
                                                                            <TableCell sx={{ backgroundColor: "#DDEAFB" }}>Bank Account</TableCell>
                                                                            <TableCell sx={{ backgroundColor: "#DDEAFB" }}>Payment Date</TableCell>
                                                                            <TableCell sx={{ backgroundColor: "#DDEAFB" }}>Status</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        <TableRow>
                                                                            <TableCell>{paymentInfo.method}</TableCell>
                                                                            <TableCell>{paymentInfo.accountNumber}</TableCell>
                                                                            <TableCell>{paymentInfo.date}</TableCell>
                                                                            <TableCell>{paymentInfo.status}</TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>

                                                            <Grid container justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
                                                                <Grid item>
                                                                    <Button variant="outlined" sx={{ textTransform: "none" }}>
                                                                        Export
                                                                    </Button>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Button
                                                                        variant="contained"
                                                                        sx={{
                                                                            bgcolor: "#0A2647",
                                                                            "&:hover": {
                                                                                bgcolor: "#0A2647",
                                                                            },
                                                                            textTransform: "none",
                                                                        }}
                                                                    >
                                                                        Save
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>

                                                    </Grid>

                                                </Grid>
                                            </Grid>
                                        </>
                                    )}

                                    {selectedTab === "notice" && (
                                        <Grid container justifyContent="center">
                                            <Grid item xs={12}>
                                                <CardContent>
                                                    <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                                        <Grid item>
                                                            <Typography variant="h6">Notice</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Divider sx={{ backgroundColor: 'black', height: 0.01, marginTop: 1 }} />

                                                    <TableContainer component={Paper} elevation={0} style={{
                                                        marginTop: '1rem'
                                                    }}>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell sx={{ backgroundColor: "#DDEAFB" }}>Notice</TableCell>
                                                                    <TableCell sx={{ backgroundColor: "#DDEAFB" }}>Date</TableCell>
                                                                    <TableCell sx={{ backgroundColor: "#DDEAFB" }}>Status</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell>{noticeInfo.method}</TableCell>
                                                                    <TableCell>{noticeInfo.date}</TableCell>
                                                                    <TableCell>{paymentInfo.status}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </CardContent>
                                            </Grid>
                                        </Grid>
                                    )}

                                    {selectedTab === "attendance" && (
                                        <Grid container justifyContent="center">
                                            <Grid item xs={12}>

                                                <CardContent>
                                                    {/* Header */}
                                                    <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                                        <Grid item>
                                                            <Typography variant="h6">Attendance Report</Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <FormControl size="small">
                                                                <Select value={month} onChange={(e) => setMonth(e.target.value)} sx={{ minWidth: 120 }}>
                                                                    <MenuItem value="January">January</MenuItem>
                                                                    <MenuItem value="February">February</MenuItem>
                                                                    <MenuItem value="March">March</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>

                                                    </Grid>
                                                    <Divider sx={{ backgroundColor: 'black', height: 0.01, }} />

                                                    {/* Filter Options */}
                                                    <Grid container spacing={2} style={{
                                                        justifyContent: 'flex-end'
                                                    }}>
                                                        <Grid item>
                                                            <FormControl>
                                                                <RadioGroup row value={filter} onChange={(e) => setFilter(e.target.value)}>
                                                                    <FormControlLabel value="all" control={<Radio size="small" />} label="All" />
                                                                    <FormControlLabel value="present" control={<Radio size="small" />} label="Present" />
                                                                    <FormControlLabel value="absent" control={<Radio size="small" />} label="Absent" />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>

                                                    {/* Table */}
                                                    <TableContainer component={Paper} elevation={0}>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell sx={{ backgroundColor: "#DDEAFB" }}>#</TableCell>
                                                                    <TableCell sx={{ backgroundColor: "#DDEAFB" }}>Date</TableCell>
                                                                    <TableCell sx={{ backgroundColor: "#DDEAFB" }}>Check-in</TableCell>
                                                                    <TableCell sx={{ backgroundColor: "#DDEAFB" }}>Check-out</TableCell>
                                                                    <TableCell sx={{ backgroundColor: "#DDEAFB" }}>Status</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {attendanceData.map((row) => (
                                                                    <TableRow key={row.id + row.checkIn}>
                                                                        <TableCell>{row.id}</TableCell>
                                                                        <TableCell>{row.date}</TableCell>
                                                                        <TableCell>{row.checkIn}</TableCell>
                                                                        <TableCell>{row.checkOut}</TableCell>
                                                                        <TableCell>
                                                                            <Chip
                                                                                label={row.status}
                                                                                size="small"
                                                                                sx={{
                                                                                    ...getStatusChipColor(row.status),
                                                                                    borderRadius: "4px",
                                                                                    fontWeight: 500,
                                                                                }}
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>

                                                    {/* Export Button */}
                                                    <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<FileDownload />}
                                                            sx={{
                                                                bgcolor: "#0A2647",
                                                                "&:hover": {
                                                                    bgcolor: "#0A2647",
                                                                },
                                                                textTransform: "none",
                                                            }}
                                                        >
                                                            Export
                                                        </Button>
                                                    </Grid>
                                                </CardContent>

                                            </Grid>
                                        </Grid>
                                    )}

                                    {selectedTab === "membership" && (
                                        <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                                            <Typography variant="h5" style={{ marginBottom: "24px" }}>
                                                Membership Card
                                            </Typography>

                                            <Grid container spacing={2}>
                                                {membersData.map((member) => (
                                                    <Grid item xs={12} sm={6} key={member.id}>
                                                        <MembershipCard userData={member} />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </div>
                                    )}
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>

                </div>
            </div>
        </>
    )
}

export default EmployeeDetails