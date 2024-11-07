@extends('admin.master')
@section('title', __('Update Role'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3 class="mb-3 mb-md-0">Update Role</h3>
        </div>
    </div>
    <div class="card shadow-sm mx-auto">
        <form action="{{ route('admin.roles.update', $role->id) }}" method="POST" class="card-body row">
            @csrf
            <div class="row">
                <div class="col-6 col-md-12 col-xl-6 mb-2">
                    <label class="mb-1" for="name">Name</label>
                    <div class="form-group">
                        <input type="text" name="name" class="form-control" value="{{ $role->name }}">
                    </div>
                </div>
            </div>
            <div>
                <h3 class="m-3 mb-md-0">Permissions</h3>
            </div>

            <div class="col-12 mt-4 mb-2">
                @forelse ($permissions as $index => $item)
                @if ($index % 4 == 0)
                <div class="row">
                    @endif
                    <div class="col-6 col-md-4 col-lg-3 mb-3">
                        <div class="form-check">
                            <input type="checkbox" name="permissions[]" value="{{ $item->id }}" class="form-check-input"
                                id="permission-{{ $item->id }}"
                                @if(in_array($item->id, $assignedPermissions)) checked @endif>
                            <label class="form-check-label" for="permission-{{ $item->id }}">{{ $item->name }}</label>
                        </div>
                    </div>
                    @if (($index + 1) % 4 == 0 || $loop->last)
                </div> 
                @endif
                @empty
                <p>No Records Found</p>
                @endforelse
            </div>


            <div class="d-flex justify-content-center mt-4">
                <a href="{{ route('dashboard') }}" class="btn-secondary me-2">Cancel</a>
                <button type="submit" class="btn-success">Update</button>
            </div>
        </form>
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