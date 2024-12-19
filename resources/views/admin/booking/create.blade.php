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

    .selection-area {
        margin: 15px 0;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
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

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <form action="{{ route('booking.storeUserDetails') }}" method="POST" id="bookingForm">
                    @csrf
                    <!-- User Details Section -->
                    <div class="card mb-4">
                        <div class="card-body p-4">
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
                            </div>

                            <!-- Branch Selection Button -->
                            <div class="mb-4">
                                <h4>Location Selection</h4>
                                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#branchModal">
                                    Select Location
                                </button>
                                <div id="selectedLocationInfo" class="mt-2 text-muted"></div>
                            </div>

                            <!-- Hidden Fields -->
                            <input type="hidden" name="branch_id" id="selectedBranchId">
                            <input type="hidden" name="floor_id" id="selectedFloorId">
                            <input type="hidden" name="room_id" id="selectedRoomId">
                            <input type="hidden" name="table_id" id="selectedTableId">
                            <input type="hidden" name="chair_ids" id="selectedChairIds">

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
                                <div class="mb-3">
                                    <label class="form-label">Duration</label>
                                    <select name="duration" class="form-control" required>
                                        <option value="">Select Duration</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary">Submit Booking</button>
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
                    <!-- Selection Areas -->
                    <div class="selection-area" id="branchSelect">
                        <h6>Select Branch</h6>
                        @foreach($branches as $branch)
                            <div class="btn-toggle" data-action="showFloors" data-branch-id="{{ $branch->id }}" data-branch-name="{{ $branch->name }}">
                                {{ $branch->name }}
                            </div>
                        @endforeach
                    </div>

                    <div class="selection-area" id="floors" style="display: none;">
                        <h6>Select Floor</h6>
                        @foreach($branches as $branch)
                            @foreach($branch->floors as $floor)
                                <div class="btn-toggle" data-action="showRooms" data-branch-id="{{ $branch->id }}" data-floor-id="{{ $floor->id }}" data-floor-name="{{ $floor->name }}">
                                    {{ $floor->name }}
                                </div>
                            @endforeach
                        @endforeach
                    </div>

                    <div class="selection-area" id="rooms" style="display: none;">
                        <h6>Select Room</h6>
                        @foreach($branches as $branch)
                            @foreach($branch->floors as $floor)
                                @foreach($floor->rooms as $room)
                                    <div class="btn-toggle" data-action="showTables" data-floor-id="{{ $floor->id }}" data-room-id="{{ $room->id }}" data-room-name="{{ $room->name }}">
                                        {{ $room->name }}
                                    </div>
                                @endforeach
                            @endforeach
                        @endforeach
                    </div>

                    <div class="selection-area" id="tables" style="display: none;">
                        <h6>Select Table</h6>
                        @foreach($branches as $branch)
                            @foreach($branch->floors as $floor)
                                @foreach($floor->rooms as $room)
                                    @foreach($room->tables as $table)
                                        <div class="btn-toggle" data-action="showChairs" data-room-id="{{ $room->id }}" data-table-id="{{ $table->id }}" data-table-name="{{ $table->name }}">
                                            {{ $table->name }}
                                        </div>
                                    @endforeach
                                @endforeach
                            @endforeach
                        @endforeach
                    </div>

                    <div class="selection-area" id="chairs" style="display: none;">
                        <h6>Select Chair</h6>
                        @foreach($branches as $branch)
                            @foreach($branch->floors as $floor)
                                @foreach($floor->rooms as $room)
                                    @foreach($room->tables as $table)
                                        @foreach($table->chairs as $chair)
                                            <div class="chair {{ $chair->status == 0 ? 'available' : 'reserved' }}"
                                                 data-table-id="{{ $table->id }}"
                                                 data-chair-id="{{ $chair->id }}"
                                                 data-chair-name="{{ $chair->name }}"
                                                 data-status="{{ $chair->status }}">
                                                {{ $chair->name }}
                                            </div>
                                        @endforeach
                                    @endforeach
                                @endforeach
                            @endforeach
                        @endforeach
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="confirmChairSelection" style="display: none;">
                        Confirm Selection
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
   $(document).ready(function() {
    let selectedInfo = {
        branch: '',
        floor: '',
        room: '',
        table: '',
        chairs: []
    };

    let selectedChairIds = [];

    // Navigation between sections
    $('.btn-toggle').on('click', function() {
        const action = $(this).data('action');
        const currentElement = $(this);

        switch(action) {
            case 'showFloors':
                selectedInfo.branch = currentElement.data('branch-name');
                $('#selectedBranchId').val(currentElement.data('branch-id'));
                $('#branchSelect').hide();
                $('#floors').show();
                break;
            case 'showRooms':
                selectedInfo.floor = currentElement.data('floor-name');
                $('#selectedFloorId').val(currentElement.data('floor-id'));
                $('#floors').hide();
                $('#rooms').show();
                break;
            case 'showTables':
                selectedInfo.room = currentElement.data('room-name');
                $('#selectedRoomId').val(currentElement.data('room-id'));
                $('#rooms').hide();
                $('#tables').show();
                break;
            case 'showChairs':
                selectedInfo.table = currentElement.data('table-name');
                $('#selectedTableId').val(currentElement.data('table-id'));
                $('#tables').hide();
                $('#chairs').show();
                $('#confirmChairSelection').show();
                break;
        }
    });

    // Chair selection with toggle logic
    $('.chair').on('click', function() {
        const $chair = $(this);
        const chairId = $chair.data('chair-id');
        const chairName = $chair.data('chair-name');
        const currentStatus = $chair.data('status');

        // Toggle logic
        if (currentStatus === 0) {
            // Chair is available, select it
            $chair.data('status', 1); // Mark as selected
            $chair.removeClass('available').addClass('reserved');
            selectedChairIds.push(chairId);
            selectedInfo.chairs.push({ id: chairId, name: chairName });
        } else if (currentStatus === 1) {
            // Chair is already selected, deselect it
            $chair.data('status', 0); // Mark as available
            $chair.removeClass('reserved').addClass('available');
            selectedChairIds = selectedChairIds.filter(id => id !== chairId);
            selectedInfo.chairs = selectedInfo.chairs.filter(chair => chair.id !== chairId);
        }

        // Update hidden input for chair IDs
        $('#selectedChairIds').val(selectedChairIds.join(','));

        // Enable/disable confirm button
        $('#confirmChairSelection').prop('disabled', selectedChairIds.length === 0);
    });

    // Confirm selection
    $('#confirmChairSelection').on('click', function() {
        if (selectedChairIds.length > 0) {
            const chairNames = selectedInfo.chairs.map(chair => chair.name).join(', ');
            const selectionSummary = `
                Branch: ${selectedInfo.branch},
                Floor: ${selectedInfo.floor},
                Room: ${selectedInfo.room},
                Table: ${selectedInfo.table},
                Chairs: ${chairNames}
            `;
            $('#selectedLocationInfo').text(selectionSummary);
            $('#branchModal').modal('hide');
            $('.selection-area').hide();
            $('#branchSelect').show();
            $('#confirmChairSelection').hide();
        }
    });

    // Form submission to backend
    $('#bookingForm').on('submit', function(e) {
        e.preventDefault();

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
                showNotification('Booking created successfully!', 'success');
                setTimeout(() => {
                    window.location.href = '{{ route("admin.booking.calendar") }}';
                }, 2000);
            },
            error: function(xhr) {
                showNotification('Booking failed. Please try again.', 'error');
                console.error(xhr.responseText);
            }
        });
    });

    function showNotification(message, type) {
        const notification = $('#notification');
        notification.removeClass('success error info').addClass(type);
        notification.text(message).fadeIn();
        setTimeout(() => notification.fadeOut(), 3000);
    }
});
</script>


@endsection
