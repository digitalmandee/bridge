@extends('admin.master')
@section('title', __('Investor Create'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
    <div class="d-flex align-items-baseline gap-2">
            <a href="{{ route('admin.investor') }}"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
            <h3 class="mb-3 mb-md-0">Investor Create</h3>
        </div>
    </div>
    <div class="card shadow-sm mx-auto">
        <form action="{{ route('admin.investor.store') }}" method="POST" class="card-body row">
            @csrf
            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Name</label>
                <div class="form-group">
                    <input type="text" name="name" class="form-control" placeholder="Name">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Email</label>
                <div class="form-group">
                    <input type="text" name="email" class="form-control" placeholder="Email">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Address</label>
                <div class="form-group">
                    <input type="text" name="address" class="form-control" placeholder="Address">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Phone</label>
                <div class="form-group">
                    <input type="text" name="phone" class="form-control" placeholder="+92">
                </div>
            </div>
            
            <!-- Submit and Cancel Buttons -->
            <div class="d-flex justify-content-center mt-4">
                <button type="button" class="btn-secondary me-2">Cancel</button>
                <button type="submit" class="btn-success">Submit</button>
            </div>
        </form>
        <!-- SweetAlert trigger -->
        @if (session('error'))
        <script>
            showToast('error', '{{ session('error') }}', '#f8d7da');
        </script>
        @endif
    </div>
</div>
@endsection