@extends('admin.master')
@section('title', __('Create Invoice'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div class="d-flex align-items-baseline gap-2">
            <a href="{{ route('admin.invoice') }}"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
            <h3 class="mb-3 mb-md-0">Create Invoice</h3>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="card col-6 col-md-12 col-xl-6">
            <form action="#" method="POST" class="card-body">
               
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Issue Date</label>
                    <div class="form-group">
                        <input type="date" name="name" class="form-control" value="2024-05-04">
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Company</label>
                    <div class="form-group">
                        <input type="text" name="company" class="form-control" placeholder="Company">
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Address</label>
                    <div class="form-group">
                        <textarea name="address" class="form-control" id="" cols="30" rows="" placeholder="Enter address.."></textarea>
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Billing Mail</label>
                    <div class="form-group">
                        <input type="tel" name="email" class="form-control" placeholder="Eg @gmail.com">
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Tax ID</label>
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="Tax ID">
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Tax Rate</label>
                    <div class="form-group">
                        <input type="number" class="form-control" min="1"
                        oninput="validateTotalMembers(this)" placeholder="Tax Rate" value="0">
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 my-3">
                    <div class="form-group d-flex justify-content-center form-control rounded-pill lh-lg" style="border:dotted;">
                            Add Item
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Invoice Text</label>
                    <div class="form-group">
                        <textarea name="address" class="form-control" id="" cols="30" rows=""></textarea>
                    </div>
                </div><div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Notes (Only visible to admins)</label>
                    <div class="form-group">
                        <textarea name="address" class="form-control" id="" cols="30" rows="" ></textarea>
                    </div>
                </div>
                <div class="box-footer text-center">
                    <button class="layout-btn active">Save Invoice</button>
                </div>
            </form>
        </div>
    </div>
    <!-- SweetAlert trigger -->
    @if (session('error'))
    <script>
        showToast('error', '{{ session('error ') }}', '#f8d7da');
    </script>
    @endif
</div>
@endsection