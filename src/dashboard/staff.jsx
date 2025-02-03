import React from 'react'
import TopNavbar from '../topNavbar'
import Sidebar from '../leftSideBar'
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import user from '../assets/user2.png'

const Staff = () => {

    const navigate = useNavigate();

    return (
        <>
            <TopNavbar />
            <div className='main'>
                <div className='sideBarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
                    {/* Back Arrow */}
                    <div style={{ paddingTop: '1rem', display: "flex", alignItems: "center", marginBottom: "20px", cursor: "pointer" }}>
                        <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}>
                            <MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
                        </div>
                        <h2 style={{ margin: 0 }}>Add Staff</h2>
                    </div>
                    <div style={{ maxWidth: "90%", margin: "0 auto", padding: "20px", borderRadius: "10px", backgroundColor: "#F9FAFB", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>


                        {/* Form Container */}
                        <div style={{ display: "flex", gap: "20px" }}>
                            {/* Left Column */}
                            <div style={{
                                flex: "1",
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                {/* Profile Picture */}
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                                    <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                                        <img src={user} alt="" style={{
                                            width: '40px',
                                            height: '40px'
                                        }} />
                                        <div style={{ position: "absolute", bottom: "0.1px", right: "5px", backgroundColor: "#0D2B4E", color: "white", borderRadius: "50%", padding: "5px", cursor: "pointer" }}>📷</div>
                                    </div>
                                </div>

                                {/* Input Fields */}
                                <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
                                    {[
                                        { label: "Name", placeholder: "Enter full name" },
                                        { label: "Email", placeholder: "Enter email" },
                                        { label: "Phone Number", placeholder: "e.g. 03333333333" },
                                        { label: "Password", placeholder: "Enter your password", type: "password" }
                                    ].map((field, index) => (
                                        <div key={index} style={{ marginBottom: "10px" }}>
                                            <span style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>{field.label}</span>
                                            <input
                                                type={field.type || "text"}
                                                placeholder={field.placeholder}
                                                style={{
                                                    width: "100%",
                                                    padding: "10px",
                                                    margin: '0',
                                                    border: "1px solid #D1D5DB",
                                                    borderRadius: "5px"
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column */}
                            <div style={{
                                flex: "1",
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
                                    {/* Dropdowns */}
                                    <div style={{ marginBottom: "10px" }}>
                                        <span style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Meeting Room</span>
                                        <select style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "5px" }}>
                                            <option>Meeting</option>
                                        </select>
                                    </div>

                                    <div style={{ marginBottom: "10px" }}>
                                        <span style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Printing Papers</span>
                                        <select style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "5px" }}>
                                            <option>Select type</option>
                                        </select>
                                    </div>

                                    {/* Other Inputs */}
                                    {[
                                        { label: "Employ ID", placeholder: "23122" },
                                        { label: "Designation", placeholder: "Enter your designation" },
                                        { label: "Date Joined", placeholder: "Jan/10/2025" },
                                        { label: "Address", placeholder: "" }
                                    ].map((field, index) => (
                                        <div key={index} style={{ marginBottom: "10px" }}>
                                            <span style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>{field.label}</span>
                                            <input
                                                type="text"
                                                placeholder={field.placeholder}
                                                style={{ width: "100%", margin: '0', padding: "10px", border: "1px solid #D1D5DB", borderRadius: "5px" }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: "center", marginTop: "10px", marginBottom: '1rem' }}>
                            {/* Save Button */}
                            <button style={{ width: "40%", padding: "12px", backgroundColor: "#0D2B4E", color: "white", border: "none", borderRadius: "5px", fontSize: "16px", cursor: "pointer", marginTop: "10px" }}
                                onClick={() => navigate("/staff-archive")}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Staff