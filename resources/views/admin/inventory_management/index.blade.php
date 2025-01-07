@extends('admin.master')
@section('title', __('Inventory Management'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3>Inventory Management</h3>
        </div>
    </div>
    <div class="row grid-margin">
        <div class="col-12 col-xl-12 stretch-card">
            <div class="row flex-grow-1">
                <div class="col-md-3 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="card-title mb-0">Total Inventories</h6>
                                <div class="icon-shape">
                                    <img src="{{ asset('icons/Inventories.svg') }}" alt="Income Icon">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6 col-md-12 col-xl-12">
                                    <h3 class="mb-2">50</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="card-title mb-0">On hand Inventory</h6>
                                <div class="icon-shape">
                                    <img src="{{ asset('icons/Inventory_Management.svg') }}" alt="expense Icon">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6 col-md-12 col-xl-12">
                                    <h3 class="mb-2">42</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 grid-margin stretch-card">
                    <div class="card">
                        <div class="card-body-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="card-title mb-0">In Stock</h6>
                                <div class="icon-shape">
                                    <img src="{{ asset('icons/Stock.svg') }}" alt="Sales Icon">
                                </div>
                            </div>
                            <div class="col-6 col-md-12 col-xl-12">
                                <h3>09</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 grid-margin stretch-card">
                    <div class="card rounded-2">
                        <div class="card-body-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="card-title mb-0">Out Of Stock</h6>
                                <div class="icon-shape">
                                    <img src="{{ asset('icons/resources.svg') }}" alt="Issues Icon">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6 col-md-12 col-xl-12">
                                    <h3 class="mb-2">06</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="card col-md-12 col-xl-12">
        <div class="mt-2  ms-2 me-2 d-flex justify-content-between align-items-center flex-wrap mb-2">
            <div class="d-flex gap-2">
                <h4>Product</h4>
            </div>
            <div class="d-flex align-items-center gap-2">
            <a href="#" class="text-dark"><i class="fa fa-download text-warning floor-btn"></i> </a>
                <a href="{{ route('admin.inventory.create') }}" class="floor-btn" role="button">Add Inventory</a>
                <button class="floor-btn" role="button">
                    <i class="fa fa-filter me-2"></i> Filter
                </button>
                <button class="floor-btn" role="button">Download All</button>
            </div>
        </div>
        <table class="table table-responsive">
            <thead>
                <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Location</th>
                    <th class="text-center">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="fw-semibold">#5644</td>
                    <td>Printer</td>
                    <td>37</td>
                    <td>Floor 3, Room1</td>
                    <td class="text-center">
                        <span class="label label-book">Working</span>
                    </td>
                </tr>
                <tr>
                    <td class="fw-semibold">#5644</td>
                    <td>Printer</td>
                    <td>37</td>
                    <td>Floor 3, Room1</td>
                    <td class="text-center">
                        <span class="label label-cancel">Out Of stock</span>
                    </td>
                </tr>
                <tr>
                    <td class="fw-semibold">#5644</td>
                    <td>Printer</td>
                    <td>37</td>
                    <td>Floor 3, Room1</td>
                    <td class="text-center">
                        <span class="label label-cancel">Damaged</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
@endsection