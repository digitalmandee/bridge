@extends('admin.master')
@section('title', __('Booking Calendar'))
@section('content')
    <div class="page-content">
        <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
            <div>
                <h3 class="mb-3 mb-md-0">Booking Calendar</h3>
            </div>
            <a href="{{ route('admin.booking.create') }}" class="layout-btn active">New Booking</a>
        </div>
    </div>
@endsection
