@extends('admin.master')
@section('title', __('Invoice Show'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
            <div class="d-flex align-items-baseline gap-2">
                <a href="{{ route('admin.invoice') }}"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
                <h3 class="mb-3 mb-md-0">Invoice Show</h3>
            </div>
        </div>
        <div class="d-flex align-items-center gap-2">
            <a href="#" class="text-dark"><i class="fa fa-download text-warning"></i> CSV</a>
        </div>
    </div>
</div>
@endsection