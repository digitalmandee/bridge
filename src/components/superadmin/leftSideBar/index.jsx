import React, { useContext, useState } from "react";
import { Button } from "@mui/material";
import { RiLogoutBoxLine } from "react-icons/ri";
import "./style.css";
import { AuthContext } from "@/contexts/SuperContext";
import Admin from "./admin";
import { SidebarContext } from "@/contexts/sidebar.context";

const Sidebar = () => {
	const { user, logout } = useContext(AuthContext);
	const context = useContext(SidebarContext);

	return (
		<>
			<div className={`sidebar ${context.isToggleSidebar === true ? "toggle" : ""}`}>
				{user.type === "superadmin" && <Admin />}
				<ul>
					<li>
						<Button className="w-100" onClick={logout}>
							<span className="icon">
								<RiLogoutBoxLine />
							</span>
							Log Out
						</Button>
					</li>
				</ul>
			</div>
		</>
	);
};

export default Sidebar;
