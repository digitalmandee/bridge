import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Select, MenuItem, styled, CircularProgress, Chip, Pagination, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { Download as DownloadIcon, FilterAlt as FilterIcon, Notifications as NotificationsIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../utils/axiosInstance";
import StaffLists from "@/components/members/company/StaffLists";
import BillingLists from "@/components/members/company/BillingLists";

const MemberCompanyDetail = () => {
	const navigate = useNavigate();

	const [month, setMonth] = useState("Month");

	const { companyId } = useParams(); // Get invoice ID from URL
	const [company, setCompany] = useState({});
	const [currentTab, setCurrentTab] = useState("staff");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		const details = async () => {
			try {
				const res = await axiosInstance.get(`member/detail/${companyId}`);
				if (res.data.success) {
					setCompany(res.data.user);
				}
			} catch (error) {
				console.error("Error fetching company details:", error);
			} finally {
				setIsLoading(false);
			}
		};
		details();
	}, []);

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="container-fluid p-4">
						{/* Header */}
						<div className="row mb-4 align-items-center">
							<div className="col">
								<Box display="flex" alignItems="center" gap={2}>
									<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
										<MdArrowBackIos style={{ fontSize: "20px" }} />
									</div>
									<Typography variant="h5">Detail</Typography>
								</Box>
							</div>
							<div className="col-auto">
								<Box display="flex" gap={2}>
									<Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderColor: "#e0e0e0", color: "text.secondary" }}>
										CSV
									</Button>
									<Button variant="outlined" startIcon={<FilterIcon />} sx={{ borderColor: "#e0e0e0", color: "text.secondary" }}>
										Filter
									</Button>
									<Select value={month} onChange={(e) => setMonth(e.target.value)} size="small" sx={{ minWidth: 120 }}>
										<MenuItem value="Month">Month</MenuItem>
										<MenuItem value="January">January</MenuItem>
										<MenuItem value="February">February</MenuItem>
									</Select>
								</Box>
							</div>
						</div>

						{/* company Profile */}
						<Paper sx={{ p: 3, mb: 4 }}>
							<Box display="flex" gap={3} alignItems="center">
								<Avatar src={import.meta.env.VITE_ASSET_API + company.profile_image} sx={{ width: 80, height: 80 }} />
								<Box display="flex" flexDirection="column" gap={2}>
									<Box display="flex" gap={2}>
										<Typography color="text.secondary" variant="body2">
											Name:
										</Typography>
										<Typography variant="body1">{company.name}</Typography>
									</Box>

									<Box display="flex" gap={2}>
										<Typography color="text.secondary" variant="body2">
											Type:
										</Typography>
										<Typography variant="body1" sx={{ textTransform: "capitalize" }}>
											{company.type}
										</Typography>
									</Box>

									<Box display="flex" gap={2}>
										<Typography color="text.secondary" variant="body2">
											Phone:
										</Typography>
										<Typography variant="body1">{company.phone_no ?? "N/A"}</Typography>
									</Box>

									<Box display="flex" gap={2}>
										<Typography color="text.secondary" variant="body2">
											Email:
										</Typography>
										<Typography variant="body1">{company.email}</Typography>
									</Box>
									<Box display="flex" gap={2}>
										<Typography color="text.secondary" variant="body2">
											Branch:
										</Typography>
										<Typography variant="body1">{company.user_branch?.name}</Typography>
									</Box>
								</Box>
							</Box>
						</Paper>

						<ToggleButtonGroup sx={{ mb: 2 }} value={currentTab} onChange={(e, newTab) => setCurrentTab(newTab)} exclusive>
							<ToggleButton value="staff">Staff</ToggleButton>
							<ToggleButton value="billing">Billing</ToggleButton>
						</ToggleButtonGroup>

						{/* Table */}
						{currentTab === "staff" && <StaffLists companyId={companyId} />}
						{currentTab === "billing" && <BillingLists companyId={companyId} />}
					</div>
				</div>
			</div>
		</>
	);
};

export default MemberCompanyDetail;
