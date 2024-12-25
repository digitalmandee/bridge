@extends('admin.master')

@section('title', __('Booking Create'))

@section('content')
<style>
    .btn-toggle {
        padding: 10px 15px;
        margin: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
        display: inline-block;
        text-align: center;
    }
    .btn-toggle:hover {
        background-color: #f0f0f0;
    }
    .chair {
        display: inline-block;
        width: 60px; /* Fixed width for circular shape */
        height: 60px; /* Fixed height for circular shape */
        margin: 10px;
        border-radius: 50%; /* Fully rounded */
        cursor: pointer;
        text-align: center;
        background-color: green; /* Default color for available */
        color: white;
        line-height: 60px; /* Center text vertically */
        border: 2px solid transparent; /* For visual separation */
    }
    .available {
        background-color: green;
    }
    .reserved {
        background-color: red;
        pointer-events: none; /* Disable pointer events */
    }
    .disabled {
        opacity: 0.5; /* Visual indication for disabled chairs */
    }
    #notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 4px;
        display: none;
        z-index: 1000;
    }
    .success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    .error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    .selection-section {
        margin-bottom: 20px;
    }
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); /* Adjusted min size for chairs */
        gap: 10px;
    }
    .chair-container {
        border: 2px solid #ddd; /* Border for the rectangular area */
        padding: 20px; /* Padding inside the border */
        border-radius: 10px; /* Rounded corners for the rectangular area */
        margin-top: 20px; /* Space above the chair selection */
    }
</style>

<div class="page-content">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="m-0">New Booking</h3>
    </div>

    <div id="notification"></div>

    <div class="row justify-content-center">
        <div class="col-md-8">
            <form action="{{ route('booking.storeUserDetails') }}" method="POST" id="bookingForm">
                @csrf
                <div class="card mb-4">
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

                        <h4>Location Selection</h4>
                        <select id="branchSelect" class="form-control" required>
                            <option value="">Select Branch</option>
                            @foreach($branches as $branch)
                                <option value="{{ $branch->id }}">{{ $branch->name }}</option>
                            @endforeach
                        </select>

                        <!-- Hidden fields for selected IDs -->
                        <input type="hidden" name="branch_id" id="selectedBranchId">
                        <input type="hidden" name="floor_id" id="selectedFloorId">
                        <input type="hidden" name="room_id" id="selectedRoomId">
                        <input type="hidden" name="chair_id" id="selectedChairIds">

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

                        <!-- Submit Button -->
                        <button type="submit" class="btn btn-primary">Submit Booking</button>
                    </div> <!-- End of card body -->
                </div> <!-- End of card -->
            </form> <!-- End of form -->
        </div> <!-- End of column -->
    </div> <!-- End of row -->

    <!-- Selection Modal -->
    <div class="modal fade" id="selectionModal" tabindex="-1" aria-labelledby="selectionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="selectionModalLabel">Select Your Location</h5>
                    <button type="button" class="btn-close" data-bs-dismiss='modal' aria-label='Close'></button>
                </div>

                <div class='modal-body'>
                    <div id='locationSelection'>
                        <div class='selection-section'>
                            <h6>Select Floor</h6>
                            <div id='floorButtons' class='grid-container'></div>
                        </div>
                        <div class='selection-section'>
                            <h6>Select Room</h6>
                            <div id='roomButtons' class='grid-container'></div>
                        </div>
                        <div class='selection-section'>
                            <h6>Select Chair</h6>
                            <div class='chair-container'>
                                <div id='chairButtons' class='grid-container'></div>
                            </div>
                        </div>
                    </div>
                    <button id='submitChairs' class='btn btn-primary mt-3' style='display:none;'>Submit Chairs</button>
                </div>
            </div>
        </div>
    </div>

<script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>
<script src='https://maxcdn.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.bundle.min.js'></script>

<script>
    // JavaScript Code
    $(document).ready(function() {
        let selectedChairIds = [];  // Store selected chair IDs

        // Handle branch selection change
        $('#branchSelect').on('change', function() {
            const selectedBranchId = $(this).val();
            $('#selectedBranchId').val(selectedBranchId);
            loadFloors(selectedBranchId);
            $('#selectionModal').modal('show');
        });

        // Load floors based on selected branch
        function loadFloors(branchId) {
            $('#floorButtons').empty();
            $('#roomButtons').empty();
            $('#chairButtons').empty();
            $('#submitChairs').hide();

            @foreach($branches as $branch)
                if (branchId == "{{ $branch->id }}") {
                    @foreach($branch->floors as $floor)
                        $('#floorButtons').append(`
                            <div class="btn-toggle" data-floor-id="{{ $floor->id }}">
                                {{ $floor->name }}
                            </div>
                        `);
                    @endforeach
                }
            @endforeach
        }

        // Load rooms based on selected floor
        $(document).on('click', '.btn-toggle[data-floor-id]', function() {
            const floorId = $(this).data('floor-id');
            $('#selectedFloorId').val(floorId);
            loadRooms(floorId);
        });

        // Load rooms based on selected floor
        function loadRooms(floorId) {
            $('#roomButtons').empty();
            $('#chairButtons').empty();
            $('#submitChairs').hide();

            @foreach($branches as $branch)
                @foreach($branch->floors as $floor)
                    if (floorId == "{{ $floor->id }}") {
                        @foreach($floor->rooms as $room)
                            $('#roomButtons').append(`
                                <div class="btn-toggle" data-room-id="{{ $room->id }}">
                                    {{ $room->name }}
                                </div>
                            `);
                        @endforeach
                    }
                @endforeach
            @endforeach
        }

        // Load chairs based on selected room
        $(document).on('click', '.btn-toggle[data-room-id]', function() {
            const roomId = $(this).data('room-id');
            $('#selectedRoomId').val(roomId);
            loadChairs(roomId);
        });

        // Load chairs based on selected room
        function loadChairs(roomId) {
            $('#chairButtons').empty();
            $('#submitChairs').show();

            let reservedCount = 0; // Count reserved chairs

            @foreach($branches as $branch)
                @foreach($branch->floors as $floor)
                    @foreach($floor->rooms as $room)
                        if (roomId == "{{ $room->id }}") {
                            @foreach($room->chairs as $chair)
                                if ("{{ $chair->status }}" == 1) reservedCount++;
                                $('#chairButtons').append(`
                                    <div class="chair {{ $chair->status == 0 ? 'available' : 'reserved' }}"
                                        data-chair-id="{{ $chair->id }}"
                                        data-status="{{ $chair->status }}">
                                        {{ $chair->name }}
                                    </div>
                                `);
                            @endforeach
                        }
                    @endforeach
                @endforeach
            @endforeach

            // If room is fully booked
            if (reservedCount >= 10) {
                showNotification('This room is fully booked!', 'error');
                $('#chairButtons').find('.chair').addClass('disabled'); // Disable further interaction
            }
        }

        // Handle chair selection
        $(document).on('click', '.chair', function() {
            const chairId = $(this).data('chair-id');
            const currentStatus = $(this).data('status');

            if (currentStatus === 1) { // Reserved
                showNotification('This chair is already reserved!', 'error');
                return; // Prevent selection
            }

            // Check if already selected
            if (selectedChairIds.length >= 10) {
                showNotification('You can only select up to 10 chairs for this room!', 'error');
                return; // Prevent selection
            }

            // Toggle chair status
            $(this).removeClass('available').addClass('reserved');
            selectedChairIds.push(chairId);  // Add chair to selection
            $(this).data('status', 1); // Mark as reserved

            // Notify when maximum chairs are selected
            if (selectedChairIds.length === 10) {
                showNotification('You have selected the maximum of 10 chairs!', 'info');
            }
        });

        // Submit selected chairs
        $('#submitChairs').on('click', function() {
            $('#selectedChairIds').val(selectedChairIds.join(','));
            $('#selectionModal').modal('hide');
            showNotification('Chairs selected successfully!', 'success');
        });

        // Handle booking form submission
        $('#bookingForm').on('submit', function(e) {
            e.preventDefault();

            if (selectedChairIds.length === 0) {
                showNotification('Please select at least one chair', 'error');
                return;
            }

            const formData = $(this).serialize() + '&chair_ids=' + selectedChairIds.join(',');

            $.ajax({
                url: $(this).attr('action'),
                method: 'POST',
                data: formData + '&_token=' + $('meta[name="csrf-token"]').attr('content'),
                success: function(response) {
                    if (response.success) {
                        showNotification('Booking successful!', 'success');
                        setTimeout(() => {
                            window.location.href = '{{ route("admin.booking.calendar") }}';
                        }, 2000);
                    } else {
                        displayValidationErrors(response.message);
                    }
                },
                error: function(xhr) {
                    showNotification('Booking failed. Please try again.', 'error');
                }
            });
        });

        // Display error messages
        function displayValidationErrors(errors) {
            let errorMessage = '';
            if (errors.chair_id) errorMessage += errors.chair_id.join('<br>');
            if (errorMessage) showNotification(errorMessage, 'error');
        }

        // Show notification messages
        function showNotification(message, type) {
            const notification = $('#notification');
            notification.removeClass('success error info').addClass(type);
            notification.html(message).fadeIn();
            setTimeout(() => notification.fadeOut(), 3000);
        }
    });
</script>

@endsection
