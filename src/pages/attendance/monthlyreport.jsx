import React, { usestate } from 'react'
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import SearchIcon from "@mui/icons-material/Search";
import profile from "../../assets/profile.png"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";


const MonthlyReport = () => {
    const navigate = useNavigate();
    const employees = [
        {
            id: "20",
            name: "John Doe",
            designation: "Designer",
            image: profile,
            totalLeave: 6,
            totalAttendance: 30,
            timePresent: 10,
            timeLate: 0,
        },
        {
            id: "20",
            name: "John Doe",
            designation: "Designer",
            image: profile,
            totalLeave: 6,
            totalAttendance: 30,
            timePresent: 10,
            timeLate: 0,
        },
        {
            id: "20",
            name: "John Doe",
            designation: "Designer",
            image: profile,
            totalLeave: 6,
            totalAttendance: 30,
            timePresent: 10,
            timeLate: 0,
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
                    <div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        <div onClick={() => navigate(-1)} style={{ cursor: "pointer", marginTop: '5px', display: "flex", alignItems: "center" }}>
                            <MdArrowBackIos style={{ fontSize: "20px", cursor: 'pointer' }} />
                        </div>
                        <h3 style={{ margin: 0 }}>Attendance Report</h3>
                    </div>
                    <div style={{ padding: "24px", backgroundColor: "#F8F7FF", minHeight: "100vh" }}>
                        {/* Header Section */}
                        <div
                            style={{
                                display: "flex",
                                gap: "16px",
                                marginBottom: "24px",
                            }}
                        >
                            {/* Search Input */}
                            <div
                                style={{
                                    position: "relative",
                                    flex: "0 1 auto",
                                    maxWidth: "250px",
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    style={{
                                        width: "100%",
                                        padding: "8px 36px",
                                        fontSize: "14px",
                                        border: "1px solid #E0E0E0",
                                        borderRadius: "4px",
                                        backgroundColor: "white",
                                    }}
                                />
                                <SearchIcon
                                    style={{
                                        position: "absolute",
                                        left: "20px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#666",
                                    }}
                                />
                            </div>

                            {/* Date Input */}
                            <div style={{ position: "relative", maxWidth: "200px" }}>
                                <input
                                    type="text"
                                    placeholder="MM/DD/YYYY"
                                    style={{
                                        width: "100%",
                                        padding: "8px 36px",
                                        fontSize: "14px",
                                        border: "1px solid #E0E0E0",
                                        borderRadius: "4px",
                                        backgroundColor: "white",
                                    }}
                                />
                                <CalendarTodayIcon
                                    style={{
                                        position: "absolute",
                                        right: "1px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#666",
                                        // marginLeft:'1rem'
                                    }}
                                />
                            </div>

                            {/* Add Button */}
                            <button
                                style={{
                                    padding: "8px 24px",
                                    backgroundColor: "#0A2647",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    marginLeft: '0.5rem'
                                }}
                            >
                                Add
                            </button>
                        </div>

                        {/* Employee Cards Grid */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                gap: "24px",
                            }}
                        >
                            {employees.map((employee, index) => (
                                <div
                                    key={index}
                                    style={{
                                        backgroundColor: "white",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                    }}
                                >
                                    {/* Employee Info */}
                                    <div
                                        style={{
                                            padding: "24px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            borderBottom: "1px solid #E0E0E0",
                                        }}
                                    >
                                        {employee.image ? (
                                            <img
                                                src={employee.image || "/placeholder.svg"}
                                                alt={employee.name}
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    borderRadius: "50%",
                                                    marginBottom: "12px",
                                                    objectFit: "contain",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: "64px",
                                                    height: "64px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#F5F5F5",
                                                    marginBottom: "12px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <span style={{ color: "#666" }}>👤</span>
                                            </div>
                                        )}
                                        <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>Employ ID : {employee.id}</div>
                                        <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "4px" }}>{employee.name}</div>
                                        <div style={{ color: "#666", fontSize: "14px" }}>{employee.designation}</div>
                                    </div>

                                    {/* Statistics */}
                                    <div style={{ padding: "16px 24px", backgroundColor: "#FFFFFF" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginBottom: "16px",
                                            }}
                                        >
                                            <div style={{
                                                backgroundColor: "#F5F6FA",
                                                width: "100%",
                                                maxWidth: '120px',
                                                borderRadius: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexDirection: "column",
                                                padding: "10px"
                                            }}>
                                                <div style={{ fontSize: "20px", fontWeight: "500" }}>{employee.totalLeave}</div>
                                                <div style={{ color: "#666", fontSize: "12px" }}>Total Leave</div>
                                            </div>
                                            <div style={{
                                                backgroundColor: "#F5F6FA",
                                                width: "100%",
                                                maxWidth: '120px',
                                                borderRadius: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexDirection: "column",
                                                padding: "10px"
                                            }}>
                                                <div style={{ fontSize: "20px", fontWeight: "500" }}>{employee.totalAttendance}</div>
                                                <div style={{ color: "#666", fontSize: "12px" }}>Total Attendance</div>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div style={{
                                                backgroundColor: "#F5F6FA",
                                                width: "100%",
                                                maxWidth: '120px',
                                                borderRadius: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexDirection: "column",
                                                padding: "10px"
                                            }}>
                                                <div style={{ fontSize: "20px", fontWeight: "500" }}>{employee.timePresent}</div>
                                                <div style={{ color: "#666", fontSize: "12px" }}>Time Present</div>
                                            </div>
                                            <div style={{
                                                backgroundColor: "#F5F6FA",
                                                width: "100%",
                                                maxWidth: '120px',
                                                borderRadius: "10px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexDirection: "column",
                                                padding: "10px"
                                            }}>
                                                <div style={{ fontSize: "20px", fontWeight: "500" }}>{employee.timeLate}</div>
                                                <div style={{ color: "#666", fontSize: "12px" }}>Time Late</div>
                                            </div>
                                        </div>
                                        <div style={{ height: "8px", backgroundColor: "#0A2647", marginTop: "auto" }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MonthlyReport
