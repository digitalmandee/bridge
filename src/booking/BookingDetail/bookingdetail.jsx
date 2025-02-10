import React from 'react'
import booking from '../../assets/Booking.png'
import colors from '../../styles/color'
const BookingDetail = ({ handlePrevious, handleNext }) => {
    return (
        <>
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    width: "50%",
                    // maxWidth: "400px",
                    margin: "0 auto",
                    marginBottom: '1rem',
                }}
            >
                <h3
                    style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        fontFamily: "Nunito Sans, sans-serif",
                        fontSize: "24px",
                        fontWeight: "600",
                    }}
                >
                    <img
                        src={booking}
                        alt="Booking Icon"
                        style={{ width: "25px", height: "25px", marginRight: "10px", marginBottom: '5px', verticalAlign: "middle" }}
                    />
                    Booking Detail
                </h3>

                {/* Booking Form */}
                <div style={{
                    maxWidth: "400px",
                    margin: '0 auto',
                    padding: 0,
                    textAlign: 'left'
                }}>
                    <div style={{ marginBottom: "10px" }}>
                        <label style={{
                            display: "block",
                            marginBottom: "5px",
                            fontWeight: "400", // Optional: for better label visibility
                            marginLeft: 0
                        }}>
                            Date
                        </label>
                        <input
                            type="date"
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                boxSizing: "border-box", // Ensures padding doesn't mess with dimensions
                                margin: 0
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label style={{
                            display: "block",
                            marginBottom: "5px",
                            fontWeight: "400", // Optional: for better label visibility
                            marginLeft: 0
                        }}>
                            Time
                        </label>
                        <input
                            type="time"
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                boxSizing: "border-box", // Ensures padding doesn't mess with dimensions
                                margin: 0
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label style={{
                            display: "block",
                            marginBottom: "5px",
                            fontWeight: "400", // Optional: for better label visibility
                            marginLeft: 0
                        }}>Duration</label>
                        <select
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                boxSizing: "border-box", // Ensures padding doesn't mess with dimensions
                                margin: 0
                            }}
                        >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label style={{
                            display: "block",
                            marginBottom: "5px",
                            fontWeight: "400", // Optional: for better label visibility
                            marginLeft: 0
                        }}>Select Plan</label>
                        <select
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                boxSizing: "border-box", // Ensures padding doesn't mess with dimensions
                                margin: 0
                            }}
                        >
                            <option value="Premium">Premium</option>
                            <option value="Gold">Gold</option>
                            <option value="Silver">Silver</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", width:'50%' }}>
                        <button
                            type="button"
                            style={{
                                padding: "10px 20px",
                                borderRadius: "5px",
                                backgroundColor: "#ccc",
                                color: "#000",
                                border: "none",
                                fontSize: "16px",
                                cursor: "pointer",
                            }}
                            onClick={handlePrevious}
                        >
                            Back
                        </button>
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
            </div>
        </>
    )
}

export default BookingDetail
