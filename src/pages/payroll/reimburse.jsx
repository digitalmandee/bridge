import React, { useState } from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";
import {
    Box,
    Typography,
    IconButton,
    Select,
    MenuItem,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    InputAdornment,
    Pagination,
} from "@mui/material"
import { ArrowBack, Search, Add, MoreVert, Edit, Delete } from "@mui/icons-material"

const Reimbursement = () => {
    const navigate = useNavigate();

    const tableData = [
        { id: 1, name: "Gladys", reimbursement: "-", amount: "10.00", appliedOn: "-", comments: "-", status: "Paid" },
        { id: 2, name: "Gladys", reimbursement: "-", amount: "20.00", appliedOn: "-", comments: "-", status: "Unpaid" },
        { id: 3, name: "Gladys", reimbursement: "-", amount: "30.00", appliedOn: "-", comments: "-", status: "Paid" },
        { id: 4, name: "Gladys", reimbursement: "-", amount: "40.00", appliedOn: "-", comments: "-", status: "Paid" },
    ]

    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    {/* Header */}
                    <Box sx={{ display: "flex", alignItems: "center", m: 3 }}>
                        <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
                        </div>
                        <Typography variant="h6">Reimbursements</Typography>
                    </Box>

                    {/* Filters */}
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <Select displayEmpty size="small" sx={{ minWidth: 200 }} defaultValue="">
                                <MenuItem value="">Select Department</MenuItem>
                            </Select>

                            <Select displayEmpty size="small" sx={{ minWidth: 200 }} defaultValue="">
                                <MenuItem value="">Select Employee</MenuItem>
                            </Select>

                            <Select displayEmpty size="small" sx={{ minWidth: 200 }} defaultValue="">
                                <MenuItem value="">Select Designation</MenuItem>
                            </Select>

                            <Select displayEmpty size="small" sx={{ minWidth: 200 }} defaultValue="">
                                <MenuItem value="">Select Reimbursement</MenuItem>
                            </Select>

                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: "#0A2647",
                                    "&:hover": { bgcolor: "#0A2647" },
                                    px: 4,
                                }}
                            >
                                Submit
                            </Button>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                            <TextField
                                size="small"
                                placeholder="Search"
                                sx={{ width: 250 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <IconButton
                                sx={{
                                    bgcolor: "#0A2647",
                                    color: "white",
                                    "&:hover": { bgcolor: "#0A2647" },
                                }}
                            >
                                <Add />
                            </IconButton>
                        </Box>
                    </Paper>

                    {/* Table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                                <TableRow>
                                    <TableCell>Employ Name</TableCell>
                                    <TableCell>Reimbursement</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Applied on</TableCell>
                                    <TableCell>Comments</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.reimbursement}</TableCell>
                                        <TableCell>{row.amount}</TableCell>
                                        <TableCell>{row.appliedOn}</TableCell>
                                        <TableCell>{row.comments}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.status}
                                                size="small"
                                                sx={{
                                                    bgcolor: row.status === "Paid" ? "#0A2647" : "#e0e0e0",
                                                    color: row.status === "Paid" ? "white" : "text.primary",
                                                    borderRadius: 1,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                                <IconButton size="small">
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small">
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small">
                                                    <MoreVert fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <Pagination count={10} shape="rounded" siblingCount={1} boundaryCount={1} />
                    </Box>
                </div>
            </div>
        </>
    )
}

export default Reimbursement
