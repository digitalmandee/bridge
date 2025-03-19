import React, { useState } from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Table,
    Button
} from 'react-bootstrap';
import {
    ArrowBack,
    Search,
    FileDownload
} from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeSalary = () => {
    const navigate = useNavigate();

    const employeeData = [
        {
            empId: '050',
            name: 'Gladys',
            designation: 'HR',
            grossSalary: '10,000',
            netSalary: '10,000',
            deduction: '00,00',
            paymentType: 'Cash',
            advanceSalary: '500',
            update: 'Dec 01, 2024'
        },
        {
            empId: '050',
            name: 'Gladys',
            designation: 'HR',
            grossSalary: '10,000',
            netSalary: '10,000',
            deduction: '00,00',
            paymentType: 'Bank transfer',
            advanceSalary: '500',
            update: 'Dec 01, 2024'
        },
        {
            empId: '050',
            name: 'Gladys',
            designation: 'HR',
            grossSalary: '10,000',
            netSalary: '10,000',
            deduction: '00,00',
            paymentType: 'Check',
            advanceSalary: '500',
            update: 'Dec 01, 2024'
        },
        {
            empId: '050',
            name: 'Gladys',
            designation: 'HR',
            grossSalary: '10,000',
            netSalary: '10,000',
            deduction: '00,00',
            paymentType: 'Cash',
            advanceSalary: '500',
            update: 'Dec 01, 2024'
        },
        {
            empId: '050',
            name: 'Gladys',
            designation: 'HR',
            grossSalary: '10,000',
            netSalary: '10,000',
            deduction: '00,00',
            paymentType: 'Cash',
            advanceSalary: '500',
            update: 'Dec 01, 2024'
        },
        {
            empId: '050',
            name: 'Gladys',
            designation: 'HR',
            grossSalary: '10,000',
            netSalary: '10,000',
            deduction: '00,00',
            paymentType: 'Bank Transfer',
            advanceSalary: '500',
            update: 'Dec 01, 2024'
        }
    ];

    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <Container fluid className="py-4 px-4 min-vh-100">
                        <div className="mb-4">
                            <h4 className="mb-0 d-flex align-items-center">
                                <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                                    <MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
                                </div> Employee Salary
                            </h4>
                        </div>

                        <Card className="border-0 shadow-sm">
                            <Card.Body className="p-0">
                                <div className="p-4 d-flex justify-content-end">
                                    <div className="d-flex align-items-center">
                                        <div className="position-relative me-3" style={{ width: '250px' }}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search for employ"
                                                className="pe-5"
                                            />
                                            <Search
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: '#6c757d'
                                                }}
                                            />
                                        </div>
                                        <Button
                                            variant="light"
                                            className="border d-flex align-items-center justify-content-center"
                                            style={{ width: '38px', height: '38px' }}
                                        >
                                            <FileDownload />
                                        </Button>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead>
                                            <tr style={{ backgroundColor: '#f0f5fa' }}>
                                                <th>EMP ID</th>
                                                <th>Name</th>
                                                <th>Designation</th>
                                                <th>Gross Salary</th>
                                                <th>Net Salary</th>
                                                <th>Deduction</th>
                                                <th>Payment type</th>
                                                <th>Advance Salary</th>
                                                <th>Update</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employeeData.map((employee, index) => (
                                                <tr key={index}>
                                                    <td>{employee.empId}</td>
                                                    <td>{employee.name}</td>
                                                    <td>{employee.designation}</td>
                                                    <td>{employee.grossSalary}</td>
                                                    <td>{employee.netSalary}</td>
                                                    <td>{employee.deduction}</td>
                                                    <td>{employee.paymentType}</td>
                                                    <td>{employee.advanceSalary}</td>
                                                    <td>{employee.update}</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan={1} className="fw-bold">Total</td>
                                                <td colSpan={1} className="fw-bold">7</td>
                                                <td colSpan={1}></td>
                                                <td colSpan={1} className="fw-bold">10,0000</td>
                                                <td colSpan={1} className="fw-bold">100,00</td>
                                                <td colSpan={1} className="fw-bold">00,00</td>
                                                <td colSpan={1}></td>
                                                <td colSpan={1} className="fw-bold">00,00</td>
                                                <td colSpan={1}></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>

                                <div className="p-4 text-center text-muted">
                                    This is a salary sheet for the Apr-2025
                                </div>
                            </Card.Body>
                        </Card>
                    </Container>
                </div>
            </div>
        </>
    )
}

export default EmployeSalary
