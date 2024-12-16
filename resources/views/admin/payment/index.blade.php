@extends('admin.master')
@section('title', __('Payment'))
@section('content')
<style>
    /* General styles */
    .payment-container {
        text-align: center;
        background: #fff;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        width: 400px;
    }

    h2 {
        font-size: 24px;
        margin-bottom: 20px;
    }

    .payment-options {
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
    }

    .option {
        text-align: center;
        cursor: pointer;
        background: #fff;
        border: 1px solid #ffd700;
        border-radius: 10px;
        padding: 20px;
        width: 45%;
        transition: all 0.3s ease;
    }

    .option:hover {
        background: #fff4cc;
    }

    .option img {
        width: 50px;
        height: 50px;
        background: #ffd700;
        padding: 10px;
        border-radius: 20%;
    }

    .option p {
        margin-top: 10px;
        font-weight: bold;
    }

    .upload-deatils {
        border: 2px dashed #d3d3d3;
        border-radius: 15px;
        margin-bottom: 10px;

    }

    .upload-deatils input {
        display: none;
    }

    .upload-deatils label {
        display: flex:;
        flex-direction: row-reverse;
        cursor: pointer;
        display: flex;
        align-items: center;
        background: #f2f2f2;
        padding: 10px 15px;
        border-radius: 15px;
        font-size: 14px;
        font-weight: bold;
    }

    /* Modal styles */
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background: #fff;
        padding: 30px;
        border-radius: 15px;
        width: 400px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        position: relative;
    }

    .modal h3 {
        font-size: 22px;
        margin-bottom: 20px;
    }

    .modal form {
        text-align: left;
    }

    .modal form p {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .modal form label {
        display: block;
        margin: 10px 0;
        font-size: 14px;
    }

    .modal form input[type="text"],
    .modal form input[type="checkbox"] {
        width: calc(100% - 20px);
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .modal form button {
        background: #ffd700;
        color: #fff;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
        width: 100%;
    }

    .modal form button:hover {
        background: #e6c200;
    }

    .modal p {
        font-size: 12px;
        color: #666;
        margin-top: 15px;
        line-height: 1.5;
    }
</style>
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