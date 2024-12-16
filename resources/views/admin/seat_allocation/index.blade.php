@extends('admin.master')
@section('title', __('Seats allocation'))
@section('content')
<style>
    .prnt_bx {
        /* width: 300px; */
        border-radius: 15px;
        box-shadow: 4px 10px 10px 0px rgba(134, 134, 134, 0.30);
        text-align: center;
        margin: 5px 0 5px;
        background: #f0f0f0;
    }

    .pstn {
        background: #FFCC16;
        padding: 10px;
        color: #ffff;
        font-size: 17px;
        font-weight: 600;
        border-radius: 0 0 15px 15px;
    }

    .fnt {
        font-size: 14px;
        font-weight: 800;
    }

    .flx {
        display: flex;
        justify-content: space-evenly;
        gap: 20px;
        margin-bottom: 10px;
    }

    .flx_1 {
        display: flex;
        flex-direction: column;
        background-color: white;
        padding: 10px;
        width: 130px;
        border-radius: 10px;
        box-shadow: 4px 10px 10px 0px rgba(134, 134, 134, 0.30);
    }



    .option img {
        width: 70px;
        height: 70px;
        background: #ffd700;
        padding: 10px;
        border-radius: 50%;
    }
</style>
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3 class="mb-3 mb-md-0">Seats Allocation</h3>
        </div>
    </div>
    <div class="col-12 col-xl-12">
        <div class="row flex-grow-1">
            <div class="col-md-3 grid-margin text-center">
                <div class="crd_bx">
                    <div class="card-body" style="padding-top: 10px;">
                        <div class="option">
                            <img src="{{ asset('icons/cash.svg') }}">
                        </div>
                        <p class="fnt text-muted my-2">Seat # 101</p>
                        <div class="flx">
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Status</p>
                                <span class="label label-pending">Available</span>
                            </div>
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Occupancy</p>
                                <p class="card-text"> 08</p>
                            </div>
                        </div>
                        <div class="flx">
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Location</p>
                                <p class="card-text">Window</p>
                            </div>
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Amenities</p>
                                <p class="card-text">TV، Projector</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="crd_bx1 pstn">
                    <p class="card-text">Allocate</p>
                </div>
            </div>
            <!--  -->
            <!-- <div class="col-md-3 grid-margin text-center">
                <div class="crd_bx">
                    <div class="card-body" style="padding-top: 10px;">
                        <div class="option">
                            <img src="{{ asset('icons/cash.svg') }}">
                        </div>
                        <p class="fnt text-muted my-2">Seat # 101</p>
                        <div class="flx">
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Status</p>
                                <span class="label label-pending">Available</span>
                            </div>
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Occupancy</p>
                                <p class="card-text"> 08</p>
                            </div>
                        </div>
                        <div class="flx">
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Location</p>
                                <p class="card-text">Window</p>
                            </div>
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Amenities</p>
                                <p class="card-text">TV، Projector</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="crd_bx1 pstn">
                    <p class="card-text">Allocate</p>
                </div>
            </div> -->
            <!--  -->
            <!-- <div class="col-md-3 grid-margin text-center">
                <div class="crd_bx">
                    <div class="card-body" style="padding-top: 10px;">
                        <div class="option">
                            <img src="{{ asset('icons/cash.svg') }}">
                        </div>
                        <p class="fnt text-muted my-2">Seat # 101</p>
                        <div class="flx">
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Status</p>
                                <span class="label label-pending">Available</span>
                            </div>
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Occupancy</p>
                                <p class="card-text"> 08</p>
                            </div>
                        </div>
                        <div class="flx">
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Location</p>
                                <p class="card-text">Window</p>
                            </div>
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Amenities</p>
                                <p class="card-text">TV، Projector</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="crd_bx1 pstn">
                    <p class="card-text">Allocate</p>
                </div>
            </div> -->
            <!--  -->
            <!-- <div class="col-md-3 grid-margin text-center">
                <div class="crd_bx">
                    <div class="card-body" style="padding-top: 10px;">
                        <div class="option">
                            <img src="{{ asset('icons/cash.svg') }}">
                        </div>
                        <p class="fnt text-muted my-2">Seat # 101</p>
                        <div class="flx">
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Status</p>
                                <span class="label label-pending">Available</span>
                            </div>
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Occupancy</p>
                                <p class="card-text"> 08</p>
                            </div>
                        </div>
                        <div class="flx">
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Location</p>
                                <p class="card-text">Window</p>
                            </div>
                            <div class="flx_1">
                                <p class="fnt text-muted my-2">Amenities</p>
                                <p class="card-text">TV، Projector</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="crd_bx1 pstn">
                    <p class="card-text">Allocate</p>
                </div>
            </div> -->

        </div>
    </div>
</div>
@endsection