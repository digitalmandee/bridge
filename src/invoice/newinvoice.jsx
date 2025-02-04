import React, { useState } from 'react'
import TopNavbar from '../topNavbar'
import Sidebar from '../leftSideBar'
import { TextField, Button, Box, Grid, Typography, Card, CardContent, CardActions, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";

const NewInvoice = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        issueDate: '2024-05-04',
        company: '',
        address: '',
        email: '',
        taxId: '',
        taxRate: 0,
        invoiceText: '',
        notes: '',
        file: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                file: file
            });
        }
    };

    const handleFileRemove = () => {
        setFormData({
            ...formData,
            file: null
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };


    return (
        <>
            <TopNavbar />
            <div className='main d-flex'>
                <div className='sideBarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
                    <div style={{ paddingTop: '1rem', display: "flex", alignItems: "center", marginBottom: "20px", cursor: "pointer" }}>
                        <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}>
                            <MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
                        </div>
                        <h4 style={{ margin: 0 }}>New Invoice</h4>
                    </div>
                    <div style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '100%', maxWidth: '600px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    {/* Issue Date */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Issue Date"
                                            type="date"
                                            fullWidth
                                            name="issueDate"
                                            value={formData.issueDate}
                                            onChange={handleChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    {/* Company */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Company"
                                            fullWidth
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            variant="outlined"
                                            placeholder="Company"
                                        />
                                    </Grid>
                                    {/* Address */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Address"
                                            fullWidth
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            variant="outlined"
                                            multiline
                                            rows={4}
                                            placeholder="Enter address.."
                                        />
                                    </Grid>
                                    {/* Billing Mail */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Billing Mail"
                                            fullWidth
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            variant="outlined"
                                            placeholder="Eg @gmail.com"
                                        />
                                    </Grid>
                                    {/* Tax ID */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Tax ID"
                                            fullWidth
                                            name="taxId"
                                            value={formData.taxId}
                                            onChange={handleChange}
                                            variant="outlined"
                                            placeholder="Tax ID"
                                        />
                                    </Grid>
                                    {/* Tax Rate */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Tax Rate"
                                            type="number"
                                            fullWidth
                                            name="taxRate"
                                            value={formData.taxRate}
                                            onChange={handleChange}
                                            variant="outlined"
                                            placeholder="Tax Rate"
                                        />
                                    </Grid>
                                    {/* Add Item File Input */}
                                    <Grid item xs={12} container justifyContent="center">
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px dotted #ccc', padding: '10px', borderRadius: '10px', width: '100%' }}>
                                            <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>Add Item</label>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                        {/* Display selected file name and cancel button */}
                                        {formData.file && (
                                            <div style={{ marginTop: '10px' }}>
                                                <Typography variant="body2">{formData.file.name}</Typography>
                                                <Button variant="outlined" color="secondary" onClick={handleFileRemove}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                    </Grid>
                                    {/* Invoice Text */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Invoice Text"
                                            fullWidth
                                            name="invoiceText"
                                            value={formData.invoiceText}
                                            onChange={handleChange}
                                            variant="outlined"
                                            multiline
                                            rows={4}
                                        />
                                    </Grid>
                                    {/* Notes */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Notes (Only visible to admins)"
                                            fullWidth
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            variant="outlined"
                                            multiline
                                            rows={4}
                                        />
                                    </Grid>
                                </Grid>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        sx={{ bgcolor: '#0D2B4E', '&:hover': { bgcolor: '#0B1E3E' } }} // Set the background color and hover effect
                                        onClick={()=>navigate('/show-invoice')}
                                    >
                                        Save Invoice
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewInvoice
