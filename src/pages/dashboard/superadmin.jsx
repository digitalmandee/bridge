import React from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import colors from "@/assets/styles/color";
import { Box, Card, CardContent, Typography, Grid, Button, Select, MenuItem } from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import PeopleIcon from "@mui/icons-material/People";
import SpaceBarIcon from "@mui/icons-material/SpaceBar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Revenue chart data
const revenueChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
  datasets: [
    {
      label: "Income",
      data: [400, 200, 600, 200, 400, 600, 400, 600, 400, 600, 400],
      backgroundColor: "#4C6FFF",
      barThickness: 12,
      borderRadius: 4,
    },
    {
      label: "Expenses",
      data: [500, 600, 400, 600, 300, 400, 300, 400, 300, 400, 300],
      backgroundColor: "#FF8F6B",
      barThickness: 12,
      borderRadius: 4,
    },
    {
      label: "Profit",
      data: [200, 200, 400, 200, 200, 300, 200, 300, 200, 400, 200],
      backgroundColor: "#00E1C2",
      barThickness: 12,
      borderRadius: 4,
    },
  ],
};

const revenueChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
      },
      ticks: {
        maxTicksLimit: 5,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const floorPlanData = {
  labels: ["Available", "Occupied"],
  datasets: [
    {
      data: [32, 14],
      backgroundColor: ["#4C6FFF", "#34A853"],
      borderWidth: 0,
    },
  ],
};

const floorPlanOptions = {
  cutout: "70%",
  plugins: {
    legend: {
      display: false,
    },
  },
};

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <TopNavbar />
      <div className="main d-flex">
        <div className="sideBarWrapper">
          <Sidebar />
        </div>
        <div className="content">

          <Box sx={{ p: 1 }}>
            {/* Back to Dashboard Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Button
                // startIcon={<ArrowBackIcon />}
                sx={{
                  font: 'Nunito Sans',
                  color: "#202224",
              fontWeight: "600",
              fontSize: "28px",
              textTransform: "none",
              pl: 0
                }}
              >
              Dashboard
            </Button>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box></Box> {/* Empty box for spacing */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  backgroundColor:'background.paper',
                  color: "text.primary",
                  borderColor: "divider",
                  borderRadius: "4px",
                  textTransform: "none"
                }}
              >
                View Report
              </Button>
              <Select
                value="branch1"
                size="small"
                sx={{
                  bgcolor: "background.paper",
                  minWidth: 120,
                  height: "36px",
                  borderRadius: "4px"
                }}
                displayEmpty
              >
                <MenuItem value="branch1">Branch 1</MenuItem>
              </Select>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#0D2B4E",
                  "&:hover": { bgcolor: "#0D2B4E" },
                  borderRadius: "4px",
                  textTransform: "none"
                }}
                onClick={() => navigate("/create/new/branch")}
              >
                Add New Branch
              </Button>
            </Box>
          </Box>

          {/* Metric Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { title: "Total Members", value: "350", icon: PeopleIcon, color: "#0D2B4E" },
              { title: "Available Space", value: "43", icon: SpaceBarIcon, color: "#0D2B4E" },
              { title: "Total Revenue", value: "35,0000", icon: AttachMoneyIcon, color: "#0D2B4E" },
              { title: "P&L", value: "329", icon: BarChartIcon, color: "#0D2B4E" },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    boxShadow: "none",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "8px",
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {item.value}
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: item.color,
                          borderRadius: "8px",
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <item.icon sx={{ color: "#fff", fontSize: 24 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={2}>
            {/* Revenue Chart */}
            <Grid item xs={12} md={7}>
              <Card
                sx={{
                  boxShadow: "none",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "8px",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Revenue</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Your Revenue This Year</Typography>

                  {/* Revenue Summary */}
                  <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#4C6FFF" }}></Box>
                        <Typography variant="body2" color="text.secondary">Income</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>$26,000</Typography>
                        <Typography variant="body2" color="success.main">10% ↑</Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#FF8F6B" }}></Box>
                        <Typography variant="body2" color="text.secondary">Expenses</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>$18,000</Typography>
                        <Typography variant="body2" color="error.main">10% ↑</Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#00E1C2" }}></Box>
                        <Typography variant="body2" color="text.secondary">Profit</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>$8,000</Typography>
                        <Typography variant="body2" color="success.main">3% ↑</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ height: 300 }}>
                    <Bar data={revenueChartData} options={revenueChartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Floor Plan Chart */}
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  boxShadow: "none",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "8px",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ position: "relative", height: 300, display: "flex", justifyContent: "center" }}>
                    <Doughnut data={floorPlanData} options={floorPlanOptions} />
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>Floor Plan</Typography>
                      <Typography variant="h4" sx={{ fontWeight: "bold" }}>46</Typography>
                      <Typography variant="body2" color="text.secondary">seats</Typography>
                    </Box>
                  </Box>

                  {/* Floor Plan Stats */}
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#4C6FFF" }}></Box>
                        <Typography>Available</Typography>
                      </Box>
                      <Typography>32</Typography>
                      <Typography>62.5%</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#34A853" }}></Box>
                        <Typography>Occupied</Typography>
                      </Box>
                      <Typography>14</Typography>
                      <Typography>38.2%</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div >

    </>
  );
};

export default SuperAdminDashboard;