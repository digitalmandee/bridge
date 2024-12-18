@extends('admin.master')
@section('title', __('Branch Manager Edit'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
    <div class="d-flex align-items-baseline gap-2">
            <a href="{{ route('admin.branch.manager') }}"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
            <h3 class="mb-3 mb-md-0">Edit Branch Manager </h3>
        </div>
    </div>
    <div class="card shadow-sm mx-auto">
        <form method="POST" action="{{ route('admin.branch.manager.update', $branchManager->id) }}" class="card-body row">
            @csrf
            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Name</label>
                <div class="form-group">
                    <input type="text" name="name" value="{{ $branchManager->name }}" class="form-control">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Email</label>
                <div class="form-group">
                    <input type="text" name="email" value="{{ $branchManager->user->email }}" class="form-control">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Address</label>
                <div class="form-group">
                    <input type="text" name="address" value="{{ $branchManager->address }}" class="form-control">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Role</label>
                <div class="form-group">
                    <select name="role_id" class="form-control">
                        <option selected disabled>Select role</option>
                        @forelse ($roles as $role)
                        <option value="{{ $role->id }}"
                            {{$branchManager->user->roles->pluck('id')->implode(', ') == $role->id ? 'selected' : ''}}>
                            {{ ucwords(str_replace('_', ' ', $role->name)) }}
                        </option>
                        @empty
                        <p value="">No Records Found</p>
                        @endforelse
                    </select>
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Branches</label>
                <div class="form-group">
                    <select name="branch_id" class="form-control">
                        <option selected disabled>Select branch</option>
                        @forelse ($branches as $branch)
                        <option value="{{ $branch->id }}"
                            {{$branchManager->branch->id == $branch->id ? 'selected' : ''}}>
                            {{ $branch->name }}
                        </option>
                        @empty
                        <p value="">No Records Found</p>
                        @endforelse
                    </select>
                </div>
            </div>
            <div class="col-6 col-md-12 col-xl-6 mb-2 d-flex gap-5 align-items-end">
                <label for="name">Status</label>
                <div class="form-group">
                    <div class="checkbox-wrapper-3">
                        <input id="cbx-3" type="checkbox" name="status" value="1" {{ $branchManager->status == 1 ? 'checked' : '' }} style="margin-top: 6px;">
                        <label for="cbx-3" class="toggle"><span></span></label>
                    </div>
                </div>
            </div>
            <!-- Submit and Cancel Buttons -->
            <div class="d-flex justify-content-center mt-4">
                <button type="button" class="btn-secondary me-2">Cancel</button>
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