@extends('admin.master')
@section('title', __('Tables'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3>Tables</h3>
        </div>
        <a href="{{ route('admin.branch.table.create') }}" class="layout-btn active">Add Table</a>
    </div>
    <div class="row card col-md-12">
        <table class="table table-responsive">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Room Name</th>
                    <th>Name</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse($tables as $table)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $table->room->name }}</td>
                    <td>{{ $table->name }}</td>
                    <td class="text-center">
                        <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                            <i class="fa fa-ellipsis-v"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="{{ route('admin.branch.table.edit', $table->id) }}">
                                <i class="fa fa-edit"></i>
                            </a>
                            <a class="dropdown-item text-danger"
                                href="{{ route('admin.branch.table.delete', $table->id) }}">
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