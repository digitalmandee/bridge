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
        <div class="col-12">
            <div class="card p-4">
                <div class="mb-3">
                    <h4>Overall Inventory</h4>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <!-- Categories -->
                    <div class="inventory-item">
                        <h6 class="inventory-heading text-primary">Categories</h6>
                        <h2 class="inventory-value">14</h2>
                        <small class="inventory-subtext">Last 7 days</small>
                    </div>
                    <div class="divider"></div>
                    <!-- Total Products -->
                    <div class="inventory-item">
                        <h6 class="inventory-heading text-warning">Total Products</h6>
                        <div class="inventory-content">
                            <div class="inventory-column">
                                <h2 class="inventory-value">868</h2>
                                <small class="inventory-subtext">Last 7 days</small>
                            </div>
                            <div class="inventory-column">
                                <h2 class="inventory-value">₹25000</h2>
                                <small class="inventory-subtext">Revenue</small>
                            </div>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <!-- Top Selling -->
                    <div class="inventory-item">
                        <h6 class="inventory-heading text-success">Top Selling</h6>
                        <div class="inventory-content">
                            <div class="inventory-column">
                                <h2 class="inventory-value">868</h2>
                                <small class="inventory-subtext">Last 7 days</small>
                            </div>
                            <div class="inventory-column">
                                <h2 class="inventory-value">₹25000</h2>
                                <small class="inventory-subtext">Cost</small>
                            </div>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <!-- Low Stocks -->
                    <div class="inventory-item">
                        <h6 class="inventory-heading text-danger">Low Stocks</h6>
                        <div class="inventory-content">
                            <div class="inventory-column">
                                <h2 class="inventory-value">8</h2>
                                <small class="inventory-subtext">Ordered</small>
                            </div>
                            <div class="inventory-column">
                                <h2 class="inventory-value">2</h2>
                                <small class="inventory-subtext">Not in stock</small>
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
            <div class="d-flex gap-2">
                <button class="floor-btn" role="button">Add Product</button>
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
                    <th>Amount</th>
                    <th class="text-center">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="fw-semibold">#5644</td>
                    <td>Printer</td>
                    <td>37</td>
                    <td>Floor 3, Room1</td>
                    <td>$555</td>
                    <td class="text-center">
                        <span class="label label-book">Working</span>
                    </td>
                </tr>
                <tr>
                    <td class="fw-semibold">#5644</td>
                    <td>Printer</td>
                    <td>37</td>
                    <td>Floor 3, Room1</td>
                    <td>$555</td>
                    <td class="text-center">
                        <span class="label label-cancel">Out Of stock</span>
                    </td>
                </tr>
                <tr>
                    <td class="fw-semibold">#5644</td>
                    <td>Printer</td>
                    <td>37</td>
                    <td>Floor 3, Room1</td>
                    <td>$555</td>
                    <td class="text-center">
                        <span class="label label-cancel">Damaged</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
@endsection