import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, CircularProgress, Pagination } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PrintIcon from "@mui/icons-material/Print";
import { ArrowDownIcon, ArrowUpIcon, Bell, Building2, FileText, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { Box } from "@mui/system";

// const bookingData = [
// 	{ id: "#123", name: "Ali Ansari", department: "Digital Marketing", designation: "Assistant", startDate: "Jan 01, 2024", email: "ali@gmail.com", branch: "Gulberg", status: "Confirmed" },
// 	{ id: "#123", name: "Anas Sheikh", department: "Web Development", designation: "Associate", startDate: "Jan 15, 2024", email: "ali@gmail.com", branch: "Gulberg", status: "Confirmed" },
// 	{ id: "#123", name: "Arif Hameed", department: "Manager", designation: "Manager", startDate: "Feb 01, 2024", email: "ali@gmail.com", branch: "DHA", status: "Cancelled" },
// 	{ id: "#123", name: "Ali Afghan", department: "HR Management", designation: "HR Officer", startDate: "Feb 05, 2024", email: "ali@gmail.com", branch: "Gulberg", status: "Pending" },
// 	{ id: "#123", name: "Faraz Naseem", department: "Social Media", designation: "Associate", startDate: "Feb 10, 2024", email: "ali@gmail.com", branch: "DHA", status: "Confirmed" },
// 	{ id: "#123", name: "Aisha Afzal", department: "Office", designation: "Office Boy", startDate: "Feb 12, 2024", email: "ali@gmail.com", branch: "DHA", status: "Confirmed" },
// 	{ id: "#123", name: "Ash Sodi", department: "Finance", designation: "CFO", startDate: "Feb 20, 2024", email: "ali@gmail.com", branch: "Gulberg", status: "Confirmed" },
// 	{ id: "#123", name: "Winnie Peter", department: "Admin", designation: "Manager", startDate: "Feb 25, 2024", email: "ali@gmail.com", branch: "Gulberg", status: "Confirmed" },
// ];

const EmployeeDashboard = () => {
	const navigate = useNavigate();

	const [employees, setEmployees] = useState([]);
	const [stats, setStats] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);

	const getStats = async () => {
		try {
			const res = await axiosInstance.get("employees/dashboard");

			if (res.data.success) {
				setStats(res.data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getEmployees = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("employees", {
				params: { page, limit },
			});

			if (res.data.success) {
				setEmployees(res.data.employees.data);
				setTotalPages(res.data.employees.last_page);
				setCurrentPage(res.data.employees.current_page);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getEmployees(currentPage);
	}, [currentPage, limit]);

	useEffect(() => {
		getStats();
	}, []);

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div style={{ paddingTop: "1rem", backgroundColor: "transparent" }}>
						{/* Header */}
						<div style={{ display: "flex", width: "98%", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
							<Typography variant="h5" style={{ fontWeight: "bold" }}>
								Employee Management
							</Typography>
							<Button style={{ color: "white", backgroundColor: "#0D2B4E" }} onClick={() => navigate("/branch/employee/create")}>
								Add Employee
							</Button>
						</div>

						{/* Metric Cards */}
						<div style={{ display: "flex", width: "98%", justifyContent: "space-between", gap: "1rem", marginBottom: "24px" }}>
							{[
								{ title: "Total Employees", value: stats?.total_employees || 0, icon: EventSeatIcon, color: "#0D2B4E" },
								{ title: "Total Present", value: stats?.total_present || 0, icon: PeopleIcon, color: "#0D2B4E" },
								{ title: "Total Absent", value: stats?.total_absent || 0, icon: AssignmentIcon, color: "#0D2B4E" },
								{ title: "Late Arrival", value: stats?.total_late || 0, icon: PrintIcon, color: "#0D2B4E" },
							].map((item, index) => (
								<div key={index} style={{ flex: 1 }}>
									<Card style={{ boxShadow: "none", border: "1px solid #ccc", borderRadius: "8px", height: "100%", backgroundColor: "white" }}>
										<CardContent>
											<Typography variant="body2" color="text.secondary" gutterBottom>
												{item.title}
											</Typography>
											<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
												<Typography variant="h5" style={{ fontWeight: "bold" }}>
													{item.value}
												</Typography>
												<div style={{ backgroundColor: item.color, borderRadius: "8px", padding: "0.5rem" }}>
													<item.icon style={{ color: "#fff", width: "40px", height: "40px" }} />
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							))}
						</div>
						<div style={{ marginBottom: "1rem" }}>
							{/* Booking Table */}
							<TableContainer component={Paper} style={{ width: "98%", backgroundColor: "#FFFFFF", borderRadius: "1rem", boxShadow: "none", border: "1px solid #ccc", marginBottom: "24px" }}>
								<Table>
									<TableHead style={{ backgroundColor: "#C5D9F0" }}>
										<TableRow>
											<TableCell style={{ color: "black", fontWeight: "700" }}>EMP ID</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Name</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Department</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Designation</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Joining Date</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Email Address</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Branch Name</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{isLoading ? (
											<TableRow>
												<TableCell colSpan={7} align="center">
													<CircularProgress sx={{ color: "#0F172A" }} />
												</TableCell>
											</TableRow>
										) : employees.length > 0 ? (
											employees.map((row, index) => (
												<TableRow key={index}>
													<TableCell style={{ cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate(`/branch/employee/details/${row.employee_id}`, { state: { employee: row } })}>
														#{row.employee_id}
													</TableCell>
													<TableCell>{row.user?.name}</TableCell>
													<TableCell>{row.department?.name}</TableCell>
													<TableCell>{row.user?.designation}</TableCell>
													<TableCell>{row.joining_date}</TableCell>
													<TableCell>{row.user.email}</TableCell>
													<TableCell>{row.branch?.name}</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={7} align="center">
													No invoices found.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</TableContainer>

							{/* Pagination */}
							<Box sx={{ display: "flex", justifyContent: "end", mt: 3, paddingBottom: "10px" }}>
								<Pagination count={totalPages} page={currentPage} onChange={(e, page) => setCurrentPage(page)} />
							</Box>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default EmployeeDashboard;
