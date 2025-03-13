import React from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Box, TextField, Typography, Button, Card, CardContent, Grid } from "@mui/material"

const CreateReport = () => {
    const navigate = useNavigate();

    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px", cursor: "pointer" }}>
                        <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
                        </div>
                        <h4 style={{ margin: 0 }}>New Entry</h4>
                    </div>
                    <Box
                        sx={{
                            minHeight: "100vh",
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            p: 3,
                            bgcolor: "#f8f9fa",
                        }}
                    >
                        <Card
                            sx={{
                                width: "100%",
                                maxWidth: 800,
                                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                                borderRadius: 2,
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Grid container spacing={3}>
                                    {/* Category and Description */}
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Category
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Rent Income"
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#fff",
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Description
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Description"
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#fff",
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Amount and Quantity */}
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Amount
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Enter Amount"
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#fff",
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Quantity
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            defaultValue="2"
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#fff",
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Status and Date */}
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Status
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Paid"
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#fff",
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            Date
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            defaultValue="Dec 01, 2025"
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#fff",
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Save Button */}
                                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                mt: 2,
                                                px: 6,
                                                py: 1,
                                                bgcolor: "#0A2647",
                                                "&:hover": {
                                                    bgcolor: "#0A2647",
                                                },
                                                textTransform: "none",
                                                borderRadius: 1,
                                                minWidth: "120px",
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Box>
                </div>
            </div>
        </>
    )
}

export default CreateReport
