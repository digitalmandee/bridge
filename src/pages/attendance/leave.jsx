import React, { useState } from 'react'
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import {
    TextField,
    Select,
    MenuItem,
    Button,
    Card,
    CardContent,
    IconButton,
    Typography,
    FormControl,
    InputLabel,
} from "@mui/material"
import { ArrowBack, MoreVert } from "@mui/icons-material"
import "bootstrap/dist/css/bootstrap.min.css"

const LeaveCategory = () => {

    const navigate = useNavigate();

    const [clientName, setClientName] = useState("")
    const [selectedOption, setSelectedOption] = useState("")

    const leaveCategories = [
        { title: "Annual Leave" },
        { title: "Business Leave" },
        { title: "Casual Leave" },
        { title: "Maternity Leave" },
        { title: "Sick Leave" },
        { title: "Unpaid Leave" },
    ]

    const LeaveCard = ({ title }) => (
        <Card style={{
            flex: "1 1 calc(33.333% - 16px)",
            minWidth: "250px",
            padding: "16px",
            backgroundColor: "white",
            borderRadius: "12px",
            border: "1px solid #ccc",
            textAlign: "left",
            cursor: "pointer",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}>
            <CardContent>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <Typography variant="h6">{title}</Typography>
                    <IconButton size="small">
                        <MoreVert />
                    </IconButton>
                </div>
                <div style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <Typography variant="body2" color="textSecondary">Added</Typography>
                        <Typography variant="body2" color="textSecondary">Status</Typography>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2">10 Jun 2024</Typography>
                        <Typography variant="body2">Published</Typography>
                    </div>
                </div>
                <div>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: "6px" }}>Description</Typography>
                    <Typography variant="body2">Can be availed once a year</Typography>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <>
            <TopNavbar />
            <div className="main">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        <div onClick={() => navigate(-1)} style={{ cursor: "pointer", marginTop: '5px', display: "flex", alignItems: "center" }}>
                            <MdArrowBackIos style={{ fontSize: "20px", cursor: 'pointer' }} />
                        </div>
                        <h3 style={{ margin: 0 }}>Leave Category</h3>
                    </div>
                    <div style={{ marginBottom: "24px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                            <div style={{ flex: "1", maxWidth: "250px" }}>
                                <TextField
                                    fullWidth
                                    label="Enter Client name"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                />
                            </div>
                            <div style={{ flex: "1", maxWidth: "250px" }}>
                                <FormControl fullWidth>
                                    <InputLabel>Select one</InputLabel>
                                    <Select value={selectedOption} label="Select one" onChange={(e) => setSelectedOption(e.target.value)}>
                                        <MenuItem value="option1">Option 1</MenuItem>
                                        <MenuItem value="option2">Option 2</MenuItem>
                                        <MenuItem value="option3">Option 3</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{ maxWidth: "120px" }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    style={{
                                        backgroundColor: "#0A2647",
                                        color: "white",
                                        textTransform: "none",
                                        padding: "12px",
                                        fontSize: "16px",
                                    }}>
                                    Add
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Cards Section */}
                    <div style={{ display: "flex", width:'90%', flexWrap: "wrap", gap: "16px", justifyContent: "flex-start" }}>
                        {leaveCategories.map((category, index) => (
                            <LeaveCard key={index} title={category.title} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default LeaveCategory
