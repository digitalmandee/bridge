import React, { useState } from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";
import { Button, Modal, Box, Typography, Paper, Grid, IconButton } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import "bootstrap/dist/css/bootstrap.min.css"
import colors from '@/assets/styles/color';

const PayrollSummary = () => {
    const navigate = useNavigate();
    const { branch } = useParams();

    const [open, setOpen] = useState(false)

    // State for form values
    const [formValues, setFormValues] = useState({
        basicSalary: "10,0000",
        houseRent: "10,0000",
        fuelAllowance: "10,0000",
        healthInsurance: "10,0000",
        childrenAllowance: "10,0000",
        miscellaneous: "10,0000",
    })

    // Handle modal open/close
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    // Handle form submission
    const handleSubmit = () => {
        navigate(`/${branch}/branch/payroll/payslip`)
        handleClose()
    }

    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <div className="container-fluid p-0">
                        {/* Header */}
                        <div className="p-3 d-flex align-items-center">
                            <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                                <MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
                            </div>
                            <Typography variant="h5" component="div" style={{ marginLeft: 8, color: 'black' }}>
                                Payroll Process Summary
                            </Typography>
                        </div>

                        {/* Main Content */}
                        <Paper elevation={1} style={{ margin: 16, padding: 16, borderRadius: 4 }}>
                            {/* Employee Details */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <div className="mb-3">
                                        <label className="text-muted">Employee Name</label>
                                        <div>Zahid Ullah</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="text-muted">Employee ID</label>
                                        <div>02323</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="text-muted">Department</label>
                                        <div>Web Design</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="text-muted">Designation</label>
                                        <div>UI/UX Design</div>
                                    </div>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <div className="mb-3">
                                        <label className="text-muted">Payable Days :</label>
                                        <div>30</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="text-muted">Present Days</label>
                                        <div>10</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="text-muted">Absent Days</label>
                                        <div>20</div>
                                    </div>
                                </Grid>
                            </Grid>

                            {/* Salary Table */}
                            <div className="table-responsive mt-4">
                                <table className="table ">
                                    <thead style={{ backgroundColor: "#D9D9D9" }}>
                                        <tr>
                                            <th>Salary Component</th>
                                            <th>Gross Pay</th>
                                            <th>Deduction</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Basic Salary</td>
                                            <td>
                                                <div className="form-group mb-0">
                                                    <small className="text-muted">Enter Amount*</small>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formValues.basicSalary}
                                                        onChange={(e) => setFormValues({ ...formValues, basicSalary: e.target.value })}
                                                    />
                                                </div>
                                            </td>
                                            <td>Health Insurance</td>
                                            <td>
                                                <div className="form-group mb-0">
                                                    <small className="text-muted">Enter Amount*</small>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formValues.healthInsurance}
                                                        onChange={(e) => setFormValues({ ...formValues, healthInsurance: e.target.value })}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>House Rent</td>
                                            <td>
                                                <div className="form-group mb-0">
                                                    <small className="text-muted">Enter Amount*</small>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formValues.houseRent}
                                                        onChange={(e) => setFormValues({ ...formValues, houseRent: e.target.value })}
                                                    />
                                                </div>
                                            </td>
                                            <td>Children Allowance</td>
                                            <td>
                                                <div className="form-group mb-0">
                                                    <small className="text-muted">Enter Amount*</small>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formValues.childrenAllowance}
                                                        onChange={(e) => setFormValues({ ...formValues, childrenAllowance: e.target.value })}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Fuel Allowance</td>
                                            <td>
                                                <div className="form-group mb-0">
                                                    <small className="text-muted">Enter Amount*</small>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formValues.fuelAllowance}
                                                        onChange={(e) => setFormValues({ ...formValues, fuelAllowance: e.target.value })}
                                                    />
                                                </div>
                                            </td>
                                            <td>Miscellaneous</td>
                                            <td>
                                                <div className="form-group mb-0">
                                                    <small className="text-muted">Enter Amount*</small>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formValues.miscellaneous}
                                                        onChange={(e) => setFormValues({ ...formValues, miscellaneous: e.target.value })}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Total Salary</strong>
                                            </td>
                                            <td>
                                                <strong>20,0000</strong>
                                            </td>
                                            <td></td>
                                            <td>
                                                <strong>1000</strong>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Submit Button */}
                            <div className="d-flex justify-content-end mt-3">
                                <Button
                                    variant="contained"
                                    onClick={handleOpen}
                                    style={{
                                        backgroundColor: colors.primary,
                                        color: "white",
                                        borderRadius: "4px",
                                        padding: "8px 16px",
                                    }}
                                >
                                    Submit
                                </Button>
                            </div>
                        </Paper>

                        {/* Confirmation Modal */}
                        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: 400,
                                    bgcolor: "background.paper",
                                    borderRadius: 2,
                                    boxShadow: 24,
                                    p: 4,
                                    textAlign: "center",
                                }}
                            >
                                <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
                                    Are you sure you want to submit?
                                </Typography>
                                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                                    <Button
                                        onClick={handleClose}
                                        color="secondary"
                                        sx={{
                                            backgroundColor: '#FFFFFF',
                                            // width:'50px',
                                            // p:2,
                                            border: '1px solid #000000',
                                            color: '#000000', // Ensures text is visible on white
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5', // Optional: light gray on hover
                                                border: '1px solid #000000',
                                            },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        sx={{
                                            borderRadius: 1,
                                            px: 3,
                                            bgcolor: colors.primary,
                                            "&:hover": {
                                                bgcolor: colors.primary,
                                            },
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Box>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PayrollSummary
