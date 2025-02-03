import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import colors from "@/assets/styles/color";
import { Box, Card, CardContent, Typography, Grid, Button, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/Loader";
import { Bell, Building, Building2, FileText, MoreVerticalIcon } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime); // Enable relative time formatting

ChartJS.register(ArcElement, Tooltip, Legend);

const bookingData = [
  { id: "#123757", floor: "Floor 1", room: 'Desk #12", Meeting Room', type: "Hourly", startDate: "Dec 01, 2024", endDate: "Dec 01, 2024", status: "Complete" },
  { id: "#141257", floor: "Floor 1", room: 'Desk #12", Meeting Room', type: "Daily", startDate: "Dec 01, 2024", endDate: "Dec 01, 2024", status: "Pending" },
  { id: "#365615", floor: "Floor 1", room: 'Desk #12", Meeting Room', type: "Monthly", startDate: "Dec 01, 2024", endDate: "Dec 01, 2024", status: "Complete" },
  { id: "#365615", floor: "Floor 1", room: 'Desk #12", Meeting Room', type: "Hourly", startDate: "Dec 01, 2024", endDate: "Dec 01, 2024", status: "Cancel" },
  { id: "#365615", floor: "Floor 1", room: 'Desk #12", Meeting Room', type: "Monthly", startDate: "Dec 01, 2024", endDate: "Dec 01, 2024", status: "Complete" },
  { id: "#638251", floor: "Floor 1", room: 'Desk #12", Meeting Room', type: "Hourly", startDate: "Dec 01, 2024", endDate: "Dec 01, 2024", status: "Cancel" },
];

const chartData = {
  datasets: [
    {
      data: [62.5, 22.4, 18.9],
      backgroundColor: ["#4285F4", "#EA4335", "#34A853"],
      borderWidth: 0,
    },
  ],
};

const chartOptions = {
  cutout: "70%",
  plugins: {
    legend: {
      position: "right", // remove `as const`
      labels: {
        boxWidth: 10,
        padding: 20,
      },
    },
  },
};

const UserDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await axios.get(import.meta.env.VITE_BASE_API + "user/dashboard", { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "application/json" } }).then((res) => {
        // console.log(res.data);
        setData(res.data);
      });
      setIsLoading(false);
    };
    getData();
  }, []);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BASE_API + "notifications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "application/json" },
      })
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => console.error("Error fetching notifications:", error.response.data));
  }, []);

  //   const markAsRead = (notificationId) => {
  //     axios.post(import.meta.env.VITE_BASE_API + `notifications/${notificationId}/read`, {}, {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
  //     }).then(() => {
  //         setNotifications(notifications.filter(n => n.id !== notificationId)); // Remove from list
  //     })
  //     .catch(error => console.error("Error marking as read:", error));
  // };

  const notificationsStyle = {
    marginTop: "1rem",
    backgroundColor: "#FFFFFF",
    borderRadius: "0.2rem",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    border: "1px solid #E5E7EB",
    height: "30rem",
    width: "21rem",
    padding: "1.5rem",
  };

  return (
    <>
      <TopNavbar />
      <div className="main d-flex">
        <div className="sideBarWrapper">
          <Sidebar />
        </div>
        <div className="content">
          <div className="right-content">
            <Box
              sx={{
                p: 3,
                // bgcolor: '#F8F9FA'
              }}
            >
              {/* Header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Dashboard
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Link to="/user/booking-schedule">
                    <Button
                      variant="outlined"
                      sx={{
                        color: "text.primary",
                        borderColor: "divider",
                        bgcolor: "white",
                      }}
                    >
                      Create Booking
                    </Button>
                  </Link>
                </Box>
              </Box>

              {/* Metric Cards */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {[
                  { title: "Available Booking", value: data.totalBookings ?? 0, icon: DirectionsCarIcon, color: colors.primary },
                  { title: "Remaing Booking", value: data.remainingbookings ?? 0, icon: GroupsIcon, color: colors.primary },
                  { title: "Total Amount", value: data.totalAmount ?? 0, icon: AccountBalanceWalletIcon, color: colors.primary },
                  { title: "Over Due Amount", value: data.overDueAmount ?? 0, icon: PaymentsIcon, color: colors.primary },
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                      sx={{
                        boxShadow: "none",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: "8px",
                        height: "100%",
                        bgcolor: "white",
                      }}
                    >
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {item.title}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            {item.value}
                          </Typography>
                          <Box
                            sx={{
                              bgcolor: item.color,
                              borderRadius: "8px",
                              p: 1,
                            }}
                          >
                            <item.icon sx={{ color: "#fff" }} />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Main Content */}
              <Grid container spacing={3}>
                {/* Booking Table */}
                <Grid item xs={12} md={8}>
                  <TableContainer
                    component={Paper}
                    sx={{
                      boxShadow: "none",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Table>
                      <TableHead sx={{ bgcolor: colors.primary }}>
                        <TableRow>
                          <TableCell sx={{ color: "white" }}>Booking ID</TableCell>
                          <TableCell sx={{ color: "white" }}>Name</TableCell>
                          <TableCell sx={{ color: "white" }}>Date</TableCell>
                          <TableCell sx={{ color: "white" }}>Amount</TableCell>
                          <TableCell sx={{ color: "white" }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {isLoading ? (
                          <tr>
                            <td colSpan="6">
                              <Loader variant="C" />
                            </td>
                          </tr>
                        ) : data.bookingInvoices.length > 0 ? (
                          data.bookingInvoices.map((invoice, index) => (
                            <TableRow key={index}>
                              <TableCell>#{invoice.id}</TableCell>
                              <TableCell>#{invoice.booking_id}</TableCell>
                              <TableCell>{invoice.user.name}</TableCell>
                              <TableCell>{invoice.due_date}</TableCell>
                              <TableCell>Rs. {invoice.amount}</TableCell>
                              <TableCell>
                                <span className={`status ${invoice.status}`}>{invoice.status}</span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No data available
                            </td>
                          </tr>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} md={4}>
                  <div style={notificationsStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                      <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>Notifications</h2>
                      <div style={{ backgroundColor: "#0A2156", padding: "0.5rem", borderRadius: "0.375rem" }}>
                        <Bell style={{ width: "1.25rem", height: "1.25rem", color: "white" }} />
                      </div>
                    </div>
                    <div style={{ marginTop: "0.5rem" }}>
                      {notifications.map((notification, i) => (
                        <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
                          <div style={{ marginTop: "0.05rem" }}>
                            <FileText style={{ width: "1.25rem", height: "1.25rem", color: "#0A2156" }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <span style={{ fontWeight: "500", fontSize: "0.875rem", color: "#111827" }}>{notification.title}</span>
                              <span style={{ fontSize: "0.75rem", color: "#6B7280", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>{dayjs(notification.created_at).fromNow()}</span>
                            </div>
                            <p style={{ fontSize: "0.875rem", color: "#4B5563", marginTop: "0.25rem", lineHeight: "1.25" }}>{notification.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;

const notifications2 = [
  {
    icon: FileText,
    title: "Booking Confirmation",
    message: "Your booking for Desk #12 at Downtown Branch is confirmed for Jan 10, 2025, 9:00 AM",
    time: "2 min ago",
  },
  {
    icon: FileText,
    title: "Upcoming Booking Reminder",
    message: "Reminder: You have an upcoming booking for Meeting Room",
    time: "10 min ago",
  },
  {
    icon: Building2,
    title: "New Amenities Added",
    message: "*New* High-speed internet and ergonomic chairs are now available at Branch 1",
    time: "2 days ago",
  },
  {
    icon: Building,
    title: "Payment Reminder",
    message: "Payment overdue! Please complete payment for your monthly booking",
    time: "3 days ago",
  },
];
