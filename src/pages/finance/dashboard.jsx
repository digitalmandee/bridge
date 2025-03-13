import React from 'react'
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import ReceiptIcon from "@mui/icons-material/Receipt"
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import { Bar, Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const FinanceDashboard = () => {
    const navigate = useNavigate();
    const { branch } = useParams();
    const barChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        datasets: [
            {
                label: "Dataset 1",
                data: [35000, 28000, 25000, 45000, 40000, 28000, 35000, 28000],
                backgroundColor: "#8DADD2",
                barThickness: 15,
            },
            {
                label: "Dataset 2",
                data: [30000, 25000, 20000, 35000, 32000, 22000, 30000, 25000],
                backgroundColor: "#0D2B4E",
                barThickness: 15,
            },
            {
                label: "Dataset 3",
                data: [25000, 20000, 15000, 30000, 25000, 18000, 25000, 20000],
                backgroundColor: "#7986cb",
                barThickness: 15,
            },
        ],
    }

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    drawBorder: false,
                },
                ticks: {
                    stepSize: 10000,
                    callback: (value) => value / 1000 + "K",
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    }

    // Donut Chart Data
    const donutChartData = {
        labels: ["Instock", "Out of Stock", "Damage"],
        datasets: [
            {
                data: [28, 12, 6],
                backgroundColor: ["#4285f4", "#fbbc04", "#34a853"],
                borderWidth: 0,
            },
        ],
    }

    const donutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                },
            },
        },
    }

    // Table Data
    const tableData = [
        {
            category: "Rent Income",
            description: "Monthly rent from tenants",
            amount: "15,000",
            date: "Dec 01, 2024",
            instock: "10",
            outOfStock: "10",
            damage: "10",
        },
        {
            category: "Utility Bills",
            description: "Electricity & water",
            amount: "2,500",
            date: "Dec 01, 2024",
            instock: "20",
            outOfStock: "20",
            damage: "20",
        },
        {
            category: "Internet Expense",
            description: "Monthly Wi-Fi charges",
            amount: "500",
            date: "Dec 01, 2024",
            instock: "6",
            outOfStock: "6",
            damage: "6",
        },
        {
            category: "Groceries & Supplies",
            description: "Coffee, tea, snacks",
            amount: "800",
            date: "Dec 01, 2024",
            instock: "11",
            outOfStock: "11",
            damage: "11",
        },
    ]
    return (
        <>
            <TopNavbar />
            <div className="main d-flex">
                <div className="sideBarWrapper">
                    <Sidebar />
                </div>
                <div className="content">
                    <Box sx={{ mt: 1,  bgcolor: "#f5f6fa" }}>
                        {/* Header */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                Dashboard
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button variant="outlined" color="primary">
                                    Financial Report
                                </Button>
                                <Button 
                                variant="contained" 
                                sx={{ bgcolor: "#0A2647" }}
                                onClick={ ()=> navigate(`/${branch}/branch/finance/create`)}
                                >
                                    Add New Entry
                                </Button>
                            </Box>
                        </Box>

                        {/* Metric Cards */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            {[
                                { title: "Total Sale", amount: "632,000kr", change: "+1.29%", icon: <ShoppingCartIcon />, color: "#ff9800" },
                                { title: "Bills", amount: "592,000kr", change: "+0.29%", icon: <ReceiptIcon />, color: "#e91e63" },
                                {
                                    title: "Groceries Expenses",
                                    amount: "354,000kr",
                                    change: "+1.29%",
                                    icon: <LocalGroceryStoreIcon />,
                                    color: "#4caf50",
                                },
                                {
                                    title: "Total P&L",
                                    amount: "238,000kr",
                                    change: "+1.29%",
                                    icon: <AccountBalanceWalletIcon />,
                                    color: "#f44336",
                                },
                            ].map((item, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card sx={{ bgcolor: "white", boxShadow: "none", borderRadius: 3, border: "1px solid #e0e0e0" }}>
                                        <CardContent>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Box
                                                        sx={{
                                                            bgcolor: `${item.color}15`,
                                                            p: 1,
                                                            borderRadius: 1,
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        {React.cloneElement(item.icon, { sx: { color: item.color } })}
                                                    </Box>
                                                </Box>
                                                <IconButton size="small">
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </Box>
                                            <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
                                                {item.amount}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "success.main" }}>
                                                {item.change}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Charts Section */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={8}>
                                <Card sx={{ bgcolor: "white", boxShadow: "none", borderRadius: 3, border: "1px solid #e0e0e0" }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2 }}>
                                            Analytics
                                        </Typography>
                                        <Box sx={{ height: 300 }}>
                                            <Bar data={barChartData} options={barChartOptions} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ bgcolor: "white", boxShadow: "none", borderRadius: 3, border: "1px solid #e0e0e0" }}>
                                    <CardContent>
                                        <Box sx={{ height: 300, position: "relative" }}>
                                            <Doughnut data={donutChartData} options={donutChartOptions} />
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Typography variant="body2" color="text.secondary">
                                                    Total Inventory
                                                </Typography>
                                                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                                    46
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ mt: 2 }}>
                                            <Grid container spacing={1}>
                                                {[
                                                    { label: "Instock", value: "28", percentage: "62.5%" },
                                                    { label: "Out of Stock", value: "12", percentage: "25%" },
                                                    { label: "Damage", value: "6", percentage: "12.5%" },
                                                ].map((item, index) => (
                                                    <Grid item xs={12} key={index}>
                                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <Typography variant="body2">{item.label}</Typography>
                                                            <Typography variant="body2">{item.value}</Typography>
                                                            <Typography variant="body2">{item.percentage}</Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Table */}
                        <TableContainer component={Paper} sx={{ boxShadow: "none", borderRadius: 3, border: "1px solid #e0e0e0" }}>
                            <Table>
                                <TableHead sx={{ bgcolor: "#C5D9F0" }}>
                                    <TableRow>
                                        <TableCell>Categories</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Instock</TableCell>
                                        <TableCell>Out of Stock</TableCell>
                                        <TableCell>Damage</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.category}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>{row.amount}</TableCell>
                                            <TableCell>{row.date}</TableCell>
                                            <TableCell>{row.instock}</TableCell>
                                            <TableCell>{row.outOfStock}</TableCell>
                                            <TableCell>{row.damage}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </div>
            </div>
        </>
    )
}

export default FinanceDashboard
