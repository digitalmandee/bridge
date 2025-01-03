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
                </div>
                <div class="option" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                    <img src="{{ asset('icons/card.svg') }}">
                    <p>Bank Transfer</p>
                </div>
            </div>
            <div class="upload-deatils">
                <input type="file" id="upload-receipt">
                <label for="upload-receipt"><i class="upload-icon"> <img src="{{ asset('icons/uplod-file.svg') }}">
                    </i></label>
            </div>
            <button class="layout-btn active">CONFIRM</button>
        </div>
    </div>
</div>
<!-- Modal -->
<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <!-- Modal -->
        <div class="modal-content">
            <form>
                <p class="border-bottom">Payment</p>
                <div class="d-flex gap-3">
                    <label><input type="radio" name="payment-method" value="card" checked> Card</label>
                    <label><input type="radio" name="payment-method" value="bank"> Bank</label>
                    <label><input type="radio" name="payment-method" value="transfer"> Transfer</label>
                </div>
                <div>
                    <label for="card-number">Card Number</label>
                    <input class="form-control" type="text" id="card-number" placeholder="1234 5678 9101 1121">
                </div>
                <div class="d-flex">
                    <div class="expiration-date">
                        <label for="expiration-date">Expiration Date</label>
                        <input class="form-control" type="text" id="expiration-date" placeholder="MM/YY">
                    </div>
                    <div class="cvv-number">
                        <label for="cvv">CVV</label>
                        <input class="form-control" type="text" id="cvv" placeholder="123">
                    </div>
                </div>
                <div class="d-flex align-items-baseline">
                    <span style="width:10%;"><input type="checkbox"></span>
                    <label>Save card details</label>
                </div>
                <button type="submit">Pay USD59.28</button>

            </form>
            <p>Your personal data will be used to process your order and for other purposes described in our privacy
                policy.</p>
        </div>
    </div>
</div>
@endsection
