import React, { useState } from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";
import {
    Container,
    Paper,
    Typography,
    Button,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import "bootstrap/dist/css/bootstrap.min.css"

const PaySlip = () => {
    const navigate = useNavigate();

    const employeeData = {
        name: "Zahid Ullah",
        id: "02323",
        department: "Web Design",
        designation: "UI/UX Design",
        payslipDate: "10 / Jan / 2025",
        payableDays: 30,
        presentDays: 10,
        absentDays: 20,
    }

    const salaryComponents = [
        { name: "Basic Salary", grossPay: "10,000", deduction: "00.00", amount: "0.0" },
        { name: "House Rent", grossPay: "10,000", deduction: "00.00", amount: "0.0" },
        { name: "Fuel Allowance", grossPay: "10,000", deduction: "00.00", amount: "0.0" },
        { name: "Advance Salary", grossPay: "10,000", deduction: "00.00", amount: "0.0" },
        { name: "Tax Deduction", grossPay: "10,000", deduction: "00.00", amount: "0.0" },
    ]

    const totalAmount = "20,0000"
    const totalNetPay = "20,0000"
    const amountInWords = "Two Hundred Thousand"

    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <Container sx={{ py: 1 }}>
                        {/* Header */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h5" component="div" sx={{ display: "flex", alignItems: "center" }}>
                                <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                                    <MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
                                </div> 
                                Payslip
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: "#0a2351",
                                    "&:hover": { bgcolor: "#0a2351" },
                                    borderRadius: "4px",
                                    px: 3,
                                }}
                            >
                                Export
                            </Button>
                        </Box>

                        {/* Main Content */}
                        <Paper
                            elevation={0}
                            sx={{
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                overflow: "hidden",
                            }}
                        >
                            {/* Company Info and Date */}
                            <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <Grid item>
                                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0a2351" }}>
                                            Co-Work
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ color: "#0a2351" }}>
                                            @NASTP
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" sx={{ color: "#666", textAlign: "right" }}>
                                            Payslip Date
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                                            {employeeData.payslipDate}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Employee Details and Net Pay */}
                            <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body2" sx={{ color: "#666" }}>
                                                    Employee Name :
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={8}>
                                                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                                                    {employeeData.name}
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body2" sx={{ color: "#666" }}>
                                                    Employee ID :
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={8}>
                                                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                                                    {employeeData.id}
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body2" sx={{ color: "#666" }}>
                                                    Department :
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={8}>
                                                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                                                    {employeeData.department}
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body2" sx={{ color: "#666" }}>
                                                    Designation :
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={8}>
                                                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                                                    {employeeData.designation}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                bgcolor: "#f9f9f9",
                                                borderRadius: "4px",
                                                border: "1px solid #e0e0e0"
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ mb: 1, fontWeight: "medium" }}>
                                                Net Pay
                                            </Typography>
                                            <Grid container spacing={1}>
                                                <Grid item xs={8}>
                                                    <Typography variant="body2" sx={{ color: "#666", textAlign: "right" }}>
                                                        Payable Days :
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography variant="body2" sx={{ fontWeight: "medium", textAlign: "right" }}>
                                                        {employeeData.payableDays}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={8}>
                                                    <Typography variant="body2" sx={{ color: "#666", textAlign: "right" }}>
                                                        Present Days :
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography variant="body2" sx={{ fontWeight: "medium", textAlign: "right" }}>
                                                        {employeeData.presentDays}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={8}>
                                                    <Typography variant="body2" sx={{ color: "#666", textAlign: "right" }}>
                                                        Absent Days :
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography variant="body2" sx={{ fontWeight: "medium", textAlign: "right" }}>
                                                        {employeeData.absentDays}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Salary Breakdown */}
                            <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
                                    Salary Breakup
                                </Typography>

                                <TableContainer component={Paper} elevation={0}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
                                                <TableCell>Salary Component</TableCell>
                                                <TableCell align="right">Gross Pay</TableCell>
                                                <TableCell align="right">Deduction</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {salaryComponents.map((component, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{component.name}</TableCell>
                                                    <TableCell align="right">{component.grossPay}</TableCell>
                                                    <TableCell align="right">{component.deduction}</TableCell>
                                                    <TableCell align="right">{component.amount}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
                                                <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                                    {totalAmount}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                                    00.00
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                                                    00.00
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            {/* Total Net Pay */}
                            <Box sx={{ p: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                    Total Net Pay
                                    <Box component="span" sx={{ ml: 2 }}>
                                        {totalNetPay} ( {amountInWords} )
                                    </Box>
                                </Typography>
                            </Box>
                        </Paper>
                    </Container>
                </div>
            </div>
        </>
    )
}

export default PaySlip
