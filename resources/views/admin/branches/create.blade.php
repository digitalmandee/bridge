@extends('admin.master')
@section('title', __('Create Branch'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3 class="mb-3 mb-md-0">Create Branch</h3>
        </div>
    </div>
    <div class="card shadow-sm mx-auto">
        <form action="{{ route('admin.branch.store') }}" method="POST" class="card-body row">
            @csrf
            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Branch Name</label>
                <div class="form-group">
                    <input type="text" name="name" class="form-control" placeholder="Branch Name">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Branch Location</label>
                <div class="form-group">
                    <input type="text" name="location" class="form-control" placeholder="Branch Location">
                </div>
            </div>
            <div class="col-6 col-md-12 col-xl-6 mb-2 d-flex align-items-end gap-5">
                <label for="name">Status</label>
                <div class="checkbox-wrapper-3 form-group">
                    <input type="checkbox" id="cbx-3" name="status" value="1">
                    <label for="cbx-3" class="toggle"><span></span></label>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-4">
                <a href="{{ route('dashboard') }}" class="btn-secondary me-2">Cancel</a>
                <button type="submit" class="btn-success">Submit</button>
            </div>
        </form>
        <!-- SweetAlert trigger -->
        @if (session('error'))
        <script>
            showToast('error', '{{ session('
                error ') }}', '#f8d7da');
        </script>
        @endif
    </div>
</div>
@endsection