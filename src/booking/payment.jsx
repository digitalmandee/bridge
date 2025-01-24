import React, { useContext, useState } from "react";
import cash from "../assets/cash.png";
import payment from "../assets/payment.png";
import Modal from "./modal";
import { FloorPlanContext } from "../contexts/floorplan.context";
import axios from "axios";

const Payment = () => {
  const { selectedChairs, bookingPlans, bookingdetails } = useContext(FloorPlanContext);
  const [showModal, setShowModal] = useState(false);
  const handleConfirm = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_BASE_API + "booking/create", {
        branch_id: 1,
        floor_id: 1,
        ...bookingdetails,
        selectedPlan: bookingPlans[bookingdetails.selectedPlan],
        selectedChairs,
      });
      console.log(response.data);
      setShowModal(true); // Show the modal
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = async () => {
    try {
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
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
              // onClick={() => setPaymentMethod("Cash")}
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
              // onClick={() => setPaymentMethod("Bank Transfer")}
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
            Plan price: ${bookingdetails.total_price}
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
