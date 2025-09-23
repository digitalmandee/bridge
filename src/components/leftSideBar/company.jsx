import React, { useState, useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { RxDashboard } from "react-icons/rx";
import { FaAngleRight } from "react-icons/fa6";
import { MdOutlineDateRange, MdOutlinePeople } from "react-icons/md";
import { TbContract } from "react-icons/tb";
import { RiBillLine } from "react-icons/ri";
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
		to: "/company/invoices/management",
		label: "Biling Management",
		icon: <RiBillLine />,
	},
	{ to: "/company/booking-schedule/requests", label: "Booking Requests", icon: <MdOutlineDateRange /> },
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

				return (
					<li key={index} style={{ marginBottom: "0.1rem" }}>
						{item.dropdown ? (
							<>
								<Button className={`w-100 ${openDropdown === item.label ? "active-button" : ""}`} onClick={() => toggleDropdown(item.label)}>
									<span className="icon">{item.icon}</span>
									{item.label}
									<span className={`arrow ${openDropdown === item.label ? "rotate" : ""}`}>
										<FaAngleRight />
									</span>
								</Button>
								{openDropdown === item.label && (
									<ul className="submenu">
										{item.dropdown.map((subItem, subIndex) => (
											<li key={subIndex}>
												<Link to={`/${branch}${subItem.to}`}>{subItem.label}</Link>
											</li>
										))}
									</ul>
								)}
							</>
						) : (
							<Link to={`/${branch}${item.to}`}>
								<Button className={`w-100 ${location.pathname === item.to ? "active-button" : ""}`}>
									<span className="icon">{item.icon}</span>
									{item.label}
								</Button>
							</Link>
						)}
					</li>
				);
			})}
		</ul>
	);
};

export default Company;
