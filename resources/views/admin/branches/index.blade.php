@extends('admin.master')
@section('title', __('Branches'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3 class="mb-3 mb-md-0">Branches</h3>
        </div>
    </div>
    <div class="card shadow-sm mx-auto">
        <form class="card-body row">
            @csrf
            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Branch Name</label>
                <div class="form-group">
                    <input type="text" name="name" class="form-control" placeholder="Branch Name">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Branch Location</label>
                <div class="form-group">
                    <input type="text" name="Location" class="form-control" placeholder="Branch Location">
                </div>
            </div>
            <div class="col-6 col-md-12 col-xl-6 mb-2 d-flex align-items-end gap-5">
                <label for="name">Status</label>
                <div class="form-group">
                    <input type="radio" name="" placeholder="">
                </div>
            </div>
            <!-- Submit and Cancel Buttons -->
            <div class="d-flex justify-content-center mt-4">
                <button type="button" class="btn-secondary me-2">Cancel</button>
                <button type="submit" class="btn-success">Submit</button>
            </div>
    </div>
    </form>
</div>
@endsection