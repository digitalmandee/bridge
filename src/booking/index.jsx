import React, { useState } from 'react'
import TopNavbar from '../topNavbar/index'
import Sidebar from '../leftSideBar'
import MemberDetail from './memberdetail'
import BookingDetail from './BookingDetail/bookingdetail'
import Payment from './payment'
import { FaCheck } from 'react-icons/fa';
// import './style.css';
const Booking = () => {

    const [currentStep, setCurrentStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [receipt, setReceipt] = useState(null);

    const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

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
                            // alignItems: "center",
                            backgroundColor: "transparent",
                            padding: "20px 0",
                        }}
                    >
                        <div style={{ marginTop: "10px" }}>
                            {currentStep === 1 && (
                                <div>
                                    <h2>Member Detail</h2>
                                </div>
                            )}
                            {currentStep === 2 && (
                                <div>
                                    <h2>Booking Detail</h2>
                                </div>
                            )}
                            {currentStep === 3 && (
                                <div>
                                    <h2>Payment</h2>
                                </div>
                            )}
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "50%",
                            margin: "20px auto"
                        }}>
                            {/* Step 1 */}
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                fontSize: "18px",
                                backgroundColor: currentStep === 1 ? "#0D274D" : "#fff",
                                color: currentStep === 1 ? "#fff" : "#aaa",
                                border: `2px solid ${currentStep >= 1 ? "#0D274D" : "#ccc"}`
                            }}>
                                1
                            </div>

                            {/* Line 1 */}
                            <div style={{
                                flex: 1,
                                height: "2px",
                                backgroundColor: currentStep > 1 ? "#0D274D" : "#ccc",
                                margin: "0 10px"
                            }}></div>


                            {/* Step 2 */}
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                fontSize: "18px",
                                backgroundColor: currentStep === 2 ? "#0D274D" : "#fff",
                                color: currentStep === 2 ? "#fff" : "#aaa",
                                border: `2px solid ${currentStep >= 2 ? "#0D274D" : "#ccc"}`
                            }}>2</div>

                            {/* Line 2 */}
                            <div style={{
                                flex: 1,
                                height: "2px",
                                backgroundColor: currentStep > 2 ? "#0D274D" : "#ccc",
                                margin: "0 10px"
                            }}></div>

                            {/* Step 3 */}
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                fontSize: "18px",
                                backgroundColor: currentStep === 3 ? "#0D274D" : "#fff",
                                color: currentStep === 3 ? "#fff" : "#aaa",
                                border: `2px solid ${currentStep === 3 ? "#0D274D" : "#ccc"}`
                            }}>3</div>
                        </div>

                        {/* Step Content */}

                    </div>
                    {currentStep === 1 &&
                        <MemberDetail handleNext={handleNext} />
                    }
                    {currentStep === 2 &&
                        <BookingDetail handleNext={handleNext} handlePrevious={handlePrevious} />}
                    {currentStep === 3 &&
                        <Payment />}
                </div>
            </div>
        </>
    )
}

export default Booking
