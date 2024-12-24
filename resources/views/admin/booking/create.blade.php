@extends('admin.master')
@section('title', __('Booking Create'))
@section('content')
<style>
    .btn-toggle {
        padding: 8px 16px;
        margin: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-toggle:hover {
        background-color: #f0f0f0;
    }

    .chair {
        display: inline-block;
        padding: 10px 20px;
        margin: 5px;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
    }

    .available {
        background-color: green;
        color: white;
    }

    .reserved {
        background-color: red;
        color: white;
    }

    .selection-area {
        margin: 15px 0;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    #notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 4px;
        display: none;
        z-index: 1000;
    }

    .success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
</style>
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-2">
            <a href="{{ route('admin.booking.calendar') }}">
                <i class="fa fa-chevron-left"></i>
            </a>
            <h3 class="m-0">New Booking</h3>
        </div>
    </div>
    <div id="notification"></div>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <form action="{{ route('booking.storeUserDetails') }}" method="POST" id="bookingForm">
                @csrf
                <!-- User Details Section -->
                <div class="card mb-4">
                    <div class="card-body p-4">
                        <div class="mb-4">
                            <h4>User Details</h4>
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" name="name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" name="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone</label>
                                <input type="text" name="phone" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Product</label>
                                <select name="product" class="form-control" required>
                                    <option value="">Select Product</option>
                                    <option value="meeting_rooms">Meeting Rooms</option>
                                    <option value="podcast_rooms">Podcast Rooms</option>
                                    <option value="visitor">Visitor</option>
                                    <option value="office">Office</option>
                                </select>
                            </div>
                        </div>
                        <!-- Branch Selection Button -->
                        <div>
                            <div class="mb-4 d-flex align-items-center gap-5">
                                <h4>Location Selection</h4>
                                <button type="button" class="layout-btn active" data-bs-toggle="modal"
                                    data-bs-target="#branchModal">
                                    Select Location
                                </button>
                            </div>
                            <div id="selectedLocationInfo" class="mt-2 text-muted"></div>
                        </div>
                        <!-- Hidden Fields -->
                        <input type="hidden" name="branch_id" id="selectedBranchId">
                        <input type="hidden" name="floor_id" id="selectedFloorId">
                        <input type="hidden" name="room_id" id="selectedRoomId">
                        <input type="hidden" name="table_id" id="selectedTableId">
                        <input type="hidden" name="chair_ids" id="selectedChairIds">
                        <!-- Booking Details -->
                        <div class="mb-4">
                            <h4>Booking Details</h4>
                            <div class="mb-3">
                                <label class="form-label">Date</label>
                                <input type="date" name="date" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Time</label>
                                <input type="time" name="time" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Duration</label>
                                <select name="duration" class="form-control" required>
                                    <option value="">Select Duration</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                        </div>
                            <button type="submit" class="layout-btn active">Submit</button>
                      
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
@include('admin.booking.modal.branch_detail')
@endsection