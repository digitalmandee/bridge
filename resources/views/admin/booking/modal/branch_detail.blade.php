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


                <div class="selection-area" id="chairs" style="display: none;">
                    <h6>Select Chair</h6>
                    @foreach($branches as $branch)
                        @foreach($branch->floors as $floor)
                            @foreach($floor->rooms as $room)
                                @foreach($room->tables as $table)
                                    @foreach($table->chairs as $chair)
                                        <div class="chair {{ $chair->status == 0 ? 'available' : 'reserved' }}"
                                            data-table-id="{{ $table->id }}" data-chair-id="{{ $chair->id }}"
                                            data-chair-name="{{ $chair->name }}" data-status="{{ $chair->status }}">
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
                <button type="button" class="layout-btn" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="layout-btn active" id="confirmChairSelection" style="display: none;">
                    Confirm Selection
                </button>
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

    // Chair selection with status toggle
    $('.chair').on('click', function() {
        const $chair = $(this);
        const chairId = $chair.data('chair-id');
        const chairName = $chair.data('chair-name');
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
            selectedInfo.chairs.push({
                id: chairId,
                name: chairName
            });
        } else {
            selectedChairIds.splice(chairIndex, 1);
            selectedInfo.chairs = selectedInfo.chairs.filter(chair => chair.id !== chairId);
        }

        // Update hidden input
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

    // Form submission
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
                showNotification('Booking successful!', 'success');
                setTimeout(() => {
                    window.location.href = '{{ route("admin.booking.calendar") }}';
                }, 2000);
            },
            error: function(xhr) {
                showNotification('Booking failed. Please try again.', 'error');
                console.error(xhr.responseText);
            }
        });

        // Chair selection with status toggle
        $('.chair').on('click', function () {
            const $chair = $(this);
            const chairId = $chair.data('chair-id');
            const chairName = $chair.data('chair-name');
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
                selectedInfo.chairs.push({
                    id: chairId,
                    name: chairName
                });
            } else {
                selectedChairIds.splice(chairIndex, 1);
                selectedInfo.chairs = selectedInfo.chairs.filter(chair => chair.id !== chairId);
            }

            // Update hidden input
            $('#selectedChairIds').val(selectedChairIds.join(','));

            // Enable/disable confirm button
            $('#confirmChairSelection').prop('disabled', selectedChairIds.length === 0);
        });

        // Confirm selection
        $('#confirmChairSelection').on('click', function () {
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

        // Form submission
        $('#bookingForm').on('submit', function (e) {
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
                success: function (response) {
                    showNotification('Booking successful!', 'success');
                    setTimeout(() => {
                        window.location.href = '{{ route("admin.booking.calendar") }}';
                    }, 2000);
                },
                error: function (xhr) {
                    showNotification('Booking failed. Please try again.', 'error');
                    console.error(xhr.responseText);
                }
            });
        });

        function showNotification(message, type) {
            const notification = $('#notification');
            notification.removeClass('success error').addClass(type);
            notification.text(message).fadeIn();
            setTimeout(() => notification.fadeOut(), 3000);
        }
    });

    function showNotification(message, type) {
        const notification = $('#notification');
        notification.removeClass('success error').addClass(type);
        notification.text(message).fadeIn();
        setTimeout(() => notification.fadeOut(), 3000);
    }
});
</script>
