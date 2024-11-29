@extends('admin.master')
@section('title', __('Rooms'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3>Rooms</h3>
        </div>
        <a href="{{ route('admin.branch.room.create') }}" class="layout-btn active">Add Room</a>
    </div>
    <div class="row card col-md-12">
        <table class="table table-responsive">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Branch Name</th>
                    <th>Floor Name</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse($rooms as $room)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $room->floor->branch->name }}</td>
                    <td>{{ $room->floor->name }}</td>
                    <td>{{ $room->name }}</td>
                    <td>{{ $room->type }}</td>
                    <td class="text-center">
                        <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                            <i class="fa fa-ellipsis-v"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="{{ route('admin.branch.room.edit', $room->id) }}">
                                <i class="fa fa-edit"></i>
                            </a>
                            <a class="dropdown-item text-danger"
                                href="{{ route('admin.branch.room.delete', $room->id) }}">
                                <i class="fa fa-trash"></i>
                            </a>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="text-center">No records found</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <div class="card shadow-sm mx-auto">
        <!-- SweetAlert trigger -->
        @if (session('success'))
        <script>
            // Show the Toast
            showToast('success', '{{ session('success') }}', '#d4edda');
        </script>
        @endif
    </div>
</div>
@endsection