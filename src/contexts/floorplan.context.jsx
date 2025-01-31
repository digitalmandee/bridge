import { createContext, useState } from "react";

export const FloorPlanContext = createContext();

const FloorPlanProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [bookingPlans, setBookingPlans] = useState([]);
  const [selectedChairs, setSelectedChairs] = useState({});
  const [selectedFloor, setSelectedFloor] = useState(1); // Default is Ground Floor
  const [totalAvailableChairs, setTotalAvailableChairs] = useState(0);
  const [totalOccupiedChairs, setTotalOccupiedChairs] = useState(0);
  const [floorSize, setFloorSize] = useState({ width: 0, height: 0 });
  const [checkAvailability, setCheckAvailability] = useState({});
  const [bookingdetails, setBookingDetails] = useState({
    profile_image: "",
    name: "",
    email: "",
    phone_no: "",
    type: "individual",
    start_date: "",
    start_time: "",
    duration: 12,
    selectedPlan: "",
    package_detail: 0,
    total_price: 0,
    payment_method: "cash",
  });

  const [formErrors, setFormErrors] = useState({});

  // Function to validate booking details
  const validateMemeberDetails = () => {
    const errors = {};
    if (!bookingdetails.name) errors.name = "Name is required.";
    if (!bookingdetails.email) errors.email = "Email is required.";
    if (!bookingdetails.phone_no) errors.phone_no = "Phone number is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };
  const validateBookingDetails = () => {
    const errors = {};
    if (!bookingdetails.start_date) errors.start_date = "Date is required.";
    if (!bookingdetails.start_time) errors.start_time = "Time is required.";
    if (!bookingdetails.selectedPlan) errors.selectedPlan = "Plan selection is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  return (
    <FloorPlanContext.Provider
      value={{
        isLoading,
        tables,
        bookingPlans,
        selectedChairs,
        floorSize,
        bookingdetails,
        formErrors,
        checkAvailability,
        selectedFloor,
        totalAvailableChairs,
        totalOccupiedChairs,
        setTotalAvailableChairs,
        setTotalOccupiedChairs,
        setSelectedFloor,
        setCheckAvailability,
        setIsLoading,
        setTables,
        setBookingPlans,
        setSelectedChairs,
        setFloorSize,
        setBookingDetails,
        validateMemeberDetails,
        validateBookingDetails,
      }}
    >
      {children}
    </FloorPlanContext.Provider>
  );
};

export default FloorPlanProvider;
