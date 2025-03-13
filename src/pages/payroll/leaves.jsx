import React, { useState } from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";
import {
    Box,
    Typography,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Pagination,
    InputAdornment,
} from "@mui/material"
import { ArrowBack, MoreVert, Search, CheckCircle, Cancel } from "@mui/icons-material"

const EmployeeLeave = () => {

    const navigate = useNavigate();

    const [leaves, setLeaves] = useState([
        { id: 1, employee: "Gladys", fromTo: "-", availableAmount: "12.00", leaveType: "-", reason: "-", status: "active" },
        {
            id: 2,
            employee: "Gladys",
            fromTo: "-",
            availableAmount: "20.00",
            leaveType: "-",
            reason: "-",
            status: "inactive",
        },
        { id: 3, employee: "Gladys", fromTo: "-", availableAmount: "30.00", leaveType: "-", reason: "-", status: "active" },
        { id: 4, employee: "Gladys", fromTo: "-", availableAmount: "40.00", leaveType: "-", reason: "-", status: "active" },
    ])

    // State for the menu
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedLeave, setSelectedLeave] = useState(null)

    // State for the delete confirmation dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

    // Handle opening the menu
    const handleMenuOpen = (event, leave) => {
        setAnchorEl(event.currentTarget)
        setSelectedLeave(leave)
    }

    // Handle closing the menu
    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    // Handle delete option
    const handleDeleteClick = () => {
        setOpenDeleteDialog(true)
        handleMenuClose()
    }

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        setLeaves(leaves.filter((leave) => leave.id !== selectedLeave.id))
        setOpenDeleteDialog(false)
    }

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setOpenDeleteDialog(false)
    }

    // Handle active/inactive toggle
    const handleToggleStatus = () => {
        setLeaves(
            leaves.map((leave) => {
                if (leave.id === selectedLeave.id) {
                    return {
                        ...leave,
                        status: leave.status === "active" ? "inactive" : "active",
                    }
                }
                return leave
            }),
        )
        handleMenuClose()
    }

    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <Box
                        sx={{
                            maxWidth: "100%",
                            // bgcolor: "#f8f9fa",
                            borderRadius: "8px",
                            // boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                            overflow: "hidden",
                            p: 2,
                        }}
                    >
                        {/* Header */}
                        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                            <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                                <MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
                            </div>
                            <Typography variant="h6" component="h1" sx={{ ml: 1, fontWeight: "medium" }}>
                                Employ leaves
                            </Typography>
                        </Box>

                        {/* Search Box */}
                        <Box sx={{ mb: 3, width: '25%' }}>
                            <TextField
                                placeholder="Search name..."
                                variant="outlined"
                                size="small"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: "text.secondary" }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: "4px",
                                        bgcolor: "white",
                                        "& fieldset": {
                                            borderColor: "#e0e0e0",
                                        },
                                    },
                                }}
                            />
                        </Box>

                        {/* Table */}
                        <TableContainer component={Paper} sx={{ boxShadow: "none", mb: 2 }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#E6EDF5" }}>
                                        <TableCell sx={{ fontWeight: "bold" }}>Employee Name</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>From-To</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Available Amount</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Leave Type</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {leaves.map((leave) => (
                                        <TableRow key={leave.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                {leave.employee}
                                            </TableCell>
                                            <TableCell>{leave.fromTo}</TableCell>
                                            <TableCell>{leave.availableAmount}</TableCell>
                                            <TableCell>{leave.leaveType}</TableCell>
                                            <TableCell>{leave.reason}</TableCell>
                                            <TableCell>
                                                {leave.status === "active" ? (
                                                    <CheckCircle sx={{ color: "success.main" }} />
                                                ) : (
                                                    <Cancel sx={{ color: "error.main" }} />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="more"
                                                    aria-controls="long-menu"
                                                    aria-haspopup="true"
                                                    onClick={(e) => handleMenuOpen(e, leave)}
                                                >
                                                    <MoreVert />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
                            <Pagination count={10} />
                        </Box>

                        {/* Menu */}
                        <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                            <MenuItem onClick={handleToggleStatus}>
                                {selectedLeave && selectedLeave.status === "active" ? "Deactivate" : "Activate"}
                            </MenuItem>
                        </Menu>

                        {/* Delete Confirmation Dialog */}
                        <Dialog
                            open={openDeleteDialog}
                            onClose={handleDeleteCancel}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to delete this leave record?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleDeleteCancel} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </div>
            </div>
        </>
    )
}

export default EmployeeLeave
