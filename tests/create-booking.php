@extends('admin.master')
@section('title', __('Booking Create'))
@section('content')

<div class="page-content">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-2">
            <a href="{{ route('admin.booking.calendar') }}">
                <i class="fa fa-chevron-left"></i>
            </a>
            <h3 class="m-0">New Booking</h3>
        </div>
    </div>

    <div id="notification"></div>

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <form action="{{ route('booking.storeUserDetails') }}" method="POST" id="bookingForm">
                    @csrf
                    <div class="card mb-4">
                        <div class="card-body p-4">
                            <!-- User Details Section -->
                            <div class="mb-4">
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
                            </div>

                            <!-- Branch Selection Button -->
                            <div class="mb-4">
                                <h4>Location Selection</h4>
                                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#branchModal">
                                    Select Location
                                </button>
                                <div id="selectedLocationInfo" class="mt-2 text-muted"></div>
                            </div>

                            <!-- Hidden Fields for Selection -->
                            <input type="hidden" name="branch_id" id="selectedBranchId">
                            <input type="hidden" name="floor_id" id="selectedFloorId">
                            <input type="hidden" name="chair_id" id="selectedChairId">

                            <!-- Booking Details -->
                            <div class="mb-4">
                                <h4>Booking Details</h4>
                                <div class="mb-3">
                                    <label class="form-label">Date</label>
                                    <input type="date" name="date" class="form-control" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Time</label>
                                    <input type="time" name="time" class="form-control" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Submit Booking</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Branch Selection Modal -->
    <div class="modal fade" id="branchModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Select Location</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <!-- Branch Selection -->
                    <h6>Select Branch</h6>
                    @foreach($branches as $branch)
                        <button type='button'
                                class='btn btn-toggle'
                                data-branch-id="{{ $branch->id }}"
                                data-branch-name="{{ $branch->name }}">
                            {{ $branch->name }}
                        </button>
                    @endforeach

                    <!-- Floor Selection -->
                    <h6>Select Floor</h6>
                    @foreach($branches as $branch)
                        @foreach($branch->floors as $floor)
                            <button type='button'
                                    class='btn btn-toggle'
                                    data-floor-id="{{ $floor->id }}"
                                    data-floor-name="{{ $floor->name }}">
                                {{ $floor->name }}
                            </button>
                        @endforeach
                    @endforeach

                    <!-- Chair Selection -->
                    <h6>Select Chair</h6>
                    @foreach($branches as $branch)
                        @foreach($branch->floors as $floor)
                            @foreach($floor->chairs as $chair)
                                <div
                                    class='chair {{ $chair->status == 0 ? 'available' : 'reserved' }}'
                                    data-chair-id="{{ $chair->id }}"
                                    data-chair-name="{{ $chair->name }}">
                                    {{ $chair->name }}
                                </div>
                            @endforeach
                        @endforeach
                    @endforeach
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer">
                    <button type='button'
                            id='confirmChairSelection'
                            style='display: none;'
                            data-bs-dismiss='modal'>
                        Confirm Selection
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Styles -->
    <style>
        .btn-toggle { padding: 8px 16px; margin: 5px; }
        .chair { display: inline-block; padding: 10px 20px; margin: 5px; border-radius: 4px; text-align: center; }
        .available { background-color: green; color: white; cursor: pointer; }
        .reserved { background-color: red; color: white; cursor: not-allowed; }
    </style>

    <!-- Scripts -->
    <script src="//code.jquery.com/jquery-3.6.0.min.js"></script> <!-- Ensure jQuery is included -->
    <script>
        $(document).ready(function() {
            let selectedChairIds = [];

            // Handle chair selection
            $('.chair').on('click', function() {
                const chairId = $(this).data('chair-id');
                const chairName = $(this).data('chair-name');

                if ($(this).hasClass('available')) {
                    $(this).toggleClass('selected');

                    if ($(this).hasClass('selected')) {
                        selectedChairIds.push(chairId);
                        $(this).addClass('permanently-selected');
                    } else {
                        selectedChairIds = selectedChairIds.filter(id => id !== chairId);
                        $(this).removeClass('permanently-selected');
                    }

                    $('#selectedChairId').val(selectedChairIds.join(','));
                } else {
                    alert('This chair is already reserved.');
                }
            });

            // Confirm selection button logic
            $('#confirmChairSelection').on('click', function() {
                const selectedChairs = selectedChairIds.map(id => $('.chair[data-chair-id="' + id + '"]').data('chair-name')).join(', ');
                $('#selectedLocationInfo').text(`Selected Chairs: ${selectedChairs}`);
            });
        });
    </script>

</div>

@endsection
