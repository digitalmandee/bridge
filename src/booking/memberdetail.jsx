import React, { useContext, useState } from "react";
import { FloorPlanContext } from "../contexts/floorplan.context";
import axios from "axios";
import Loader from "../components/Loader";

const MemberDetail = ({ handleNext }) => {
  const { bookingdetails, setBookingDetails, formErrors, validateMemeberDetails, selectedChairs, setCheckAvailability } = useContext(FloorPlanContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const allChairs = Object.values(selectedChairs).flat();
    if (validateMemeberDetails()) {
      try {
        setIsLoading(true);

        const response = await axios.post(process.env.REACT_APP_BASE_API + "check-chair-availability", {
          data: allChairs,
        });

        if (response.data.success) {
          setCheckAvailability(response.data.data);
          updateTimeAndDuration(response.data.data); // Update time and duration based on availability
          handleNext();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateTimeAndDuration = (availabilityData) => {
    const { available_durations, available_time } = availabilityData;

    // Extract date and time from available_time (2025-01-23 10:04:45)
    const { date, time } = extractDateAndTime(available_time);

    // Set the duration options based on available_durations
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      date: date, // Set the extracted date
      time: formatTimeForDuration(time, available_durations), // Set the extracted time with AM/PM logic
      duration: available_durations.length > 0 ? available_durations[0] : "day", // Default to day if no options available
    }));
  };

  const extractDateAndTime = (availableTime) => {
    const [date, time] = availableTime.split(" "); // Split into date and time
    return { date, time }; // Return both separately
  };

  const formatTimeForDuration = (time, durations) => {
    let formattedTime = time;

    // Apply AM/PM logic based on the duration
    if (durations.includes("day")) {
      formattedTime = convertToAMPM(time, "AM"); // Set AM for day
    } else if (durations.includes("night")) {
      formattedTime = convertToAMPM(time, "PM"); // Set PM for night
    }

    return formattedTime;
  };

  const convertToAMPM = (time) => {
    const timeObj = new Date("1970-01-01T" + time + "Z");
    let hours = timeObj.getHours();
    let minutes = timeObj.getMinutes();
    let suffix = hours >= 12 ? "PM" : "AM";

    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${suffix}`;
  };

  return (
    <>
      <form
        style={{
          position: "relative",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "50%",
          margin: "0 auto",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>🧑 Member Detail</h3>

        {isLoading && <Loader variant="B" />}

        {/* Name Field */}
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Name</label>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              name="name"
              value={bookingdetails.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {formErrors.name && <span style={{ color: "red" }}>{formErrors.name}</span>}
          </div>

          {/* Email Field */}
          <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              name="email"
              value={bookingdetails.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {formErrors.email && <span style={{ color: "red" }}>{formErrors.email}</span>}
          </div>

          {/* Phone Number Field */}
          <label style={{ display: "block", marginBottom: "5px" }}>Phone No</label>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="tel"
              name="phone_no"
              value={bookingdetails.phone_no}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {formErrors.phone_no && <span style={{ color: "red" }}>{formErrors.phone_no}</span>}
          </div>

          {/* Individual/Company Dropdown */}
          <label style={{ display: "block", marginBottom: "5px" }}>Individual/Company</label>
          <select
            name="selectabout"
            value={bookingdetails.selectabout}
            onChange={handleChange}
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
              onClick={handleSubmit}
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default MemberDetail;
