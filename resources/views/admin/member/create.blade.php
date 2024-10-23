@extends('admin.master')
@section('title', __('Create Member'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3 class="mb-3 mb-md-0">Create Member</h3>
        </div>
    </div>
    <div class="card shadow-sm mx-auto">
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