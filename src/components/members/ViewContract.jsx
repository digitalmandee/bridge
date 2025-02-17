import React, { useContext, useEffect, useState } from "react";
import { Typography, Button, IconButton, Modal, Box, Divider, CardContent, Card, Avatar, Grid, TextField } from "@mui/material";
import { Close as CloseIcon, Download as DownloadIcon } from "@mui/icons-material";
import { AuthContext } from "@/contexts/AuthContext";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import colors from "@/assets/styles/color";
import axiosInstance from "@/utils/axiosInstance";

// Register a custom font for the signature (optional)
Font.register({
	family: "Bastliga",
	src: "/signature-one/Bastliga-One.ttf", // Make sure this path matches your font location
});

// PDF Styles matching your frontend
const styles = StyleSheet.create({
	page: {
		padding: 40,
		backgroundColor: "#fff",
	},
	section: {
		marginBottom: 20,
	},
	branchName: {
		fontSize: 20,
		textAlign: "center",
		textTransform: "uppercase",
		color: colors.primary,
		fontWeight: "bold",
		marginBottom: 20,
	},
	card: {
		padding: 20,
		marginBottom: 20,
		border: "1 solid #eee",
		borderRadius: 8,
	},
	userProfile: {
		flexDirection: "row",
		marginBottom: 20,
		alignItems: "center",
	},
	userInfo: {
		marginLeft: 15,
	},
	userName: {
		fontSize: 16,
		fontWeight: "bold",
	},
	userEmail: {
		fontSize: 12,
		color: "#666",
		marginBottom: 5,
	},
	userType: {
		fontSize: 12,
		color: "#666",
	},
	status: {
		fontSize: 12,
		fontWeight: "bold",
	},
	divider: {
		borderBottom: "1 solid #eee",
		marginVertical: 10,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 10,
	},
	detailsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginBottom: 10,
	},
	detailItem: {
		width: "50%",
		marginBottom: 5,
	},
	detailText: {
		fontSize: 10,
		color: "#333",
	},
	signatureSection: {
		alignItems: "center",
		marginTop: 20,
	},
	signatureTitle: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 10,
	},
	signature: {
		fontFamily: "Bastliga",
		fontSize: 40,
		marginTop: 10,
	},
});

// PDF Document Component
const ContractPDF = ({ contract, formData }) => (
	<Document>
		<Page size="A4" style={styles.page}>
			{/* Branch Name */}
			<Text style={styles.branchName}>{contract?.branch?.name}</Text>

			{/* Main Card */}
			<View style={styles.card}>
				{/* User Profile Section */}
				<View style={styles.userProfile}>
					<Image alt={contract?.user?.name} src={contract?.user?.profile_image ? import.meta.env.VITE_API_URL + contract?.user?.profile_image : "/demo.jpg"} style={{ width: 60, height: 60 }} />
					<View style={styles.userInfo}>
						<Text style={styles.userName}>{contract?.user?.name}</Text>
						<Text style={styles.userEmail}>{contract?.user?.email}</Text>
						<Text style={styles.userType}>Type: {contract?.user?.type}</Text>
						<Text style={[styles.status, { color: contract?.status === "signed" ? "green" : "red" }]}>Status: {contract?.status}</Text>
					</View>
				</View>

				<View style={styles.divider} />

				{/* Contract Details Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Contract Details</Text>
					<View style={styles.detailsGrid}>
						<View style={styles.detailItem}>
							<Text style={styles.detailText}>Type: {contract?.type}</Text>
							<Text style={styles.detailText}>Registration No: {contract?.company_number}</Text>
							<Text style={styles.detailText}>Start Date: {contract?.start_date}</Text>
							<Text style={styles.detailText}>End Date: {contract?.end_date}</Text>
						</View>
						<View style={styles.detailItem}>
							<Text style={styles.detailText}>
								Notice Period: {contract?.notice_period} - {contract?.duration}
							</Text>
							<Text style={styles.detailText}>Plan: {contract?.plan?.name}</Text>
							<Text style={styles.detailText}>Plan Price: Rs. {contract?.plan?.price}</Text>
							<Text style={styles.detailText}>Deposit: Rs. {contract?.amount}</Text>
						</View>
					</View>
				</View>

				<View style={styles.divider} />

				{/* Plan Information Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Plan Information</Text>
					<Text style={styles.detailText}>Plan Start Date: {contract?.plan_start_date}</Text>
					<Text style={styles.detailText}>Plan End Date: {contract?.plan_end_date || "N/A"}</Text>
					<Text style={styles.detailText}>Contract: {contract?.contract}</Text>
					<Text style={styles.detailText}>Terms & Conditions: {contract?.agreement ? "Agreed" : "N/A"}</Text>
				</View>

				{/* Signature Section */}
				{formData?.signature && (
					<>
						<View style={styles.divider} />
						<View style={styles.signatureSection}>
							<Text style={styles.signatureTitle}>Signature</Text>
							<Text style={styles.signature}>{formData.signature}</Text>
						</View>
					</>
				)}
			</View>
		</Page>
	</Document>
);

const ViewContract = ({ contract, open, onClose }) => {
	const { user } = useContext(AuthContext);
	const [formData, setFormData] = useState({ signature: contract?.signature || "" });
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setFormData({ signature: contract?.signature || "" });
	}, [contract]);

	const handleInputChange = (name) => (e) => {
		setFormData({ ...formData, [name]: e.target.value });
	};

	const handleSubmit = async () => {
		setLoading(true);
		const updatedFormData = { ...formData, contractId: contract.id };

		try {
			const res = await axiosInstance.put("member/contract/user/update", updatedFormData);

			if (res.data.success) {
				setAlertOpen(true);
				onClose();
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}>
			<Box sx={modalStyle}>
				{/* Header */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 2,
					}}>
					<Typography variant="h6" fontWeight="bold">
						View Contract
					</Typography>
					<IconButton onClick={onClose} size="small">
						<CloseIcon />
					</IconButton>
				</Box>

				{/* Scrollable Content */}
				<Box
					sx={{
						maxHeight: "60vh",
						overflowY: "auto",
						px: 2,
						"&::-webkit-scrollbar": {
							width: "8px",
						},
						"&::-webkit-scrollbar-thumb": {
							backgroundColor: "#888",
							borderRadius: "4px",
						},
					}}>
					<div className="contract-container">
						{/* Branch Name */}
						<Typography
							variant="h6"
							textAlign="center"
							sx={{
								fontWeight: "bold",
								mb: 2,
								textTransform: "uppercase",
								color: colors.primary,
							}}>
							{contract?.branch?.name}
						</Typography>

						<Card sx={{ p: 3, mx: "auto", mb: 2 }}>
							{/* User Profile */}
							<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
								<Avatar src={contract?.user?.profile_image ? `${import.meta.env.VITE_ASSET_API}${contract?.user?.profile_image}` : ""} sx={{ width: 60, height: 60, mr: 2 }} />
								<Box>
									<Typography variant="h6">{contract?.user?.name}</Typography>
									<Typography variant="body2" color="textSecondary">
										{contract?.user?.email}
									</Typography>
									<Typography variant="body2" color="textSecondary">
										Type: {contract?.user?.type}
									</Typography>
									<Typography
										variant="body2"
										sx={{
											fontWeight: "bold",
											color: contract?.status === "signed" ? "green" : "red",
										}}>
										Status: {contract?.status}
									</Typography>
								</Box>
							</Box>

							<Divider />

							{/* Contract Details */}
							<CardContent>
								<Typography variant="subtitle1" fontWeight="bold">
									Contract Details
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={6}>
										<Typography variant="body2">
											<strong>Type:</strong> {contract?.type}
										</Typography>
										<Typography variant="body2">
											<strong>Registration No:</strong> {contract?.company_number}
										</Typography>
										<Typography variant="body2">
											<strong>Start Date:</strong> {contract?.start_date}
										</Typography>
										<Typography variant="body2">
											<strong>End Date:</strong> {contract?.end_date}
										</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography variant="body2">
											<strong>Notice Period:</strong> {contract?.notice_period} - {contract?.duration}
										</Typography>
										<Typography variant="body2">
											<strong>Plan:</strong> {contract?.plan?.name}
										</Typography>
										<Typography variant="body2">
											<strong>Plan Price:</strong> Rs. {contract?.plan?.price}
										</Typography>
										<Typography variant="body2">
											<strong>Deposit:</strong> Rs. {contract?.amount}
										</Typography>
									</Grid>
								</Grid>
							</CardContent>

							<Divider />

							{/* Plan Details */}
							<CardContent>
								<Typography variant="subtitle1" fontWeight="bold">
									Plan Information
								</Typography>
								<Typography variant="body2">
									<strong>Plan Start Date:</strong> {contract?.plan_start_date}
								</Typography>
								<Typography variant="body2">
									<strong>Plan End Date:</strong> {contract?.plan_end_date || "N/A"}
								</Typography>
								<Typography variant="body2">
									<strong>Contract:</strong> {contract?.contract}
								</Typography>
								<Typography variant="body2">
									<strong>Terms & Conditions:</strong> {contract?.agreement ? "Agreed" : "N/A"}
								</Typography>
							</CardContent>

							{/* Signature Section */}
							<Divider />
							<CardContent>
								{user.type !== "admin" && contract.status === "not signed" && <TextField fullWidth label="Signature" value={formData.signature} onChange={handleInputChange("signature")} sx={{ mb: 2 }} required />}
								{formData.signature && (
									<Box sx={{ mt: 2, textAlign: "center" }}>
										<Typography variant="subtitle1">
											<strong>Signature</strong>
										</Typography>
										<Typography variant="h4" sx={{ fontFamily: "Bastliga One", fontSize: "60px", mt: 1 }}>
											{formData.signature}
										</Typography>
									</Box>
								)}
							</CardContent>
						</Card>
					</div>
				</Box>

				{/* Bottom Buttons */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						gap: 2,
						mt: 2,
					}}>
					<Button onClick={onClose} variant="contained" color="secondary">
						Close
					</Button>
					{contract?.status === "not signed" && user?.type !== "admin" && (
						<Button variant="contained" color="primary" onClick={handleSubmit} disabled={!formData.signature || loading}>
							Sign
						</Button>
					)}
					<PDFDownloadLink document={<ContractPDF contract={contract} formData={formData} />} fileName={`Contract_${contract?.user?.name}_${new Date().toISOString().split("T")[0]}.pdf`}>
						{({ loading }) => (
							<Button variant="contained" color="primary" startIcon={<DownloadIcon />} disabled={loading}>
								{loading ? "Preparing PDF..." : "Download PDF"}
							</Button>
						)}
					</PDFDownloadLink>
				</Box>
			</Box>
		</Modal>
	);
};

// Modal Style
const modalStyle = {
	width: 700,
	bgcolor: "background.paper",
	borderRadius: 2,
	boxShadow: 24,
	p: 4,
	outline: "none",
};

export default ViewContract;
