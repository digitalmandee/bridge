import React from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { FaPrint, FaTrashAlt, FaSearch } from "react-icons/fa"; // Ensure you have react-icons
import { FaEdit, FaEye } from "react-icons/fa";

const data = [
	{ id: 1001, name: "John Doe", type: "Designer", department: "Engineering", dateJoined: "05 Jan 2025", status: "Inactive" },
	{ id: 3001, name: "Jane Smith", type: "Designer", department: "Engineering", dateJoined: "05 Jan 2025", status: "Active" },
	{ id: 3002, name: "Alice Johnson", type: "Developer", department: "Engineering", dateJoined: "05 Feb 2025", status: "Active" },
	{ id: 4001, name: "Bob Brown", type: "Manager", department: "Sales", dateJoined: "05 Oct 2025", status: "Active" },
];

const StaffManagement = () => {
	const navigate = useNavigate();
	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px", cursor: "pointer" }}>
						<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
							<MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
						</div>
						<h2 style={{ margin: 0 }}>Staff Archive</h2>
					</div>
					<div style={{ padding: "16px", backgroundColor: "#F8F9FA", width: "95%" }}>
						<div>
							{/* First Child Div with Filter Buttons */}
							<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
								<div style={{ display: "flex", alignItems: "center" }}>
									<button style={{ marginRight: "8px", backgroundColor: "white", border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}>
										All <span style={{ marginLeft: "4px", color: "gray" }}>20</span>
									</button>
									<button style={{ marginRight: "8px", backgroundColor: "white", border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}>
										Active <span style={{ marginLeft: "4px", color: "gray" }}>5</span>
									</button>
									<button style={{ backgroundColor: "white", border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}>
										Inactive <span style={{ marginLeft: "4px", color: "gray" }}>15</span>
									</button>
								</div>
							</div>
							{/* Line Below the First Child Div */}
							<hr style={{ margin: "16px 0", border: "1px solid #ccc" }} />
							{/* Second Child Div with Search Bar and Action Buttons */}
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									alignItems: "center",
								}}>
								<button style={{ marginRight: "8px", backgroundColor: "#979797", color: "#f2f2f2", border: "none", borderRadius: "4px", padding: "8px", display: "flex", alignItems: "center" }}>
									<FaPrint style={{ marginRight: "4px", color: "#f2f2f2" }} />
									Print
								</button>
								<button style={{ marginRight: "8px", backgroundColor: "#979797", color: "#f2f2f2", border: "none", borderRadius: "4px", padding: "8px", display: "flex", alignItems: "center" }}>
									<FaTrashAlt style={{ marginRight: "4px", color: "#f2f2f2" }} />
									Delete
								</button>
								<div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "4px", padding: "4px", width: "200px" }}>
									<FaSearch style={{ marginRight: "4px", color: "gray" }} />
									<input
										type="text"
										placeholder="Search name, role"
										style={{
											border: "none",
											outline: "none",
											width: "100%",
										}}
									/>
								</div>
							</div>
						</div>
						<table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse", backgroundColor: "white" }}>
							<thead style={{ backgroundColor: "#C5D9F0", color: "black" }}>
								<tr>
									<th style={{ padding: "12px" }}>ID</th>
									<th style={{ padding: "12px" }}>Name</th>
									<th style={{ padding: "12px" }}>Type</th>
									<th style={{ padding: "12px" }}>Department</th>
									<th style={{ padding: "12px" }}>Date Joined</th>
									<th style={{ padding: "12px" }}>Status</th>
									<th style={{ padding: "12px" }}>Action</th>
								</tr>
							</thead>
							<tbody>
								{data.map((row, index) => (
									<tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
										<td style={{ padding: "12px" }}>{row.id}</td>
										<td style={{ padding: "12px" }}>{row.name}</td>
										<td style={{ padding: "12px" }}>{row.type}</td>
										<td style={{ padding: "12px" }}>{row.department}</td>
										<td style={{ padding: "12px" }}>{row.dateJoined}</td>
										<td style={{ padding: "12px", color: row.status === "Active" ? "green" : "red" }}>{row.status}</td>
										<td style={{ padding: "12px" }}>
											<button style={{ marginRight: "8px", border: "none", background: "none" }}>
												<FaEye
													style={{
														color: "#0D2B4E",
													}}
												/>
											</button>
											<button style={{ marginRight: "8px", border: "none", background: "none" }}>
												<FaEdit
													style={{
														color: "#0D2B4E",
													}}
												/>
											</button>
											<button style={{ border: "none", background: "none" }}>
												<FaTrashAlt
													style={{
														color: "#0D2B4E",
													}}
												/>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<div>
								<span>Showing 1 to 4 of 67 entries</span>
							</div>
							<div style={{ display: "flex", alignItems: "center" }}>
								<button style={{ marginRight: "8px", backgroundColor: "#F8F9FA", border: "none", borderRadius: "4px", padding: "8px" }}>Previous</button>
								<button style={{ marginRight: "8px", backgroundColor: "#0D2B4E", color: "white", border: "none", borderRadius: "4px", padding: "8px" }}>1</button>
								<button style={{ marginRight: "8px", backgroundColor: "white", border: "none", borderRadius: "4px", padding: "8px" }}>2</button>
								<button style={{ marginRight: "8px", backgroundColor: "white", border: "none", borderRadius: "4px", padding: "8px" }}>3</button>
								<button style={{ marginRight: "8px", backgroundColor: "white", border: "none", borderRadius: "4px", padding: "8px" }}>...</button>
								<button style={{ backgroundColor: "#F8F9FA", border: "none", borderRadius: "4px", padding: "8px" }}>Next</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default StaffManagement;
