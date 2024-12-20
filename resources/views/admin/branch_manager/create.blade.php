@extends('admin.master')
@section('title', __('Branch Manager Create'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
    <div class="d-flex align-items-baseline gap-2">
            <a href="{{ route('admin.branch.manager') }}"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
            <h3 class="mb-3 mb-md-0">Branch Manager Create</h3>
        </div>
    </div>
    <div class="card shadow-sm mx-auto">
        <form action="{{ route('admin.branch.manager.store') }}" method="POST" class="card-body row">
            @csrf
            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Name</label>
                <div class="form-group">
                    <input type="text" name="name" class="form-control" placeholder="Name">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Email</label>
                <div class="form-group">
                    <input type="text" name="email" class="form-control" placeholder="Email">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Password</label>
                <div class="form-group">
                    <input type="Password" name="password" class="form-control" placeholder="Password">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Address</label>
                <div class="form-group">
                    <input type="text" name="address" class="form-control" placeholder="Address">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Role</label>
                <div class="form-group">
                    <select name="role_id" class="form-control">
                        <option selected disabled>Select role</option>
                        @forelse ($roles as $role)
                        <option value="{{ $role->id }}">{{ ucwords(str_replace('_', ' ', $role->name)) }}</option>
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
                        <option value="{{ $branch->id }}">{{ $branch->name }}</option>
                        @empty
                        <p value="">No Records Found</p>
                        @endforelse
                    </select>
                </div>
            </div>
            <div class="col-6 col-md-12 col-xl-6 mb-2 d-flex gap-5">
                <label for="name">Status</label>
                <div class="checkbox-wrapper-3 form-group">
                    <input id="cbx-3" type="checkbox" name="status" value="1">
                    <label for="cbx-3" class="toggle"><span></span></label>
                </div>
            </div>
            <!-- Submit and Cancel Buttons -->
            <div class="d-flex justify-content-center mt-4">
                <button type="button" class="btn-secondary me-2">Cancel</button>
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