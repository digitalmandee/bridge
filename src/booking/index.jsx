import React, { useContext, useEffect, useState } from "react";
import TopNavbar from "../topNavbar/index";
import Sidebar from "../leftSideBar";
import MemberDetail from "./memberdetail";
import BookingDetail from "./bookingdetail";
import Payment from "./payment";
import { FloorPlanContext } from "../contexts/floorplan.context";
import { useNavigate } from "react-router-dom";
// import './style.css';
const Booking = () => {
  const navigate = useNavigate();

  const { selectedChairs } = useContext(FloorPlanContext);

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

  useEffect(() => {
    if (selectedChairs.length === 0) return navigate('/floorplan');
  }, [])
  

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
      <div className="main">
        <div className="sideBarWrapper">
          <Sidebar />
        </div>
        <div className="content">
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
              <h2
                style={{
                  font: "Nunito Sans",
                  fontWeight: "500",
                  fontSize: "30px",
                }}
              >
                {getHeadingText()}
              </h2>
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
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "18px",
                  color: currentStep >= 1 ? "#000" : "#ccc",
                }}
              >
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
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "18px",
                  color: currentStep >= 2 ? "#000" : "#ccc",
                }}
              >
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
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "18px",
                  color: currentStep === 3 ? "#000" : "#ccc",
                }}
              >
                <span>Step-3</span>
              </div>
            </div>
          </div>
          {currentStep === 1 && <MemberDetail handleNext={handleNext} />}
          {currentStep === 2 && (
            <BookingDetail
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          )}
          {currentStep === 3 && <Payment />}
        </div>
      </div>
    </>
  );
};

export default Booking;
