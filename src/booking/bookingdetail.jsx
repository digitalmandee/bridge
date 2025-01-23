import React, { useContext, useEffect } from "react";
import { FloorPlanContext } from "../contexts/floorplan.context";
import axios from "axios";

const BookingDetail = ({ handlePrevious, handleNext }) => {
  const { bookingdetails, setBookingDetails, formErrors, bookingPlans, setBookingPlans, validateBookingDetails, checkAvailability } = useContext(FloorPlanContext);

  useEffect(() => {
    const fetchBookingPlanData = async () => {
      try {
        const branchId = 1;
        const response = await axios.get(`${process.env.REACT_APP_BASE_API}booking-plans?branch_id=${branchId}`);

        if (response.data && Array.isArray(response.data.data)) {
          setBookingPlans(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching booking plan data", error);
      }
    };

    fetchBookingPlanData();
  }, [setBookingPlans]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (validateBookingDetails()) {
      handleNext();
    }
  };

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

        {/* Date Field */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Date</label>
          <input
            type="date"
            name="date"
            value={bookingdetails.date}
            readOnly // Make the date field read-only so the user cannot change it
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Time Field */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Time</label>
          <input
            type="text"
            name="time"
            value={bookingdetails.time}
            readOnly // Make the time field read-only so the user cannot change it
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Duration Field */}
        <label style={{ display: "block", marginBottom: "5px" }}>Duration</label>
        <select
          name="duration"
          value={bookingdetails.duration}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          {checkAvailability?.available_durations?.map((duration) => (
            <option key={duration} value={duration}>
              {duration.charAt(0).toUpperCase() + duration.slice(1)}
            </option>
          ))}
        </select>

        {/* Select Plan Field */}
        <label style={{ display: "block", marginBottom: "5px" }}>Select Plan</label>
        <select
          name="selectedPlan"
          value={bookingdetails.selectedPlan}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">-- Select a Plan --</option>
          {bookingPlans.map((plan, index) => (
            <option key={plan.id} value={index}>
              {plan.name}
            </option>
          ))}
        </select>
        {formErrors.selectedPlan && <span style={{ color: "red" }}>{formErrors.selectedPlan}</span>}

        {/* Buttons */}
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
            onClick={handleSubmit}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingDetail;
