import React, { useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Table, Dropdown } from "react-bootstrap";
import { People, AccountBalance, CalendarToday, TrendingUp, AccountBalanceWallet, Receipt } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";

const PayrollDashboard = () => {
	const navigate = useNavigate();
	const { branch } = useParams();
	const [financialYear, setFinancialYear] = useState("Financial Year 2025-2026");

	// Sample data for the dashboard
	const summaryData = [
		{
			title: "Total Employs",
			value: "34",
			icon: <People />,
			bgColor: "#FFE987",
		},
		{
			title: "Total CTC",
			value: "34",
			icon: <AccountBalance />,
			bgColor: "#87FFAA",
		},
		{
			title: "Payable Days",
			value: "34",
			icon: <CalendarToday />,
			bgColor: "#FFE987",
		},
		{
			title: "Total Gross Salary",
			value: "34",
			icon: <TrendingUp />,
			bgColor: "#64F6C5",
		},
		{
			title: "Total Net Salary",
			value: "34,00",
			icon: <AccountBalanceWallet />,
			bgColor: "#00D0D4",
		},
		{
			title: "Total Deduction",
			value: "34,00",
			icon: <Receipt />,
			bgColor: "#00D0D4",
		},
	];

	// Sample data for the table
	const tableData = [
		{
			period: "Apr-2025",
			totalEmploy: "34",
			totalSalary: "-",
			payableDays: "28",
			totalCTC: "-",
			grossSalary: "-",
			netSalary: "-",
			deduction: "-",
		},
		{
			period: "May-2025",
			totalEmploy: "34",
			totalSalary: "-",
			payableDays: "31",
			totalCTC: "-",
			grossSalary: "-",
			netSalary: "-",
			deduction: "-",
		},
	];

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<Container fluid className="py-4 px-4 bg-light min-vh-100">
						<div className="d-flex justify-content-between align-items-center mb-4">
							<h2 className="mb-0 fw-bold">Payroll Dashboard</h2>
							<div
								style={{
									alignItems: "center",
									justifyContent: "center",
								}}>
								<Button
									variant="primary"
									style={{
										backgroundColor: "#FFFFFF",
										borderColor: "#DCDCDC",
										borderRadius: "4px",
										color: "black",
										padding: "8px 16px",
										marginRight: "1.5rem",
										// height: "45px"
									}}
									onClick={() => navigate(`/${branch}/branch/salary/component`)}>
									Salary Component
								</Button>
								<Button
									variant="primary"
									style={{
										backgroundColor: "#0A2647",
										borderColor: "#0A2647",
										borderRadius: "4px",
										padding: "8px 16px",
									}}
									onClick={() => navigate(`/${branch}/branch/run-payroll`)}>
									Run Payroll
								</Button>
							</div>
						</div>

						<Row className="g-4 mb-4">
							{summaryData.slice(0, 3).map((item, index) => (
								<Col md={4} key={index}>
									<Card className="border-1 shadow-sm h-100">
										<Card.Body className="d-flex align-items-center p-4">
											<div
												className="rounded-circle d-flex align-items-center justify-content-center me-3"
												style={{
													backgroundColor: item.bgColor,
													width: "60px",
													height: "60px",
												}}>
												{item.icon}
											</div>
											<div>
												<div className="text-muted">{item.title}</div>
												<div className="fs-4 fw-bold">{item.value}</div>
											</div>
										</Card.Body>
									</Card>
								</Col>
							))}
						</Row>

						<Row className="g-4 mb-4">
							{summaryData.slice(3).map((item, index) => (
								<Col md={4} key={index}>
									<Card className="border-1 shadow-sm h-100">
										<Card.Body className="d-flex align-items-center p-4">
											<div
												className="rounded-circle d-flex align-items-center justify-content-center me-3"
												style={{
													backgroundColor: item.bgColor,
													width: "60px",
													height: "60px",
												}}>
												{item.icon}
											</div>
											<div>
												<div className="text-muted">{item.title}</div>
												<div className="fs-4 fw-bold">{item.value}</div>
											</div>
										</Card.Body>
									</Card>
								</Col>
							))}
						</Row>

						<Card className="border-0 shadow-sm mb-4">
							<Card.Body className="p-4">
								<div className="d-flex justify-content-between align-items-center mb-4">
									<h5 className="mb-0">Payroll Summary By financial year</h5>
									<Dropdown>
										<Dropdown.Toggle variant="light" id="dropdown-basic" className="border">
											{financialYear}
										</Dropdown.Toggle>
										<Dropdown.Menu>
											<Dropdown.Item onClick={() => setFinancialYear("Financial Year 2025-2026")}>Financial Year 2025-2026</Dropdown.Item>
											<Dropdown.Item onClick={() => setFinancialYear("Financial Year 2024-2025")}>Financial Year 2024-2025</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>

								<div className="table-responsive">
									<Table hover className="mb-0">
										<thead className="bg-light">
											<tr>
												<th>Period Name</th>
												<th>Total Employ</th>
												<th>Total Salary</th>
												<th>Payable days</th>
												<th>Total CTC</th>
												<th>Gross Salary</th>
												<th>Net Salary</th>
												<th>Deduction</th>
											</tr>
										</thead>
										<tbody>
											{tableData.map((row, index) => (
												<tr
													key={index}
													style={{
														cursor: "pointer",
													}}
													onClick={() => navigate(`/${branch}/branch/payroll/employee/salary`)}>
													<td>{row.period}</td>
													<td>{row.totalEmploy}</td>
													<td>{row.totalSalary}</td>
													<td>{row.payableDays}</td>
													<td>{row.totalCTC}</td>
													<td>{row.grossSalary}</td>
													<td>{row.netSalary}</td>
													<td>{row.deduction}</td>
												</tr>
											))}
										</tbody>
									</Table>
								</div>
							</Card.Body>
						</Card>
					</Container>
				</div>
			</div>
		</>
	);
};

export default PayrollDashboard;
