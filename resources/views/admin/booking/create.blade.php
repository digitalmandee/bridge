@extends('admin.master')
@section('title', __('Booking Create'))
@section('content')

<style>
    .btn-toggle {
        padding: 8px 16px;
        margin: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .btn-toggle:hover {
        background-color: #f0f0f0;
    }
    .chair {
        display: inline-block;
        padding: 10px 20px;
        margin: 5px;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
    }
    .available {
        background-color: green;
        color: white;
    }
    .reserved {
        background-color: red;
        color: white;
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
</style>

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

    <div class="">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <form action="{{ route('booking.storeUserDetails') }}" method="POST" id="bookingForm">
                    @csrf
                    <!-- User Details Section -->
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

                            <!-- Branch Selection Dropdown -->
                            <h4>Location Selection</h4>
                            <select id="branchSelect" class="form-control" required>
                                <option value="">Select Branch</option>
                                @foreach($branches as $branch)
                                    <option value="{{ $branch->id }}" data-branch-name="{{ $branch->name }}">{{ $branch->name }}</option>
                                @endforeach
                            </select>

                            <!-- Hidden Fields -->
                            <input type="hidden" name="branch_id" id="selectedBranchId">
                            <input type="hidden" name="floor_id" id="selectedFloorId">
                            <input type="hidden" name="room_id" id="selectedRoomId">
                            <input type="hidden" name="table_id" id="selectedTableId">
                            <input type="hidden" name="chair_ids" id="selectedChairIds">

                            <!-- Booking Details -->
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

                            <button type="submit" class="btn btn-primary">Submit Booking</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal for Selection -->
    <div class="modal fade" id="selectionModal" tabindex="-1" aria-labelledby="selectionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="selectionModalLabel">Select Your Location</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="selection-area" id="floors" style="display: none;">
                        <h6>Select Floor</h6>
                        <div id="floorButtons"></div>
                    </div>

                    <div class="selection-area" id="rooms" style="display: none;">
                        <h6>Select Room</h6>
                        <div id="roomButtons"></div>
                    </div>

                    <div class="selection-area" id="tables" style="display: none;">
                        <h6>Select Table</h6>
                        <div id="tableButtons"></div>
                    </div>

                    <div class="selection-area" id="chairs" style="display: none;">
                        <h6>Select Chair</h6>
                        <div id="chairButtons"></div>
                        <button id="submitChairs" class="btn btn-primary mt-3">Submit Chairs</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.bundle.min.js"></script>
<script>
$(document).ready(function() {
    let selectedChairIds = [];

    // Load floors based on selected branch and open modal
    $('#branchSelect').on('change', function() {
        const selectedBranchId = $(this).val();
        $('#selectedBranchId').val(selectedBranchId);
        $('#floors').show();

        // Clear previous selections
        $('#floorButtons').empty();
        $('#rooms, #tables, #chairs').hide();

        @foreach($branches as $branch)
            if (selectedBranchId == "{{ $branch->id }}") {
                @foreach($branch->floors as $floor)
                    $('#floorButtons').append(`
                        <div class="btn-toggle" data-floor-id="{{ $floor->id }}">
                            {{ $floor->name }}
                        </div>
                    `);
                @endforeach
            }
        @endforeach

        // Open the modal
        $('#selectionModal').modal('show');
    });

    // Load rooms based on selected floor
    $(document).on('click', '.btn-toggle[data-floor-id]', function() {
        const floorId = $(this).data('floor-id');
        $('#selectedFloorId').val(floorId);
        $('#rooms').show();

        // Clear previous selections
        $('#roomButtons').empty();
        $('#tables, #chairs').hide();

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
    });

    // Load tables based on selected room
    $(document).on('click', '.btn-toggle[data-room-id]', function() {
        const roomId = $(this).data('room-id');
        $('#selectedRoomId').val(roomId);
        $('#tables').show();

        // Clear previous selections
        $('#tableButtons').empty();
        $('#chairs').hide();

        @foreach($branches as $branch)
            @foreach($branch->floors as $floor)
                @foreach($floor->rooms as $room)
                    if (roomId == "{{ $room->id }}") {
                        @foreach($room->tables as $table)
                            $('#tableButtons').append(`
                                <div class="btn-toggle" data-table-id="{{ $table->id }}">
                                    {{ $table->name }}
                                </div>
                            `);
                        @endforeach
                    }
                @endforeach
            @endforeach
        @endforeach
    });

    // Load chairs based on selected table
    $(document).on('click', '.btn-toggle[data-table-id]', function() {
        const tableId = $(this).data('table-id');
        $('#selectedTableId').val(tableId);
        $('#chairs').show();

        // Clear previous selections
        $('#chairButtons').empty();

        @foreach($branches as $branch)
            @foreach($branch->floors as $floor)
                @foreach($floor->rooms as $room)
                    @foreach($room->tables as $table)
                        if (tableId == "{{ $table->id }}") {
                            @foreach($table->chairs as $chair)
                                $('#chairButtons').append(`
                                    <div class="chair {{ $chair->status == 0 ? 'available' : 'reserved' }}"
                                         data-chair-id="{{ $chair->id }}"
                                         data-chair-name="{{ $chair->name }}"
                                         data-status="{{ $chair->status }}">
                                        {{ $chair->name }}
                                    </div>
                                `);
                            @endforeach
                        }
                    @endforeach
                @endforeach
            @endforeach
        @endforeach
    });

    // Chair selection with status toggle
    $(document).on('click', '.chair', function() {
        const $chair = $(this);
        const chairId = $chair.data('chair-id');
        const currentStatus = $chair.data('status');

        // Toggle status between 0 and 1
        const newStatus = currentStatus == 0 ? 1 : 0;
        $chair.data('status', newStatus);

        // Update visual appearance
        if (newStatus == 0) {
            $chair.removeClass('reserved').addClass('available');
        } else {
            $chair.removeClass('available').addClass('reserved');
        }

        // Update selected chairs array
        const chairIndex = selectedChairIds.indexOf(chairId);
        if (chairIndex === -1) {
            selectedChairIds.push(chairId);
        } else {
            selectedChairIds.splice(chairIndex, 1);
        }
    });

    // Submit selected chairs
    $('#submitChairs').on('click', function() {
        $('#selectedChairIds').val(selectedChairIds.join(','));
        $('#selectionModal').modal('hide');
        showNotification('Chairs selected successfully!', 'success');
    });

    // Handle form submission
    $('#bookingForm').on('submit', function(e) {
        e.preventDefault();

        // Check if any chairs are selected
        if (selectedChairIds.length === 0) {
            showNotification('Please select at least one chair', 'error');
            return;
        }

        const formData = $(this).serialize() + '&chair_id=' + selectedChairIds.join(',');

        $.ajax({
            url: $(this).attr('action'),
            method: 'POST',
            data: formData + '&_token=' + $('meta[name="csrf-token"]').attr('content'), // Add CSRF token
            success: function(response) {
                if (response.success) {
                    showNotification('Booking successful!', 'success');
                    setTimeout(() => {
                        window.location.href = '{{ route("admin.booking.calendar") }}';
                    }, 2000);
                } else {
                    // Display validation errors for start_date and end_date
                    displayValidationErrors(response.message);
                }
            },
            error: function(xhr) {
                // Handle unexpected errors
                showNotification('Booking failed. Please try again.', 'error');
                console.error(xhr.responseText);
            }
        });
    });

    // Function to display validation errors
    function displayValidationErrors(errors) {
        let errorMessage = '';

        // Check for specific errors
        if (errors.start_date) {
            errorMessage += errors.start_date.join(' ') + '<br>';
        }
        if (errors.end_date) {
            errorMessage += errors.end_date.join(' ') + '<br>';
        }

        // Show notification with errors
        if (errorMessage) {
            showNotification(errorMessage, 'error');
        }
    }

    function showNotification(message, type) {
        const notification = $('#notification');
        notification.removeClass('success error').addClass(type);
        notification.html(message).fadeIn();
        setTimeout(() => notification.fadeOut(), 3000);
    }
});
</script>

@endsection
