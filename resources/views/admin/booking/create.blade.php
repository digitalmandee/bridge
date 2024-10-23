@extends('admin.master')
@section('title', __('Booking Create'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3>New Booking</h3>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="tab-list mb-3 col-md-8">
            <button class="main-btn tab active" data-tab="tab1">User Details</button>
            <button class="main-btn tab" data-tab="tab2">Booking Details</button>
        </div>
        <div class="col-md-8 tab-content active" id="tab1">
            <div class="card">
                <div class="card-body px-5">
                    <div class="d-flex justify-content-center mb-2">
                        <h3>User Details</h3>
                    </div>
                    <form action="">
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <label class="mb-1" for="name">Name</label>
                            <div class="form-group">
                                <input type="text" name="name" class="form-control">
                            </div>
                        </div>
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <label class="mb-1" for="name">Email</label>
                            <div class="form-group">
                                <input type="text" name="name" class="form-control">
                            </div>
                        </div>
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <label class="mb-1" for="name">Phone No</label>
                            <div class="form-group">
                                <input type="text" name="name" class="form-control">
                            </div>
                        </div>
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <label class="mb-1" for="name">Product</label>
                            <div class="form-group select">
                                <select name="name" class="form-control " id="">
                                    <option value="">select Product</option>
                                    <option value="">Meeting Rooms</option>
                                    <option value="">Podcast Rooms</option>
                                    <option value="">Visitor</option>
                                    <option value="">Office</option>
                                </select>
                                <span class="down-icon"><i class="fas fa-chevron-down"></i></span>
                            </div>
                        </div>
                        <div class="box-footer text-center">
                            <button class="layout-btn">Cancel</button>
                            <button class="layout-btn active">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- 2 -->
        <div class="col-md-8 tab-content" id="tab2">
            <div class="card">
                <div class="card-body px-5">
                    <div class="d-flex justify-content-center mb-2">
                        <h3>Booking Details</h3>
                    </div>
                    <form action="">
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <div class="d-flex gap-2">
                                <div class="form-group w-50">
                                    <label class="mb-1" for="date">Date</label>
                                    <input class="form-control" type="date" id="date" name="date" value="2024-05-04">
                                </div>
                                <div class="form-group w-50">
                                    <label class="mb-1" for="time">Time</label>
                                    <input class="form-control" type="time" id="time" name="time" value="12:00">
                                </div>
                            </div>
                        </div>
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <label class="mb-1" for="duration">Duration</label>
                            <div class="form-group select">
                                <select name="duration" class="form-control" id="duration">
                                    <option value="">Select Duration</option>
                                    <option value="">Daily</option>
                                    <option value="">Weekly</option>
                                    <option value="">Monthly</option>
                                </select>
                                <span class="down-icon"><i class="fas fa-chevron-down"></i></span>
                            </div>
                        </div>
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <div class="d-flex gap-2">
                                <div class="form-group w-50">
                                    <label class="mb-1" for="start-date">Start Date</label>
                                    <input class="form-control" type="date" id="start-date" name="start-date" value="2024-05-04">
                                </div>
                                <div class="form-group w-50">
                                    <label class="mb-1" for="end-date">End Date</label>
                                    <input class="form-control" type="date" id="end-date" name="end-date" value="2024-05-04">
                                </div>
                            </div>
                        </div>
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <div class="form-group">
                                <label class="mb-1" for="seat">Seat/Room</label>
                                <div class="form-group select">
                                    <select name="" class="form-control" id="">
                                        <option value="">Select Seat/Room</option>
                                    </select>
                                    <span class="down-icon"><i class="fas fa-chevron-down"></i></span>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <label class="mb-1" for="purpose">Purpose of Booking</label>
                            <div class="form-group">
                                <input class="form-control" type="text" id="purpose" name="purpose" placeholder="Purpose of Booking">
                            </div>
                        </div>
                        <div class="box-footer text-center">
                            <button class="layout-btn">Cancel</button>
                            <button class="layout-btn active">Submit</button>
                        </div>
                </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection