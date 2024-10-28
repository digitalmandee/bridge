@extends('admin.master')
@section('title', __('Members'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
            <div class="d-flex align-items-baseline gap-2">
                <a href="#"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
                <h3>Members</h3>
            </div>
        </div>
        <div class="d-flex align-items-center gap-2">
            <a href="#" class="text-dark"><i class="fa fa-download text-warning"></i> CSV</a>
            <a href="{{ route('admin.members.create') }}" class="layout-btn active">Add Members</a>
        </div>
    </div>
    <div class="d-flex justify-content-between align-items-baseline flex-wrap grid-margin">
        <div class="tab-list mb-3 col-md-8">
            <button class="main-btn ">Recent Active</button>
            <button class="main-btn">Current Active</button>
            <button class="main-btn active">Canceled</button>
            <button class="main-btn ">Unconfirmed</button>
        </div>
        <div class="d-flex align-items-">
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
    <div class="row card col-md-12">
        <table class="table table-responsive">
            <thead>
                <tr>
                    <th>Name/Company</th>
                    <th>Plan</th>
                    <th>Price</th>
                    <th>Payment Method</th>
                    <th class="text-center">Status</th>
                    <th class="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <img class="wd-30 ht-30 rounded-circle" src="{{ asset('adminPanel/images/favicon-1.png') }}"" alt=" profile">
                        Yasir/Bridge
                    </td>
                    <td>Free</td>
                    <td>0.00 USD</td>
                    <td>Paypall</td>
                    <td class="text-center">
                        <span class="label label-book">Confirmed</span>
                    </td>
                    <td class="text-center">
                        <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fa fa-ellipsis-v"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#">
                                <i class="fa fa-edit"></i>
                            </a>
                            <a class="dropdown-item text-danger" href="#">
                                <i class="fa fa-trash"></i>
                            </a>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <img class="wd-30 ht-30 rounded-circle" src="{{ asset('adminPanel/images/favicon-1.png') }}"" alt=" profile">
                        Yasir/Bridge
                    </td>
                    <td>Free</td>
                    <td>0.00 USD</td>
                    <td>Paypall</td>
                    <td class="text-center">
                        <span class="label label-cancel">Cancel</span>
                    </td>
                    <td class="text-center">
                        <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fa fa-ellipsis-v"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#">
                                <i class="fa fa-edit"></i>
                            </a>
                            <a class="dropdown-item text-danger" href="#">
                                <i class="fa fa-trash"></i>
                            </a>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <img class="wd-30 ht-30 rounded-circle" src="{{ asset('adminPanel/images/favicon-1.png') }}"" alt=" profile">
                        Yasir/Bridge
                    </td>
                    <td>Free</td>
                    <td>0.00 USD</td>
                    <td>Paypall</td>
                    <td class="text-center">
                        <span class="label label-pending">Pending</span>
                    </td>
                    <td class="text-center">
                        <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fa fa-ellipsis-v"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#">
                                <i class="fa fa-edit"></i>
                            </a>
                            <a class="dropdown-item text-danger" href="#">
                                <i class="fa fa-trash"></i>
                            </a>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="card shadow-sm mx-auto">
        <!-- SweetAlert trigger -->
        @if (session('success'))
        <script>
            // Show the Toast
            showToast('success', '{{ session('success') }}', '#d4edda');
        </script>
        @endif
    </div>
</div>
@endsection