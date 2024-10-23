@extends('admin.master')
@section('title', __('Dashboard'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3>Dashboard</h3>
        </div>
        <div>
            <a href="{{ route('admin.booking.create') }}" class="layout-btn active">Create Booking</a>
        </div>
    </div>
    <div class="row">
        <div class="col-12 col-xl-12 stretch-card">
            <div class="row flex-grow-1">
                <div class="col-md-3 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="card-title mb-0">Total Income</h6>
                                <div class="income-icon">
                                    <img src="{{ asset('icons/person.svg') }}" alt="Income Icon">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6 col-md-12 col-xl-12">
                                    <h3 class="mb-2">6,784</h3>
                                    <a href="{{ route('admin.members') }}" class="manage-link">Manage Members</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="card-title mb-0">Total Expense</h6>
                                <div class="income-icon">
                                    <img src="{{ asset('icons/expense.svg') }}" alt="expense Icon">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6 col-md-12 col-xl-12">
                                    <h3 class="mb-2">1,920</h3>
                                    <a href="{{ route('admin.invoice') }}" class="manage-link">Setup Invoice</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="card-title mb-0">Total Sales</h6>
                                <div class="income-icon">
                                    <img src="{{ asset('icons/sale.svg') }}" alt="Sales Icon">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6 col-md-12 col-xl-12">
                                    <h3 class="mb-2">$4,920</h3>
                                    <a href="#" class="manage-link">Add Resources</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 grid-margin stretch-card">
                    <div class="card rounded-2">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="card-title mb-0">Issues</h6>
                                <div class="income-icon">
                                    <img src="{{ asset('icons/issue.svg') }}" alt="Issues Icon">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6 col-md-12 col-xl-12">
                                    <h3 class="mb-2">320</h3>
                                    <a href="#" class="manage-link">Create Guide</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12 col-xl-12 stretch-card">
            <div class="row flex-grow-1">

                <div class="col-md-8 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                            <!-- Title and Buttons Section -->
                            <div class="d-flex justify-content-between align-items-baseline">
                                <div class="title-card">
                                    <h3 class="mb-md-2">Revenue</h3>
                                    <h6 class="card-title mb-0">Your Revenue This Year</h6>
                                </div>
                                <div class="card-button">
                                    <button type="button" class="btn-toggle active">Monthly</button>
                                    <button type="button" class="btn-toggle">Quarterly</button>
                                    <button type="button" class="btn-toggle">Biannually</button>
                                    <button type="button" class="btn-toggle">Annually</button>
                                </div>
                            </div>

                            <!-- Inner Cards Section -->
                            <div class="d-flex justify-content-between align-items-baseline mb-4 mt-4">
                                <!-- First Inner Card -->
                                <div class="inner-card">
                                    <div class="d-flex justify-content-between align-items-end gap-2">
                                        <div class="d-flex align-items-center">
                                            <!-- Icon Placeholder -->
                                            <div class="income-icon me-3">
                                                <img src="{{ asset('icons/income.svg') }}" alt="Income Icon">
                                            </div>

                                            <!-- Title and Amount -->
                                            <div class="income-amount">
                                                <h6 class="card-title mb-0">Income</h6>
                                                <h2>$26,000</h2>
                                            </div>
                                        </div>
                                        <!-- Growth Percentage -->
                                        <div class="d-flex align-items-center">
                                            <span class="growth-percentage ">10%</span>
                                            <span class="growth-arrow text-success ms-1">&#9650;</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Second Inner Card -->
                                <div class="inner-card">
                                    <div class="d-flex justify-content-between align-items-end gap-2">
                                        <div class="d-flex align-items-center">
                                            <!-- Icon Placeholder -->
                                            <div class="income-icon me-3">
                                                <img src="{{ asset('icons/icome1.svg') }}" alt="Income Icon">
                                            </div>
                                            <!-- Title and Amount -->
                                            <div class="income-amount">
                                                <h6 class="card-title mb-0">Expenses</h6>
                                                <h2>$15,000</h2>
                                            </div>
                                        </div>
                                        <!-- Growth Percentage -->
                                        <div class="d-flex align-items-center">
                                            <span class="growth-percentage text-danger">8%</span>
                                            <span class="growth-arrow text-danger ms-1">&#9660;</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Third Inner Card -->
                                <div class="inner-card">
                                    <div class="d-flex justify-content-between align-items-end gap-2">
                                        <div class="d-flex align-items-center">
                                            <!-- Icon Placeholder -->
                                            <div class="income-icon me-3">
                                                <img src="{{ asset('icons/profit.svg') }}" alt="Income Icon">
                                            </div>
                                            <!-- Title and Amount -->
                                            <div class="income-amount">
                                                <h6 class="card-title mb-0">Profit</h6>
                                                <h2>$10,000</h2>
                                            </div>
                                        </div>
                                        <!-- Growth Percentage -->
                                        <div class="d-flex align-items-center">
                                            <span class="growth-percentage text-danger">5%</span>
                                            <span class="growth-arrow text-danger ms-1">&#9660;</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Chart Container -->
                            <canvas id="expense-chart1"></canvas>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-baseline">
                                <h3 class="mb-2">All Booking</h3>
                            </div>
                            <div class="row">
                                <div class="col-6 col-md-12 col-xl-8">
                                    <h6 class="card-title mb-0">Based On Status</h6>
                                </div>
                            </div>

                            <!-- Venn Diagram Section -->
                            <div class="venn-diagram">
                                <div class="circle yellow">
                                    <span>58.33%</span>
                                </div>
                                <div class="circle teal">
                                    <span>25%</span>
                                </div>
                                <div class="circle red">
                                    <span>8%</span>
                                </div>
                            </div>

                            <!-- Legend -->
                            <div class="legend">
                                <div class="legend-item">
                                    <span class="circle-1 yellow"></span>
                                    <div class="d-flex justify-content-between w-100">
                                        <div class="legend-item-text">
                                            Booked
                                        </div>
                                        <div class="legend-item-no">
                                            <span>1,400</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="legend-item">
                                    <span class="circle-1 teal"></span>
                                    <div class="d-flex justify-content-between w-100">
                                        <div class="legend-item-text">
                                            Pending
                                        </div>
                                        <div class="legend-item-no">
                                            <span>1,400</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="legend-item">
                                    <span class="circle-1 red"></span>
                                    <div class="d-flex justify-content-between w-100">
                                        <div class="legend-item-text">
                                            Cancel
                                        </div>
                                        <div class="legend-item-no">
                                            <span>1,400</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
@endsection