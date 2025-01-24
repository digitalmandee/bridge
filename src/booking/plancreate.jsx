import axios from "axios";
import React, { useState } from "react";
import TopNavbar from "../topNavbar";
import Sidebar from "../leftSideBar";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Button, Snackbar, Alert } from "@mui/material";

const PlanCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("basic");
  const [price, setPrice] = useState(0);
  const [nameError, setNameError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const createBookingPlan = async () => {
    setIsLoading(true);
    try {
      const branchId = 1;
      const response = await axios.post(`${process.env.REACT_APP_BASE_API}booking-plans`, {
        name,
        type,
        price,
        branch_id: branchId,
      });

      if (response.data.success) {
        setSnackbarMessage("Plan created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setName("");
        setType("basic");
        setPrice(0);
      } else {
        setSnackbarMessage("Failed to create plan.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      // console.error("Error fetching booking plan data", error);
      setSnackbarMessage("An error occurred.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formIsValid = true;

    if (name.trim().length === 0) {
      setNameError("Name is required");
      formIsValid = false;
    } else {
      setNameError("");
    }

    if (type.trim().length === 0) {
      setTypeError("Type is required");
      formIsValid = false;
    } else {
      setTypeError("");
    }

    if (price <= 0) {
      setPriceError("Price must be greater than 0");
      formIsValid = false;
    } else {
      setPriceError("");
    }

    if (formIsValid) {
      createBookingPlan();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <TopNavbar />
      <div className="main">
        <div className="sidebarWrapper">
          <Sidebar />
        </div>
        <div className="content">
          <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin py-4">
            <Link to={"/booking/plans"} className="d-flex align-items-center gap-2" style={{ textDecoration: "none", color: "black" }}>
              <ChevronLeftIcon fontSize="large" />
              <h3 className="mb-3 mb-md-0">Branch Manager Create</h3>
            </Link>
          </div>
          <div className="card shadow-sm mx-auto">
            <div className="card-body row">
              <div className="col-12 mb-3">
                <label className="mb-1" htmlFor="name">
                  Name
                </label>
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                  {nameError && <span className="text-danger">{nameError}</span>}
                </div>
              </div>
              <div className="col-12 mb-3">
                <label className="mb-1" htmlFor="type">
                  Type
                </label>
                <div className="form-group">
                  <select name="type" id="type" className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                  </select>
                  {typeError && <span className="text-danger">{typeError}</span>}
                </div>
              </div>
              <div className="col-12 mb-3">
                <label className="mb-1" htmlFor="price">
                  Price
                </label>
                <div className="form-group">
                  <input type="number" className="form-control" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.valueAsNumber)} />
                  {priceError && <span className="text-danger">{priceError}</span>}
                </div>
              </div>
              <div className="d-flex justify-content-end mt-4">
                <Button variant="contained" disabled={isLoading} onClick={handleSubmit} style={{ backgroundColor: "#f5b500", color: "black" }}>
                  Create Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Snackbar  anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackbarOpen} autoHideDuration={1500} onClose={handleSnackbarClose} >
        <Alert onClose={handleSnackbarClose} variant="filled" severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PlanCreate;

