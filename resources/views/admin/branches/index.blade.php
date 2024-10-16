@extends('admin.master')
@section('title', __('Branches'))
@section('content')
    <div class="page-content">
        <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
            <div>
                <h3 class="mb-3 mb-md-0">@section('heading', __('Branches'))</h3>
            </div>
        </div>
        <form>
            @csrf
            <label for="">Branch Name</label>
            <input type="text" name="name" placeholder="Branch Name">
            <label for="">Branch Location</label>
            <input type="text" name="location" placeholder="Branch Location">
            <label for="">Status</label>
            <input type="radio">
            <button class="btn btn-success">Submit</button>
            <button class="btn btn-warning">Cancel</button>
        </form>
    </div>
@endsection
