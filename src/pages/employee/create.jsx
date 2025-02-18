import React from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { TextField, Button, Typography, MenuItem, Box, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";

const EmployeeCreate = () => {

    const navigate = useNavigate();

    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <MdArrowBackIos style={{ fontSize: "20px", cursor: 'pointer' }} />
                        </div>
                        <h3 style={{ margin: 0 }}>Personal Detail</h3>
                    </div>
                    <Box
                        sx={{
                            padding: "2rem",
                            backgroundColor: "white",
                            borderRadius: "1rem",
                            maxWidth: "65rem",
                            margin: "auto",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        <form
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                gap: "16px"
                            }}
                        >

                            {/* Common styling for input fields */}
                            {[
                                { label: "Employee Name", placeholder: "First Name" },
                                { label: "Employee ID*", placeholder: "12345" },
                                { label: "Designation", placeholder: "HR Manager" },
                                { label: "E-mail", placeholder: "Abc@gmail.com" },
                                { label: "Phone Number", placeholder: "030-0000000" },
                                { label: "Salary", placeholder: "300-10000" }
                            ].map((field, index) => (
                                <Box key={index}>
                                    <Typography variant='body1' sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.6)", marginBottom: "1rem" }}>
                                        {field.label}
                                    </Typography>
                                    <TextField
                                        placeholder={field.placeholder}
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </Box>
                            ))}

                            {/* Department */}
                            <Box>
                                {/* Label as Typography (Only One Label Now) */}
                                <Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.6)", marginBottom: "1rem" }}>
                                    Department
                                </Typography>

                                <FormControl fullWidth sx={{ borderRadius: "8px" }}>
                                    <Select defaultValue="" displayEmpty>
                                        {/* Placeholder as a Disabled MenuItem */}
                                        <MenuItem value="" disabled sx={{ color: "rgba(0, 0, 0, 0.5)" }}>
                                            Select Department
                                        </MenuItem>
                                        <MenuItem value="Social Media">Social Media</MenuItem>
                                        <MenuItem value="Finance">Finance</MenuItem>
                                        <MenuItem value="HR">HR</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Joining Date */}
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.6)", marginBottom: "1rem" }}>
                                    Joining Date
                                </Typography>
                                <TextField
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    sx={{
                                        // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", 
                                        borderRadius: "8px"
                                    }}
                                />
                            </Box>

                            {/* Location */}
                            <Box>
                                {/* Label as Typography (Only One Label Now) */}
                                <Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.6)", marginBottom: "1rem" }}>
                                    Location
                                </Typography>

                                <FormControl fullWidth sx={{ borderRadius: "8px" }}>
                                    <Select defaultValue="" displayEmpty>
                                        {/* Placeholder as a Disabled MenuItem */}
                                        <MenuItem value="" disabled sx={{ color: "rgba(0, 0, 0, 0.5)" }}>
                                            Select Location
                                        </MenuItem>
                                        <MenuItem value="Branch 1">Branch 1</MenuItem>
                                        <MenuItem value="Branch 2">Branch 2</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                        </form>

                        {/* Buttons */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "24px", gap: "12px" }}>
                            <Button variant="contained" 
                            sx={{
                                backgroundColor:"white",
                                color:'black'
                            }}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#0D2B4E", color: "white", "&:hover": { backgroundColor: "#09213A" } }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </div>
            </div>
        </>
    )
}

export default EmployeeCreate
