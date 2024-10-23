@extends('admin.master')
@section('title', __('Branches'))
@section('content')
    <div class="page-content">
        <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
            <div>
                <h3>Branches</h3>
            </div>
            <a href="{{ route('admin.branches.create') }}" class="layout-btn active">Add Branch</a>
        </div>
        <div class="row card col-md-12">
            <table class="table table-responsive">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @php($sl = 1)
                    @forelse ($branches as $branch)
                        <tr>
                            <td>{{ $sl++ }}</td>
                            <td>{{ $branch->name }}</td>
                            <td>{{ $branch->location }}</td>
                            <td>{{ $branch->status == 1 ? 'Active' : 'Inactive' }}</td>
                            <td class="text-center">
                                <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="false">
                                    <i class="fa fa-ellipsis-v"></i>
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item" href="{{ route('admin.branch.edit', $branch->id) }}">
                                        <i class="fa fa-edit"></i>
                                    </a>

                                    <a class="dropdown-item text-danger"
                                        href="{{ route('admin.branch.delete', $branch->id) }}">
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
