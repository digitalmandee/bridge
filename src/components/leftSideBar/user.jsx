import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { RxDashboard } from "react-icons/rx";
import { FaAngleRight } from "react-icons/fa6";
import { MdOutlineEventSeat } from "react-icons/md";
import "./style.css";
import { SlCalender } from "react-icons/sl";
import { TbContract, TbFileInvoice } from "react-icons/tb";
import SeatBooking from "../SeatBooking";

const menuItems = [
	{ to: "/user/dashboard", label: "Dashboard", icon: <RxDashboard /> },
	{
		to: "/user/booking-request", label: "Seats Booking Request", icon: <MdOutlineEventSeat />
	},
	{
		label: "Booking Management",
		icon: <SlCalender />,
		dropdown: [
			{ to: "/user/booking-schedule", label: "Room Booking" },
			{ to: "/user/booking-schedule/requests", label: "Booking Requests" },
		],
	},
	{ to: "/user/invoices/management", label: "Invoice Management", icon: <TbFileInvoice /> },
	{ to: "/user/contracts", label: "Contracts", icon: <TbContract /> },
];

const User = () => {
	const { branch } = useParams();

	const [openDropdown, setOpenDropdown] = useState(null);
	const location = useLocation();

	const toggleDropdown = (label) => {
		setOpenDropdown(openDropdown === label ? null : label);
	};
	return (
		<>
			<div style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "16px" }}>
				<SeatBooking />
			</div>

			<ul>
				{menuItems.map((item, index) => (
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
												<NavLink
													to={"/" + branch + subItem.to}
													className={({ isActive }) =>
														isActive ? "active-link" : ""
													}
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
								to={"/" + branch + item.to}
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
				))}
			</ul>
		</>
	);
};

export default User;
