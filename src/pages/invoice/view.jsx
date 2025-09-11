import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, CardHeader } from "@mui/material";
import { Download } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./invoiceView.css";
import axiosInstance from "@/utils/axiosInstance";

const ViewInvoice = () => {
	const navigate = useNavigate();

	const { invoiceId } = useParams(); // Get invoice ID from URL
	const items = [{ description: "Dedicated desks", qty: 3, price: 15000, total: 45000 }];

	const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
	const paidAmount = 70000;
	const payableAmount = totalAmount - paidAmount;

	const [isLoading, setIsLoading] = useState(true);

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
										Invoice
									</Typography>
									<Button variant="contained" size="small" startIcon={<Download size={18} />} className="custom-btn">
										PDF
									</Button>
								</div>
							}
						/>

						<Card className="shadow-lg w-100" style={{ borderRadius: "20px" }}>
							<CardContent className="p-4">
								{/* Client Info + Paid Amount */}
								<div className="row g-3">
									<div className="col-md-8">
										<div className="p-3 rounded-4 bg-light border">
											<Typography variant="h6" className="fw-bold">
												Mauro Sicard
											</Typography>
											<Typography className="text-muted small">+92 3209469594</Typography>
											<Typography className="text-muted small">contact@maurosicard.com</Typography>
											<Typography className="text-muted small">Pablo Alto, San Francisco, CA 92102, United States of America</Typography>
										</div>
									</div>
									<div className="col-md-4">
										<div className="p-4 rounded-4 text-center text-white custom-accent">
											<Typography variant="subtitle2">Paid Amount</Typography>
											<Typography variant="h5" className="fw-bold">
												{paidAmount.toLocaleString()} Pkr
											</Typography>
											<Typography className="small">03 August 2024</Typography>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="shadow-lg w-100" style={{ borderRadius: "20px" }}>
							<CardContent className="p-4">
								{/* Invoice Info */}
								<div className="row g-3 mb-4">
									<div className="col-md-4">
										<div className="p-3 rounded-3 bg-light border">
											<Typography className="text-muted small">Invoice No :</Typography>
											<Typography className="fw-bold">N°: 000027</Typography>
										</div>
									</div>
									<div className="col-md-4">
										<div className="p-3 rounded-3 bg-light border">
											<Typography className="text-muted small">Issued :</Typography>
											<Typography className="fw-bold">03/07/2024</Typography>
										</div>
									</div>
									<div className="col-md-4">
										<div className="p-3 rounded-3 bg-light border">
											<Typography className="text-muted small">Due Date :</Typography>
											<Typography className="fw-bold">07/07/2024</Typography>
										</div>
									</div>
								</div>

								{/* Table */}
								<TableContainer className="border rounded-4 mb-4">
									<Table>
										<TableHead>
											<TableRow className="bg-light">
												<TableCell className="fw-bold">Description</TableCell>
												<TableCell className="fw-bold">Qty</TableCell>
												<TableCell className="fw-bold">Price</TableCell>
												<TableCell className="fw-bold">Total Price</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{items.map((item, idx) => (
												<TableRow key={idx}>
													<TableCell>{item.description}</TableCell>
													<TableCell>{item.qty}</TableCell>
													<TableCell>{item.price.toLocaleString()} Pkr</TableCell>
													<TableCell>{item.total.toLocaleString()} Pkr</TableCell>
												</TableRow>
											))}
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
