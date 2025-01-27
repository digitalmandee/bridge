import React from 'react'
import { useNavigate } from "react-router-dom";
import colors from '../styles/color'
const Modal = ({ handleClose }) => {
    const navigate = useNavigate();
    const handleContinue = () => {
        navigate("/seatsAllocation"); // Navigate to the seatsAllocation screen
    };
    return (
        <>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "20px",
                        textAlign: "center",
                        width: "300px",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#f0c040",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "0 auto",
                        }}
                    >
                        <span
                            style={{
                                color: "white",
                                fontSize: "24px",
                                fontWeight: "bold",
                            }}
                        >
                            ✓
                        </span>
                    </div>
                    <h2 style={{ marginTop: "20px", fontSize: "18px" }}>SUCCESS!</h2>
                    <p>Your Booking was completed</p>
                    <button
                        onClick={handleContinue} // Close modal on click
                        style={{
                            backgroundColor: colors.primary,
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "5px",
                            fontSize: "16px",
                            cursor: "pointer",
                        }}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </>
    )
}

export default Modal
