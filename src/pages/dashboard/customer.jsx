import { useContext, useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Box, FormControl, TextField, Typography, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Avatar } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { SidebarContext } from "../../contexts/sidebar.context";
import axiosInstance from "@/utils/axiosInstance";

const CustomerDashboard = ({ isSidebarOpen }) => {
	const context = useContext(SidebarContext);

	const [fromDate, setFromDate] = useState(() => {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]; // 1st of this month
	});
	const [toDate, setToDate] = useState(() => {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]; // End of this month
	});
	const [stats, setStats] = useState(null);
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (fromDate) fetchData();
	}, [fromDate, toDate]);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("admin/customer/dashboard", {
				params: { from_date: fromDate, to_date: toDate },
			});
			console.log(res.data);

			setStats(res.data.stats);
			setUsers(res.data.customers);
		} catch (err) {
			console.error("Fetch failed", err);
		} finally {
			setIsLoading(false);
		}
	};

	const cardStyle = {
		backgroundColor: "#FFFFFF",
		width: "100%",
		borderRadius: "0.2rem",
		padding: "1rem",
		boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
		border: "1px solid #E5E7EB",
	};

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className={`sideBarWrapper ${context.isToggleSidebar === true ? "toggle" : ""}`}>
					<Sidebar />
				</div>

				<div className={`content ${context.isToggleSidebar === true ? "toggle" : ""}`}>
					<Box p={3}>
						{/* Date Filters */}
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1 }}>
							<div
								style={{
									fontSize: "1.5rem",
									fontWeight: "600",
									color: "#111827",
									marginBottom: "1rem",
								}}>
								Customer Details
							</div>
							<Box sx={{ display: "flex", gap: 2, mb: 3 }}>
								<FormControl>
									<TextField label="From Date" type="date" size="small" value={fromDate} onChange={(e) => setFromDate(e.target.value)} InputLabelProps={{ shrink: true }} />
								</FormControl>
								<FormControl>
									<TextField label="To Date" type="date" size="small" value={toDate} onChange={(e) => setToDate(e.target.value)} InputLabelProps={{ shrink: true }} />
								</FormControl>
							</Box>
						</Box>

						{/* Stats Box */}
						{stats && (
							<Box sx={{ display: "flex", gap: 4, mb: 4, }}>
								<div style={cardStyle}>
									<div style={{ fontSize: "0.875rem", color: "#6B7280" }}>New</div>
									<div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginTop: "0.25rem" }}>{stats.new}</div>
									<div style={{ fontSize: "0.875rem", color: "#16A34A", display: "flex", alignItems: "center", marginTop: "0.25rem" }}>
										<ArrowUpward style={{ width: "0.75rem", height: "0.75rem", marginRight: "0.25rem" }} />
										{stats.growth_new}%
									</div>
								</div>

								<div style={cardStyle}>
									<div style={{ fontSize: "0.875rem", color: "#6B7280" }}>Lost</div>
									<div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginTop: "0.25rem" }}>{stats.lost}</div>
									<div style={{ fontSize: "0.875rem", color: "#DC2626", display: "flex", alignItems: "center", marginTop: "0.25rem" }}>
										<ArrowDownward style={{ width: "0.75rem", height: "0.75rem", marginRight: "0.25rem" }} />
										{stats.growth_lost}%
									</div>
								</div>

								<div style={cardStyle}>
									<div style={{ fontSize: "0.875rem", color: "#6B7280" }}>Total Customers</div>
									<div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginTop: "0.25rem" }}>{stats.total}</div>
									{/* <div style={{ fontSize: "0.875rem", color: "#FFCC16", marginTop: "0.25rem" }}>As of selected date range</div> */}
								</div>
							</Box>
						)}

						{/* Customer Details Table in Card Style */}
						<Box sx={{ mb: 4 }}>
							<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
								{isLoading ? (
									<Box display="flex" justifyContent="center" alignItems="center" p={3}>
										<CircularProgress sx={{ color: "#FFCC16" }} />
									</Box>
								) : (
									<Table>
										<TableHead sx={{ bgcolor: "#F8FAFC" }}>
											<TableRow>
												<TableCell sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#374151" }}>Name</TableCell>
												<TableCell sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#374151" }}>Email</TableCell>
												<TableCell sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#374151" }}>Type</TableCell>
												<TableCell sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#374151" }}>Status</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{users.length > 0 ? (
												users.map((user) => (
													<TableRow key={user.id}>
														<TableCell>
															<Box display="flex" alignItems="center" gap={1}>
																<Avatar src={import.meta.env.VITE_ASSET_API + user.profile_image} />
																<Typography fontSize="0.95rem">{user.name}</Typography>
															</Box>
														</TableCell>
														<TableCell>{user.email}</TableCell>
														<TableCell>
															<Typography fontSize="0.875rem">{user.type}</Typography>
														</TableCell>
														<TableCell>
															<Typography
																variant="caption"
																sx={{
																	color: user.status === "new" ? "#34C759" : "#FF5252",
																	fontWeight: 600,
																}}>
																{user.status.toUpperCase()}
															</Typography>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell colSpan={4} align="center">
														No customers found.
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								)}
							</TableContainer>
						</Box>
					</Box>
				</div>
			</div>
		</>
	);
};

export default CustomerDashboard;
