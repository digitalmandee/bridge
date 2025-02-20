import React, { useState } from 'react'
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Button, TextField, Checkbox, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';

const AttendanceReport = () => {
    const navigate = useNavigate();
    const currentDate = new Date();
    const [month, setMonth] = useState(currentDate.getMonth() + 1);
    const [year, setYear] = useState(currentDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState("");

    const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

    // Generate attendance dynamically
    const generateAttendance = (days) => {
        return Array(days).fill().map((_, index) => {
            const day = index % 7;
            if (day === 5 || day === 6) {
                return ""; // Weekend
            }
            return ["P", "S", "C", "B", "M", "U"][Math.floor(Math.random() * 6)];
        });
    };

    const [employees, setEmployees] = useState([
        { id: "01", name: "John Doe", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "02", name: "Jane Doe", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "03", name: "Mike Smith", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "04", name: "John Doe", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "05", name: "Jane Doe", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "06", name: "Mike Smith", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "07", name: "John Doe", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "08", name: "Jane Doe", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "09", name: "Mike Smith", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "10", name: "John Doe", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "11", name: "Jane Doe", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "12", name: "Mike Smith", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "13", name: "John Doe", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "14", name: "Jane Doe", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "15", name: "Mike Smith", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "16", name: "John Doe", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "17", name: "Jane Doe", attendance: generateAttendance(getDaysInMonth(month, year)) },
        { id: "18", name: "Mike Smith", attendance: generateAttendance(getDaysInMonth(month, year)) },
    ]);

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const legend = [
        { label: "Present", color: "#6FC3AF", code: "P" },
        { label: "Sick Leave", color: "#E3BD5F", code: "S" },
        { label: "Casual Leave", color: "#469BD1", code: "C" },
        { label: "Business Leave", color: "#77C155", code: "B" },
        { label: "Maternity Leave", color: "#FF6696", code: "M" },
        { label: "Unpaid Leave", color: "#BAD53F", code: "U" },
    ];

    const calculateTotalPresent = (attendance) => attendance.filter(status => status === "P").length;

    // Handle month change
    const handleMonthChange = (event) => {
        const newMonth = parseInt(event.target.value);
        setMonth(newMonth);

        // Update employees with new attendance for the selected month
        setEmployees(employees.map(emp => ({
            ...emp,
            attendance: generateAttendance(getDaysInMonth(newMonth, year))
        })));
    };

    // Handle year change
    const handleYearChange = (event) => {
        const newYear = parseInt(event.target.value);
        setYear(newYear);

        // Update attendance based on new year
        setEmployees(employees.map(emp => ({
            ...emp,
            attendance: generateAttendance(getDaysInMonth(month, newYear))
        })));
    };

    return (
        <>
            <TopNavbar />
            <div className="main">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
                        <div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px" }}>
                            <div onClick={() => navigate(-1)} style={{ cursor: "pointer", marginTop: '5px', display: "flex", alignItems: "center" }}>
                                <MdArrowBackIos style={{ fontSize: "20px", cursor: 'pointer' }} />
                            </div>
                            <h3 style={{ margin: 0 }}>Attendance Report</h3>
                        </div>
                        <div style={{ display: "flex", justifyContent: "end", gap: "8px" }}>
                            {/* Month & Year Section */}
                            <TextField
                                select
                                label="Month"
                                value={month}
                                onChange={handleMonthChange}
                                size="small"
                                SelectProps={{ native: true }}
                                style={{ backgroundColor: "white", minWidth: "120px" }}
                            >
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                ))}
                            </TextField>

                            <TextField
                                type="number"
                                label="Year"
                                value={year}
                                onChange={handleYearChange}
                                size="small"
                                style={{ backgroundColor: "white", minWidth: "100px" }}
                            />
                        </div>

                        {/* Legend */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop:'1rem', marginBottom: "16px" }}>
                            {legend.map((item) => (
                                <div key={item.code} className="d-flex align-items-center px-3 py-1"
                                    style={{ backgroundColor: item.color, borderRadius: "6px", minWidth: "fit-content", gap: "8px" }}>
                                    <span style={{ fontSize: "14px" }}>{item.label}</span>
                                    <span style={{ fontSize: "14px", fontWeight: "500", marginLeft: "4px" }}>{item.code}</span>
                                </div>
                            ))}
                        </div>

                        {/* Table */}
                        <div style={{ overflowX: "auto" }}>
                            <Table bordered hover className="mb-0" style={{ minWidth: '1200px' }}>
                                <thead>
                                    <tr className="bg-light">
                                        <th style={{ width: "60px" }}>ID</th>
                                        <th style={{ width: "150px" }}>Employ Name</th>
                                        {[...Array(getDaysInMonth(month, year))].map((_, i) => (
                                            <th key={i} className="text-center"
                                                style={{ width: "40px", padding: "8px 4px", backgroundColor: i % 7 === 5 || i % 7 === 6 ? "#f0f0f0" : "inherit" }}>
                                                <div style={{ fontSize: "14px" }}>{(i + 1).toString().padStart(2, "0")}</div>
                                                <div style={{ fontSize: "12px", color: "#6c757d" }}>{weekdays[i % 7]}</div>
                                            </th>
                                        ))}
                                        <th className="text-center" style={{ width: "100px" }}>Total Present</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee, idx) => (
                                        <tr key={idx}>
                                            <td>{employee.id}</td>
                                            <td>{employee.name}</td>
                                            {employee.attendance.map((status, i) => (
                                                <td key={i} className="text-center"
                                                    style={{ backgroundColor: legend.find(item => item.code === status)?.color || "white" }}>
                                                    {status}
                                                </td>
                                            ))}
                                            <td className="text-center">{calculateTotalPresent(employee.attendance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AttendanceReport
