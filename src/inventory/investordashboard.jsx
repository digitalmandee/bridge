import React, { useState } from 'react'
import TopNavbar from '../topNavbar';
import Sidebar from '../leftSideBar';
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const InvestorDashboard = () => {

    const navigate = useNavigate();
    return (
        <>
            <TopNavbar />
            <div className='main'>
                <div className='sidebarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
                    <div style={{ 
                        display: 'flex', 
                        width: '98%',
                        marginTop:'2rem', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '24px' 
                        }}>
                        <Typography variant="h5" style={{ fontWeight: 'bold' }}>Investor Dashboard</Typography>
                        <Button style={{ color: 'white', backgroundColor: '#0D2B4E' }}
                            onClick={() => navigate("")}>New Entry</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InvestorDashboard
