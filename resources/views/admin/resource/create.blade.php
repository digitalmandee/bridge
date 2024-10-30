@extends('admin.master')
@section('title', __('Add Resource'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div class="d-flex align-items-baseline gap-2">
            <a href="{{ route('admin.resource') }}"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
            <h3 class="mb-3 mb-md-0">Add Resource</h3>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="tab-list mb-3 col-md-8">
            <button class="main-btn tab active" data-tab="tab1">Basic Setting</button>
            <button class="main-btn tab" data-tab="tab2">Availability</button>
            <button class="main-btn tab" data-tab="tab3">Pricing</button>
            <button class="main-btn tab" data-tab="tab4">Cancellation</button>
            <button class="main-btn tab" data-tab="tab5">Settings (Members)</button>
        </div>
        <!-- 1 -->
        <div class="col-md-8 tab-content active" id="tab1">
            <div class="card">
                <div class="card-body px-5">
                    <form action="">
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <label class="mb-1" for="name">Name</label>
                            <div class="form-group">
                                <input type="text" name="name" class="form-control" placeholder="Name">
                            </div>
                        </div>
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <div class="form-group upload-container">
                                <input type="file" id="fileInput" class="file-input d-none" />
                                <label for="fileInput" class="upload-label d-flex flex-column align-items-center cursor-pointer">
                                    <img src="{{ asset('icons/uplod.svg') }}" alt="Upload Icon">
                                    <p>Choose a file or drag & drop it here</p>
                                    <small class="text-secondary mb-2">JPEG, PNG, GIF formats</small>
                                    <button class="layout-btn active">Browse File</button>
                                </label>
                            </div>
                        </div>
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <label class="mb-1" for="phone">Capacity</label>
                            <div class="form-group">
                                <input type="number" class="form-control" min="1" oninput="validateTotalMembers(this)" value="6">
                            </div>
                            <div class="d-flex justify-content-center gap-7">
                                <small class="text-secondary">How many of this resource do you
                                    have?</small>
                                <small class="text-secondary">How many people can use this resource
                                    together?</small>
                            </div>
                        </div>
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <label class="mb-1" for="product">Description</label>
                            <div class="form-group">
                                <textarea name="address" class="form-control" id="" cols="30" rows=""></textarea>
                            </div>
                        </div>
                        <div class="box-footer text-center">
                            <button type="submit" class="layout-btn active">Next</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- 2 -->
        <div class="col-md-8 tab-content" id="tab2">
            <div class="card">
                <div class="card-body px-5">
                    <form action="">
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <div class="booking-container d-flex gap-2">
                                <div class="booking-input w-50">
                                    <label for="min-duration">Minimum Booking Duration</label>
                                    <div class="input-box form-control">
                                        <input id="min-hours" type="number" min="0" value="1">
                                        <span class="mx-5">0</span>
                                        <span class="mx-4">H</span>
                                    </div>
                                </div>
                                <div class="booking-input w-50">
                                    <label for="max-duration">Maximum Booking Duration</label>
                                    <div class="input-box form-control">
                                        <input id="max-hours" type="number" min="0" value="2">
                                        <span class="mx-5">0</span>
                                        <span class="mx-4">H</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <div class="form-group">
                                <label class="mb-1" for="start-date">Available Booking Time</label>
                                <input class="form-control" type="">
                            </div>
                            <small class="text-secondary">E.g. For Monday through Friday, 9am to 5pm, enter 'mo - fr 9am - 5pm'.
                                To make the resource always available, enter 24/7.</small>
                        </div>
                        <div class="col-6 col-md-12 col-xl-12 mb-2">
                            <div class="form-group">
                                <label class="mb-1" for="end-date">Booking Cutoff</label>
                                <div class="input-box form-control">
                                    <input id="max-hours" type="number" min="0" value="2">
                                    <span class="mx-4">H</span>
                                </div>
                                <small class="text-secondary">A booking may be made up until this many hours before it starts.</small>
                            </div>
                        </div>
                        <div class="box-footer text-center">
                            <button type="submit" class="layout-btn active">Next</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- 3 -->
        <div class="col-md-8 tab-content" id="tab3">
            <div class="card">
                <div class="card-body">
                    Pricing
                </div>
            </div>
        </div>
        <!-- 4 -->
        <div class="col-md-8 tab-content" id="tab4">
            <div class="card">
                <div class="card-body">
                    Cancellation
                </div>
            </div>
        </div>
        <!-- 5 -->
        <div class="col-md-8 tab-content" id="tab5">
            <div class="card">
                <div class="card-body">
                    Settings (Members)
                </div>
            </div>
        </div>

    </div>
    <!-- SweetAlert trigger -->
    @if (session('error'))
    <script>
        showToast('error', '{{ session('error') }}', '#f8d7da');
    </script>
    @endif
</div>
@endsection