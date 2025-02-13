import React, { useState, useEffect, useContext } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { TextField, Select, MenuItem, Modal, Box, Typography, Button, FormControl, InputLabel, ListSubheader, Autocomplete, FormHelperText, Snackbar, Alert } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, addDays, startOfMonth, endOfMonth, isSameMonth, isSameDay, parseISO, setHours, setMinutes } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";
import SkipPreviousSharpIcon from "@mui/icons-material/SkipPreviousSharp";
import SkipNextSharpIcon from "@mui/icons-material/SkipNextSharp";
import colors from "@/assets/styles/color";
import { AuthContext } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";
import axiosInstance from "@/utils/axiosInstance";

const BookingCalender = () => {
	const { user } = useContext(AuthContext);

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [location, setLocation] = useState("");
	const [room, setRoom] = useState("");
	const [events, setEvents] = useState([]);

	const [modalOpen, setModalOpen] = useState(false);
	const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
	const [tempBooking, setTempBooking] = useState(null);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);
	const [currentView, setCurrentView] = useState("day");

	const [locations, setLocations] = useState([]);
	const [selectedMember, setSelectedMember] = useState(null);
	const [members, setMembers] = useState([]);
	const [timeExist, setTimeExist] = useState("");
	const [userLimitError, setUserLimitError] = useState("");
	const [rooms, setRooms] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [newEvent, setNewEvent] = useState({
		title: "",
		description: "",
		persons: 0,
		startTime: null,
		endTime: null,
	});
	const [errors, setErrors] = useState({});
	const [saveLoading, setSaveLoading] = useState(false);

	// Alert
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	useEffect(() => {
		// Remove any date changes when switching views
	}, [currentView]);

	// Generate time slots from 1 AM to 11 PM
	const timeSlots = Array.from({ length: 23 }, (_, i) => {
		const hour = i + 1;
		return `${hour}:00`;
	});

	const handleTimeSlotClick = (time, date) => {
		const [hours, minutes] = time.split(":").map(Number);

		const startTime = new Date(selectedDate);
		startTime.setHours(Number.parseInt(hours), 0, 0);
		const endTime = new Date(startTime);
		endTime.setHours(startTime.getHours() + 1);

		setSelectedTimeSlot(time);
		setNewEvent({
			...newEvent,
			startTime,
			endTime,
			date,
		});
		setTempBooking({
			startTime,
			endTime,
		});
		setModalOpen(true);
	};

	const handleTimeChange = (type, newTime) => {
		setNewEvent({
			...newEvent,
			[type]: newTime,
		});
		setTempBooking({
			...tempBooking,
			[type]: newTime,
		});
	};

	const handleSnackbarClose = () => setSnackbarOpen(false);

	const handleSaveEvent = async () => {
		const errors = {};

		if (!newEvent.title) errors.title = "Booking Title is required";
		if (!newEvent.startTime) errors.startTime = "Start time is required";
		if (!newEvent.endTime) errors.endTime = "End time is required";
		if (newEvent.persons <= 0) errors.persons = "Number of persons must be greater than 0";
		if (!location) errors.location = "Location is required";
		if (!room) errors.room = "Room is required";

		if (!selectedMember) errors.selectedMember = "Member is required";

		if (Object.keys(errors).length > 0) {
			setErrors(errors);
			return;
		}

		setTimeExist("");
		setUserLimitError("");

		setSaveLoading(true);
		try {
			const res = await axiosInstance.post(`booking-schedule/create`, { ...newEvent, date: selectedDate, location_id: Number(location), room_id: Number(room), user_id: selectedMember.id });

			if (res.data.success) {
				setModalOpen(false);
				setNewEvent({ title: "", description: "", startTime: null, persons: 0, endTime: null });
				setTempBooking(null);
				setSnackbarMessage("Booking created successfully!");
				setSnackbarSeverity("success");
			}
		} catch (error) {
			setSnackbarMessage("Failed to create booking!");
			setSnackbarSeverity("error");
			// console.log("error", error.response.data);

			if (error.response && error.response.data) {
				if (error.response.data.already_exist) setTimeExist(error.response.data.already_exist);
				else if (error.response.data.user_limit_error) setUserLimitError(error.response.data.user_limit_error);
			}
		} finally {
			setSaveLoading(false);
			setSnackbarOpen(true);
		}
	};

	const handleEventClick = (event) => {
		setSelectedEvent(event);
		setEventDetailsModalOpen(true);
	};

	const isTimeSlotBooked = (timeSlot, date) => {
		const [hours, minutes] = timeSlot.split(":").map(Number);
		const slotTime = setMinutes(setHours(date, hours), minutes);

		return events.some((event) => {
			return isSameDay(event.date, date) && slotTime >= event.startTime && slotTime < event.endTime;
		});
	};

	const getEventForTimeSlot = (timeSlot, date) => {
		const [hours, minutes] = timeSlot.split(":").map(Number);
		const slotTime = setMinutes(setHours(date, hours), minutes);

		return events.find((event) => isSameDay(event.date, date) && slotTime >= event.startTime && slotTime < event.endTime);
	};

	const getDaysInMonth = (date) => {
		const start = startOfMonth(date);
		const end = endOfMonth(date);
		const firstDayOfMonth = startOfWeek(start);
		const lastDayOfMonth = endOfWeek(end);
		return eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
	};

	const reservedPercentage = Math.round((events.length / (23 * 31)) * 100);
	const availablePercentage = 100 - reservedPercentage;

	const changeLocation = async (value) => {
		setLocation(value);
		try {
			const res = await axiosInstance.get(`booking-schedule/filter`, {
				params: { location_id: Number(value) },
			});

			if (res.data.rooms) {
				setRooms(res.data.rooms);
			}
		} catch (error) {
			// console.log(error.response.data);
		}
	};

	useEffect(() => {
		const fetchFilters = async () => {
			setIsLoading(true);

			try {
				const res = await axiosInstance.get(`booking-schedule/filter`, {
					params: {
						location_id: Number(location),
						room_id: Number(room),
						date: selectedDate,
						view: currentView,
					},
				});

				if (res.data.locations) {
					setLocations(res.data.locations);
				} else if (res.data.schedules) {
					const newData = res.data.schedules.map((event) => ({
						...event,
						startTime: new Date(event.startTime),
						endTime: new Date(event.endTime),
						date: new Date(event.date),
					}));

					setEvents(newData);
				}
			} catch (error) {
				console.log(error.response.data);
			} finally {
				setIsLoading(false);
			}
		};
		fetchFilters();
	}, [room, selectedDate, currentView]);

	useEffect(() => {
		// Update Default User according Type
		if (user.type === "user") {
			setSelectedMember(user);
		} else {
			const fetchMembers = async () => {
				try {
					const res = await axiosInstance.get(`booking/users`);
					if (res.data.users) {
						setMembers(res.data.users);
					}
				} catch (error) {
					console.log(error.response.data);
				}
			};
			fetchMembers();
		}
	}, []);

	// Show selected Time Difference on save event
	const getTimeDifference = (start, end) => {
		if (!start || !end) return "";

		const diffInMs = end.getTime() - start.getTime();
		const diffInMinutes = diffInMs / (1000 * 60); // Convert milliseconds to minutes

		if (diffInMinutes < 30) return "Invalid time range"; // Handle invalid range

		const hours = Math.floor(diffInMinutes / 60);
		const minutes = diffInMinutes % 60;

		let timeString = "";
		if (hours > 0) timeString += `${hours} hour${hours > 1 ? "s" : ""}`;
		if (minutes > 0) timeString += ` ${minutes} minute${minutes > 1 ? "s" : ""}`;

		return timeString.trim();
	};

	const renderDayView = (date) => (
		<div className="time-slots">
			{timeSlots.map((time) => {
				const event = getEventForTimeSlot(time, date);
				const isBooked = isTimeSlotBooked(time, date);
				return (
					<div
						key={time}
						className={`time-slot ${isBooked ? "booked" : ""}`}
						onClick={() => {
							if (event && event.user) {
								handleEventClick(event);
							} else if (!isBooked) {
								handleTimeSlotClick(time);
							}
						}}>
						<div className="time">{time}</div>
						<div className="event">
							{event && (
								<div className={`event-card ${event && !event.user ? "disabled" : ""}`}>
									<Typography variant="subtitle2">{event.title}</Typography>
									<Typography variant="caption">
										{format(event.startTime, "HH:mm")} - {format(event.endTime, "HH:mm")}
									</Typography>
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);

	const renderWeekView = (date) => {
		const weekStart = startOfWeek(date);
		const weekEnd = endOfWeek(date);
		const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

		return (
			<div className="week-view">
				<div className="week-header">
					<div className="week-time-header"></div>
					{days.map((day) => (
						<div key={day.toISOString()} className="week-day-header">
							{format(day, "EEE dd/MM")}
						</div>
					))}
				</div>
				<div className="week-body">
					{timeSlots.map((time) => (
						<div key={time} className="week-row">
							<div className="week-time">{time}</div>
							{days.map((day) => {
								const event = getEventForTimeSlot(time, day);
								const isBooked = isTimeSlotBooked(time, day);
								return (
									<div
										key={`${day.toISOString()}-${time}`}
										className={`week-cell ${isBooked ? "booked" : ""} ${isSameDay(day, selectedDate) ? "selected" : ""}`}
										onClick={() => {
											setSelectedDate(day);
											if (event && event.user) {
												handleEventClick(event);
											} else if (!isBooked) {
												handleTimeSlotClick(time, day);
											}
										}}>
										{event && (
											<div className={`event-card ${event && !event.user ? "disabled" : ""}`}>
												<Typography variant="subtitle2">
													{event.title || format(event.startTime, "HH:mm")} - {format(event.endTime, "HH:mm")}
												</Typography>
											</div>
										)}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
		);
	};

	const renderMonthView = (date) => {
		const monthStart = startOfMonth(date);
		const monthEnd = endOfMonth(date);
		const startDate = startOfWeek(monthStart);
		const endDate = endOfWeek(monthEnd);
		const days = eachDayOfInterval({ start: startDate, end: endDate });

		return (
			<div className="month-view">
				<div className="month-header">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
						<div key={day} className="month-day-header">
							{day}
						</div>
					))}
				</div>
				<div className="month-grid">
					{days.map((day) => (
						<div
							key={day.toISOString()}
							className={`month-cell ${!isSameMonth(day, selectedDate) ? "other-month" : ""} ${isSameDay(day, selectedDate) ? "selected" : ""}`}
							onClick={() => {
								setSelectedDate(day);
								handleTimeSlotClick("00:00", day);
							}}>
							<div className="month-date">{format(day, "d")}</div>
							<div className="month-events">
								{events
									.filter((event) => isSameDay(new Date(event.date), day))
									.slice(0, 3)
									.map((event, index) => (
										<div
											key={index}
											className={`month-event ${event && !event.user ? "disabled" : ""}`}
											onClick={(e) => {
												e.stopPropagation();
												if (event && event.user) {
													handleEventClick(event);
												}
											}}>
											{event.title || format(event.startTime, "HH:mm")} - {format(event.endTime, "HH:mm")}
										</div>
									))}
								{events.filter((event) => isSameDay(new Date(event.date), day)).length > 3 && <div className="month-more">...</div>}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	const handleDateChange = (newDate) => {
		setSelectedDate(newDate);
	};

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="container-fluid p-4">
						<div className="row mb-4 align-items-center">
							<div className="col">
								<h1 className="mb-0">Room Booking</h1>
							</div>
							<div className="col-auto">
								<Button variant="contained" sx={{ backgroundColor: colors.primary, color: "white" }}>
									Room/Event Booking
								</Button>
							</div>
						</div>

						<div className="row mb-4">
							<div className="col">
								<div className="d-flex gap-3">
									<div className="badge bg-secondary pd-5 10">Reserved {reservedPercentage}%</div>
									<div
										style={{
											fontSize: "14px",
											color: "white",
											backgroundColor: colors.primary,
											padding: "5px 10px",
											borderRadius: "5px",
										}}>
										Available {availablePercentage}%
									</div>
								</div>
							</div>
						</div>

						<div className="row">
							<div className="col-md-4">
								<div className="card mb-4">
									<div className="card-body">
										<FormControl fullWidth className="mb-3">
											<InputLabel>Select Location</InputLabel>
											<Select value={location} onChange={(e) => changeLocation(e.target.value)} label="Select Location">
												{locations.length > 0 ? (
													locations.map((item) => (
														<MenuItem key={item.id} value={item.id}>
															{item.name}
														</MenuItem>
													))
												) : (
													<MenuItem value="" disabled>
														No Location
													</MenuItem>
												)}
											</Select>
										</FormControl>

										<FormControl fullWidth>
											<InputLabel>Meeting Room</InputLabel>
											<Select value={room} onChange={(e) => setRoom(e.target.value)} label="Meeting Room">
												{rooms.length > 0 ? (
													rooms.flatMap((room) => [
														<MenuItem key={`room-${room.id}`} value={room.id}>
															{room.name}
														</MenuItem>,
													])
												) : (
													<MenuItem value="" disabled>
														No Rooms
													</MenuItem>
												)}
											</Select>
										</FormControl>

										<div className="mt-4">
											<div className="d-flex justify-content-between align-items-center mb-2">
												<Button
													onClick={() => {
														const prevMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
														setSelectedDate(prevMonth);
													}}>
													<SkipPreviousSharpIcon />
												</Button>
												<Typography
													variant="p"
													style={{ cursor: "pointer" }}
													onClick={() => {
														const now = new Date();
														setSelectedDate(now);
													}}>
													{format(selectedDate, "MMMM yyyy")}
												</Typography>
												<Button
													onClick={() => {
														const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
														setSelectedDate(nextMonth);
													}}>
													<SkipNextSharpIcon />
												</Button>
											</div>
											<div className="calendar-grid">
												{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
													<div key={day} className="calendar-header">
														{day}
													</div>
												))}
												{getDaysInMonth(selectedDate).map((day) => (
													<div
														key={day.toISOString()}
														className={`calendar-day ${isSameDay(day, selectedDate) ? "selected" : ""} 
                        ${isSameDay(day, new Date()) ? "today" : ""}
                        ${!isSameMonth(day, selectedDate) ? "other-month" : ""}`}
														onClick={() => handleDateChange(day)}>
														{format(day, "d")}
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="col-md-8">
								<div className="card">
									<div className="card-body">
										{isLoading && <Loader variant="B" />}

										<div className="d-flex justify-content-between align-items-center mb-4">
											<Typography variant="h5">{currentView === "day" ? format(selectedDate, "MMMM d, yyyy") : currentView === "week" ? `Week of ${format(startOfWeek(selectedDate), "MMMM d, yyyy")}` : format(selectedDate, "MMMM yyyy")}</Typography>
											<div className="btn-group gap-2">
												<Button variant={currentView === "day" ? "contained" : "outlined"} sx={currentView === "day" ? { backgroundColor: colors.primary, color: "white" } : { color: "#1976d2" }} onClick={() => setCurrentView("day")}>
													Day
												</Button>
												<Button variant={currentView === "week" ? "contained" : "outlined"} sx={currentView === "week" ? { backgroundColor: colors.primary, color: "white" } : { color: "#1976d2" }} onClick={() => setCurrentView("week")}>
													Week
												</Button>
												<Button variant={currentView === "month" ? "contained" : "outlined"} sx={currentView === "month" ? { backgroundColor: colors.primary, color: "white" } : { color: "#1976d2" }} onClick={() => setCurrentView("month")}>
													Month
												</Button>
											</div>
										</div>

										{currentView === "day" && renderDayView(selectedDate)}
										{currentView === "week" && renderWeekView(selectedDate)}
										{currentView === "month" && renderMonthView(selectedDate)}
									</div>
								</div>
							</div>
						</div>

						<Modal
							open={modalOpen}
							onClose={() => {
								setModalOpen(false);
								setTempBooking(null);
							}}
							aria-labelledby="event-modal"
							style={{
								overflowY: "auto",
							}}>
							<Box
								sx={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									width: 600,
									bgcolor: "background.paper",
									boxShadow: 24,
									marginTop: 10,
									marginBottom: 10,
									p: 4,
									borderRadius: 2,
								}}>
								<Typography variant="h6" component="h2" mb={3}>
									Create Booking
								</Typography>
								{/* {format(new Date(selectedDate), "MMMM d, yyyy")} */}
								{timeExist != "" && (
									<p className="mb-3" style={{ color: "red" }}>
										{timeExist}
									</p>
								)}
								{userLimitError != "" && (
									<p className="mb-3" style={{ color: "red" }}>
										{userLimitError}
									</p>
								)}
								{user.type !== "user" && (
									<Autocomplete
										className="mb-3"
										options={members} // Array of members
										getOptionLabel={(option) => option.name} // Display member name
										value={selectedMember} // Controlled value
										onChange={(event, newValue) => setSelectedMember(newValue)} // Update selected member
										renderInput={(params) => (
											<>
												<TextField {...params} label="Select Member" variant="outlined" />
												{errors.selectedMember && <FormHelperText error>{errors.selectedMember}</FormHelperText>}
											</>
										)}
									/>
								)}
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<div className="d-flex align-items-center gap-3">
										<div className="mb-3">
											<TimePicker
												label="Start Time"
												value={newEvent.startTime}
												onChange={(newTime) => handleTimeChange("startTime", newTime)}
												shouldDisableTime={(timeValue, view) => {
													if (view === "minutes") {
														return timeValue.getMinutes() !== 0 && timeValue.getMinutes() !== 30;
													}
													return false;
												}}
												renderInput={(params) => (
													<>
														<TextField {...params} variant="outlined" />
														{errors.startTime && <FormHelperText error>{errors.startTime}</FormHelperText>}
													</>
												)}
											/>
										</div>
										<div className="mb-3">
											<TimePicker
												label="End Time"
												value={newEvent.endTime}
												onChange={(newTime) => handleTimeChange("endTime", newTime)}
												shouldDisableTime={(timeValue, view) => {
													if (view === "minutes") {
														return timeValue.getMinutes() !== 0 && timeValue.getMinutes() !== 30;
													}
													return false;
												}}
												renderInput={(params) => (
													<>
														<TextField {...params} variant="outlined" />
														{errors.endTime && <FormHelperText error>{errors.endTime}</FormHelperText>}
													</>
												)}
											/>
										</div>
									</div>
								</LocalizationProvider>
								{newEvent.startTime && newEvent.endTime && (
									<Typography variant="body2" color="textSecondary" mb={2}>
										Selected Hours: {getTimeDifference(newEvent.startTime, newEvent.endTime)}
									</Typography>
								)}
								<FormControl component="fieldset" error={Boolean(errors.title)} className="mb-3" fullWidth>
									<TextField fullWidth label="Booking Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
									{errors.title && (
										<FormHelperText className="ms-0" error>
											{errors.title}
										</FormHelperText>
									)}
								</FormControl>
								<FormControl component="fieldset" error={Boolean(errors.persons)} className="mb-3" fullWidth>
									<TextField fullWidth label="Persons" type="number" value={newEvent.persons} onChange={(e) => setNewEvent({ ...newEvent, persons: e.target.value })} />
									{errors.persons && (
										<FormHelperText className="ms-0" error>
											{errors.persons}
										</FormHelperText>
									)}
								</FormControl>
								<FormControl fullWidth className="mb-3" error={Boolean(errors.location)}>
									<InputLabel>Select Location</InputLabel>
									<Select value={location} onChange={(e) => changeLocation(e.target.value)} label="Select Location">
										{locations.length > 0 ? (
											locations.map((item) => (
												<MenuItem key={item.id} value={item.id}>
													{item.name}
												</MenuItem>
											))
										) : (
											<MenuItem value="" disabled>
												No Location
											</MenuItem>
										)}
									</Select>
									{errors.location && (
										<FormHelperText className="ms-0" error>
											{errors.location}
										</FormHelperText>
									)}
								</FormControl>
								<FormControl fullWidth className="mb-3" error={Boolean(errors.room)}>
									<InputLabel>Meeting Room</InputLabel>
									<Select value={room} onChange={(e) => setRoom(e.target.value)} label="Meeting Room" error={Boolean(errors.room)}>
										{rooms.length > 0 ? (
											rooms.flatMap((room) => [
												<MenuItem key={`room-${room.id}`} value={room.id}>
													{room.name}
												</MenuItem>,
											])
										) : (
											<MenuItem value="" disabled>
												No Rooms
											</MenuItem>
										)}
									</Select>
									{errors.room && (
										<FormHelperText className="ms-0" error>
											{errors.room}
										</FormHelperText>
									)}
								</FormControl>
								<div className="d-flex justify-content-end gap-2">
									<Button
										variant="outlined"
										onClick={() => {
											setModalOpen(false);
											setTempBooking(null);
										}}>
										Cancel
									</Button>
									<Button loading={saveLoading} variant="contained" sx={{ backgroundColor: colors.primary, color: "white" }} onClick={handleSaveEvent} disabled={getTimeDifference(newEvent.startTime, newEvent.endTime) == "Invalid time range"}>
										Save Event
									</Button>
								</div>
							</Box>
						</Modal>

						<Modal open={eventDetailsModalOpen} onClose={() => setEventDetailsModalOpen(false)} aria-labelledby="event-details-modal">
							<Box
								sx={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									width: 400,
									bgcolor: "background.paper",
									boxShadow: 24,
									p: 4,
									borderRadius: 2,
								}}>
								<Typography variant="h6" component="h2" mb={3}>
									Booking Details
								</Typography>
								{selectedEvent && (
									<>
										<Typography variant="subtitle1" mb={2}>
											{selectedEvent.title}
										</Typography>
										<Typography variant="body2" mb={2}>
											Date: {selectedEvent.date.toLocaleDateString()}
										</Typography>
										<Typography variant="body2" mb={2}>
											Time: {selectedEvent.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{selectedEvent.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
										</Typography>
										<Typography variant="body2" mb={2}>
											Persons: {selectedEvent.persons}
										</Typography>
										<Typography variant="body2" mb={2}>
											Branch: {selectedEvent.branch.name}
										</Typography>
										<Typography variant="body2" mb={2}>
											Location: {selectedEvent.floor.name}
										</Typography>
										<Typography variant="body2" mb={2}>
											Room: {selectedEvent.room.name}
										</Typography>
										<Typography variant="body2" mb={2}>
											Member Name: {selectedEvent.user.name}
										</Typography>
										<Typography variant="body2" mb={2}>
											Member Email: {selectedEvent.user.email}
										</Typography>
										<Button variant="outlined" onClick={() => setEventDetailsModalOpen(false)}>
											Close
										</Button>
									</>
								)}
							</Box>
						</Modal>

						<Snackbar open={snackbarOpen} autoHideDuration={1500} onClose={handleSnackbarClose}>
							<Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
								{snackbarMessage}
							</Alert>
						</Snackbar>

						<style jsx>{`
							.calendar-grid {
								display: grid;
								grid-template-columns: repeat(7, 1fr);
								gap: 4px;
								padding: 8px;
								background: white;
								border-radius: 12px;
							}
							.badge bg-warning text-white {
								background-color: ${colors.primary};
							}
							.calendar-header {
								text-align: center;
								padding: 4px;
								font-weight: 500;
								color: #666;
								font-size: 0.85rem;
								height: 32px;
								display: flex;
								align-items: center;
								justify-content: center;
							}
							.calendar-day {
								text-align: center;
								padding: 8px;
								cursor: pointer;
								border-radius: 50%;
								aspect-ratio: 1;
								display: flex;
								align-items: center;
								justify-content: center;
								font-size: 0.9rem;
								color: #333;
								transition: all 0.2s ease;
								height: 32px;
								width: 32px;
								margin: 2px auto;
							}
							.calendar-day:hover {
								background-color: #f0f7ff;
							}
							.calendar-day.selected {
								background-color: ${colors.primary};
								color: white;
							}
							.calendar-day.today {
								border: 2px solid ${colors.primary};
							}
							.calendar-day.other-month {
								color: #ccc;
							}
							.time-slots {
								display: flex;
								flex-direction: column;
								gap: 8px;
							}
							.time-slot {
								display: flex;
								gap: 16px;
								padding: 8px;
								border-radius: 4px;
								cursor: pointer;
								transition: background-color 0.2s;
							}
							.time-slot:hover:not(.booked) {
								background-color: #f0f0f0;
							}
							.time-slot.booked {
								background-color: rgba(255, 193, 7, 0.1);
								cursor: pointer;
							}
							.time {
								width: 80px;
								font-weight: bold;
							}
							.event {
								flex-grow: 1;
							}
							.event-card {
								background-color: ${colors.primary};
								padding: 8px;
								border-radius: 4px;
								color: white;
							}
							.event-card.disabled,
							.month-event.disabled {
								background-color: #ca1111;
							}
							.week-view {
								display: flex;
								flex-direction: column;
								overflow-y: auto;
							}
							.week-header {
								display: grid;
								grid-template-columns: 80px repeat(7, 1fr);
								position: sticky;
								top: 0;
								background: white;
								z-index: 1;
							}
							.week-day-header {
								padding: 10px;
								text-align: center;
								background: #f5f5f5;
								border-bottom: 1px solid #e0e0e0;
								font-weight: bold;
							}
							.week-body {
								display: flex;
								flex-direction: column;
							}
							.week-row {
								display: grid;
								grid-template-columns: 80px repeat(7, 1fr);
								min-height: 60px;
							}
							.week-time {
								padding: 10px;
								background: #f5f5f5;
								border-right: 1px solid #e0e0e0;
								font-weight: bold;
							}
							.week-cell {
								border: 1px solid #e0e0e0;
								padding: 4px;
								cursor: pointer;
							}
							.week-cell:hover:not(.booked) {
								background: #f8f8f8;
							}
							.week-cell.booked {
								background-color: rgba(255, 193, 7, 0.1);
							}
							.month-view {
								display: flex;
								flex-direction: column;
							}
							.month-header {
								display: grid;
								grid-template-columns: repeat(7, 1fr);
								background: #f5f5f5;
							}
							.month-day-header {
								padding: 10px;
								text-align: center;
								font-weight: bold;
								border-bottom: 1px solid #e0e0e0;
							}
							.month-grid {
								display: grid;
								grid-template-columns: repeat(7, 1fr);
								flex: 1;
							}
							.month-cell {
								border: 1px solid #e0e0e0;
								padding: 8px;
								min-height: 120px;
								cursor: pointer;
							}
							.month-cell:hover {
								background: #f8f8f8;
							}
							.month-cell.other-month {
								background: #fafafa;
								color: #999;
							}
							.month-cell.selected {
								background-color: rgba(25, 118, 210, 0.1);
							}
							.month-date {
								font-weight: bold;
								margin-bottom: 4px;
							}
							.month-events {
								display: flex;
								flex-direction: column;
								gap: 2px;
							}
							.month-event {
								background: ${colors.primary};
								color: white;
								padding: 2px 4px;
								border-radius: 2px;
								font-size: 0.8rem;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}
							.month-more {
								color: #666;
								font-size: 0.8rem;
								text-align: center;
							}
							.calendar-navigation {
								display: flex;
								align-items: center;
								justify-content: space-between;
								width: 100%;
								padding: 8px 0;
							}

							.calendar-title {
								color: ${colors.primary};
								font-weight: 500;
							}

							.nav-button {
								min-width: 40px !important;
								color: ${colors.primary} !important;
							}
							.week-cell.selected,
							.month-cell.selected {
								background-color: rgba(25, 118, 210, 0.1);
							}
							.card {
								border-radius: 16px;
								border: none;
								box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
							}
						`}</style>
					</div>
				</div>
			</div>
		</>
	);
};
export default BookingCalender;
