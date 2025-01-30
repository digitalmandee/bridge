import React from "react";
import TopNavbar from "../topNavbar";
import Sidebar from "../leftSideBar";
import colors from "../styles/color";
import { Box, Card, CardContent, Typography, Grid, Button, Select, MenuItem } from "@mui/material";
import { Bar, Doughnut } from "react-chartjs-2";
import PeopleIcon from "@mui/icons-material/People";
import SpaceBarIcon from "@mui/icons-material/SpaceBar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BarChartIcon from "@mui/icons-material/BarChart";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  datasets: [
    {
      label: "Total Sale",
      data: [35000, 28000, 32000, 30000, 35000, 28000, 38000, 25000],
      backgroundColor: colors.primary,
      barThickness: 20,
      borderRadius: 4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Total Sale",
      align: "start",
      font: {
        size: 16,
        weight: "bold",
      },
      padding: {
        bottom: 30,
      },
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
      backgroundColor: ["#0D2B4E", "#34A853"],
      borderWidth: 0,
    },
  ],
};

const floorPlanOptions = {
  cutout: "70%",
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

const AdminDashboard = () => {
  return (
    <>
      <TopNavbar />
      <div className="main d-flex">
        <div className="sideBarWrapper">
          <Sidebar />
        </div>
        <div className="content">
          <div className="right-content">
            <Box>
              <Box sx={{ bgcolor: "transparent" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: "medium", fontSize: "24px" }}>
                    Dashboard
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="outlined" sx={{ color: "text.primary", borderColor: "divider" }}>
                      View Report
                    </Button>
                    <Box sx={{ minWidth: 120 }}>
                      <Select value="branch1" size="small" sx={{ bgcolor: "background.paper" }}>
                        <MenuItem value="branch1">Branch 1</MenuItem>
                      </Select>
                    </Box>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: colors.primary,
                        "&:hover": { bgcolor: colors.primary },
                      }}
                    >
                      Add New Branch
                    </Button>
                  </Box>
                </Box>
                <Grid container>
                  <Grid container spacing={2}>
                    {[
                      { title: "Total Members", value: "350", icon: PeopleIcon, color: colors.primary },
                      { title: "Available Space", value: "43", icon: SpaceBarIcon, color: colors.primary },
                      { title: "Total Revenue", value: "35,0000", icon: AttachMoneyIcon, color: colors.primary },
                      { title: "P&L", value: "329", icon: BarChartIcon, color: colors.primary },
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
                          <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {item.title}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "auto" }}>
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

                  <Grid container spacing={2} sx={{ mt: "20px" }}>
                    <Grid item xs={12} md={7}>
                      <Card
                        sx={{
                          boxShadow: "none",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: "8px",
                        }}
                      >
                        <CardContent>
                          <Bar data={chartData} options={chartOptions} />
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Card
                        sx={{
                          boxShadow: "none",
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: "8px",
                        }}
                      >
                        <CardContent>
                          <Box sx={{ position: "relative" }}>
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
                              <Typography variant="h6">Floor Plan </Typography>
                              <Typography variant="h4">46</Typography>
                              <Typography variant="body2">seats</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography>Available</Typography>
                              <Typography>32</Typography>
                              <Typography>62.5%</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography>Occupied</Typography>
                              <Typography>14</Typography>
                              <Typography>38.2%</Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
