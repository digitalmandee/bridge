import React, { useState } from 'react'
import TopNavbar from '../topNavbar'
import Sidebar from '../leftSideBar'
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";
import {
    Box,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Menu,
    MenuItem,
    IconButton,
    Avatar,
} from "@mui/material"
import {
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    ArrowBack as ArrowBackIcon,
    Download as DownloadIcon,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import "bootstrap/dist/css/bootstrap.min.css"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: "16px",
    fontSize: "14px",
}))

const StatusChip = styled(Box)(({ status }) => ({
    padding: "6px 12px",
    borderRadius: "20px",
    display: "inline-block",
    fontSize: "12px",
    fontWeight: 500,
    backgroundColor: status === "Not sent" || status === "Unpaid" ? "#FEE2E2" : "#DCFCE7",
    color: status === "Not sent" || status === "Unpaid" ? "#DC2626" : "#16A34A",
}))


const ShowInvoice = () => {

    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedInvoice, setSelectedInvoice] = useState(null)

    const handleMenuClick = (event, invoiceId) => {
        setAnchorEl(event.currentTarget)
        setSelectedInvoice(invoiceId)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedInvoice(null)
    }

    const invoices = [
        {
            id: "001",
            name: "Talha/Bridge",
            issueDate: "03/07/2024",
            totalAmount: "115,000Kr",
            sendStatus: "Not sent",
            status: "Paid",
        },
    ]


    return (
        <>
            <TopNavbar />
            <div className='main d-flex'>
                <div className='sideBarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
                    <div className="container-fluid py-4">
                        {/* Header */}
                        <div className="row mb-4 align-items-center">
                            <div className="col-auto d-flex align-items-center">
                                <div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}>
                                    <MdArrowBackIos style={{ fontSize: "20px" }} />
                                </div>
                                <Typography variant="h6" className="mb-0 ms-2">
                                    Invoice
                                </Typography>
                            </div>
                            <div className="col-auto ms-auto">
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    sx={{ color: "#64748B", borderColor: "#E2E8F0", mr: 2 }}
                                >
                                    CSV
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: "#0F172A",
                                        borderRadius: "10px",
                                        "&:hover": {
                                            bgcolor: "#1E293B",
                                        },
                                    }}
                                >
                                    New Invoice
                                </Button>
                            </div>
                        </div>

                        {/* Filters and Search */}
                        <div className="row mb-4 align-items-center">
                            <div className="col-md-8 mb-3 mb-md-0">
                                <div className="d-flex flex-wrap gap-2">
                                    {["Unpaid & pending", "Written off", "Paid", "Not sent", "sent"].map((label) => (
                                        <Button
                                            key={label}
                                            variant="outlined"
                                            sx={{
                                                bgcolor: label === "Written off" ? "#0D2B4E" : "",
                                                borderRadius: "20px",
                                                border: "1px solid #0D2B4E",
                                                color: label === "Written off" ? "#fff" : "#0D2B4E",
                                                "&:hover": {
                                                    bgcolor: label === "Written off" ? "" : "#0D2B4E",
                                                    color: '#ffff',
                                                },
                                            }}
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </div>

                            </div>
                            <div className="col-md-4">
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search"
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ color: "#64748B", mr: 1 }} />,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #E2E8F0" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>ID</StyledTableCell>
                                        <StyledTableCell>Name/Company</StyledTableCell>
                                        <StyledTableCell>Issue Date</StyledTableCell>
                                        <StyledTableCell>Total Amount</StyledTableCell>
                                        <StyledTableCell>Send status</StyledTableCell>
                                        <StyledTableCell>status</StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <StyledTableCell>{invoice.id}</StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Avatar sx={{ bgcolor: "#0F172A", width: 32, height: 32, fontSize: "14px" }}>
                                                        {invoice.name[0]}
                                                    </Avatar>
                                                    <span
                                                        onClick={()=>navigate('/invoice-detail')}
                                                        style={{ cursor: 'pointer', color: 'inherit' }} // Ensures text color inherits from parent
                                                    >
                                                        {invoice.name}
                                                    </span>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell>{invoice.issueDate}</StyledTableCell>
                                            <StyledTableCell>{invoice.totalAmount}</StyledTableCell>
                                            <StyledTableCell>
                                                <StatusChip status={invoice.sendStatus}>{invoice.sendStatus}</StatusChip>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <StatusChip status={invoice.status}>{invoice.status}</StatusChip>
                                            </StyledTableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShowInvoice
