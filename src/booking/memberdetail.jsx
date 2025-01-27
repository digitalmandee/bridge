import React from 'react'
import colors from '../styles/color'
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
                <h3 style={{ textAlign: "center", marginBottom: "20px" }}>🧑 Member Detail</h3>

                {/* Name Field */}
                <div style={{
                    maxWidth: "400px", margin: "0 auto"
                }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Name</label>
                    <input
                        type="text"
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    />

                    {/* Email Field */}
                    <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
                    <input
                        type="email"
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    />

                    {/* Phone Number Field */}
                    <label style={{ display: "block", marginBottom: "5px" }}>Phone No</label>
                    <input
                        type="tel"
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    />

                    {/* Individual/Company Dropdown */}
                    <label style={{ display: "block", marginBottom: "5px" }}>Individual/Company</label>
                    <select
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    >
                        <option value="individual">Individual</option>
                        <option value="company">Company</option>
                    </select>
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
