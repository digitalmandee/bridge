import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { RxDashboard } from "react-icons/rx";
import { FaAngleRight } from "react-icons/fa6";
import { IoGitBranchOutline } from "react-icons/io5";
("react-icons/all");
import InvestorIcon from "../../../assets/investor.svg";
import "./style.css";
import { AuthContext } from "@/contexts/SuperContext";

const menuItems = [
	{ to: "/super-admin/dashboard", label: "Dashboard", icon: <RxDashboard />, hasDropdown: false, permission: "dashboard" },
	{ to: "/investor/dashboard", label: "Dashboard", icon: <RxDashboard />, hasDropdown: false, permission: "investor-dashboard" },
	{ to: "/investor/management", label: "Management", icon: <RxDashboard />, hasDropdown: false, permission: "investor-management" },
	{
		label: "Investor Management",
		icon: <img src={InvestorIcon} alt="Investor" style={{ width: 20, height: 20 }} />,
		hasDropdown: true,
		dropdown: [
			// { to: "/super-admin/investor/dashboard", label: "Dashboard", permission: "dashboard" },
			{ to: "/super-admin/investor/management", label: "Management", permission: "dashboard" },
			{ to: "/super-admin/investor/new-entry", label: "New Entry", permission: "dashboard" },
			{ to: "/super-admin/investor/investment-types", label: "Investment Types", permission: "dashboard" },
		],
	},
	{ to: "/super-admin/branch/management", label: "Branch Management", icon: <IoGitBranchOutline />, hasDropdown: false, permission: "dashboard" },
];

const Admin = () => {
	const { permissions } = useContext(AuthContext);

	const { branch } = useParams();

	const location = useLocation();
	const [selectedButton, setSelectedButton] = useState("");
	const [openDropdown, setOpenDropdown] = useState("");

	useEffect(() => {
		if (!menuItems || !Array.isArray(menuItems)) return; // Ensure menuItems is defined

		let activeLabel = "";

		// Check if a top-level menu item matches the current route
		const activeItem = menuItems.find((item) => item.to && item.to === location.pathname);

		if (activeItem) {
			activeLabel = activeItem.label;
		} else {
			// Check dropdown items to see if a child matches the route
			menuItems.forEach((item) => {
				if (item.hasDropdown && item.dropdown) {
					const activeSubItem = item.dropdown.find((subItem) => subItem.to === location.pathname);
					if (activeSubItem) {
						activeLabel = item.label; // Set the parent button as active
					}
				}
			});
		}

		setSelectedButton(activeLabel); // Update the state with the active button
	}, [location.pathname]);

	const handleButtonClick = (label, to, hasDropdown) => {
		if (hasDropdown) {
			// If clicking an already open dropdown, close it and deselect the button
			if (openDropdown === label) {
				setOpenDropdown("");
				setSelectedButton(""); // Unselect everything when collapsing
			} else {
				setOpenDropdown(label); // Open new dropdown
				setSelectedButton(label); // Set the parent button as active
			}
		} else {
			setSelectedButton(label); // Select the button
			setOpenDropdown(""); // Close any open dropdown
		}
	};

	return (
		<ul>
			{menuItems
				.filter((item) => {
					if (!item.hasDropdown) {
						// Check permission for single item
						return permissions.includes(item.permission);
					}

					// Check if any dropdown item has permission
					return item.dropdown.some((subItem) => permissions.includes(subItem.permission));
				})
				.map((item, index) => (
					<li key={index}>
						{item.hasDropdown ? (
							<>
								<Button className={`w-100 dropdown-button ${selectedButton === item.label ? "active-button" : ""}`} onClick={() => handleButtonClick(item.label, item.to, item.hasDropdown)}>
									<span className="icon">{item.icon}</span>
									{item.label}
									<span className={`arrow ${openDropdown === item.label ? "rotate" : ""}`}>
										<FaAngleRight />
									</span>
								</Button>
								{openDropdown === item.label && (
									<ul className="submenu">
										{item.dropdown &&
											item.dropdown
												.filter((subItem) => permissions.includes(subItem.permission))
												.map((subItem, subIndex) => (
													<li key={subIndex}>
														<Link to={subItem.to}>
															<Button className={`w-100 ${selectedButton === subItem.label ? "active-button" : ""}`} onClick={() => handleButtonClick(subItem.label, subItem.to, false)}>
																{subItem.label}
															</Button>
														</Link>
													</li>
												))}
									</ul>
								)}
							</>
						) : (
							<Link to={item.to}>
								<Button className={`w-100 ${selectedButton === item.label ? "active-button" : ""}`} onClick={() => handleButtonClick(item.label, item.to, item.hasDropdown)}>
									<span className="icon">{item.icon}</span>
									{item.label}
								</Button>
							</Link>
						)}
					</li>
				))}
		</ul>
	);
};

export default Admin;
