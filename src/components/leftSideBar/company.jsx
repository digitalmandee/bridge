import React, { useState, useContext } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { RxDashboard } from "react-icons/rx";
import { FaAngleRight } from "react-icons/fa6";
import { MdOutlineDateRange, MdOutlinePeople } from "react-icons/md";
import { TbContract } from "react-icons/tb";
import { RiBillLine } from "react-icons/ri";
import { SlCalender } from "react-icons/sl";
import { AuthContext } from "@/contexts/AuthContext"; // ✅ get investor/profile flags
import "./style.css";

const menuItems = [
	// Example Investor-only menu
	{ to: "/company/dashboard", label: "Dashboard", icon: <RxDashboard /> },
	{ to: "/company/booking-request", label: "Seats Booking Request", icon: <RxDashboard /> },
	{
		label: "Staff Management",
		icon: <MdOutlinePeople />,
		dropdown: [
			{ to: "/company/staff/add", label: "Add Staff" },
			{ to: "/company/staff/management", label: "Management" },
		],
	},
	{
		label: "Booking Management",
		icon: <SlCalender />,
		dropdown: [
			{ to: "/company/booking-schedule", label: "Room Booking" },
			{ to: "/company/booking-schedule/requests", label: "Booking Requests" },
		],
	},
	{
		to: "/company/invoices/management",
		label: "Biling Management",
		icon: <RiBillLine />,
	},
	{ to: "/company/contracts", label: "Contracts", icon: <TbContract /> },
];

const Company = () => {
	const { branch } = useParams();
	const location = useLocation();
	const [openDropdown, setOpenDropdown] = useState(null);

	// ✅ get auth context
	const { user } = useContext(AuthContext);
	const hasProfile = user?.is_profile_completed; // true/false from backend

	const toggleDropdown = (label) => {
		setOpenDropdown(openDropdown === label ? null : label);
	};

	return (
		<ul>
			{menuItems.map((item, index) => {
				// 🔒 access rules
				if (!item.requiresInvestor && !hasProfile) return null;
				const isParentActive =
					item.dropdown &&
					item.dropdown.some((subItem) =>
						location.pathname.startsWith(`/${branch}${subItem.to}`)
					);
				return (
					<li key={index} style={{ marginBottom: "0.1rem" }}>
						{item.dropdown ? (
							<>
								<Button
									className={`w-100 ${openDropdown === item.label || isParentActive ? "active-button" : ""}`}
									onClick={() => toggleDropdown(item.label)}
									style={{
										justifyContent: "flex-start",
										backgroundColor: "transparent",
										color: "black",
										textAlign: "left",
									}}
								>
									<span className="icon">{item.icon}</span>
									{item.label}
									<span
										className={`arrow ${openDropdown === item.label || isParentActive ? "rotate" : ""
											}`}
									>
										<FaAngleRight />
									</span>
								</Button>
								{(openDropdown === item.label || isParentActive) && (
									<ul style={{ listStyle: "none", paddingLeft: "1.5rem", margin: 0 }}>
										{item.dropdown.map((subItem, subIndex) => (
											<li key={subIndex}>
												<NavLink
													to={`/${branch}${subItem.to}`}
													end
													style={({ isActive }) => ({
														display: "block",
														padding: "0.5rem 1rem",
														borderRadius: "6px",
														textDecoration: "none",
														color: isActive ? "white" : "black",
														backgroundColor: isActive ? "#FFCC16" : "transparent",
													})}
												>
													{subItem.label}
												</NavLink>
											</li>
										))}
									</ul>
								)}
							</>
						) : (
							<NavLink
								to={`/${branch}${item.to}`}
								style={({ isActive }) => ({
									width: "100%",
									backgroundColor: isActive ? "#FFCC16" : "transparent",
									color: isActive ? "white" : "black",
									textDecoration: "none",
								})}
							>
								<Button
									className="w-100"
									style={{
										justifyContent: "flex-start",
										backgroundColor: "inherit",
										color: "inherit",
									}}
								>
									<span className="icon">{item.icon}</span>
									{item.label}
								</Button>
							</NavLink>
						)}
					</li>
				);
			})}
		</ul>
	);
};

export default Company;
