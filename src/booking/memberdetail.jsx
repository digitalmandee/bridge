import React, { useContext, useState } from "react";
import { FloorPlanContext } from "../contexts/floorplan.context";
import axios from "axios";
import Loader from "../components/Loader";

const MemberDetail = ({ handleNext }) => {
  const { bookingdetails, setBookingDetails, formErrors, validateMemeberDetails, selectedChairs, setCheckAvailability } = useContext(FloorPlanContext);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // State to store image preview
  const [imageFile, setImageFile] = useState(null); // State to store the image file

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set the image file and generate a preview
      setImageFile(file);
      setBookingDetails((prevDetails) => ({
        ...prevDetails,
        profile_image: file, // Save image URL to profile_image
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set preview URL
        // Store the image URL in bookingDetails.profile_image
      };
      reader.readAsDataURL(file);
    }
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

    const { date, time } = extractDateAndTime(available_time);

    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      start_date: date,
      start_time: formatTimeForInput(time),
      duration: available_durations.length > 0 ? available_durations[0] : "day",
    }));
  };

  const extractDateAndTime = (availableTime) => {
    const [date, time] = availableTime.split(" ");
    return { date, time };
  };

  const formatTimeForInput = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
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
            name="type"
            value={bookingdetails.type}
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

          {/* Image Upload Field */}
          <label style={{ display: "block", marginBottom: "5px" }}>Upload Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          {/* Image Preview */}
          {imagePreview && (
            <div style={{ textAlign: "left", marginTop: "4px" }}>
              <img src={imagePreview} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover",borderRadius:'50%' }} />
            </div>
          )}

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
