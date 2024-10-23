@extends('admin.master')
@section('title', __('Branch Manager'))
@section('content')
    <div class="page-content">
        <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
            <div>
                <h3>Branch Manager</h3>
            </div>
            <a href="{{ route('admin.branch.manager.create') }}" class="layout-btn">Add Branch Manager</a>
        </div>
        <div class="row card col-md-12">
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
                        <th class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @php($sl = 1)
                    @forelse ($branchManagers as $item)
                        <tr>
                            <td>{{ $sl++ }}</td>
                            <td>{{ $item->name }}</td>
                            <td>{{ $item->email }}</td>
                            <td>{{ $item->address }}</td>
                            <td>{{ ucwords(str_replace('_', ' ', $item->roles->pluck('name')->implode(', '))) }}</td>
                            <td>{{ $item->branch->name }}</td>
                            <td>{{ $item->status == 1 ? 'Active' : 'Inactive' }}</td>
                            <td class="text-center">
                                <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="false">
                                    <i class="fa fa-ellipsis-v"></i>
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item" href="{{ route('admin.branch.manager.edit', $item->id) }}">
                                        <i class="fa fa-edit"></i>
                                    </a>
                                    <a class="dropdown-item text-danger" href="{{ route('admin.branch.manager.delete', $item->id) }}">
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
