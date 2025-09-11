import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { RxDashboard } from "react-icons/rx";
import { FaAngleRight } from "react-icons/fa6";
import "./style.css";
import { SlCalender } from "react-icons/sl";
import { TbContract, TbFileInvoice } from "react-icons/tb";
import SeatBooking from "../SeatBooking";

const menuItems = [
	{ to: "/user/dashboard", label: "Dashboard", icon: <RxDashboard /> },
	{ to: "/user/booking-request", label: "Seats Booking Request", icon: <RxDashboard /> },
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
					<li key={index}>
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
												<Link to={"/" + branch + subItem.to}>{subItem.label}</Link>
											</li>
										))}
									</ul>
								)}
							</>
						) : (
							<Link to={"/" + branch + item.to}>
								<Button className={`w-100 ${location.pathname === item.to ? "active-button" : ""}`}>
									<span className="icon">{item.icon}</span>
									{item.label}
									<span className="arrow">
										<FaAngleRight />
									</span>
								</Button>
							</Link>
						)}
					</li>
				))}
			</ul>
		</>
	);
};

export default User;
