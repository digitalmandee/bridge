import React, { useState } from 'react'
import TopNavbar from '../topNavbar/index'
import Sidebar from '../leftSideBar'
import cash from '../assets/cash.png'
import payment from '../assets/payment.png'
// import './style.css';
const Booking = () => {

    const [currentStep, setCurrentStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [receipt, setReceipt] = useState(null);

    const handleNext = () => {
        setCurrentStep(currentStep + 1); // Move to the next step
    };

    // Function to handle the "Previous" button click
    const handlePrevious = () => {
        setCurrentStep(currentStep - 1); // Move to the previous step
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setReceipt(file ? file.name : null);
    };

    const getHeadingText = () => {
        if (currentStep === 1) return "Member Detail";
        if (currentStep === 2) return "Booking Detail";
        if (currentStep === 3) return "Payment";
        return "";
    };

    // const handleConfirm = () => {
    //     if (!paymentMethod || !receipt) {
    //         alert("Please select a payment method and upload a receipt.");
    //         return;
    //     }
    //     alert(`Payment confirmed with ${paymentMethod} and receipt uploaded.`);
    // };

    return (
        <>
            <TopNavbar />
            <div className='main'>
                <div className='sideBarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            backgroundColor: "transparent",
                            padding: "20px 0",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px",
                            }}
                        >
                            <h2 style={{
                                font: 'Nunito Sans',
                                fontWeight: '500',
                                fontSize: '30px',
                            }}>{getHeadingText()}</h2>
                            {/* <h3 style={{ color: "#888" }}>
                                Today <span style={{ color: "#007bff" }}>03 Aug 2024</span>
                            </h3> */}
                        </div>
                        <div
                            style={{
                                width: "50%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px",
                            }}
                        >
                            <div style={{ flex: 1, textAlign: "center", fontWeight: "600", fontSize: '18px', color: currentStep >= 1 ? "#000" : "#ccc", }}>
                                <span>Step-1</span>
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    height: "1px",
                                    backgroundColor: currentStep >= 2 ? "#000" : "#ccc",
                                    margin: "0 10px",
                                }}
                            ></div>
                            <div style={{ flex: 1, textAlign: "center", fontWeight: "600", fontSize: '18px', color: currentStep >= 2 ? "#000" : "#ccc", }}>
                                <span>Step-2</span>
                            </div>
                            <div
                                style={{
                                    flex: 1,
                                    height: "1px",
                                    backgroundColor: currentStep >= 3 ? "#000" : "#ccc",
                                    margin: "0 10px",
                                }}
                            ></div>
                            <div style={{ flex: 1, textAlign: "center", fontWeight: "600", fontSize: '18px', color: currentStep === 3 ? "#000" : "#ccc", }}>
                                <span>Step-3</span>
                            </div>
                        </div>
                    </div>
                    {currentStep === 1 && (
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
                        </form>
                    )}
                    {currentStep === 2 && (
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
                    )}
                    {currentStep === 3 && (
                        <div
                            style={{
                                backgroundColor: "transparent",
                                padding: "20px",
                                borderRadius: "10px",
                                // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
                                Payment Details
                            </h3>
                            <div
                                style={{
                                    display: "flex",
                                    // backgroundColor:'black',
                                    justifyContent: "space-between",
                                    gap: "2rem",
                                    marginBottom: "20px",
                                }}
                            >
                                <div
                                    style={{
                                        flex: 1,
                                        textAlign: "center",
                                        padding: "20px",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        backgroundColor: '#FFFFFF',
                                    }}
                                    onClick={() => setPaymentMethod("Cash")}
                                >
                                    <img
                                        src={cash}
                                        alt="Cash"
                                        style={{ width: "50px", marginBottom: "10px" }}
                                    />
                                    <p style={{
                                        font: 'Nunito Sans',
                                        fontWeight: '500',
                                        fontSize: '24px'
                                    }}>Cash</p>
                                </div>
                                <div
                                    style={{
                                        flex: 1,
                                        textAlign: "center",
                                        padding: "20px",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        backgroundColor: '#FFFFFF',
                                    }}
                                    onClick={() => setPaymentMethod("Bank Transfer")}
                                >
                                    <img
                                        src={payment}
                                        alt="Bank Transfer"
                                        style={{ width: "50px", marginBottom: "10px" }}
                                    />
                                    <p style={{
                                        font: 'Nunito Sans',
                                        fontWeight: '500',
                                        fontSize: '24px'
                                    }}>Bank Transfer</p>
                                </div>
                            </div>
                            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                                <label
                                    htmlFor="receipt-upload"
                                    style={{
                                        display: "inline-block",
                                        backgroundColor: "#f0c040",
                                        color: "white",
                                        padding: "10px 20px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Upload Receipt
                                </label>
                                <input
                                    type="file"
                                    id="receipt-upload"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    style={{ display: "none" }}
                                />
                                {/* <p style={{ marginTop: "10px" }}>
                                    {receipt ? `Uploaded: ${receipt}` : "No receipt uploaded"}
                                </p> */}
                            </div>
                            <button
                                style={{
                                    display: "block",
                                    margin: "0 auto",
                                    backgroundColor: "#f0c040",
                                    color: "white",
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                }}

                            >
                                Confirm
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Booking
