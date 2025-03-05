import React, { useState } from "react";
import TopNavbar from "@/components/superadmin/topNavbar";
import Sidebar from "@/components/superadmin/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import Modal from "./modal";
import axiosInstance from "@/utils/axiosInstance";

const CreateBranch = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		location: "",
		floors: "",
		rooms: "",
		seats: "",
		tables: "",
		username: "",
		email: "",
	});

	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	// Handle Input Changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		setErrors({ ...errors, [name]: "" }); // Clear error when user types
	};

	// Validate Form Fields
	const validateForm = () => {
		let newErrors = {};
		Object.keys(formData).forEach((key) => {
			if (!formData[key].trim()) {
				newErrors[key] = "This field is required";
			}
		});
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle Form Submission
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!validateForm()) return; // Stop if validation fails
		try {
			const response = await axiosInstance.post("branches", formData);
			console.log("Branch Created:", response.data);
			setIsModalOpen(true);
		} catch (error) {
			console.error("Error creating branch:", error.response?.data || error.message);
		}
	};

	const containerStyle = {
		width: "90%",
		margin: "20px auto",
		padding: "20px",
		backgroundColor: "#fff",
		borderRadius: "12px",
		boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
	};

	const formStyle = {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: "20px",
	};

	const inputGroupStyle = {
		display: "flex",
		flexDirection: "column",
		gap: "8px",
	};

	const labelStyle = {
		fontSize: "14px",
		color: "#333",
		textAlign: "left",
		marginBottom: "8px",
	};

	const inputStyle = {
		padding: "8px 12px",
		border: "1px solid #e2e8f0",
		borderRadius: "4px",
		fontSize: "14px",
		color: "#333",
		margin: "0",
	};

	const buttonStyle = {
		backgroundColor: "#0D2B4E",
		color: "white",
		padding: "10px",
		border: "none",
		borderRadius: "4px",
		width: "100%",
		maxWidth: "200px",
		margin: "20px auto 0",
		cursor: "pointer",
		display: "block",
		fontSize: "14px",
	};

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sidebarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px", cursor: "pointer" }}>
						<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
							<MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
						</div>
						<h4 style={{ margin: 0 }}>Create Branch</h4>
					</div>
					<div style={containerStyle}>
						<form onSubmit={handleSubmit}>
							<div style={formStyle}>
								{[
									{ label: "Branch Name", name: "name", type: "text", placeholder: "Branch Name" },
									{ label: "Location", name: "location", type: "text", placeholder: "Enter Location" },
									{ label: "No of Floors", name: "floors", type: "number", placeholder: "4" },
									{ label: "Total Rooms", name: "rooms", type: "number", placeholder: "10" },
									{ label: "Total Seats", name: "seats", type: "number", placeholder: "25" },
									{ label: "Total Tables", name: "tables", type: "number", placeholder: "15" },
									{ label: "User Name", name: "username", type: "text", placeholder: "@Branch_Admin" },
									{ label: "Email", name: "email", type: "email", placeholder: "Branch_Admin@gmail.com" },
								].map((field, index) => (
									<div key={index} style={inputGroupStyle}>
										<label style={labelStyle}>{field.label}</label>
										<input type={field.type} name={field.name} placeholder={field.placeholder} value={formData[field.name]} onChange={handleChange} style={inputStyle} />
										{errors[field.name] && <span style={{ color: "red", fontSize: "12px" }}>{errors[field.name]}</span>}
									</div>
								))}
							</div>

							<button type="submit" style={buttonStyle}>
								Save
							</button>
							{isModalOpen && <Modal handleCloseModal={() => setIsModalOpen(false)} />}
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default CreateBranch;
