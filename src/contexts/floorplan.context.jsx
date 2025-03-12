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
		cnic_image: "",
		name: "",
		email: "",
		phone_no: "",
		secondary_phone_no: "",
		type: "individual",
		designation: "",
		cnic: "",
		start_date: "",
		start_time: "",
		duration: "monthly",
		time_slot: "day",
		selectedPlan: "",
		package_detail: 0,
		total_price: 0,
		payment_method: "cash",
		// Freelancer Fields
		linkedin: "",
		facebook: "",
		freelance_site: "",
		// Business Fields
		company_name: "",
		company_website: "",
		industry: "",
		employees: "",
		company_address: "",
	});

	const [formErrors, setFormErrors] = useState({});

	// General Member Validation
	const validateMemeberDetails = () => {
		const errors = {};
		if (!bookingdetails.name.trim()) errors.name = "Full Name is required.";
		if (!bookingdetails.type.trim()) errors.type = "Work Category is required.";
		if (!bookingdetails.email.trim()) errors.email = "Email Address is required.";
		if (!bookingdetails.phone_no.trim()) errors.phone_no = "Primary Contact Number is required.";
		if (!bookingdetails.secondary_phone_no.trim()) errors.secondary_phone_no = "Secondary Contact Number is required.";
		if (!bookingdetails.designation.trim()) errors.designation = "Designation is required.";
		if (!bookingdetails.cnic.trim()) errors.cnic = "CNIC Number is required.";
		if (!bookingdetails.cnic_image) errors.cnic_image = "CNIC Copy is required.";

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// Validate Freelancer or Business Organization Details
	const validateCategoryDetails = () => {
		const errors = {};

		if (bookingdetails.type === "individual") {
			// Freelancer Validation
			if (!bookingdetails.linkedin.trim()) errors.linkedin = "LinkedIn profile is required.";
			if (!bookingdetails.facebook.trim()) errors.facebook = "Facebook profile is required.";
			if (!bookingdetails.freelance_site.trim()) errors.freelance_site = "Freelance website is required.";
		} else if (bookingdetails.type === "company") {
			// Business Organization Validation
			if (!bookingdetails.company_name.trim()) errors.company_name = "Company name is required.";
			if (!bookingdetails.company_website.trim()) errors.company_website = "Company website is required.";
			if (!bookingdetails.industry.trim()) errors.industry = "Industry selection is required.";
			if (!bookingdetails.employees.trim()) errors.employees = "Number of employees is required.";
			if (!bookingdetails.company_address.trim()) errors.company_address = "Company address is required.";
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// Validate Booking Details
	const validateBookingDetails = () => {
		const errors = {};
		if (!bookingdetails.start_date) errors.start_date = "Start Date is required.";
		if (!bookingdetails.start_time) errors.start_time = "Start Time is required.";
		if (!bookingdetails.selectedPlan) errors.selectedPlan = "Plan selection is required.";

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
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
				validateCategoryDetails,
				validateBookingDetails,
			}}>
			{children}
		</FloorPlanContext.Provider>
	);
};

export default FloorPlanProvider;
