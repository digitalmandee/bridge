import React from 'react'
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"
import CategoryIcon from "@mui/icons-material/Category"
import AssignmentIcon from "@mui/icons-material/Assignment"
import SettingsIcon from "@mui/icons-material/Settings"
import BarChartIcon from "@mui/icons-material/BarChart"
import DescriptionIcon from "@mui/icons-material/Description"
import EventNoteIcon from "@mui/icons-material/EventNote"
import { useNavigate } from "react-router-dom";

const AttendanceDashboard = () => {

    const navigate = useNavigate();

    const employees = [
        {
            id: "#01",
            name: "Cody",
            department: "Digital Marketing",
            designation: "Social Media",
            joiningDate: "Dec 01, 2024",
            email: "abc@gmail.com",
        },
        {
            id: "#02",
            name: "Dianne",
            department: "Web Development",
            designation: "Developer",
            joiningDate: "Dec 01, 2024",
            email: "abc@gmail.com",
        },
        {
            id: "#03",
            name: "Esther",
            department: "Finance Management",
            designation: "Manager",
            joiningDate: "Dec 01, 2024",
            email: "abc@gmail.com",
        },
        {
            id: "#04",
            name: "Shawn",
            department: "Accounts",
            designation: "Accountant",
            joiningDate: "Dec 01, 2024",
            email: "abc@gmail.com",
        },
        {
            id: "#05",
            name: "Gladys",
            department: "HR Management",
            designation: "HR",
            joiningDate: "Dec 01, 2024",
            email: "abc@gmail.com",
        },
    ]

    return (
        <>
            <TopNavbar />
            <div className="main">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <div style={{ paddingTop: '1rem', backgroundColor: 'transparent' }}>
                        <div style={{ display: 'flex', width: '98%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <Typography variant="text" style={{ fontWeight: '500', fontSize: '24px' }}>Application Dashboard</Typography>
                            <Button style={{ color: 'white', backgroundColor: '#0D2B4E' }}
                                onClick={() => navigate('/branch/employee/leave/new/application')}>New Application</Button>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: "50px",
                                width: "98%",
                                marginBottom: "24px",
                            }}
                        >
                            {[
                                {
                                    label: "Leave Category",
                                    icon: <CategoryIcon style={{ color: "#FF9933" }} />,
                                    bgColor: "#FFF2E5",
                                    borderColor: "#FFE0C2",
                                    path: "/branch/employee/leave/category",
                                },
                                {
                                    label: "Leave Application",
                                    icon: <AssignmentIcon style={{ color: "#FF66B2" }} />,
                                    bgColor: "#FFE5F1",
                                    borderColor: "#FCCFEF",
                                    path: "/branch/employee/leave/application",
                                },
                                {
                                    label: "Leave Management",
                                    icon: <SettingsIcon style={{ color: "#33CC33" }} />,
                                    bgColor: "#E5FFE5",
                                    borderColor: "#A4FFBF",
                                    path: "/branch/employee/leave/management",
                                },
                                {
                                    label: "Leave Report",
                                    icon: <BarChartIcon style={{ color: "#6666FF" }} />,
                                    bgColor: "#E5E5FF",
                                    borderColor: "#BEC0FF",
                                    path: "/branch/employee/leave/report",
                                },
                                {
                                    label: "Manage Attendance",
                                    icon: <AssignmentIcon style={{ color: "#FF9933" }} />,
                                    bgColor: "#FFF2E5",
                                    borderColor: "#F8EF91",
                                    path: "/branch/employee/manage/attendance",
                                },
                                {
                                    label: "Monthly Report",
                                    icon: <DescriptionIcon style={{ color: "#33CC33" }} />,
                                    bgColor: "#F2FFF2",
                                    borderColor: "#A6FFD7",
                                    path: "/branch/employee/attendance/monthly/report",
                                },
                                {
                                    label: "Attendance Report",
                                    icon: <EventNoteIcon style={{ color: "#33CC33" }} />,
                                    bgColor: "#F0FFF0",
                                    borderColor: "#B8FF8F",
                                    path: "/branch/employee/attendance/report",
                                },
                                {
                                    label: "Leave Reports",
                                    icon: <BarChartIcon style={{ color: "#6666FF" }} />,
                                    bgColor: "#E5E5FF",
                                    borderColor: "#BEC0FF",
                                    path: "",
                                },
                            ].map((card, index) => (
                                <div
                                    key={index}
                                    style={{
                                        flex: "1 1 calc(25% - 50px)", // 4 items per row
                                        maxWidth: "220px",
                                        maxHeight: "160px",
                                        padding: "20px",
                                        backgroundColor: "white",
                                        borderRadius: "12px",
                                        border: `2px solid ${card.borderColor}`,
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                    }}
                                    onClick={() => card.path && navigate(card.path)}
                                >
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            backgroundColor: card.bgColor,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        {card.icon}
                                    </div>
                                    <div style={{ fontSize: "14px", color: "#333" }}>{card.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Employee List Section */}
                        <div style={{ backgroundColor: "white", width: '98%', borderRadius: "12px", padding: "24px" }}>
                            <div style={{ marginBottom: "24px" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: '0 1rem'
                                    }}
                                >
                                    <div style={{ fontSize: "18px", fontWeight: "500" }}>Employee List</div>
                                    <div style={{ position: "relative", width: '250px' }}>
                                        <input
                                            type="text"
                                            placeholder="Find by name"
                                            style={{
                                                width: "100%",
                                                padding: "8px 16px 8px 40px",
                                                border: "1px solid #E0E0E0",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                            }}
                                        />
                                        <SearchIcon
                                            style={{
                                                position: "absolute",
                                                left: "1.5rem",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                color: "#666",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "1px solid #E0E0E0" }}>
                                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#666", fontWeight: "500" }}>EMP ID</th>
                                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#666", fontWeight: "500" }}>Name</th>
                                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#666", fontWeight: "500" }}>
                                                Department
                                            </th>
                                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#666", fontWeight: "500" }}>
                                                Designation
                                            </th>
                                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#666", fontWeight: "500" }}>
                                                Joining Date
                                            </th>
                                            <th style={{ padding: "12px 16px", textAlign: "left", color: "#666", fontWeight: "500" }}>
                                                Email Address
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees.map((employee) => (
                                            <tr key={employee.id} style={{ borderBottom: "1px solid #E0E0E0" }}>
                                                <td style={{ padding: "12px 16px", color: "#333" }}>{employee.id}</td>
                                                <td style={{ padding: "12px 16px", color: "#333" }}>{employee.name}</td>
                                                <td style={{ padding: "12px 16px", color: "#333" }}>{employee.department}</td>
                                                <td style={{ padding: "12px 16px", color: "#333" }}>{employee.designation}</td>
                                                <td style={{ padding: "12px 16px", color: "#333" }}>{employee.joiningDate}</td>
                                                <td style={{ padding: "12px 16px", color: "#333" }}>{employee.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginTop: "24px",
                                }}
                            >
                                <button
                                    style={{
                                        padding: "8px",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    <NavigateBeforeIcon />
                                </button>
                                {[1, 2, 3, 4, 5, "....", 10].map((page, index) => (
                                    <button
                                        key={index}
                                        style={{
                                            padding: "8px 12px",
                                            border: "none",
                                            borderRadius: "50px",
                                            backgroundColor: page === 1 ? "#E5E5FF" : "transparent",
                                            color: page === 1 ? "#6666FF" : "#666",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    style={{
                                        padding: "8px",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    <NavigateNextIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AttendanceDashboard