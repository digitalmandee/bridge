import React, { useContext, useState } from "react";
import cash from "../../assets/cash.png";
import payment from "../../assets/payment.png";
import Modal from "./modal";
import axios from "axios";
import { FloorPlanContext } from "../../contexts/floorplan.context";

const Payment = () => {
  const { selectedChairs, bookingPlans, bookingdetails, setBookingDetails } = useContext(FloorPlanContext);
  const [showModal, setShowModal] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null); // State to store the uploaded file

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReceiptFile(file);

    // Save file name in bookingdetails.receipt
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      receipt: file.name, // Update receipt field
    }));
  };

  const handleConfirm = async () => {
    try {
      // Create a FormData object to send the image and other data
      const formData = new FormData();
      formData.append("branch_id", 1);
      formData.append("floor_id", 1);
      formData.append("profile_image", bookingdetails.profile_image); // Add the receipt file
      formData.append("receipt", receiptFile); // Add the receipt file
      formData.append("bookingdetails", JSON.stringify(bookingdetails));
      formData.append("selectedPlan", JSON.stringify(bookingPlans[bookingdetails.selectedPlan]));
      formData.append("selectedChairs", JSON.stringify(selectedChairs));

      const response = await axios.post(import.meta.env.VITE_BASE_API + "booking/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      setShowModal(true); // Show the modal
    } catch (error) {
      console.error("Error while creating booking:", error);
    }
  };

  const handleClose = async () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
                backgroundColor: "#FFFFFF",
              }}
            >
              <img src={cash} alt="Cash" style={{ width: "50px", marginBottom: "10px" }} />
              <p
                style={{
                  font: "Nunito Sans",
                  fontWeight: "500",
                  fontSize: "24px",
                }}
              >
                Cash
              </p>
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "center",
                padding: "20px",
                borderRadius: "10px",
                cursor: "pointer",
                backgroundColor: "#FFFFFF",
              }}
            >
              <img src={payment} alt="Bank Transfer" style={{ width: "50px", marginBottom: "10px" }} />
              <p
                style={{
                  font: "Nunito Sans",
                  fontWeight: "500",
                  fontSize: "24px",
                }}
              >
                Bank Transfer
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "#fff",
              margin: "2rem",
            }}
            onClick={() => document.getElementById("receipt-upload").click()}
          >
            {/* Placeholder Text */}
            <span style={{ flex: 1, color: "#999" }}>Upload Receipt</span>

            {/* Upload Icon (Replace with an actual icon library if needed) */}
            <span style={{ marginLeft: "10px", cursor: "pointer" }}>📤</span>

            {/* Hidden File Input */}
            <input type="file" id="receipt-upload" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
            {receiptFile && <p style={{ marginTop: "10px" }}>Uploaded: {receiptFile.name}</p>}
          </div>
          {/* <div style={{ textAlign: "center", marginBottom: "20px" }}>
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
            <input type="file" id="receipt-upload" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
            {receiptFile && <p style={{ marginTop: "10px" }}>Uploaded: {receiptFile.name}</p>}
          </div> */}
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
            onClick={handleConfirm}
          >
            Confirm
          </button>
          {showModal && <Modal handleClose={handleClose} />}
        </div>
        <div style={{ backgroundColor: "white", padding: "10px" }}>
          <span style={{ fontSize: "18px", fontWeight: 600 }}>
            Plan name: {bookingPlans[bookingdetails.selectedPlan].name} <br />
            Plan price: Rs. {bookingdetails.total_price}
          </span>
          {/* Display Selected Chairs */}
          {Object.entries(selectedChairs).length > 0 && (
            <div className="selected-chairs" style={{ width: "100%" }}>
              <h3>Selected Chairs:</h3>
              <ul>
                {Object.entries(selectedChairs).map(([tableId, chairs]) =>
                  chairs.map((chair) => (
                    <li key={chair.id}>
                      {tableId}
                      {chair.id}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Payment;
