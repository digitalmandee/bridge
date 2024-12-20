@extends('admin.master')
@section('title', __('Booking Create'))
@section('content')

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

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <form action="{{ route('booking.storeUserDetails') }}" method="POST" id="bookingForm">
                    @csrf
                    <div class="card mb-4">
                        <div class="card-body p-4">
                            <!-- User Details Section -->
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
                            <div class="mb-4">
                                <h4>Location Selection</h4>
                                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#branchModal">
                                    Select Location
                                </button>
                                <div id="selectedLocationInfo" class="mt-2 text-muted"></div>
                            </div>

                            <!-- Hidden Fields for Selection -->
                            <input type="hidden" name="branch_id" id="selectedBranchId">
                            <input type="hidden" name="floor_id" id="selectedFloorId">
                            <input type="hidden" name="room_id" id="selectedRoomId">
                            <input type="hidden" name="table_id" id="selectedTableId">
                            <input type="hidden" name="chair_id" id="selectedChairId">

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

                            <button type="submit" class="btn btn-primary">Submit Booking</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Branch Selection Modal -->
@include('admin.booking.modal.branch_detail')

@endsection
