@extends('admin.master')
@section('title', __('Invoice Show'))
@section('content')
<div class="page-content">
    <div class="d-flex align-items-start justify-content-between grid-margin">
        <div class="d-flex align-items-center">
            <div class="d-flex align-items-baseline gap-2">
                <a href="{{ route('admin.invoice') }}"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
                <h3 class="mb-3 mb-md-0">Invoice Show</h3>
            </div>
        </div>
        <div class="d-flex align-items-center gap-2">
            <div class="shadow p-1 rounded-1">
                <a href="#" class="text-dark"><i class="fa fa-download text-warning"></i> Pdf</a>
            </div>
            <div class="shadow p-1 rounded-1">
                <a href="#" class="text-dark"><i class="fa fa-send text-warning"></i> Sent</a>
            </div>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="d-flex gap-2 col-md-12 col-xl-10  p-0">
            <div class="card col-md-12 col-xl-8 rounded-4">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h4 class="mb-0">Mauro Sicard</h4>
                        <div class="income-icon">
                            <img src="{{ asset('icons/man.svg') }}" alt="Man Icon" style="width: 30px; height:30px;">
                        </div>
                    </div>
                    <div class="sub-info col-md-12 col-xl-7">
                        <div class="row text-secondary">
                            <small>+92 3209469594</small>
                        </div>
                        <div class="row text-secondary">
                            <small>contact@maurosicard.com</small>
                        </div>
                        <div class="row text-secondary">
                            <small>Pablo Alto, San Francisco, CA 92102,United
                                States of America</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card ammount-card col-md-12 col-xl-4 rounded-4">
                <div class="card-body text-end pb-0">
                    <div class="ammount-titel text-dark">
                        <h6 class="text-dark  mb-2">Paid Ammount</h6>
                    </div>
                    <div class="row">
                        <div class="col-6 col-md-12 col-xl-12">
                            <div class="ammount-rate">
                                <h3 class="text-dark fw-semibold fs-4 mb-2">70,000.00</h3>
                            </div>
                            <div class="ammount-rs mb-2">
                                <h4 class="text-dark">Pkr</h4>
                            </div>
                        </div>
                        <small class="text-dark">03 August 2024</small>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row justify-content-center my-3">
        <div class="d-flex col-md-12 col-xl-10 justify-content-center">
            <div class="info-container d-flex gap-7">
                <div class="info-card shadow rounded-5 p-3 text-center">
                    Invoice No : <span class="fw-semibold">000027</span>
                </div>
                <div class="info-card shadow rounded-5 p-3 text-center">
                    Issued : <span class="fw-semibold">03/07/2024</span>
                </div>
                <div class="info-card shadow rounded-5 p-3 text-center">
                    Due Date : <span class="fw-semibold">07/07/2024</span>
                </div>
            </div>
        </div>
    </div>

    <div class="row justify-content-center">
        <div class="card col-md-12 col-xl-10 rounded-4">
            <table class="table table-responsive">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th class="text-end">Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            Dedicated desks
                        </td>
                        <td>1
                        </td>
                        <td>15,000</td>
                        <td class="text-end">45,000</td>
                    </tr>
                </tbody>
            </table>
            <div class="invoice-total">
                <div class="payable-amount  d-flex justify-content-between">
                    <span>Payable Amount</span>
                    <span>Total Amount</span>

                </div>
                <div class="total-amount  d-flex justify-content-between">
                    <span class="text-danger fs-5">25,000 Pkr</span>
                    <span class="text-primary fs-5">115,000 Pkr</span>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection