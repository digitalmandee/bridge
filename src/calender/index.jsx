import TopNavbar from "../topNavbar"
import Sidebar from "../leftSideBar"
import React, { useState, useEffect } from "react"
import { TextField, Select, MenuItem, Modal, Box, Typography, Button, FormControl, InputLabel } from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers"
import {
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    addDays,
    startOfMonth,
    endOfMonth,
    isSameMonth,
    isSameDay,
    parseISO,
    setHours,
    setMinutes,
} from "date-fns"
import "bootstrap/dist/css/bootstrap.min.css"
import SkipPreviousSharpIcon from "@mui/icons-material/SkipPreviousSharp"
import SkipNextSharpIcon from "@mui/icons-material/SkipNextSharp"
import colors from '../styles/color'
const BookingCalender = () => {

    const [selectedDate, setSelectedDate] = useState(new Date())
    const [location, setLocation] = useState("")
    const [room, setRoom] = useState("")
    const [events, setEvents] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        startTime: null,
        endTime: null,
    })
    const [tempBooking, setTempBooking] = useState(null)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false)
    const [currentView, setCurrentView] = useState("day")

    useEffect(() => {
        // Remove any date changes when switching views
    }, [currentView])

    // Generate time slots from 1 AM to 11 PM
    const timeSlots = Array.from({ length: 23 }, (_, i) => {
        const hour = i + 1
        return `${hour}:00`
    })

    const handleTimeSlotClick = (time, date) => {
        const [hours, minutes] = time.split(":").map(Number)
        const startTime = setMinutes(setHours(date, hours), minutes)
        const endTime = addDays(startTime, 0)
        endTime.setHours(startTime.getHours() + 1)

        setSelectedTimeSlot(time)
        setNewEvent({
            ...newEvent,
            startTime,
            endTime,
            date,
        })
        setTempBooking({
            startTime,
            endTime,
        })
        setModalOpen(true)
    }

    const handleTimeChange = (type, newTime) => {
        setNewEvent({
            ...newEvent,
            [type]: newTime,
        })
        setTempBooking({
            ...tempBooking,
            [type]: newTime,
        })
    }

    const handleSaveEvent = () => {
        if (newEvent.title && newEvent.startTime && newEvent.endTime) {
            setEvents([...events, { ...newEvent, date: selectedDate }])
            setModalOpen(false)
            setNewEvent({ title: "", description: "", startTime: null, endTime: null })
            setTempBooking(null)
        }
    }

    const handleEventClick = (event) => {
        setSelectedEvent(event)
        setEventDetailsModalOpen(true)
    }

    const isTimeSlotBooked = (timeSlot, date) => {
        const [hours, minutes] = timeSlot.split(":").map(Number)
        const slotTime = setMinutes(setHours(date, hours), minutes)

        return events.some((event) => {
            return isSameDay(event.date, date) && slotTime >= event.startTime && slotTime < event.endTime
        })
    }

    const getEventForTimeSlot = (timeSlot, date) => {
        const [hours, minutes] = timeSlot.split(":").map(Number)
        const slotTime = setMinutes(setHours(date, hours), minutes)

        return events.find(
            (event) => isSameDay(event.date, date) && slotTime >= event.startTime && slotTime < event.endTime,
        )
    }

    const getDaysInMonth = (date) => {
        const start = startOfMonth(date)
        const end = endOfMonth(date)
        const firstDayOfMonth = startOfWeek(start)
        const lastDayOfMonth = endOfWeek(end)
        return eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth })
    }

    const reservedPercentage = Math.round((events.length / (23 * 31)) * 100)
    const availablePercentage = 100 - reservedPercentage

    const renderDayView = (date) => (
        <div className="time-slots">
            {timeSlots.map((time) => {
                const event = getEventForTimeSlot(time, date)
                const isBooked = isTimeSlotBooked(time, date)
                return (
                    <div
                        key={time}
                        className={`time-slot ${isBooked ? "booked" : ""}`}
                        onClick={() => {
                            if (event) {
                                handleEventClick(event)
                            } else if (!isBooked) {
                                handleTimeSlotClick(time, date)
                            }
                        }}
                    >
                        <div className="time">{time}</div>
                        <div className="event">
                            {event && (
                                <div className="event-card">
                                    <Typography variant="subtitle2">{event.title}</Typography>
                                    <Typography variant="caption">
                                        {format(event.startTime, "HH:mm")} - {format(event.endTime, "HH:mm")}
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )

    const renderWeekView = (date) => {
        const weekStart = startOfWeek(date)
        const weekEnd = endOfWeek(date)
        const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

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
                                const event = getEventForTimeSlot(time, day)
                                const isBooked = isTimeSlotBooked(time, day)
                                return (
                                    <div
                                        key={`${day.toISOString()}-${time}`}
                                        className={`week-cell ${isBooked ? "booked" : ""} ${isSameDay(day, selectedDate) ? "selected" : ""
                                            }`}
                                        onClick={() => {
                                            setSelectedDate(day)
                                            if (event) {
                                                handleEventClick(event)
                                            } else if (!isBooked) {
                                                handleTimeSlotClick(time, day)
                                            }
                                        }}
                                    >
                                        {event && (
                                            <div className="event-card">
                                                <Typography variant="subtitle2">{event.title}</Typography>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const renderMonthView = (date) => {
        const monthStart = startOfMonth(date)
        const monthEnd = endOfMonth(date)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)
        const days = eachDayOfInterval({ start: startDate, end: endDate })

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
                            className={`month-cell ${!isSameMonth(day, selectedDate) ? "other-month" : ""} ${isSameDay(day, selectedDate) ? "selected" : ""
                                }`}
                            onClick={() => {
                                setSelectedDate(day)
                                handleTimeSlotClick("00:00", day)
                            }}
                        >
                            <div className="month-date">{format(day, "d")}</div>
                            <div className="month-events">
                                {events
                                    .filter((event) => isSameDay(new Date(event.date), day))
                                    .slice(0, 3)
                                    .map((event, index) => (
                                        <div
                                            key={index}
                                            className="month-event"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEventClick(event)
                                            }}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                {events.filter((event) => isSameDay(new Date(event.date), day)).length > 3 && (
                                    <div className="month-more">...</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate)
    }

    return (
        <>
            <TopNavbar />
            <div className='main'>
                <div className='sideBarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
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
                                    <div className="badge bg-secondary pd-5 10">Reserved {reservedPercentage}%</div>
                                    <div style={{
                                        fontSize:'14px',
                                        color:'white',
                                        backgroundColor:colors.primary,
                                        padding: "5px 10px",
                                        borderRadius: "5px"
                                    }}>Available {availablePercentage}%</div>
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
                                                <MenuItem value="location1">Location 1</MenuItem>
                                                <MenuItem value="location2">Location 2</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <InputLabel>Meeting Room</InputLabel>
                                            <Select value={room} onChange={(e) => setRoom(e.target.value)} label="Meeting Room">
                                                <MenuItem value="room1">Room 1</MenuItem>
                                                <MenuItem value="room2">Room 2</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <div className="mt-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <Button
                                                    onClick={() => {
                                                        const prevMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
                                                        setSelectedDate(prevMonth)
                                                    }}
                                                >
                                                    <SkipPreviousSharpIcon />
                                                </Button>
                                                <Typography
                                                    variant="p"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        const now = new Date()
                                                        setSelectedDate(now)
                                                    }}
                                                >
                                                    {format(selectedDate, "MMMM yyyy")}
                                                </Typography>
                                                <Button
                                                    onClick={() => {
                                                        const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
                                                        setSelectedDate(nextMonth)
                                                    }}
                                                >
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
                                                        onClick={() => handleDateChange(day)}
                                                    >
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
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <Typography variant="h5">
                                                {currentView === "day"
                                                    ? format(selectedDate, "MMMM d, yyyy")
                                                    : currentView === "week"
                                                        ? `Week of ${format(startOfWeek(selectedDate), "MMMM d, yyyy")}`
                                                        : format(selectedDate, "MMMM yyyy")}
                                            </Typography>
                                            <div className="btn-group gap-2">
                                                <Button
                                                    variant={currentView === "day" ? "contained" : "outlined"}
                                                    sx={currentView === "day" ? { backgroundColor: colors.primary, color: "white" } : { color: "#1976d2" }}
                                                    onClick={() => setCurrentView("day")}
                                                >
                                                    Day
                                                </Button>
                                                <Button
                                                    variant={currentView === "week" ? "contained" : "outlined"}
                                                    sx={currentView === "week" ? { backgroundColor: colors.primary, color: "white" } : { color: "#1976d2" }}
                                                    onClick={() => setCurrentView("week")}
                                                >
                                                    Week
                                                </Button>
                                                <Button
                                                    variant={currentView === "month" ? "contained" : "outlined"}
                                                    sx={currentView === "month" ? { backgroundColor: colors.primary, color: "white" } : { color: "#1976d2" }}
                                                    onClick={() => setCurrentView("month")}
                                                >
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
                                setModalOpen(false)
                                setTempBooking(null)
                            }}
                            aria-labelledby="event-modal"
                        >
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
                                    Create Event
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <div className="mb-3">
                                        <TimePicker
                                            label="Start Time"
                                            value={newEvent.startTime}
                                            onChange={(newTime) => handleTimeChange("startTime", newTime)}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <TimePicker
                                            label="End Time"
                                            value={newEvent.endTime}
                                            onChange={(newTime) => handleTimeChange("endTime", newTime)}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </div>
                                </LocalizationProvider>
                                <TextField
                                    fullWidth
                                    label="Event Title"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="mb-3"
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    className="mb-3"
                                />
                                <div className="d-flex justify-content-end gap-2">
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setModalOpen(false)
                                            setTempBooking(null)
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

                        <Modal
                            open={eventDetailsModalOpen}
                            onClose={() => setEventDetailsModalOpen(false)}
                            aria-labelledby="event-details-modal"
                        >
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
                                    Event Details
                                </Typography>
                                {selectedEvent && (
                                    <>
                                        <Typography variant="subtitle1" mb={2}>
                                            {selectedEvent.title}
                                        </Typography>
                                        <Typography variant="body2" mb={2}>
                                            Date: {format(new Date(selectedEvent.date), "MMMM d, yyyy")}
                                        </Typography>
                                        <Typography variant="body2" mb={2}>
                                            Time: {format(selectedEvent.startTime, "HH:mm")} -{format(selectedEvent.endTime, "HH:mm")}
                                        </Typography>
                                        <Typography variant="body2" mb={2}>
                                            Description: {selectedEvent.description}
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
          padding: 8px;
          background: white;
          border-radius: 12px;
        }
          .badge bg-warning text-white{
          background-color: ${colors.primary}
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
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
      `}</style>
                    </div>
                </div>
            </div>
        </>
    )
}
export default BookingCalender
