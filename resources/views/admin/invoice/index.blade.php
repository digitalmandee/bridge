@extends('admin.master')
@section('title', __('Invoice'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
            <div class="d-flex align-items-baseline gap-2">
                <h3>Invoice</h3>
            </div>
        </div>
        <div class="d-flex align-items-center gap-2">
            <a href="#" class="text-dark"><i class="fa fa-download text-warning"></i> CSV</a>
            <a href="{{ route('admin.invoice.create') }}" class="layout-btn active">Add Invoice</a>
        </div>
    </div>
    <div class="d-flex justify-content-between align-items-baseline flex-wrap grid-margin">
        <div class="tab-list mb-3 col-md-8">
            <button class="main-btn ">Unpaid & pending</button>
            <button class="main-btn">Written off</button>
            <button class="main-btn active">Paid</button>
            <button class="main-btn ">Not sent</button>
            <button class="main-btn ">sent</button>
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
                    <input type="text" class="form-srch w-100" id="navbarForm" placeholder="Search">
                </div>
            </form>
        </div>
    </div>
    <div class="row card col-md-12">
        <table class="table table-responsive">
            <thead>
                <tr>
                    <th class="text-center">ID</th>
                    <th class="text-center">Name/Company</th>
                    <th class="text-center">Issue Date</th>
                    <th class="text-center">Total Amount</th>
                    <th class="text-center">Send status</th>
                    <th class="text-center">Status</th>
                    <th class="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="text-center">
                        <a href="{{ route('admin.invoice.show') }}" class="text-dark">
                            00
                        </a>
                    </td>
                    <td class="text-center">
                        <img class="wd-30 ht-30 rounded-circle" src="{{ asset('adminPanel/images/favicon-1.png') }}"" alt=" profile">
                        Yasir/Bridge
                    </td>
                    <td class="text-center">00/00/000</td>
                    <td class="text-center">0.00 USD</td>

                    <td class="text-center">
                        <span class="label label-cancel">Not Sent</span>
                    </td>
                    <td class="text-center">
                        <div class="d-flex align-items-center justify-content-center gap-1">
                            <div class="round-1">
                                <i class="fa fa-close text-white"></i>
                            </div>
                            Unpaid
                        </div>
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
                    <td class="text-center">00</td>
                    <td class="text-center">
                        <img class="wd-30 ht-30 rounded-circle" src="{{ asset('adminPanel/images/favicon-1.png') }}"" alt=" profile">
                        Yasir/Bridge
                    </td>
                    <td class="text-center">00/00/000</td>
                    <td class="text-center">0.00 USD</td>

                    <td class="text-center">
                        <span class="label label-book">Sent</span>
                    </td>
                    <td class="text-center">
                        <div class="d-flex align-items-center justify-content-center gap-1">
                            <div class="round">
                                <i class="fa fa-check text-white"></i>
                            </div>
                            Paid
                        </div>
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