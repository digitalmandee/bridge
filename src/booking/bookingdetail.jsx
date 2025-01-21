import React from 'react'

const BookingDetail = ({handlePrevious, handleNext}) => {
    return (
        <>
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    width: "80%",
                    maxWidth: "500px",
                    margin: "0 auto",
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
                    📅 Booking Detail
                </h3>

                {/* Booking Form */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                        Date
                    </label>
                    <input
                        type="date"
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                        Time
                    </label>
                    <input
                        type="time"
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    />

                    <label style={{ display: "block", marginBottom: "5px" }}>Duration</label>
                    <select
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                    </select>

                    <label style={{ display: "block", marginBottom: "5px" }}>Select Plan</label>
                    <select
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "15px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    >
                        <option value="Premium">Premium</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                    </select>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                        Cancel
                    </button>
                    <button
                        type="button"
                        style={{
                            padding: "10px 20px",
                            borderRadius: "5px",
                            backgroundColor: "#f5b500",
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
        </>
    )
}

export default BookingDetail
