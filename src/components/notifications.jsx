import colors from "@/assets/styles/color";
import { AuthContext } from "@/contexts/AuthContext";
import axiosInstance from "@/utils/axiosInstance";
import { Bell, FileText } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardNotifications = () => {
	const { user } = useContext(AuthContext);

	const navigate = useNavigate();
	const [notifications, setNotifications] = useState([]);
	const [unreadNotifications, setUnreadNotifications] = useState(0);

	const getNotifications = async () => {
		try {
			const res = await axiosInstance.get("notifications?limit=4");

			setNotifications(res.data.notifications);
			setUnreadNotifications(res.data.unread);
		} catch (error) {
			console.error("Error fetching notifications:", error.response.data);
		}
	};

	useEffect(() => {
		getNotifications();
	}, []);
	return (
		<div style={notificationsStyle}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
				<h2 onClick={() => navigate(user.type === "admin" ? "/branch/notifications" : "/" + user.type + "/notifications")} style={{ cursor: "pointer", fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>
					Notifications
				</h2>
				<div style={{ position: "relative", backgroundColor: "#0A2156", padding: "0.5rem", borderRadius: "0.375rem" }}>
					<Bell style={{ width: "1.25rem", height: "1.25rem", color: "white" }} />
					<span style={{ position: "absolute", top: "4px", right: "4px", backgroundColor: "white", padding: "1px 5px", borderRadius: "50%", fontSize: "9px", color: colors.primary, marginLeft: "0.25rem" }}>{unreadNotifications >= 100 ? "99+" : unreadNotifications}</span>
					<sup> </sup>
				</div>
			</div>
			<div style={{ marginTop: "0.5rem" }}>
				{notifications.length > 0 ? (
					notifications.map((notification, i) => (
						<div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
							<div style={{ marginTop: "0.05rem" }}>
								<FileText style={{ width: "1.25rem", height: "1.25rem", color: "#0A2156" }} />
							</div>
							<div style={{ flex: 1, minWidth: 0 }}>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
									<span style={{ fontWeight: "500", fontSize: "0.875rem", color: "#111827" }}>{notification.title}</span>
									<span style={{ fontSize: "0.75rem", color: "#6B7280", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>{notification.created_at}</span>
								</div>
								<p style={{ fontSize: "0.875rem", color: "#4B5563", marginTop: "0.25rem", lineHeight: "1.25" }}>{notification.message}</p>
							</div>
						</div>
					))
				) : (
					<p style={{ color: "#6B7280", fontSize: "0.875rem", textAlign: "center" }}>No notifications</p>
				)}
			</div>
		</div>
	);
};

export default DashboardNotifications;

const notificationsStyle = {
	marginTop: "1rem",
	backgroundColor: "#FFFFFF",
	borderRadius: "0.2rem",
	boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
	border: "1px solid #E5E7EB",
	overflowY: "auto",
	height: "30rem",
	width: "21rem",
	padding: "1.5rem",
	transition: "width 0.3s ease-in-out",
	scrollbarWidth: "none",
};
