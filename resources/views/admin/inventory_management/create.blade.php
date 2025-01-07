@extends('admin.master')
@section('title', __('Add Inventory'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3>Add Inventory</h3>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="card col-6 col-md-12 col-xl-6">
            <form action="#" method="POST" class="card-body">

                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Inventory Name</label>
                    <div class="form-group">
                        <input type="text" name="name" class="form-control" placeholder="Name">
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Inventory Type</label>
                    <div class="form-group">
                        <input type="text" name="company" class="form-control" placeholder="equipment">
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Location</label>
                    <div class="form-group">
                        <input type="text" name="Location" class="form-control" placeholder="Location">
                    </div>
                </div>
                <div class="d-flex gap-4">
                    <div class="col-6 mb-2">
                        <label class="mb-1" for="name">Quantity</label>
                        <div class="form-group">
                            <input type="number" class="form-control" min="1" oninput="validateTotalMembers(this)"
                                placeholder="" value="1">
                        </div>
                    </div>
                    <div class="col-5 mb-2">
                        <label class="mb-1" for="name">Price</label>
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="25,000/-">
                        </div>
                    </div>
                </div>
                <div class="box-footer text-center">
                    <button class="layout-btn active">Add inventory</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection