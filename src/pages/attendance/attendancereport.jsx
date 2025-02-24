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

    const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

    const getWeekdayIndex = (day, month, year) => {
        return new Date(year, month - 1, day).getDay(); // 0 = Sunday, 6 = Saturday
    };

    const generateAttendance = (days, month, year) => {
        let attendance = Array(days).fill("");

        let weekdayIndexes = [];
        for (let i = 1; i <= days; i++) {
            let dayOfWeek = getWeekdayIndex(i, month, year);
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                // Only consider weekdays (Monday to Friday)
                weekdayIndexes.push(i - 1);
            }
        }

        let totalWeekdays = weekdayIndexes.length;
        let presentDays = Math.floor(totalWeekdays * 0.9); // 90% Present

        let shuffledIndexes = weekdayIndexes.sort(() => 0.5 - Math.random());
        shuffledIndexes.slice(0, presentDays).forEach(idx => (attendance[idx] = "P"));
        shuffledIndexes.slice(presentDays).forEach(idx => {
            attendance[idx] = ["S", "C", "B", "M", "U"][Math.floor(Math.random() * 5)];
        });

        return attendance;
    };

    const [employees, setEmployees] = useState([
        { id: "01", name: "John Doe", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "02", name: "Jane Doe", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "03", name: "Mike Smith", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "04", name: "John Doe", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "05", name: "Jane Doe", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "06", name: "Mike Smith", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "07", name: "John Doe", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "08", name: "Jane Doe", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "09", name: "Mike Smith", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "10", name: "John Doe", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "11", name: "Jane Doe", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "12", name: "Mike Smith", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "13", name: "John Doe", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "14", name: "Jane Doe", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "15", name: "Mike Smith", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "16", name: "John Doe", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "17", name: "Jane Doe", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
        { id: "18", name: "Mike Smith", attendance: generateAttendance(getDaysInMonth(month, year), month, year) },
    ]);

    const legend = [
        { label: "Present", color: "#6FC3AF", code: "P" },
        { label: "Sick Leave", color: "#E3BD5F", code: "S" },
        { label: "Casual Leave", color: "#469BD1", code: "C" },
        { label: "Business Leave", color: "#77C155", code: "B" },
        { label: "Maternity Leave", color: "#FF6696", code: "M" },
        { label: "Unpaid Leave", color: "#BAD53F", code: "U" },
    ];

    const calculateTotalPresent = (attendance) => attendance.filter(status => status === "P").length;

    const handleMonthChange = (event) => {
        const newMonth = parseInt(event.target.value);
        setMonth(newMonth);
        setEmployees(employees.map(emp => ({
            ...emp,
            attendance: generateAttendance(getDaysInMonth(newMonth, year), newMonth, year)
        })));
    };

    const handleYearChange = (event) => {
        const newYear = parseInt(event.target.value);
        setYear(newYear);
        setEmployees(employees.map(emp => ({
            ...emp,
            attendance: generateAttendance(getDaysInMonth(month, newYear), month, newYear)
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
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: '1rem', marginBottom: "16px" }}>
                            {legend.map((item) => (
                                <div key={item.code} className="d-flex align-items-center px-3 py-1"
                                    style={{ width:'100%', maxWidth:'148px', backgroundColor: item.color, borderRadius: "6px", minWidth: "fit-content", gap: "10px" }}>
                                    <span style={{ fontSize: "14px" }}>{item.label}</span>
                                    <span style={{ fontSize: "14px", fontWeight: "500", marginLeft: "4px" }}>{item.code}</span>
                                </div>
                            ))}
                        </div>

                        {/* Table */}
                        <div style={{ overflowX: "auto", width: '100%' }}>
                            <Table bordered hover className="mb-0" style={{
                                width: "100%",
                                backgroundColor: "#C5D9F0",
                                borderCollapse: "separate",
                                // borderSpacing: "2px",
                                border: "1px solid #B9B9B9", // Light grey border around the table
                                // borderRadius: "5px"
                            }}>
                                <thead>
                                    <tr>
                                        <th rowSpan={2} style={{
                                            width: "60px",
                                            backgroundColor: "#C5D9F0",
                                            padding: "10px",
                                            boxShadow: "0 0 0 1px #B9B9B9",
                                            textAlign: "center",
                                            verticalAlign: "middle"
                                        }}>ID</th>

                                        <th rowSpan={2} style={{
                                            // width: '100%',
                                            maxWidth: "200px",
                                            backgroundColor: "#C5D9F0",
                                            padding: '10px',
                                            boxShadow: "0 0 0 1px #B9B9B9",
                                            textAlign: "center",
                                            verticalAlign: "middle",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}>Employee Name</th>

                                        {/* Dates Row */}
                                        {[...Array(getDaysInMonth(month, year))].map((_, i) => (
                                            <th key={i} className="text-center"
                                                style={{
                                                    width: "40px",
                                                    padding: "8px 4px",
                                                    boxShadow: "0 0 0 1px #B9B9B9",
                                                    backgroundColor: "#C5D9F0"
                                                }}>
                                                {(i + 1).toString().padStart(2, "0")}
                                            </th>
                                        ))}

                                        <th rowSpan={2} className="text-center" style={{
                                            maxWidth: "100px",
                                            backgroundColor: "#C5D9F0",
                                            boxShadow: "0 0 0 1px #B9B9B9",
                                            textAlign: "center",
                                            verticalAlign: "middle",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}>
                                            Total Present
                                        </th>
                                    </tr>

                                    {/* Second Row - Weekdays */}
                                    <tr>
                                        {[...Array(getDaysInMonth(month, year))].map((_, i) => {
                                            let dayIndex = getWeekdayIndex(i + 1, month, year);
                                            return (
                                                <th key={i} className="text-center"
                                                    style={{
                                                        width: "40px",
                                                        padding: "8px 4px",
                                                        boxShadow: "0 0 0 1px #B9B9B9",
                                                        backgroundColor: dayIndex === 0 || dayIndex === 6 ? "#E0E8F0" : "inherit"
                                                    }}>
                                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex]}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee, idx) => (
                                        <tr key={idx}>
                                            <td style={{
                                                padding: '10px',
                                                backgroundColor: 'white',
                                                boxShadow: "0 0 0 1px #B9B9B9"
                                            }}>{employee.id}</td>
                                            <td style={{
                                                padding: '10px',
                                                backgroundColor: 'white',
                                                boxShadow: "0 0 0 1px #B9B9B9"
                                            }}>{employee.name}</td>
                                            {employee.attendance.map((status, i) => (
                                                <td key={i} className="text-center"
                                                    style={{ boxShadow: "0 0 0 1px #B9B9B9", backgroundColor: legend.find(item => item.code === status)?.color || "white" }}>
                                                    {status}
                                                </td>
                                            ))}
                                            <td style={{
                                                backgroundColor: 'white',
                                                boxShadow: "0 0 0 1px #B9B9B9"
                                            }} className="text-center">{calculateTotalPresent(employee.attendance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default AttendanceReport
