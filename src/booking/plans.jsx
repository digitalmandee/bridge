import React, { useEffect, useState } from "react";
import TopNavbar from "../topNavbar";
import Sidebar from "../leftSideBar";
import { Link } from "react-router-dom";
import axios from "axios";
import { IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, Snackbar, Alert } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Loader from "../components/Loader";
import colors from '../styles/color'

const BookingPlans = () => {
  const [bookingPlans, setBookingPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [editData, setEditData] = useState({ name: "", type: "", price: "" });

  const handleMenuOpen = (event, plan) => {
    setAnchorEl(event.currentTarget);
    setCurrentPlan(plan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditData({
      name: currentPlan.name,
      type: currentPlan.type,
      price: currentPlan.price,
    });
    setIsEditModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_API}booking-plans/${currentPlan.id}`);
      setBookingPlans((prev) => prev.filter((plan) => plan.id !== currentPlan.id));
      setSnackbarMessage("Plan deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting booking plan", error);
      setSnackbarMessage("Failed to delete plan");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_API}booking-plans/${currentPlan.id}`, editData);

      setBookingPlans((prev) => prev.map((plan) => (plan.id === currentPlan.id ? response.data.data : plan)));

      setIsEditModalOpen(false);
      setSnackbarMessage("Plan updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating booking plan", error);
      setSnackbarMessage("Failed to update plan");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchBookingPlanData = async () => {
      setIsLoading(true);
      try {
        const branchId = 1;
        const response = await axios.get(`${process.env.REACT_APP_BASE_API}booking-plans?branch_id=${branchId}`);

        if (response.data && Array.isArray(response.data.data)) {
          setBookingPlans(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching booking plan data", error);
        setSnackbarMessage("Failed to fetch booking plans");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingPlanData();
  }, []);

  return (
    <>
      <TopNavbar />
      <div className="main">
        <div className="sidebarWrapper">
          <Sidebar />
        </div>
        <div className="content">
          <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin py-4">
            <div>
              <h3>Price Plan</h3>
            </div>
            <Link
              to={"/booking/plans/create"}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                backgroundColor: colors.primary,
                color: "#fff",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Add Plan
            </Link>
          </div>
          <div className="row card col-md-12">
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Fees</th>
                  <th className="p-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4">
                      <Loader variant="C" />
                    </td>
                  </tr>
                ) : bookingPlans.length ? (
                  bookingPlans.map((plan, index) => (
                    <tr key={index}>
                      <td className="px-3">
                        <b>{plan.name}</b>
                        <br />
                        <small>{plan.branch?.location || "No location available"}</small>
                      </td>
                      <td className="px-3" style={{ textTransform: "capitalize" }}>
                        {plan.type}
                      </td>
                      <td className="px-3">Rs. {plan.price}</td>
                      <td className="d-flex justify-content-end">
                        <IconButton onClick={(e) => handleMenuOpen(e, plan)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          PaperProps={{
                            style: {
                              boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
                            },
                          }}
                        >
                          <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                          <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                        </Menu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No booking plans available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <DialogTitle>Edit Booking Plan</DialogTitle>
        <DialogContent>
          <TextField className="mb-3" margin="dense" label="Name" name="name" fullWidth value={editData.name} onChange={handleInputChange} />
          <Select className="mb-3" margin="dense" id="select-status" name="type" fullWidth value={editData.type} onChange={handleInputChange}>
            <MenuItem value="basic">Basic</MenuItem>
            <MenuItem value="premium">Premium</MenuItem>
          </Select>
          <TextField margin="dense" label="Price" name="price" type="number" fullWidth value={editData.price} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this plan?</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbarOpen} autoHideDuration={1500} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} variant="filled" severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookingPlans;
