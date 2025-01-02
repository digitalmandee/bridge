@extends('admin.master')
@section('title', __('Payment'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3 class="mb-3 mb-md-0">Payment Deatils</h3>
        </div>
    </div>
    <div class="col-md-12 d-flex justify-content-center">
        <div class="payment-container">
            <div class="payment-options">
                <div class="option">
                    <img src="{{ asset('icons/cash.svg') }}">
                    <p>Cash</p>
                    <input type="radio" >
                </div>
                <div class="option" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                    <img src="{{ asset('icons/card.svg') }}">
                    <p>Bank Transfer</p>
                    <input type="radio" >
                </div>
            </div>
            <div class="upload-deatils">
                <input type="file" id="upload-receipt">
                <label for="upload-receipt">
                    <i class="upload-icon"> <img src="{{ asset('icons/uplod-file.svg') }}"></i>
                </label>
            </div>
            <button class="layout-btn active">CONFIRM</button>
        </div>
    </div>
</div>
@endsection