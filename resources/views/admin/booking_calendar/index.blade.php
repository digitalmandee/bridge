@extends('admin.master')
@section('title', __('Booking Calendar'))
@section('content')
<style>
    :root {
        --primary-clr: #b38add;
    }
</style>
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3 class="mb-3 mb-md-0">Booking Calendar</h3>
        </div>
        <a href="{{ route('admin.booking.create') }}" class="layout-btn active">New Booking</a>
    </div>
    <div class="container">
        <div class="left">
            <div class="calendar">
                <div class="month">
                    <i class="fas fa-angle-left prev"></i>
                    <div class="date">december 2015</div>
                    <i class="fas fa-angle-right next"></i>
                </div>
                <div class="weekdays">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div class="days"></div>
                <div class="goto-today">
                    <div class="goto">
                        <input type="text" placeholder="mm/yyyy" class="date-input" />
                        <button class="goto-btn">Go</button>
                    </div>
                    <button class="today-btn">Today</button>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="today-date">
                <div class="event-day">wed</div>
                <div class="event-date">12th december 2022</div>
            </div>
            <div class="events"></div>
            <div class="add-event-wrapper">
                <div class="add-event-header">
                    <div class="title">Add Event</div>
                    <i class="fas fa-times close"></i>
                </div>
                <div class="add-event-body">
                    <div class="add-event-input">
                        <input type="text" placeholder="Event Name" class="event-name" />
                    </div>
                    <div class="add-event-input">
                        <input type="text" placeholder="Event Time From" class="event-time-from" />
                    </div>
                    <div class="add-event-input">
                        <input type="text" placeholder="Event Time To" class="event-time-to" />
                    </div>
                </div>
                <div class="add-event-footer">
                    <button class="add-event-btn">Add Event</button>
                </div>
            </div>
        </div>
        <button class="add-event">
            <i class="fas fa-plus"></i>
        </button>
    </div>
</div>
@include('admin.booking_calendar.calendar_script')
@endsection
