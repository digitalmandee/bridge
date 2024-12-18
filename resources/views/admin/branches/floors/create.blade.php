@extends('admin.master')
@section('title', __('Create Floor'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div class="d-flex align-items-baseline gap-2">
            <a href="{{ route('admin.branch.floor') }}"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
            <h3 class="mb-3 mb-md-0">Create Floor</h3>
        </div>
    </div>
    <div class="card shadow-sm mx-auto">
        <form action="{{ route('admin.branch.floor.store') }}" method="POST" class="card-body row">
            @csrf
            <div id="container">
                <div class="d-flex justify-content-between" id="clone-floors">
                    <div class="col-5 mb-1">
                        <label class="mb-1" for="name">Branches</label>
                        <div class="form-group">
                            <select name="branch_id[]" class="form-control">
                                <option selected disabled>Select One</option>
                                @foreach($branches as $branch)
                                <option value="{{ $branch->id }}">{{ $branch->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="col-5 mb-1">
                        <label class="mb-1" for="name">Floor Name</label>
                        <div class="form-group">
                            <input type="text" name="name[]" class="form-control" placeholder="Floor Name">
                        </div>
                    </div>
                    <div class="col-1" style="padding:25px;">
                        <span class="btn btn-primary add-clone" style="cursor: pointer;">+</span>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-4">
                <a href="{{ route('dashboard') }}" class="btn-secondary me-2">Cancel</a>
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
<script>
    $(document).ready(function () {
        $(document).on('click', '.add-clone', function () {
            const clone = $('#clone-floors').clone();
            clone.find('select').val('');
            clone.find('input').val('');
            clone.find('.add-clone')
            .removeClass('add-clone btn-primary')
            .addClass('remove-clone btn-danger')
            .text('-');
            $('#container').append(clone);
        });
        $(document).on('click', '.remove-clone', function () {
            $(this).closest('#clone-floors').remove();
        });
    });
</script>
@endsection