@extends('admin.master')
@section('title', __('Booking Create'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-2">
            <a href="{{ route('admin.booking.calendar') }}">
                <i class="fa fa-chevron-left"></i>
            </a>
            <h3 class="m-0">Booking Create</h3>
        </div>
    </div>
    <div class="">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <form action="{{ route('booking.storeUserDetails') }}" method="POST" id="bookingForm">
                    @csrf
                    <!-- User Details Section -->
                    <div class="card mb-4">
                        <div class="card-body p-4">
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
                            <!-- Branch Selection Dropdown -->
                            <h4>Location Selection</h4>
                            <select id="branchSelect" class="form-control" required>
                                <option value="">Select Branch</option>
                                @foreach($branches as $branch)
                                    <option value="{{ $branch->id }}" data-branch-name="{{ $branch->name }}">
                                        {{ $branch->name }}
                                    </option>
                                @endforeach
                            </select>
                            <!-- Booking Details -->
                            <h4>Booking Details</h4>
                            <div class="mb-3">
                                <label class="form-label">Start Date</label>
                                <input type="date" name="start_date" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">End Date</label>
                                <input type="date" name="end_date" class="form-control" required>
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
                            <button type="submit" class="btn btn-primary">Submit Booking</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@include('admin.booking.modal.branch_detail')
@endsection