@extends('admin.master')
@section('title', __('Branch Manager'))
@section('content')
    <div class="page-content">
        <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
            <div>
                <h3 class="mb-3 mb-md-0">Branch Manager</h3>
            </div>
            <a href="{{ route('admin.branch.manager.create') }}" class="btn btn-info">Add Branch Manager</a>
        </div>
        <div class="row col-md-12">
            <table class="table table-responsive">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Role</th>
                        <th>Branch</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {{-- @php($sl = 1)
                    @forelse ($branches as $branch)
                        <tr>
                            <td>{{ $sl++ }}</td>
                            <td>{{ $branch->name }}</td>
                            <td>{{ $branch->location }}</td>
                            <td>{{ $branch->status == 1 ? 'Active' : 'Inactive' }}</td>
                            <td>
                                <a href="{{ route('admin.branch.edit', $branch->id) }}">Edit</a>
                                <a href="{{ route('admin.branch.delete', $branch->id) }}">Delete</a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center">No records found</td>
                        </tr>
                    @endforelse --}}
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
