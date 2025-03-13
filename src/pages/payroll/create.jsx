import React, { useState } from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Container
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateCheque = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        employName: '',
        amount: '20,3032',
        checkNumber: '232323674657'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add your form submission logic here
    };

    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        minHeight: "100vh",
                        padding: "1rem",
                        // backgroundColor: "#f5f5f5"
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 3
                            }}
                        >
                            <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                                <MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
                            </div>
                            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                                Create Cheque
                            </Typography>
                        </Box>

                        {/* Form Card */}
                        <div

                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexGrow: 1,  // Makes this div take up the remaining space and center the form
                                width: "100%"

                            }}
                        >

                            <div
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    maxWidth: '650px',
                                    width: "100%",
                                    backgroundColor: 'white',
                                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
                                }}
                            >

                                <form onSubmit={handleSubmit}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography
                                            variant="body1"
                                            component="label"
                                            htmlFor="employName"
                                            sx={{
                                                display: 'block',
                                                mb: 1,
                                                fontWeight: 'medium',
                                                color: '#333'
                                            }}
                                        >
                                            Employ Name
                                        </Typography>
                                        <TextField
                                            id="employName"
                                            name="employName"
                                            fullWidth
                                            placeholder="Enter your name"
                                            variant="outlined"
                                            value={formData.employName}
                                            onChange={handleChange}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '4px',
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography
                                            variant="body1"
                                            component="label"
                                            htmlFor="amount"
                                            sx={{
                                                display: 'block',
                                                mb: 1,
                                                fontWeight: 'medium',
                                                color: '#333'
                                            }}
                                        >
                                            Amount
                                        </Typography>
                                        <TextField
                                            id="amount"
                                            name="amount"
                                            fullWidth
                                            variant="outlined"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '4px',
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 4 }}>
                                        <Typography
                                            variant="body1"
                                            component="label"
                                            htmlFor="checkNumber"
                                            sx={{
                                                display: 'block',
                                                mb: 1,
                                                fontWeight: 'medium',
                                                color: '#333'
                                            }}
                                        >
                                            Check Number
                                        </Typography>
                                        <TextField
                                            id="checkNumber"
                                            name="checkNumber"
                                            fullWidth
                                            variant="outlined"
                                            value={formData.checkNumber}
                                            onChange={handleChange}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '4px',
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{
                                                bgcolor: '#0a2e52',
                                                '&:hover': { bgcolor: '#0a2e52cc' },
                                                borderRadius: '4px',
                                                textTransform: 'none',
                                                px: 3
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </Box>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateCheque
