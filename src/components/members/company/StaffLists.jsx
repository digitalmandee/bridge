import { Avatar, Chip, CircularProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

const StaffLists = ({ companyId }) => {
	const [companyUsers, setCompanyUsers] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		const details = async () => {
			try {
				const res = await axiosInstance.get(`member/company-detail/${companyId}`);
				if (res.data.success) {
					setCompanyUsers(res.data.company_users.data);
					setCurrentPage(res.data.company_users.current_page);
					setTotalPages(res.data.company_users.last_page);
				}
			} catch (error) {
				console.error("Error fetching company details:", error);
			} finally {
				setIsLoading(false);
			}
		};
		details();
	}, [companyId, currentPage, limit]);

	return (
		<>
			<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Company</TableCell>
							<TableCell>Last login</TableCell>
							<TableCell>Status</TableCell>
							{/* <TableCell>Profile</TableCell> */}
							<TableCell>Terms & Condition</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<CircularProgress sx={{ color: "#0F172A" }} />
								</TableCell>
							</TableRow>
						) : companyUsers && companyUsers.length > 0 ? (
							companyUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
											<Avatar src={user.profile_image ? import.meta.env.VITE_ASSET_API + user.profile_image : ""} />
											<Box>
												<Typography>{user.name}</Typography>
												<Typography>
													<small>{user.email}</small>
												</Typography>
											</Box>
										</Box>
									</TableCell>
									<TableCell>
										<Typography variant="body2">{user.last_login_human}</Typography>
									</TableCell>
									<TableCell>
										<Chip
											label={user.status}
											size="small"
											sx={{
												backgroundColor: "#002B5B",
												color: "#fff",
												borderRadius: "4px",
												height: "24px",
												fontSize: "0.75rem",
												textTransform: "capitalize",
											}}
										/>
									</TableCell>
									<TableCell>
										<Typography variant="body2">{user.terms}</Typography>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center">
									No user found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			{/* Pagination */}
			<Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
				<Pagination count={totalPages} page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
			</Box>
		</>
	);
};

export default StaffLists;
