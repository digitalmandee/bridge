import React from 'react'
import colors from '../styles/color'
import profile from '../assets/Profile user.png'
const MemberDetail = ({ handleNext }) => {
    return (
        <>
            <form
                style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    width: "50%",
                    margin: "0 auto",
                    marginBottom: '1rem',
                }}
            >
                <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
                    <img
                        src={profile}
                        alt="Member Icon"
                        style={{ width: "25px", height: "25px", marginRight: "10px", marginBottom: '5px', verticalAlign: "middle" }}
                    />
                    Member Detail</h3>

                {/* Name Field */}
                <div style={{
                    maxWidth: "400px",
                    margin:'0 auto',
                    padding:0,
                    textAlign:'left'
                }}>
                    <div style={{ marginBottom: "15px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "5px",
                                fontWeight: "bold", // Optional: for better label visibility
                                marginLeft:0
                            }}
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                boxSizing: "border-box", // Ensures padding doesn't mess with dimensions
                                margin:0
                            }}
                        />
                    </div>

                    {/* Email Field */}
                    <div style={{ marginBottom: "15px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "5px",
                                fontWeight: "bold",
                            }}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                boxSizing: "border-box",
                                margin:0
                            }}
                        />
                    </div>

                    {/* Phone Number Field */}
                    <div style={{ marginBottom: "15px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "5px",
                                fontWeight: "bold",
                                
                            }}
                        >
                            Phone No
                        </label>
                        <input
                            type="tel"
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                boxSizing: "border-box",
                                margin:0
                            }}
                        />
                    </div>

                    {/* Individual/Company Dropdown */}
                    <div style={{ marginBottom: "15px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "5px",
                                fontWeight: "bold",
                            }}
                        >
                            Individual/Company
                        </label>
                        <select
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                boxSizing: "border-box",
                            }}
                        >
                            <option value="individual">Individual</option>
                            <option value="company">Company</option>
                        </select>
                    </div>
                    <div style={{ textAlign: "right", marginTop: "20px" }}>
                        <button
                            type="button"
                            style={{
                                padding: "10px 20px",
                                borderRadius: "5px",
                                backgroundColor: colors.primary,
                                color: "#fff",
                                border: "none",
                                fontSize: "16px",
                                cursor: "pointer",
                            }}
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default MemberDetail
