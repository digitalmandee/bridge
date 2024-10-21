@extends('admin.master')
@section('title', __('Floor Plans'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3>Floor Plans</h3>
        </div>
    </div>
    <div class="row">
        <div class="col-12 col-xl-12 stretch-card">
            <div class="row flex-grow-1">
                <div class="col-md-3 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="label-title">2 Deals</span>
                                <div>
                                    <i class="fa fa-ellipsis-v"></i>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h6 class="card-title mb-0">Single sharing</h6>
                            </div>
                            <div class="row">
                                <div class="col-6 col-md-12 col-xl-12">
                                    <div class="d-flex  align-items-baseline gap-1">
                                        <h3>2</h3>
                                        <span class="card-title mb-0">/10</span>
                                    </div>
                                    <div class="d-flex  align-items-baseline gap-1">
                                        <h3 class="manage-link fw-semibold fs-4">Pkr 568</h3>
                                        <span class="card-title mb-0">/ Day</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="label-title">2 Deals</span>
                                <div>
                                    <i class="fa fa-ellipsis-v"></i>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h6 class="card-title mb-0">Double sharing</h6>
                            </div>
                            <div class="row">
                                <div class="col-6 col-md-12 col-xl-12">
                                    <div class="d-flex  align-items-baseline gap-1">
                                        <h3>2</h3>
                                        <span class="card-title mb-0">/10</span>
                                    </div>
                                    <div class="d-flex  align-items-baseline gap-1">
                                        <h3 class="manage-link fw-semibold fs-4">Pkr 568</h3>
                                        <span class="card-title mb-0">/ Day</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-end align-items-center mb-2">
                                <div>
                                    <i class="fa fa-ellipsis-v"></i>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h6 class="card-title mb-0">Triple sharing</h6>
                            </div>
                            <div class="row">
                                <div class="col-6 col-md-12 col-xl-12">
                                    <div class="d-flex  align-items-baseline gap-1">
                                        <h3>2</h3>
                                        <span class="card-title mb-0">/10</span>
                                    </div>
                                    <div class="d-flex  align-items-baseline gap-1">
                                        <h3 class="manage-link fw-semibold fs-4">Pkr 568</h3>
                                        <span class="card-title mb-0">/ Day</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-end align-items-center mb-2">
                                <div>
                                    <i class="fa fa-ellipsis-v"></i>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h6 class="card-title mb-0">Vip Suit</h6>
                            </div>
                            <div class="row">
                                <div class="col-6 col-md-12 col-xl-12">
                                    <div class="d-flex  align-items-baseline gap-1">
                                        <h3>2</h3>
                                        <span class="card-title mb-0">/10</span>
                                    </div>
                                    <div class="d-flex  align-items-baseline gap-1">
                                        <h3 class="manage-link fw-semibold fs-4">Pkr 568</h3>
                                        <span class="card-title mb-0">/ Day</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="card col-md-12 col-xl-12">
        <div class="mt-2  ms-2 me-2 d-flex justify-content-between align-items-center flex-wrap grid-margin">
            <div class="d-flex gap-2">
                <button class="floor-btn" role="button">Check in</button>
                <button class="floor-btn" role="button">Check out</button>
            </div>
            <div class="d-flex gap-2">
                <button class="floor-btn" role="button">
                    <i class="fa fa-filter"></i> Filter
                </button>
                <form class="search-form">
                    <div class="input-group flex-nowrap w-100">
                        <div class="input-group-text me-2" style="background: transparent!important; border:0;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <input type="text" class="form-srch w-100" id="navbarForm" placeholder="Search By Room Number">
                    </div>
                </form>
            </div>
        </div>
        <table class="table table-responsive">
            <thead>
                <tr>
                    <th>Reservation ID</th>
                    <th>Name</th>
                    <th>Room Number</th>
                    <th>Total Amount</th>
                    <th>Amount Paid</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>
</div>
@endsection