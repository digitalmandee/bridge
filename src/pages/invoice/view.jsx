import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, CardHeader, CircularProgress } from "@mui/material";
import { Download } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./invoiceView.css";
import axiosInstance from "@/utils/axiosInstance";

const ViewInvoice = () => {
	const navigate = useNavigate();
	const { invoiceId } = useParams(); // invoiceId from route param

	const [invoice, setInvoice] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchInvoice = async () => {
			try {
				const { data } = await axiosInstance.get(`invoices/view/${invoiceId}`);
				setInvoice(data);
			} catch (error) {
				console.error("Failed to fetch invoice:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (invoiceId) fetchInvoice();
	}, [invoiceId]);

	if (isLoading) {
		return (
			<div className="d-flex justify-content-center align-items-center vh-100">
				<CircularProgress />
			</div>
		);
	}

	if (!invoice) {
		return (
			<div className="d-flex justify-content-center align-items-center vh-100">
				<Typography color="error">Invoice not found</Typography>
			</div>
		);
	}

	// Related fields from backend
	const {
		id,
		booking_id,
		user_id,
		invoice_type,
		quantity,
		hours,
		discount,
		amount,
		status,
		due_date,
		paid_date,
		paid_month,
		paid_year,
		plan,
		payment_type,
		receipt,
		items = [], // optional items array if you store line items
	} = invoice;

	const totalAmount = amount;
	const paidAmount = status === "paid" ? amount : 0;
	const payableAmount = totalAmount - paidAmount;

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
						<CardHeader
							title={
								<div className="d-flex justify-content-between align-items-center">
									<Typography variant="h5" className="fw-bold custom-primary">
										Invoice #{id}
									</Typography>
									{/* <Button variant="contained" size="small" startIcon={<Download size={18} />} className="custom-btn">
										PDF
									</Button> */}
								</div>
							}
						/>

						{/* Client Info + Paid Amount */}
						<Card className="shadow-lg w-100" style={{ borderRadius: "20px" }}>
							<CardContent className="p-4">
								<div className="row g-3">
									<div className="col-md-8">
										<div className="p-3 rounded-4 bg-light border">
											<Typography variant="h6" className="fw-bold">
												User ID: {user_id}
											</Typography>
											{plan && <Typography className="text-muted small">Plan: {plan?.name}</Typography>}
											<Typography className="text-muted small">Invoice Type: {invoice_type}</Typography>
										</div>
									</div>
									<div className="col-md-4">
										<div className="p-4 rounded-4 text-center text-white custom-accent">
											<Typography variant="subtitle2">Paid Amount</Typography>
											<Typography variant="h5" className="fw-bold">
												{paidAmount.toLocaleString()} Pkr
											</Typography>
											<Typography className="small">{paid_date ? new Date(paid_date).toLocaleDateString() : "-"}</Typography>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Invoice Info */}
						<Card className="shadow-lg w-100 my-3" style={{ borderRadius: "20px" }}>
							<CardContent className="p-4">
								<div className="row g-3">
									<div className="col-md-4">
										<div className="p-3 rounded-3 bg-light border">
											<Typography className="text-muted small">Booking ID :</Typography>
											<Typography className="fw-bold">{booking_id}</Typography>
										</div>
									</div>
									<div className="col-md-4">
										<div className="p-3 rounded-3 bg-light border">
											<Typography className="text-muted small">Issued :</Typography>
											<Typography className="fw-bold">{invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : "-"}</Typography>
										</div>
									</div>
									<div className="col-md-4">
										<div className="p-3 rounded-3 bg-light border">
											<Typography className="text-muted small">Due Date :</Typography>
											<Typography className="fw-bold">{due_date ? new Date(due_date).toLocaleDateString() : "-"}</Typography>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Table */}
						<Card className="shadow-lg w-100" style={{ borderRadius: "20px" }}>
							<CardContent className="p-4">
								<TableContainer className="border rounded-4 mb-4">
									<Table>
										<TableHead>
											<TableRow className="bg-light">
												<TableCell className="fw-bold">Description</TableCell>
												<TableCell className="fw-bold">Qty</TableCell>
												<TableCell className="fw-bold">Hours</TableCell>
												<TableCell className="fw-bold">Discount</TableCell>
												<TableCell className="fw-bold">Amount</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow>
												<TableCell>{invoice_type}</TableCell>
												<TableCell>{quantity}</TableCell>
												<TableCell>{hours || "-"}</TableCell>
												<TableCell>{discount || 0} %</TableCell>
												<TableCell>{amount?.toLocaleString()} Pkr</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>

								{/* Amount Summary */}
								<div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-light border">
									<Typography className="fw-bold custom-danger">Payable Amount: {payableAmount.toLocaleString()} Pkr</Typography>
									<Typography className="fw-bold custom-primary">Total Amount: {totalAmount.toLocaleString()} Pkr</Typography>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
};

export default ViewInvoice;
