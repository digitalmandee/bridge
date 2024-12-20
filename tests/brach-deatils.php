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
    }

    .available {
        background-color: green;
        color: white;
        cursor: pointer;
    }

    .reserved {
        background-color: red;
        color: white;
        cursor: not-allowed;
    }

    .selected {
        background-color: blue;
        color: white;
    }
    .permanently-selected {
        background-color: gray; /* Change to your desired color */
        color: white;
        cursor: not-allowed; /* Change cursor to indicate it's not selectable */
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
<div class="modal fade" id="branchModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Select Location</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="selection-area" id="branchSelect">
                        <h6>Select Branch</h6>
                        @foreach($branches as $branch)
                            <div class="btn-toggle" data-action="showFloors" data-branch-id="{{ $branch->id }}"
                                 data-branch-name="{{ $branch->name }}">
                                {{ $branch->name }}
                            </div>
                        @endforeach
                    </div>

                    <div class="selection-area" id="floors" style="display: none;">
                        <h6>Select Floor</h6>
                        @foreach($branches as $branch)
                            @foreach($branch->floors as $floor)
                                <div class="btn-toggle" data-action="showRooms"
                                     data-branch-id="{{ $branch->id }}"
                                     data-floor-id="{{ $floor->id }}"
                                     data-floor-name="{{ $floor->name }}">
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
                                    <div class="btn-toggle" data-action="showTables"
                                         data-floor-id="{{ $floor->id }}"
                                         data-room-id="{{ $room->id }}"
                                         data-room-name="{{ $room->name }}">
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
                                        <div class="btn-toggle" data-action="showChairs"
                                             data-room-id="{{ $room->id }}"
                                             data-table-id="{{ $table->id }}"
                                             data-table-name="{{ $table->name }}">
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
                                                 data-chair-name="{{ $chair->name }}">
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
    <script>
    $(document).ready(function() {
        let selectedInfo = {
            branch: '',
            floor: '',
            room: '',
            table: '',
            chairs: [] // Changed from single chair to array of chairs
        };

        let selectedChairIds = JSON.parse(localStorage.getItem('selectedChairs')) || []; // Load from local storage

        // Mark previously selected chairs as permanently selected
        selectedChairIds.forEach(function(chairId) {
            const chair = $('.chair[data-chair-id="' + chairId + '"]');
            chair.addClass('permanently-selected').removeClass('available');
        });

        // Update hidden input with comma-separated chair IDs
        $('#selectedChairId').val(selectedChairIds.join(','));

        // Enable/disable confirm button based on selection
        $('#confirmChairSelection').prop('disabled', selectedChairIds.length === 0);

        // Handle selection steps
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

        // Event listener for chair selection
        $('.chair').on('click', function() {
            if ($(this).hasClass('available') && !$(this).hasClass('permanently-selected')) {
                const chairId = $(this).data('chair-id');
                const chairName = $(this).data('chair-name');

                // Select chair and mark as permanently selected
                $(this).addClass('selected permanently-selected').removeClass('available');

                // Store chair as permanently selected
                selectedChairIds.push(chairId);
                selectedInfo.chairs.push({
                    id: chairId,
                    name: chairName
                });

                // Store the selected chair state in local storage
                localStorage.setItem('selectedChairs', JSON.stringify(selectedChairIds));

                // Update hidden input with comma-separated chair IDs
                $('#selectedChairId').val(selectedChairIds.join(','));

                // Enable/disable confirm button based on selection
                $('#confirmChairSelection').prop('disabled', selectedChairIds.length === 0);

                console.log('Selected Chair ID:', chairId);
            } else if ($(this).hasClass('permanently-selected')) {
                alert('This chair is already selected and cannot be chosen again.');
            }
        });

        // Modified chair confirmation to handle multiple chairs
        $('#confirmChairSelection').on('click', function() {
            if (selectedChairIds.length > 0) {
                // Create selection summary
                const chairNames = selectedInfo.chairs.map(chair => chair.name).join(', ');
                const selectionSummary = `
                    Branch: ${selectedInfo.branch},
                    Floor: ${selectedInfo.floor},
                    Room: ${selectedInfo.room},
                    Table: ${selectedInfo.table},
                    Chairs: ${chairNames}
                `;
                $('#selectedLocationInfo').text(selectionSummary);

                // Close modal
                $('#branchModal').modal('hide');

                // Reset modal state for next opening
                $('.selection-area').hide();
                $('#branchSelect').show();
                $('#confirmChairSelection').hide();
            }
        });

        // Modified form submission to handle multiple chairs
        $('#bookingForm').on('submit', function (e) {
            e.preventDefault();

            if (selectedChairIds.length === 0) {
                showNotification('Please select at least one chair', 'error');
                return;
            }

            const formData = $(this).serialize();

            $.ajax({
                url: $(this).attr('action'),
                method: 'POST',
                data: formData,
                success: function(response) {
                    showNotification('Booking successful!', 'success');
                    setTimeout(() => {
                        window.location.href = '{{ route("booking.stripe") }}';
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
            notification.removeClass('success error').addClass(type);
            notification.text(message).fadeIn();
            setTimeout(() => notification.fadeOut(), 3000);
        }
    });
</script>
