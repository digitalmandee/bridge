import React, { useState } from 'react'
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import { useNavigate } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { MdArrowBackIos } from "react-icons/md";

const NewApplication = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: "",
        startDate: "",
        endDate: "",
        reason: "",
    })
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
                        <h3 style={{ margin: 0 }}>New Leave Application</h3>
                    </div>
                    <div
                        style={{
                            maxWidth: "600px",
                            margin: "20px auto",
                            padding: "24px",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                    >
                        {/* Leave Category */}
                        <div style={{ marginBottom: "20px" }}>
                            <div
                                style={{
                                    fontSize: "14px",
                                    color: "#333",
                                    marginBottom: "8px",
                                }}
                            >
                                Leave Category
                            </div>
                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                }}
                            >
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "8px 12px",
                                        fontSize: "14px",
                                        border: "1px solid #E0E0E0",
                                        borderRadius: "4px",
                                        appearance: "none",
                                        backgroundColor: "white",
                                        color: formData.category ? "#333" : "#666",
                                    }}
                                >
                                    <option value="">Select one</option>
                                    <option value="sick">Sick Leave</option>
                                    <option value="vacation">Vacation</option>
                                    <option value="personal">Personal Leave</option>
                                </select>
                                <div
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        pointerEvents: "none",
                                    }}
                                >
                                    <KeyboardArrowDownIcon style={{ color: "#666", fontSize: "20px" }} />
                                </div>
                            </div>
                        </div>

                        {/* Date Fields */}
                        <div
                            style={{
                                display: "flex",
                                gap: "20px",
                                marginBottom: "20px",
                            }}
                        >
                            {/* Start Date */}
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: "14px",
                                        color: "#333",
                                        marginBottom: "8px",
                                    }}
                                >
                                    Start Date
                                </div>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type="text"
                                        placeholder="MM/DD/YYYY"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            fontSize: "14px",
                                            border: "1px solid #E0E0E0",
                                            borderRadius: "4px",
                                            color: "#333",
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: "absolute",
                                            right: "12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            pointerEvents: "none",
                                        }}
                                    >
                                        <CalendarTodayIcon style={{ color: "#666", fontSize: "20px" }} />
                                    </div>
                                </div>
                            </div>

                            {/* End Date */}
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: "14px",
                                        color: "#333",
                                        marginBottom: "8px",
                                    }}
                                >
                                    End Date
                                </div>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type="text"
                                        placeholder="MM/DD/YYYY"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            fontSize: "14px",
                                            border: "1px solid #E0E0E0",
                                            borderRadius: "4px",
                                            color: "#333",
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: "absolute",
                                            right: "12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            pointerEvents: "none",
                                        }}
                                    >
                                        <CalendarTodayIcon style={{ color: "#666", fontSize: "20px" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reason */}
                        <div style={{ marginBottom: "24px" }}>
                            <div
                                style={{
                                    fontSize: "14px",
                                    color: "#333",
                                    marginBottom: "8px",
                                }}
                            >
                                Reason <span style={{ color: "#FF0000" }}>*</span>
                            </div>
                            <textarea
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="Enter your reason.."
                                style={{
                                    width: "100%",
                                    height: "120px",
                                    padding: "12px",
                                    fontSize: "14px",
                                    border: "1px solid #E0E0E0",
                                    borderRadius: "4px",
                                    resize: "none",
                                    color: "#333",
                                }}
                            />
                        </div>

                        {/* Buttons */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "12px",
                            }}
                        >
                            <button
                                style={{
                                    padding: "8px 16px",
                                    fontSize: "14px",
                                    border: "1px solid #E0E0E0",
                                    borderRadius: "4px",
                                    backgroundColor: "white",
                                    color: "#666",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                style={{
                                    padding: "8px 16px",
                                    fontSize: "14px",
                                    border: "none",
                                    borderRadius: "4px",
                                    backgroundColor: "#0A2647",
                                    color: "white",
                                    cursor: "pointer",
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewApplication
