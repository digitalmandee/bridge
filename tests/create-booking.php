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
    }

    .btn-toggle:hover {
        background-color: #f0f0f0;
    }

    .chair {
        display: inline-block;
        padding: 10px 20px;
        margin: 5px;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
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

    .selection-section {
        margin-bottom: 20px;
    }

    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 10px;
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

                <input type="hidden" name="branch_id" id="selectedBranchId">
                <input type="hidden" name="floor_id" id="selectedFloorId">
                <input type="hidden" name="room_id" id="selectedRoomId">
                <input type="hidden" name="chair_ids" id="selectedChairIds">

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

                <button type="button" class="btn btn-primary" id="openSelectionModal" style="display: none;">Select Location</button>
                <button type="submit" class="btn btn-primary">Submit Booking</button>
            </form>
        </div>
    </div>

    <div class="modal fade" id="selectionModal" tabindex="-1" aria-labelledby="selectionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="selectionModalLabel">Select Your Location</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="locationSelection">
                        <div class="selection-section">
                            <h6>Select Floor</h6>
                            <div id="floorButtons" class="grid-container"></div>
                        </div>
                        <div class="selection-section">
                            <h6>Select Room</h6>
                            <div id="roomButtons" class="grid-container"></div>
                        </div>
                        <div class="selection-section">
                            <h6>Select Chair</h6>
                            <div id="chairButtons" class="grid-container"></div>
                        </div>
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

    $('#branchSelect').on('change', function() {
        const selectedBranchId = $(this).val();
        $('#selectedBranchId').val(selectedBranchId);
        loadFloors(selectedBranchId);
        $('#openSelectionModal').show();
    });

    $('#openSelectionModal').on('click', function() {
        $('#selectionModal').modal('show');
    });

    function loadFloors(branchId) {
        $('#floorButtons').empty();
        $('#roomButtons').empty();
        $('#chairButtons').empty();

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

    $(document).on('click', '.btn-toggle[data-floor-id]', function() {
        const floorId = $(this).data('floor-id');
        $('#selectedFloorId').val(floorId);
        loadRooms(floorId);
    });

    function loadRooms(floorId) {
        $('#roomButtons').empty();
        $('#chairButtons').empty();

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

    $(document).on('click', '.btn-toggle[data-room-id]', function() {
        const roomId = $(this).data('room-id');
        $('#selectedRoomId').val(roomId);
        loadChairs(roomId);
    });

    function loadChairs(roomId) {
        $('#chairButtons').empty();

        @foreach($branches as $branch)
            @foreach($branch->floors as $floor)
                @foreach($floor->rooms as $room)
                    if (roomId == "{{ $room->id }}") {
                        @foreach($room->chairs as $chair)
                            $('#chairButtons').append(`
                                <div class="chair {{ $chair->status == 0 ? 'available' : 'reserved' }}"
                                     data-chair-id="{{ $chair->id }}">
                                    {{ $chair->name }}
                                </div>
                            `);
                        @endforeach
                    }
                @endforeach
            @endforeach
        @endforeach
    }

    $(document).on('click', '.chair', function() {
        const $chair = $(this);
        const chairId = $chair.data('chair-id');

        if ($chair.hasClass('available')) {
            $chair.removeClass('available').addClass('reserved');
            selectedChairIds.push(chairId);
        } else {
            $chair.removeClass('reserved').addClass('available');
            selectedChairIds = selectedChairIds.filter(id => id !== chairId);
        }
    });

    $('#bookingForm').on('submit', function(e) {
        e.preventDefault();

        if (selectedChairIds.length === 0) {
            showNotification('Please select at least one chair', 'error');
            return;
        }

        $('#selectedChairIds').val(selectedChairIds.join(','));

        this.submit(); // Submit the form
    });

    function showNotification(message, type) {
        const notification = $('#notification');
        notification.removeClass('success error').addClass(type);
        notification.html(message).fadeIn();
        setTimeout(() => notification.fadeOut(), 3000);
    }
});
</script>

@endsection
