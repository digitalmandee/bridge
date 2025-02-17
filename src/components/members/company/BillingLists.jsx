import React, { useEffect, useState } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, CircularProgress, Pagination } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import axiosInstance from "@/utils/axiosInstance";

const BillingLists = ({ companyId }) => {
	const [customer, setCustomer] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [isLoading, setIsLoading] = useState(true);

	const sendNotification = async (invoiceId, userId, status) => {
		try {
			const res = await axiosInstance.post(`notifications/send`, {
				user_id: userId,
				invoice_id: invoiceId,
				type: "invoice_conformation",
				invoice_status: status,
			});

			if (res.data.success) {
				alert("Notification sent successfully!");
			} else {
				alert("Failed to send notification.");
			}
		} catch (error) {
			console.error("Error sending notification:", error.response.data);
			alert("An error occurred while sending the notification.");
		}
	};

	useEffect(() => {
		setIsLoading(true);
		const fetchInvoiceDetail = async () => {
			try {
				const res = await axiosInstance.get(`invoices/customer-detail/${companyId}`);
				if (res.data.success) {
					setCustomer(res.data.customer);
				}
			} catch (error) {
				console.error("Error fetching invoice details:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchInvoiceDetail();
	}, [companyId, currentPage, limit]);

	return (
		<>
			<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
				<Table>
					<TableHead sx={{ bgcolor: "#F8FAFC" }}>
						<TableRow>
							<TableCell>Invoice #</TableCell>
							<TableCell>Issue date</TableCell>
							<TableCell>Payment Date</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Amount</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<CircularProgress sx={{ color: "#0F172A" }} />
								</TableCell>
							</TableRow>
						) : customer && customer.invoices.length > 0 ? (
							customer.invoices.map((invoice) => (
								<TableRow key={invoice.id}>
									<TableCell>#NASTP-{invoice.id}</TableCell>
									<TableCell>{new Date(invoice.created_at).toISOString().split("T")[0]}</TableCell>
									<TableCell>{invoice.due_date}</TableCell>
									<TableCell>
										<Button
											size="small"
											variant="contained"
											sx={{
												bgcolor: invoice.status === "paid" ? "#0F172A" : "#E5E7EB",
												color: invoice.status === "paid" ? "white" : "#6B7280",
												"&:hover": { bgcolor: invoice.status === "paid" ? "#1E293B" : "#D1D5DB" },
											}}>
											{invoice.status}
										</Button>
									</TableCell>
									<TableCell>Rs. {invoice.amount}</TableCell>
									<TableCell>
										<Button size="small" variant="outlined" startIcon={<NotificationsIcon />} sx={{ borderColor: "#e0e0e0", color: "text.secondary" }} onClick={() => sendNotification(invoice.user.id, invoice.user.id, invoice.status)}>
											Notify
										</Button>
									</TableCell>
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
			<Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
				<Pagination count={totalPages} page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
			</Box>
		</>
	);
};

export default BillingLists;
