@extends('admin.master')
@section('title', __('Create Permission'))
@section('content')
    <div class="page-content">
        <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
            <div>
                <h3 class="mb-3 mb-md-0">Create Permission</h3>
            </div>
        </div>
        <div class="card shadow-sm mx-auto">
            <form action="{{ route('admin.permissions.store') }}" method="POST" class="card-body row">
                @csrf
                <div class="col-6 col-md-12 col-xl-6 mb-2">
                    <label class="mb-1" for="name">Name</label>
                    <div class="form-group">
                        <input type="text" name="name" class="form-control" placeholder="Permission Name">
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
                    showToast('error', '{{ session('error') }}', '#f8d7da');
                </script>
            @endif
        </div>
    </div>
@endsection
