import React from 'react'
import TopNavbar from '../topNavbar';
import Sidebar from '../leftSideBar';
import {
    TextField,
    Typography,
    Avatar,
    Chip,
    Box,
    IconButton,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ThemeProvider,
    createTheme,
    InputAdornment,
} from "@mui/material"
import { ArrowBack, Search } from "@mui/icons-material"
import "bootstrap/dist/css/bootstrap.min.css"

const theme = createTheme({
    palette: {
        primary: {
            main: "#002B5B",
        },
        secondary: {
            main: "#E8F1FF",
        },
        text: {
            primary: "#212529",
            secondary: "#6C757D",
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        h6: {
            fontWeight: 600,
            fontSize: "1.1rem",
        },
        body2: {
            fontSize: "0.875rem",
        },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: "#dee2e6",
                    padding: "1rem",
                    whiteSpace: "nowrap",
                },
                head: {
                    fontWeight: 600,
                    backgroundColor: "#f8f9fa",
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&:last-child td": {
                        borderBottom: 0,
                    },
                },
            },
        },
    },
})

// Sample user data
const users = [
    {
        id: 1,
        username: "Username",
        suffix: "at digit",
        location: "Lahore",
        avatar: "/placeholder.svg?height=40&width=40",
        lastLogin: "Today",
        status: "Active",
        profile: "Public",
        terms: "Agree",
    },
    {
        id: 2,
        username: "Username",
        suffix: "at digit",
        location: "Lahore",
        avatar: "/placeholder.svg?height=40&width=40",
        lastLogin: "Today",
        status: "Active",
        profile: "Public",
        terms: "Agree",
    },
    {
        id: 3,
        username: "Username",
        suffix: "at digit",
        location: "Lahore",
        avatar: "/placeholder.svg?height=40&width=40",
        lastLogin: "Today",
        status: "Active",
        profile: "Public",
        terms: "Agree",
    },
    {
        id: 4,
        username: "Username",
        suffix: "at digit",
        location: "Lahore",
        avatar: "/placeholder.svg?height=40&width=40",
        lastLogin: "Today",
        status: "Active",
        profile: "Public",
        terms: "Agree",
    },
    {
        id: 5,
        username: "Username",
        suffix: "at digit",
        location: "Lahore",
        avatar: "/placeholder.svg?height=40&width=40",
        lastLogin: "Today",
        status: "Active",
        profile: "Public",
        terms: "Agree",
    },
]

const MemberUser = () => {
    return (
        <>
            <TopNavbar />
            <div className='main'>
                <div className='sidebarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
                    <ThemeProvider theme={theme}>
                        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
                            {/* Header */}
                            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                                <IconButton sx={{ mr: 1 }} size="small">
                                    <ArrowBack />
                                </IconButton>
                                <Typography variant="h6" component="h1">
                                    User
                                </Typography>
                            </Box>

                            {/* Search */}
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    placeholder="Search"
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search sx={{ color: "#6C757D", fontSize: "1.25rem" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        maxWidth: "300px",
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "4px",
                                            backgroundColor: "#fff",
                                            "& fieldset": {
                                                borderColor: "#dee2e6",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#dee2e6",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#002B5B",
                                            },
                                        },
                                    }}
                                />
                            </Box>

                            {/* User List */}
                            <TableContainer component={Paper} sx={{ mb: 3 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Company</TableCell>
                                            <TableCell>Last login</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Profile</TableCell>
                                            <TableCell>Terms & Condition</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                        <Avatar src={user.avatar} />
                                                        <Box>
                                                            <Typography>
                                                                {user.username} <span style={{ color: "#6C757D", fontSize: "0.875rem" }}>{user.suffix}</span>
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                                            >
                                                                <span style={{ fontSize: "10px" }}>●</span> {user.location}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{user.lastLogin}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label="Active"
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: "#002B5B",
                                                            color: "#fff",
                                                            borderRadius: "4px",
                                                            height: "24px",
                                                            fontSize: "0.75rem",
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label="Public"
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: "#E8F1FF",
                                                            color: "#002B5B",
                                                            borderRadius: "4px",
                                                            height: "24px",
                                                            fontSize: "0.75rem",
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{user.terms}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Pagination */}
                            <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
                                <Pagination count={10} />
                            </Box>
                        </div>
                    </ThemeProvider>
                </div>
            </div>
        </>
    )
}

export default MemberUser
