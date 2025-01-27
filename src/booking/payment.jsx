import React, {useState} from 'react'
import cash from '../assets/cash.png'
import payment from '../assets/payment.png'
import Modal from './modal'
import colors from '../styles/color'
const Payment = () => {
    const [showModal, setShowModal] = useState(false);
    const handleConfirm = () => {
        setShowModal(true); // Show the modal
    };

    const handleClose = () => {
        setShowModal(false); // Hide the modal
    };
    return (
        <>
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
                    // onClick={() => setPaymentMethod("Cash")}
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
                    // onClick={() => setPaymentMethod("Bank Transfer")}
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
                            backgroundColor: colors.primary,
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
                        // onChange={handleFileUpload}
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
                        backgroundColor: colors.primary,
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                    onClick={handleConfirm}
                >
                    Confirm
                </button>
                {showModal && 
                <Modal handleClose={handleClose}/>
                }
            </div>
        </>
    )
}

export default Payment
