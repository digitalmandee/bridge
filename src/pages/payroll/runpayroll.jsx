import React, { useState } from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Row, Col, Button } from "react-bootstrap"
import { ArrowBack, AccessTime, Settings, GetApp, Description, ChevronLeft, ChevronRight } from "@mui/icons-material"
import "bootstrap/dist/css/bootstrap.min.css"
import { MdArrowBackIos } from "react-icons/md";
import colors from '@/assets/styles/color';

const RunPayroll = () => {
    const navigate = useNavigate();
    const { branch } = useParams();
    const [startMonthIndex, setStartMonthIndex] = useState(0) // Start with January

    const timelineData = [
        { month: "Jan-2025", period: "Jan 1 - Jan 31", status: "Completed" },
        { month: "Feb-2025", period: "Feb 1 - Feb 28", status: "Current" },
        { month: "Mar-2025", period: "Mar 1 - Mar 31", status: "Pending" },
        { month: "Apr-2025", period: "Apr 1 - Apr 30", status: "Pending" },
        { month: "May-2025", period: "May 1 - May 31", status: "Pending" },
        { month: "Jun-2025", period: "Jun 1 - Jun 30", status: "Pending" },
        { month: "Jul-2025", period: "Jul 1 - Jul 31", status: "Pending" },
        { month: "Aug-2025", period: "Aug 1 - Aug 31", status: "Pending" },
        { month: "Sep-2025", period: "Sep 1 - Sep 30", status: "Pending" },
        { month: "Oct-2025", period: "Oct 1 - Oct 31", status: "Pending" },
        { month: "Nov-2025", period: "Nov 1 - Nov 30", status: "Pending" },
        { month: "Dec-2025", period: "Dec 1 - Dec 31", status: "Pending" },
    ]

    const metricsData = [
        { title: "Total Employs", value: "34" },
        { title: "Total CTC", value: "34" },
        { title: "Payable Days", value: "34" },
        { title: "Total Gross Salary", value: "34" },
        { title: "Total Net Salary", value: "34,00" },
        { title: "Total Deduction", value: "34,00" },
    ]

    const statusCards = [
        { title: "Salary Revisions", status: "Pending", route: `/${branch}/branch/payroll/salary-revision` },
        { title: "Holed Employ", status: "Pending", route: `/${branch}/branch/payroll/holed-employee` },
        { title: "Deduction", status: "Pending", route: `/${branch}/branch/payroll/deduction` },
        { title: "Text Calculation", status: "Pending" },
        { title: "Leaves", status: "Pending", route: `/${branch}/branch/payroll/employee-leave` },
        { title: "Cheque", status: "Pending", route: `/${branch}/branch/payroll/cheque` },
    ]

    const handlePrevMonth = () => {
        setStartMonthIndex((prev) => (prev > 0 ? prev - 1 : prev))
    }

    const handleNextMonth = () => {
        setStartMonthIndex((prev) => (prev < timelineData.length - 4 ? prev + 1 : prev))
    }

    // Get the visible months (4 at a time)
    const visibleMonths = timelineData.slice(startMonthIndex, startMonthIndex + 4)

    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <Container fluid className="min-vh-100">
                        <div className="mb-4">
                            <h4 className="mb-0 d-flex align-items-center">
                                <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                                    <MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
                                </div> Run Payroll
                            </h4>
                        </div>

                        <Card className="border-0 shadow-sm mb-4">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0 fw-bold">Activity</h6>
                                    <Button variant="link" className="text-decoration-none p-0 text-primary">
                                        View All
                                    </Button>
                                </div>

                                <div className="d-flex align-items-center justify-content-between" style={{ gap: "20px" }}>
                                    {/* Text div */}
                                    <div style={{ flex: "1", display: "flex", alignItems: "center" }}>
                                        <p
                                            className="text-muted mb-0"
                                            style={{ fontSize: "14px", width: "100%", padding: "8px", background: "#f8f9fa", borderRadius: "8px" }}
                                        >
                                            The chosen period's payroll has not yet been processed
                                        </p>
                                    </div>

                                    {/* Slider div */}
                                    <div className="d-flex align-items-center justify-content-between" style={{ flex: "1", width: "50%" }}>
                                        <Button
                                            variant="link"
                                            className="text-decoration-none p-0"
                                            onClick={handlePrevMonth}
                                            disabled={startMonthIndex === 0}
                                        >
                                            <ChevronLeft style={{ color: startMonthIndex === 0 ? "#dee2e6" : "#6c757d" }} />
                                        </Button>

                                        <div className="d-flex justify-content-between" style={{ width: "100%", overflow: "hidden" }}>
                                            {visibleMonths.map((item, index) => (
                                                <div
                                                    key={startMonthIndex + index}
                                                    className="text-center border rounded mx-1"
                                                    style={{
                                                        flex: "1",
                                                        minWidth: "90px",
                                                        background: "#ffffff",
                                                        padding: "10px",
                                                        cursor:'pointer',
                                                    }}
                                                    onClick={ () => navigate(`/${branch}/branch/payroll/monthly`)}
                                                >
                                                    <div className="fw-bold mb-1" style={{ fontSize: "14px" }}>
                                                        {item.month}
                                                    </div>
                                                    <div className="text-muted small mb-2" style={{ fontSize: "12px" }}>
                                                        {item.period}
                                                    </div>
                                                    <div
                                                        className={`small px-3 py-1 rounded-pill ${item.status === "Current"
                                                            ? "text-white"
                                                            : item.status === "Completed"
                                                                ? "bg-light text-muted"
                                                                : "bg-light text-muted"
                                                            }`}
                                                        style={{ fontSize: "12px", backgroundColor: item.status === "Current" ? colors.primary : "" }}
                                                    >
                                                        {item.status}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            variant="link"
                                            className="text-decoration-none p-0"
                                            onClick={handleNextMonth}
                                            disabled={startMonthIndex >= timelineData.length - 4}
                                        >
                                            <ChevronRight style={{ color: startMonthIndex >= timelineData.length - 4 ? "#dee2e6" : "#6c757d" }} />
                                        </Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        <Row className="g-4 mb-4">
                            {metricsData.map((metric, index) => (
                                <Col md={4} key={index}>
                                    <Card className="border-0 shadow-sm h-100">
                                        <Card.Body className="text-center p-4">
                                            <div className="text-muted mb-2" style={{ fontSize: "14px" }}>
                                                {metric.title}
                                            </div>
                                            <div className="fs-4 fw-bold">{metric.value}</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <Row className="g-4 mb-4">
                            {statusCards.map((card, index) => (
                                <Col md={4} key={index}>
                                    <Card className="border-1" style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            if (card.route) {
                                                navigate(card.route);
                                            }
                                        }}>
                                        <Card.Body className="d-flex justify-content-between align-items-center p-4">
                                            <div>
                                                <div className="mb-1" style={{ fontSize: "14px" }}>
                                                    {card.title}
                                                </div>
                                                <div className="text-muted small" style={{ fontSize: "12px" }}>
                                                    {card.status}
                                                </div>
                                            </div>
                                            <AccessTime style={{ color: "#6c757d", fontSize: "20px" }} />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div className="text-end mb-4">
                            <Button
                                style={{
                                    backgroundColor: colors.primary,
                                    borderColor: colors.primary,
                                    fontSize: "14px",
                                }}
                            >
                                Initialize Payroll
                            </Button>
                        </div>

                        <Row className="g-4">
                            <Col md={4}>
                                <Card className="border-0 shadow-sm">
                                    <Card.Body className="d-flex justify-content-between align-items-center p-4">
                                        <div style={{ fontSize: "14px" }}>Configuration Payroll Period</div>
                                        <Settings style={{ color: "#6c757d", fontSize: "20px" }} />
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="border-0 shadow-sm">
                                    <Card.Body className="d-flex justify-content-between align-items-center p-4">
                                        <div style={{ fontSize: "14px" }}>Generate Payslips</div>
                                        <GetApp style={{ color: "#6c757d", fontSize: "20px" }} />
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="border-0 shadow-sm">
                                    <Card.Body className="d-flex justify-content-between align-items-center p-4">
                                        <div style={{ fontSize: "14px" }}>View Payroll Summary</div>
                                        <div>
                                            <Description style={{ color: "#6c757d", fontSize: "20px", marginRight: "8px" }} />
                                            <GetApp style={{ color: "#6c757d", fontSize: "20px" }} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </>
    )
}

export default RunPayroll