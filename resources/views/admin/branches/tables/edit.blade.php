@extends('admin.master')
@section('title', __('Update Table'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div class="d-flex align-items-baseline gap-2">
            <a href="{{ route('admin.branch.table') }}"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
            <h3 class="mb-3 mb-md-0">Update Table</h3>
        </div>
    </div>
    <div class="card shadow-sm mx-auto">
        <form action="{{ route('admin.branch.table.update', $table->id) }}" method="POST" class="card-body row">
            @csrf
            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Rooms</label>
                <div class="form-group" class="form-control">
                    <select name="room_id" class="form-control">
                        <option selected disabled>Select One</option>
                        @foreach($rooms as $room)
                        <option value="{{ $room->id }}" {{ $table->room_id == $room->id ? 'selected' : '' }}>{{ $room->name }}</option>
                        @endforeach
                    </select>
                </div>
            </div>
            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Table Name</label>
                <div class="form-group">
                    <input type="text" name="name" value="{{ $table->name }}" class="form-control">
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