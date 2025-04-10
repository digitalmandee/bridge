import React, { useState } from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap"
import { ArrowBack, Search, Download } from "@mui/icons-material" // Added Download import
import { Box, Pagination, IconButton } from "@mui/material" // Added IconButton import
import "bootstrap/dist/css/bootstrap.min.css"
import colors from '@/assets/styles/color';

const PayrollMonthly = () => {
    const navigate = useNavigate();
    const { branch } = useParams();
    const employeeData = [
        {
            id: 1,
            name: "Zahid Ullah",
            empId: "EMP-23451",
            department: "Admin Department",
            position: "Executive",
            payableDays: 28,
            presentDays: 10,
            absentDays: 20,
            netSalary: "20,000",
            processedDetail: "14/02/2025 09:60 AM",
        },
        {
            id: 2,
            name: "Zahid Ullah",
            empId: "EMP-23452",
            department: "Admin Department",
            position: "Executive",
            payableDays: 28,
            presentDays: 10,
            absentDays: 20,
            netSalary: "20,000",
            processedDetail: "14/02/2025 09:60 AM",
        },
        {
            id: 3,
            name: "Zahid Ullah",
            empId: "EMP-23453",
            department: "Admin Department",
            position: "Executive",
            payableDays: 28,
            presentDays: 10,
            absentDays: 20,
            netSalary: "20,000",
            processedDetail: "14/02/2025 09:60 AM",
        },
        {
            id: 4,
            name: "Zahid Ullah",
            empId: "EMP-23454",
            department: "Admin Department",
            position: "Executive",
            payableDays: 28,
            presentDays: 10,
            absentDays: 20,
            netSalary: "20,000",
            processedDetail: "14/02/2025 09:60 AM",
        },
        {
            id: 5,
            name: "Zahid Ullah",
            empId: "EMP-23455",
            department: "Admin Department",
            position: "Executive",
            payableDays: 28,
            presentDays: 10,
            absentDays: 20,
            netSalary: "20,000",
            processedDetail: "14/02/2025 09:60 AM",
        },
    ]

    // State for search term
    const [searchTerm, setSearchTerm] = useState("")

    // State for active page
    const [activePage, setActivePage] = useState(1)

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 10

    // Custom styles to match the reference image
    const styles = {
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 0",
        },
        monthDisplay: {
            display: "flex",
            alignItems: "center",
            fontSize: "18px",
            fontWeight: "bold",
        },
        processButton: {
            backgroundColor: colors.primary,
            border: "none",
            borderRadius: "4px",
            padding: "8px 15px",
        },
        runPayrollButton: {
            backgroundColor: colors.primary,
            border: "none",
            borderRadius: "4px",
            padding: "8px 15px",
            width: "120px",
        },
        searchContainer: {
            display: "flex",
            alignItems: "center",
        },
        searchInput: {
            position: "relative",
        },
        searchIcon: {
            position: "absolute",
            left: "25px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#999",
        },
        downloadIcon: {
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            padding: "8px",
            marginLeft: "10px",
            cursor: "pointer",
        },
        tableHeader: {
            backgroundColor: "#f5f5f5",
            color: "#333",
            fontWeight: "bold",
        },
        modifyButton: {
            backgroundColor: colors.primary,
            border: "none",
            borderRadius: "4px",
            padding: "5px 10px",
            fontSize: "12px",
        },
        employeeCell: {
            display: "flex",
            alignItems: "center",
        },
        avatar: {
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#e0e0e0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "10px",
            color: "#666",
            fontSize: "16px",
        },
        employeeInfo: {
            display: "flex",
            flexDirection: "column",
        },
        employeeName: {
            fontWeight: "bold",
            margin: 0,
        },
        employeeId: {
            fontSize: "12px",
            color: "#666",
            margin: 0,
        },
        employeeDept: {
            fontSize: "12px",
            color: "#666",
            margin: 0,
        },
        paginationContainer: {
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
        },
        paginationItem: {
            margin: "0 5px",
        },
        paginationLink: {
            color: "#333",
            backgroundColor: "#fff",
            border: "1px solid #dee2e6",
            padding: "5px 10px",
            borderRadius: "4px",
            textDecoration: "none",
            cursor: "pointer",
        },
        paginationLinkActive: {
            backgroundColor: "#0f2a4a",
            color: "#fff",
            border: "1px solid #0f2a4a",
        },
        selectEmploy: {
            width: "200px",
            marginRight: "10px",
        },
    }
    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <Container fluid style={{ padding: "20px" }}>
                        {/* Header */}
                        <Row style={styles.header}>
                            <Col md={6}>
                                <div style={styles.monthDisplay}>
                                    <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                                        <MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
                                    </div>
                                    <span>Jun-2024</span>
                                </div>
                            </Col>
                            <Col md={6} className="text-end">
                                <Button 
                                style={styles.processButton}
                                onClick={ () => navigate(`/${branch}/branch/payroll/summary`)}
                                >Process Payroll</Button>
                            </Col>
                        </Row>

                        {/* Controls */}
                        <Row className="my-4">
                            <Col md={6} className="d-flex align-items-center">
                                <Form.Select style={styles.selectEmploy}>
                                    <option>Select Employ</option>
                                </Form.Select>
                                <Button style={styles.runPayrollButton}>Run Payroll</Button>
                            </Col>
                            <Col md={6} className="d-flex justify-content-end">
                                <div style={styles.searchContainer}>
                                    <div style={{ ...styles.searchInput, marginRight: "10px" }}>
                                        <Search style={styles.searchIcon} />
                                        <Form.Control
                                            type="text"
                                            placeholder="Search for Employee"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ paddingLeft: "35px", width: "250px" }}
                                        />
                                    </div>
                                    <IconButton
                                        aria-label="download"
                                        sx={{
                                            bgcolor: "#f0f0f0",
                                            borderRadius: "50%",
                                            width: "40px",
                                            height: "40px",
                                            "&:hover": {
                                                bgcolor: "#e0e0e0",
                                            },
                                        }}
                                    >
                                        <Download />
                                    </IconButton>
                                </div>
                            </Col>
                        </Row>

                        {/* Table */}
                        <Row>
                            <Col>
                                <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "15px" }}>
                                    <Table hover responsive>
                                        <thead>
                                            <tr style={styles.tableHeader}>
                                                <th>Employ</th>
                                                <th>Payable Days</th>
                                                <th>Present Days</th>
                                                <th>Absent Days</th>
                                                <th>Net Salary</th>
                                                <th>Processed Detail</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employeeData.map((employee) => (
                                                <tr key={employee.id}>
                                                    <td>
                                                        <div style={styles.employeeCell}>
                                                            <div style={styles.avatar}>{employee.name.charAt(0)}</div>
                                                            <div style={styles.employeeInfo}>
                                                                <p style={styles.employeeName}>{employee.name}</p>
                                                                <p style={styles.employeeId}>{employee.empId}</p>
                                                                <p style={styles.employeeDept}>{employee.department}</p>
                                                                <p style={styles.employeeDept}>{employee.position}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{employee.payableDays}</td>
                                                    <td>{employee.presentDays}</td>
                                                    <td>{employee.absentDays}</td>
                                                    <td>{employee.netSalary}</td>
                                                    <td>{employee.processedDetail}</td>
                                                    <td>
                                                        <Button size="sm" style={styles.modifyButton}>
                                                            Modify
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>

                                    {/* Pagination */}
                                    <Box sx={{ display: "flex", justifyContent: "end", p: 2 }}>
                                        <Pagination count={totalPages} page={currentPage} onChange={(e, value) => setCurrentPage(value)} />
                                    </Box>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </>
    )
}

export default PayrollMonthly
