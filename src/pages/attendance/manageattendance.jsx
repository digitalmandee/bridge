import React, { useEffect, useState } from "react";
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, TextField, Checkbox, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Select, MenuItem } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

const ManageAttendance = () => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(1);
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

	const [attendances, setAttendances] = useState([]);
	const [leavecategories, setLeaveCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);

	const getAttendances = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("employees/attendances", {
				params: { page, limit, date },
			});

			if (res.data.success) {
				setAttendances(res.data.attendance.data);
				setTotalPages(res.data.attendance.last_page);
				setCurrentPage(res.data.attendance.current_page);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getAttendances(currentPage);
	}, [currentPage, limit]);

	const getLeaveCatgories = async () => {
		try {
			const res = await axiosInstance.get("employees/leavecategories");
			if (res.data.success) {
				setLeaveCategories(res.data.leave_categories);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getLeaveCatgories();
	}, []);

	const handleSearch = () => {
		console.log("Searching:", searchQuery);
	};

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	// Handle check-in, check-out, and leave category updates
	const handleUpdate = async (id, updatedData) => {
		try {
			await axiosInstance.put(`employees/attendances/${id}`, updatedData);
			getAttendances(currentPage);
		} catch (error) {
			console.log("Error updating attendance:", error);
		}
	};

	const handleInputChange = (id, field, value) => {
		setAttendances((prev) =>
			prev.map((att) => {
				if (att.id === id) {
					let updatedAttendance = att.attendance;
					let updatedStatus = att.status;

					if (field === "attendance") {
						// If checked, set "present" by default, allow "late" later
						updatedAttendance = value;
						updatedStatus = value ? "present" : "absent";
					}

					if (field === "status") {
						// If status is "late" or "present", attendance must be true
						updatedStatus = ["present", "late"].includes(value) ? value : updatedStatus;
						updatedAttendance = ["present", "late"].includes(value);
					}

					if (field === "leave_category_id") {
						updatedAttendance = false; // Uncheck attendance
						updatedStatus = value ? "leave" : "absent"; // If leave is selected, status = "leave", else "absent"
					}

					return { ...att, [field]: value, attendance: updatedAttendance, status: updatedStatus };
				}
				return att;
			})
		);
	};

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px" }}>
						<div onClick={() => navigate(-1)} style={{ cursor: "pointer", marginTop: "5px", display: "flex", alignItems: "center" }}>
							<MdArrowBackIos style={{ fontSize: "20px", cursor: "pointer" }} />
						</div>
						<h3 style={{ margin: 0 }}>Manage Attendance</h3>
					</div>

					{/* Search Input */}
					<div className="d-flex mb-4">
						<TextField size="small" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="me-2" style={{ backgroundColor: "white" }} />
						<Button variant="contained" onClick={handleSearch} style={{ backgroundColor: "#0A2647", color: "white", textTransform: "none", minWidth: "80px" }}>
							Go
						</Button>
					</div>

					<TableContainer component={Paper}>
						<Table>
							<TableHead style={{ backgroundColor: "#f8f9fa" }}>
								<TableRow>
									<TableCell>#</TableCell>
									<TableCell>Employee Name</TableCell>
									<TableCell>Designation</TableCell>
									<TableCell>Attendance</TableCell>
									<TableCell>Leave Category</TableCell>
									<TableCell>Check-In</TableCell>
									<TableCell>Check-Out</TableCell>
									<TableCell>Action</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={8} align="center">
											<CircularProgress sx={{ color: "#0F172A" }} />
										</TableCell>
									</TableRow>
								) : attendances.length > 0 ? (
									attendances.map((row, index) => (
										<TableRow key={row.id}>
											<TableCell>{index + 1}</TableCell>
											<TableCell>{row.employee.user.name}</TableCell>
											<TableCell>{row.employee.user.designation}</TableCell>
											<TableCell>
												<Checkbox
													checked={["present", "late"].includes(row.status)} // If present or late, show checked
													onChange={(e) => handleInputChange(row.id, "attendance", e.target.checked)}
													disabled={row.status === "leave"} // Disable if on leave
													color="primary"
												/>
											</TableCell>

											<TableCell>
												<Select value={row.leave_category_id || ""} onChange={(e) => handleInputChange(row.id, "leave_category_id", e.target.value)} size="small" style={{ minWidth: "120px" }}>
													<MenuItem value="">Select</MenuItem>
													{leavecategories.map((category) => (
														<MenuItem key={category.id} value={category.id}>
															{category.name}
														</MenuItem>
													))}
												</Select>
											</TableCell>

											<TableCell>
												<TextField size="small" type="time" value={row.check_in || ""} onChange={(e) => handleInputChange(row.id, "check_in", e.target.value)} style={{ width: "100px" }} />
											</TableCell>
											<TableCell>
												<TextField size="small" type="time" value={row.check_out || ""} onChange={(e) => handleInputChange(row.id, "check_out", e.target.value)} style={{ width: "100px" }} />
											</TableCell>
											<TableCell>
												<Button
													onClick={() =>
														handleUpdate(row.id, {
															leave_category_id: row.leave_category_id,
															check_in: row.check_in,
															check_out: row.check_out,
														})
													}
													variant="contained"
													size="small"
													style={{
														backgroundColor: row.check_in && row.check_out ? "#e3f2fd" : "#0A2647",
														color: row.check_in && row.check_out ? "#0A2647" : "white",
														textTransform: "none",
													}}>
													{row.check_in && row.check_out ? "Updated" : "Save"}
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={8} align="center">
											No attendances found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>

					{/* Pagination */}
					<div className="d-flex justify-content-end mt-4">
						<Pagination count={totalPages} page={currentPage} onChange={(e, page) => setCurrentPage(page)} shape="rounded" style={{ color: "#0a2647" }} />
					</div>
				</div>
			</div>
		</>
	);
};

export default ManageAttendance;
