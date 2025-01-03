@extends('admin.master')
@section('title', __('Booking Create'))
@section('content')

<div class="page-content">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-2">
            <a href="{{ route('admin.booking.calendar') }}">
                <i class="fa fa-chevron-left"></i>
            </a>
            <h3 class="m-0">Booking Create</h3>
        </div>
    </div>

    <div class="">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <form action="{{ route('booking.storeUserDetails') }}" method="POST" id="bookingForm" enctype="multipart/form-data">
                    @csrf
                    @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul>
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                    <!-- Step 1: User Details -->
                    <div class="card mb-4" id="step1">
                        <div class="card-body p-4">
                            <h4>User Details</h4>
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" name="name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" name="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone</label>
                                <input type="text" name="phone" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Product</label>
                                <select name="product" class="form-control" required>
                                    <option value="">Select Product</option>
                                    <option value="meeting_rooms">Meeting Rooms</option>
                                    <option value="podcast_rooms">Podcast Rooms</option>
                                    <option value="visitor">Visitor</option>
                                    <option value="office">Office</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Location Selection</label>
                                <select id="branchSelect" class="form-control" required>
                                    <option value="">Select Branch</option>
                                    @foreach($branches as $branch)
                                        <option value="{{ $branch->id }}" data-branch-name="{{ $branch->name }}">
                                            {{ $branch->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <input type="hidden" name="branch_id" id="selectedBranchId">
                            <div class="footer text-center">
                                <button type="button" class="layout-btn active" onclick="nextStep(1)">Next</button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Booking Details -->
                    <div class="card mb-4 d-none" id="step2">
                        <div class="card-body p-4">
                            <h4>Booking Details</h4>
                            <div class="mb-3">
                                <label class="form-label">Start Date</label>
                                <input type="date" name="start_date" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">End Date</label>
                                <input type="date" name="end_date" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Time</label>
                                <input type="time" name="time" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Duration</label>
                                <select name="duration" class="form-control" required>
                                    <option value="">Select Duration</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <input type="hidden" name="chair_id" id="selectedChairIds">
                                <input type="hidden" name="floor_id" id="selectedFloorId">
                            </div>
                            <div class="footer text-center">
                                <button type="button" class="layout-btn" onclick="prevStep(2)">Back</button>
                                <button type="button" class="layout-btn active" onclick="nextStep(2)">Next</button>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Payment Details -->
                    <div class="card mb-4 d-none" id="step3">
                        <div class="card-body p-4">
                            <h4>Payment Details</h4>
                            <div class="payment-container">
                                <div class="payment-options">
                                    <div class="option">
                                        <img src="{{ asset('icons/card.svg') }}">
                                        <p>Bank Transfer</p>
                                    </div>
                                </div>
                                <div class="payment-fields">
                                    <div>
                                        <label for="card-number">Card Number</label>
                                        <input class="form-control" type="text" id="card-number" name="card_number" placeholder="1234 5678 9101 1121" required>
                                    </div>
                                    <div class="d-flex">
                                        <div class="expiration-date me-2">
                                            <label for="expiration-date">Expiration Date</label>
                                            <input class="form-control" type="text" id="expiration-date" name="expiration_date" placeholder="MM/YY" required>
                                        </div>
                                        <div class="cvv-number">
                                            <label for="cvv">CVV</label>
                                            <input class="form-control" type="text" id="cvv" name="cvv" placeholder="123" required>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-baseline mt-2">
                                        <span style="width:10%;">
                                            <input type="hidden" name="save_card_details" value="0">
                                            <input type="checkbox" name="save_card_details" value="1">
                                        </span>
                                        <label for="save_card_details">Save card details</label>
                                    </div>
                                    <div class="upload-details mt-3">
                                        <label for="upload-receipt">Upload Receipt</label>
                                        <input type="file" name="receipt" id="upload-receipt" class="form-control" required>
                                    </div>
                                </div>
                            </div>
                            <div class="footer text-center mt-3">
                                <button type="button" class="layout-btn" onclick="prevStep(3)">Back</button>
                                <button type="submit" class="layout-btn active">Submit Booking</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- Chair Selection Modal -->
@include('admin.booking.modal.branch_details')

<script>
    let currentStep = 1;

    function nextStep(step) {
        document.getElementById(`step${step}`).classList.add('d-none');
        currentStep = step + 1;
        document.getElementById(`step${currentStep}`).classList.remove('d-none');
    }

    function prevStep(step) {
        document.getElementById(`step${step}`).classList.add('d-none');
        currentStep = step - 1;
        document.getElementById(`step${currentStep}`).classList.remove('d-none');
    }

    document.getElementById('branchSelect').addEventListener('change', function() {
        const selectedBranch = this.options[this.selectedIndex];
        document.getElementById('selectedBranchId').value = selectedBranch.value;
        document.getElementById('selectedBranchName').innerText = selectedBranch.getAttribute('data-branch-name');
    });

    function checkFloorStatus(floorId) {
        const chairsOnFloor = @json($chairs);
        const chairsForFloor = chairsOnFloor.filter(chair => chair.floor_id === floorId);
        const allBooked = chairsForFloor.every(chair => chair.status === 1);

        if (allBooked) {
            const toast = document.getElementById('bookingPopup');
            toast.innerText = "This floor is already booked with chairs.";
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }
    }

    function selectChair(chairId, floorId, status) {
        if (status === 1) {
            const toast = document.getElementById('bookingPopup');
            toast.innerText = "This chair is already booked and cannot be selected.";
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
            return;
        }

        document.getElementById('selectedChairIds').value = chairId;
        document.getElementById('selectedFloorId').value = floorId;

        $('.branch-chair').css('border', 'none');
        $(`.chair-top-${chairId}, .chair-bottom-${chairId}`).css('border', '2px solid blue');
        $('#branchModal').modal('hide');
    }
</script>
@endsection
