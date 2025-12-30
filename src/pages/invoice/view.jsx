import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import { MdArrowBackIos } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import "./invoiceView.css";
import axiosInstance from "@/utils/axiosInstance";

// Import header and footer images
import invoiceHeader from "@/assets/invoice/invoice-header.png";
import invoiceFooter from "@/assets/invoice/invoice-footer.png";

const ViewInvoice = () => {
	const navigate = useNavigate();
	const { invoiceId } = useParams();

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

	// Extract invoice fields
	const { id, booking_id, user_id, invoice_type, quantity, hours, discount, amount, status, due_date, paid_date, plan, user, booking } = invoice;

	// Format dates
	const formatDate = (dateStr) => {
		if (!dateStr) return "-";
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
	};

	// Calculate amounts
	const rate = amount || 0;
	const qty = quantity || 1;
	const discountPercent = discount || 0;
	const subtotal = rate * qty;
	const discountAmount = (subtotal * discountPercent) / 100;
	const totalAmount = subtotal - discountAmount;

	// Get user/company details
	const billedToName = user?.name || booking?.company_name || "N/A";
	const billedToPhone = user?.phone_no || booking?.phone || "";
	const billedToNTN = user?.ntn || booking?.ntn || "";
	const billedToAddress = user?.address || booking?.address || "";

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="container-fluid py-4">
						{/* Back Button */}
						<div className="invoice-back-header no-print">
							<div className="invoice-back-btn" onClick={() => navigate(-1)}>
								<MdArrowBackIos style={{ fontSize: "18px", marginRight: "8px" }} />
								<span>Back to Invoices</span>
							</div>
						</div>

						{/* Invoice Container */}
						<div className="invoice-container">
							{/* Header Image */}
							<img src={invoiceHeader} alt="Bridge Co-Working Space" className="invoice-header-img" />

							{/* Invoice Title */}
							<h1 className="invoice-title">Invoice</h1>

							{/* Invoice Meta Info */}
							<div className="invoice-meta">
								<div className="invoice-meta-row">
									<span className="invoice-meta-label">Invoice Number:</span>
									<span className="invoice-meta-value">&nbsp;#{id || "01111-1111"}</span>
								</div>
								<div className="invoice-meta-row">
									<span className="invoice-meta-label">Invoice Date:</span>
									<span className="invoice-meta-value">&nbsp;{formatDate(invoice.created_at)}</span>
								</div>
								<div className="invoice-meta-row">
									<span className="invoice-meta-label">Due Date:</span>
									<span className="invoice-meta-value">&nbsp;{formatDate(due_date)}</span>
								</div>
							</div>

							{/* Billing Section */}
							<div className="billing-section">
								{/* Billed By */}
								<div className="billing-column">
									<div className="billing-title">Billed By</div>
									<div className="billing-company">Bridge</div>
									<div className="billing-detail">82 J1, Johar Town, Near Al-Fatah, Lahore.</div>
									<div className="billing-detail">Lahore.</div>
									<div className="billing-detail">Pakistan - 54000</div>
								</div>

								{/* Billed To */}
								<div className="billing-column">
									<div className="billing-title">Billed To</div>
									<div className="billing-company">{billedToName}</div>
									{billedToPhone && <div className="billing-detail">{billedToPhone}</div>}
									{billedToNTN && <div className="billing-detail">NTN {billedToNTN}</div>}
									{billedToAddress && <div className="billing-detail">{billedToAddress}</div>}
								</div>
							</div>

							{/* Items Table */}
							<div className="invoice-table-container">
								<table className="invoice-table">
									<thead>
										<tr>
											<th style={{ width: "50%" }}>Item</th>
											<th style={{ width: "15%" }}>Quantity</th>
											<th style={{ width: "15%" }}>Rate</th>
											<th style={{ width: "20%" }}>Amount</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												1. {invoice_type || "Service Charges"} {plan?.name ? `- ${plan.name}` : ""}
												<br />
												<small style={{ color: "#666" }}>
													{hours ? `${hours} Hours` : ""} {discount ? `(${discount}% discount applied)` : ""}
												</small>
											</td>
											<td>{qty}</td>
											<td>{rate.toLocaleString()}/-</td>
											<td>
												<span className="amount-highlight">Rs. {(rate * qty).toLocaleString()}/-</span>
											</td>
										</tr>

										{/* If there are additional items, show them */}
										{invoice.items &&
											invoice.items.map((item, index) => (
												<tr key={index}>
													<td>
														{index + 2}. {item.description}
													</td>
													<td>{item.quantity}</td>
													<td>{item.rate?.toLocaleString()}/-</td>
													<td>
														<span className="amount-highlight">Rs. {item.amount?.toLocaleString()}/-</span>
													</td>
												</tr>
											))}

										{/* Total Row */}
										<tr className="total-row">
											<td colSpan="3">
												<strong>{invoice.items ? invoice.items.length + 2 : 2}. Total Amount</strong>
											</td>
											<td>
												<strong>Rs. {totalAmount.toLocaleString()}/-</strong>
											</td>
										</tr>
									</tbody>
								</table>
							</div>

							{/* Total Summary Box */}
							<div className="total-summary">
								<div className="total-box">
									<div className="total-label">Total (PKR)</div>
									<div className="total-amount">{totalAmount.toLocaleString()}/-</div>
									<div className="total-note">Exclusive of Tax</div>
								</div>
							</div>

							{/* Bank Details Section */}
							<div className="bank-details">
								<div className="bank-title">Bank Details</div>
								<div className="bank-row">
									<span className="bank-label">Account Holder Name</span>
									<span className="bank-value">BRIDGE</span>
								</div>
								<div className="bank-row">
									<span className="bank-label">Account Number</span>
									<span className="bank-value">PK56ALFH5952005002320929</span>
								</div>
								<div className="bank-row">
									<span className="bank-label">Bank</span>
									<span className="bank-value">Bank Al-Falah</span>
								</div>
							</div>

							{/* Contact Info */}
							<div className="contact-info">
								For any enquiry, reach out via call on <span className="contact-phone">+92 336 1312345</span>
							</div>

							{/* Footer Image */}
							<img src={invoiceFooter} alt="Bridge Contact Info" className="invoice-footer-img" />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ViewInvoice;
