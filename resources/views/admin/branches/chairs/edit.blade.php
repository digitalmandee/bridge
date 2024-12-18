@extends('admin.master')
@section('title', __('Update Chair'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div class="d-flex align-items-baseline gap-2">
            <a href="#"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
            <h3 class="mb-3 mb-md-0">Update Chair</h3>
        </div>
    </div>
    <div class="card shadow-sm mx-auto">
        <form action="{{ route('admin.branch.chair.update', $chair->id) }}" method="POST" class="card-body row">
            @csrf
            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Tables</label>
                <div class="form-group">
                    <select name="table_id" class="form-control">
                        <option selected disabled>Select One</option>
                        @foreach($tables as $table)
                        <option value="{{ $table->id }}" {{ $chair->table_id == $table->id ? 'selected' : '' }}>{{ $table->name }}</option>
                        @endforeach
                    </select>
                </div>
            </div>
            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Chair Name</label>
                <div class="form-group">
                    <input type="text" name="name" value="{{ $chair->name }}" class="form-control">
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