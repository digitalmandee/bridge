import TopNavbar from "../topNavbar";
import Sidebar from "../leftSideBar";
import React, { useEffect, useState } from "react";
import { TextField, Select, MenuItem, Modal, Box, Typography, Button, FormControl, InputLabel, ListSubheader, Autocomplete } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import "bootstrap/dist/css/bootstrap.min.css";
import colors from "../styles/color";
import axios from "axios";

const BookingCalender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [room, setRoom] = useState("");
  const [timeExist, setTimeExist] = useState("");
  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  // {
  //   title: "Hardcoded Event",
  //   description: "This is a hardcoded event",
  //   startTime: new Date(2025, 0, 29, 1, 0), // June 15, 2023, 10:00 AM
  //   endTime: new Date(2025, 0, 29, 2, 0), // June 15, 2023, 11:00 AM
  //   date: new Date(2025, 0, 29), // June 15, 2023
  // },
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    persons: 0,
    startTime: null,
    endTime: null,
  });
  const [tempBooking, setTempBooking] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);

  // Generate time slots from 1 AM to 11 PM
  const timeSlots = Array.from({ length: 23 }, (_, i) => {
    const hour = i + 1;
    return `${hour}:00`;
  });

  const handleTimeSlotClick = (time) => {
    console.log(events);

    const [hours] = time.split(":");

    const startTime = new Date(selectedDate);
    startTime.setHours(Number.parseInt(hours), 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    setSelectedTimeSlot(time);
    setNewEvent({
      ...newEvent,
      startTime,
      endTime,
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

  const handleSaveEvent = () => {
    if (newEvent.title && newEvent.startTime && newEvent.endTime && newEvent.persons > 0 && selectedMember) {
      setTimeExist("");
      axios
        .post(`${process.env.REACT_APP_BASE_API}booking-schedule/create`, { ...newEvent, date: selectedDate, branch_id: Number(location), room_id: Number(room), user_id: selectedMember.id, created_by_branch: 1 })
        .then((res) => {
          console.log(res.data);

          setEvents([...events, { ...res.data.data, date: new Date(res.data.data.date), startTime: new Date(res.data.data.startTime), endTime: new Date(res.data.data.endTime) }]);
          setModalOpen(false);
          setNewEvent({ title: "", description: "", startTime: null, persons: 0, endTime: null });
          setTempBooking(null);
        })
        .catch((err) => {
          console.log(err.response.data.already_exist);

          setTimeExist(err.response.data.already_exist);
        });
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setEventDetailsModalOpen(true);
  };

  const isTimeSlotBooked = (timeSlot) => {
    const [hours] = timeSlot.split(":");
    const slotTime = new Date(selectedDate);
    slotTime.setHours(Number.parseInt(hours), 0, 0);

    // Check against saved events
    const isBooked = events.some((event) => {
      console.log(event.date);
      const eventData = new Date(event.date);
      return eventData.toDateString() === selectedDate.toDateString() && slotTime >= event.startTime && slotTime < event.endTime;
    });

    // Check against temporary booking
    const isTempBooked = tempBooking && slotTime >= tempBooking.startTime && slotTime < tempBooking.endTime;

    return isBooked || isTempBooked;
  };

  const getEventForTimeSlot = (timeSlot) => {
    const [hours] = timeSlot.split(":");
    const slotTime = new Date(selectedDate);
    slotTime.setHours(Number.parseInt(hours), 0, 0);

    return events.find((event) => new Date(event.date).toDateString() === selectedDate.toDateString() && slotTime >= event.startTime && slotTime < event.endTime);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  const reservedPercentage = Math.round((events.length / (23 * 31)) * 100);
  const availablePercentage = 100 - reservedPercentage;

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        await axios
          .get(`${process.env.REACT_APP_BASE_API}booking-schedule/filter`, {
            params: {
              branch_id: Number(location),
              room_id: Number(room),
            },
          })
          .then((res) => {
            console.log(res.data);

            if (res.data.branches) setLocations(res.data.branches);
            else if (res.data.floors) {
              setRooms(res.data.floors);
              setMembers(res.data.users);
            } else if (res.data.schedules) {
              const newData = res.data.schedules.map((event) => ({
                ...event,
                startTime: new Date(event.startTime),
                endTime: new Date(event.endTime),
                date: new Date(event.date),
              }));
              // console.log(newData);
              setEvents(newData);
            }
          });
      } catch (error) {
        console.log(error);
      }
    };
    fetchFilters();
  }, [location, room]);

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
                <h1 className="mb-0">Booking Calendar</h1>
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
                  <div className="badge bg-secondary">Reserved {reservedPercentage}%</div>
                  <div className="badge bg-warning text-white">Available {availablePercentage}%</div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-body">
                    <FormControl fullWidth className="mb-3">
                      <InputLabel>Select Location</InputLabel>
                      <Select value={location} onChange={(e) => setLocation(e.target.value)} label="Select Location">
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
                          rooms.flatMap((floor) => [
                            // Floor name as a subheader
                            <ListSubheader key={`floor-${floor.id}`}>{floor.name}</ListSubheader>,
                            // Rooms under the floor
                            ...floor.rooms.map((room) => (
                              <MenuItem key={`room-${room.id}`} value={room.id}>
                                {room.name}
                              </MenuItem>
                            )),
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
                        <Typography variant="h8" className="mb-0">
                          {selectedDate.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                          })}
                        </Typography>
                        <div className="d-flex">
                          <Button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>{"<"}</Button>
                          <Button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>{">"}</Button>
                        </div>
                      </div>
                      <div className="calendar-grid">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                          <div key={day} className="calendar-header">
                            {day}
                          </div>
                        ))}
                        {getDaysInMonth(selectedDate).map((day) => (
                          <div key={day} className={`calendar-day ${day === selectedDate.getDate() ? "selected" : ""}`} onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}>
                            {day}
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
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Typography variant="h5">{selectedDate.toLocaleDateString()}</Typography>
                      <div className="btn-group gap-2">
                        <Button variant="contained" sx={{ backgroundColor: colors.primary, color: "white" }}>
                          Day
                        </Button>
                        <Button variant="outlined">Week</Button>
                        <Button variant="outlined">Month</Button>
                      </div>
                    </div>

                    <div className="time-slots">
                      {timeSlots.map((time) => {
                        const event = getEventForTimeSlot(time);
                        const isBooked = isTimeSlotBooked(time);
                        return (
                          <div
                            key={time}
                            className={`time-slot ${isBooked ? "booked" : ""}`}
                            onClick={() => {
                              if (event) {
                                handleEventClick(event);
                              } else if (!isBooked) {
                                handleTimeSlotClick(time);
                              }
                            }}
                          >
                            <div className="time">{time}</div>
                            <div className="event">
                              {event && (
                                <div className="event-card">
                                  <Typography variant="subtitle2">{event.title}</Typography>
                                  <Typography variant="caption">
                                    {event.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{event.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </Typography>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
              }}
            >
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
                }}
              >
                <Typography variant="h6" component="h2" mb={3}>
                  Create Booking
                </Typography>
                {timeExist != "" && (
                  <p className="mb-3" style={{ color: "red" }}>
                    {timeExist}
                  </p>
                )}
                <Autocomplete
                  className="mb-3"
                  options={members} // Array of members
                  getOptionLabel={(option) => option.name} // Display member name
                  value={selectedMember} // Controlled value
                  onChange={(event, newValue) => setSelectedMember(newValue)} // Update selected member
                  renderInput={(params) => <TextField {...params} label="Member" variant="outlined" />}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="mb-3">
                      <TimePicker label="Start Time" value={newEvent.startTime} onChange={(newTime) => handleTimeChange("startTime", newTime)} renderInput={(params) => <TextField {...params} fullWidth />} />
                    </div>
                    <div className="mb-3">
                      <TimePicker label="End Time" value={newEvent.endTime} onChange={(newTime) => handleTimeChange("endTime", newTime)} renderInput={(params) => <TextField {...params} fullWidth />} fullWidth />
                    </div>
                  </div>
                </LocalizationProvider>
                <TextField fullWidth label="Booking Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="mb-3" />
                <TextField fullWidth label="Persons" type="number" value={newEvent.persons} onChange={(e) => setNewEvent({ ...newEvent, persons: e.target.value })} className="mb-3" />
                <FormControl fullWidth className="mb-3">
                  <InputLabel>Select Location</InputLabel>
                  <Select value={location} onChange={(e) => setLocation(e.target.value)} label="Select Location">
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
                <Select value={room} onChange={(e) => setRoom(e.target.value)} label="Meeting Room" id="select-status" className="mb-3" fullWidth>
                  {rooms.length > 0 ? (
                    rooms.flatMap((floor) => [
                      // Floor name as a subheader
                      <ListSubheader key={`floor-${floor.id}`}>{floor.name}</ListSubheader>,
                      // Rooms under the floor
                      ...floor.rooms.map((room) => (
                        <MenuItem key={`room-${room.id}`} value={room.id}>
                          {room.name}
                        </MenuItem>
                      )),
                    ])
                  ) : (
                    <MenuItem value="" disabled>
                      No Rooms
                    </MenuItem>
                  )}
                </Select>
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setModalOpen(false);
                      setTempBooking(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" sx={{ backgroundColor: colors.primary, color: "white" }} onClick={handleSaveEvent}>
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
                }}
              >
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
                      Location: {selectedEvent.branch.name}
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

            <style jsx>{`
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .badge.bg-warning.text-white {
    background-color: ${colors.primary} !important;
    color: white; !important /* Adjust text color */
}
        .calendar-header {
          text-align: center;
          padding: 8px;
          font-weight: bold;
        }
        .calendar-day {
          text-align: center;
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
        }
        .calendar-day:hover {
          background-color: #f0f0f0;
        }
        .calendar-day.selected {
          background-color: ${colors.primary};
          color: white;
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
    background-color: ${colors.primary} /* Highlight booked slots */
    color:white;
    cursor: pointer; /* Indicate clickability */
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

.time-slot:not(.booked) {
    cursor: pointer;
    background-color: #f8f9fa;
}

.time-slot:hover {
    background-color: #e9ecef; /* Hover effect */
}
      `}</style>
          </div>
        </div>
      </div>
    </>
  );
};
export default BookingCalender;
