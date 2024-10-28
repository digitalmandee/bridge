@extends('admin.master')
@section('title', __('Create Member'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div class="d-flex align-items-baseline gap-2">
            <a href="#"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
            <h3 class="mb-3 mb-md-0">Add Member</h3>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="card col-6 col-md-12 col-xl-6">
            <form action="#" class="card-body">
                <div class="grid-margin">
                    <h3 class="mb-3 mb-md-0">Personal Details</h3>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Name</label>
                    <div class="form-group">
                        <input type="text" name="name" class="form-control" placeholder="Name">
                        <small class="text-secondary">Name or company are required</small>
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Company</label>
                    <div class="form-group">
                        <input type="text" name="name" class="form-control" placeholder="Company">
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Address*</label>
                    <div class="form-group">
                        <textarea name="name" class="form-control" id="" cols="30" rows=""></textarea>
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Phone</label>
                    <div class="form-group">
                        <input type="tel" name="name" class="form-control" placeholder="+92">
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Email</label>
                    <div class="form-group">
                        <input type="tel" name="name" class="form-control" placeholder="Eg @gamil.com">
                    </div>
                </div>
                <div class="grid-margin">
                    <h3 class="mb-3 mb-md-0">Membership Details</h3>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Total Menbers</label>
                    <div class="form-group">
                        <input type="number" name="name" class="form-control" placeholder="00">
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Start Date</label>
                    <div class="form-group">
                        <input type="date" name="name" class="form-control" value="2024-10-28">
                        <small class="text-secondary">When Should be membership start</small>
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">First Recurring Invoice Date</label>
                    <div class="form-group">
                        <input type="date" name="name" class="form-control" value="2024-10-28">
                        <small class="text-secondary">When should the first invoice be sent?</small>
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <div class="form-check">
                        <input type="checkbox" name="" value="1" class="form-check-input">
                        <label class="form-check-label">Send prorated invoice on start date</label>
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <div class="form-check">
                        <input type="checkbox" name="" value="1" class="form-check-input">
                        <label class="form-check-label">Selecting this will allow you to customize the member's plan or remove a sign-up charge before confirming them and generating their first invoice.</label>
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <div class="form-check">
                        <input type="checkbox" name="" value="1" class="form-check-input">
                        <label class="form-check-label">Send confirmation email to member</label>
                    </div>
                </div>
                <div class="col-6 col-md-12 col-xl-12 mb-2">
                    <label class="mb-1" for="name">Add Note</label>
                    <div class="form-group">
                        <textarea name="name" class="form-control" id="" cols="30" rows=""></textarea>
                    </div>
                </div>
                <div class="box-footer text-center">
                    <button class="layout-btn active">Add Members</button>
                </div>
            </form>
        </div>
    </div>
    <!-- SweetAlert trigger -->
    @if (session('error'))
    <script>
        showToast('error', '{{ session('error') }}', '#f8d7da');
    </script>
    @endif
</div>
@endsection