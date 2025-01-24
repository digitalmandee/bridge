@extends('admin.master')
@section('title', __('Edit Branch'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div class="d-flex align-items-baseline gap-2">
            <a href="{{ route('admin.branches') }}"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
            <h3 class="mb-3 mb-md-0">Edit Branch</h3>
        </div>
    </div>
    <div class="card shadow-sm mx-auto">
        <form action="{{ route('admin.branch.update', $branch->id) }}" method="POST" class="card-body row">
            @csrf
            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Branch Name</label>
                <div class="form-group">
                    <input type="text" name="name" value="{{ $branch->name }}" class="form-control">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Branch Location</label>
                <div class="form-group">
                    <input type="text" name="location" value="{{ $branch->location }}" class="form-control">
                </div>
            </div>
            <div class="col-6 col-md-12 col-xl-6 mb-2 d-flex align-items-end gap-5">
                <label for="name">Status</label>
                <div class="checkbox-wrapper-3 form-group">
                    <input id="cbx-3" type="checkbox" name="status" value="1" {{ $branch->status == 1 ? 'checked' : '' }}>
                    <label for="cbx-3" class="toggle"><span></span></label>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-4">
                <a href="{{ route('dashboard') }}" class="btn-secondary me-2">Cancel</a>
                <button type="submit" class="btn-success">Update</button>
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