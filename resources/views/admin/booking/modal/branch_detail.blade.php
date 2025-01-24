<style>
    .branch-chair {
        margin: 10px; /* Spacing between chairs */
        background-color: transparent; /* Removes background color */
        border: none;
    }

    .branch-chair img {
        width: 70px; /* Increased size of the chair */
        height: 70px;
    }

    .table-container {
        display: flex;
        flex-direction: column; /* Arrange chairs in rows */
        align-items: center; /* Center-align rows */
        gap: 20px; /* Space between top and bottom rows */
    }

    .top-row, .bottom-row {
        display: flex; /* Align chairs horizontally in each row */
        justify-content: center; /* Center chairs within the row */
        gap: 20px; /* Equal spacing between chairs in the row */
    }

    .table-inner {
        border: 1px solid #ccc; /* Optional: Table boundary */
        margin: 20px;
        padding: 10px;
    }

    /* Toast Notification Styles */
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #f44336; /* Red background */
        color: white;
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        display: none; /* Hidden by default */
        z-index: 1000; /* Ensure it appears above other content */
    }
</style>
<div class="modal fade bd-example-modal-lg" id="branchModal" tabindex="-1" aria-labelledby="branchModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="selectedBranchName"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="tab-container">
                    <ul class="tab-list">
                        <li class="tab active" data-tab="tab1" onclick="checkFloorStatus(1)">Ground Floor</li>
                        <li class="tab" data-tab="tab2" onclick="checkFloorStatus(2)">First Floor</li>
                    </ul>
                    <div class="tab-content-container">
                        <div id="tab1" class="tab-content active" onclick="checkFloorStatus(1)">
                            <div class="d-flex gap-2">
                                <!-- Ground Floor -->
                                @foreach(array_chunk($chairs->where('floor_id', 1)->all(), 6) as $tableChairs)
                                    <div class="table-container">
                                        <div class="table-inner"></div>
                                        <div class="top-row">
                                            @foreach($tableChairs as $chair)
                                                @if($chair->position == 'top')
                                                    <div class="branch-chair chair-top-{{ $loop->index + 1 }}"
                                                         onclick="selectChair({{ $chair->id }}, 1, {{ $chair->status }})">
                                                        <img src="{{ asset($chair->status == 0 ? 'icons/free.png' : 'icons/booked.png') }}" alt="Chair">
                                                    </div>
                                                @endif
                                            @endforeach
                                        </div>
                                        <div class="bottom-row">
                                            @foreach($tableChairs as $chair)
                                                @if($chair->position == 'bottom')
                                                    <div class="branch-chair chair-bottom-{{ $loop->index + 1 }}"
                                                         onclick="selectChair({{ $chair->id }}, 1, {{ $chair->status }})">
                                                        <img src="{{ asset($chair->status == 0 ? 'icons/free.png' : 'icons/booked.png') }}" alt="Chair">
                                                    </div>
                                                @endif
                                            @endforeach
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                        <div id="tab2" class="tab-content">
                            <div class="d-flex gap-2">
                                <!-- First Floor -->
                                @foreach(array_chunk($chairs->where('floor_id', 2)->all(), 6) as $tableChairs)
                                    <div class="table-container">
                                        <div class="table-inner"></div>
                                        <div class="top-row">
                                            @foreach($tableChairs as $chair)
                                                @if($chair->position == 'top')
                                                    <div class="branch-chair chair-top-{{ $loop->index + 1 }}"
                                                         onclick="selectChair({{ $chair->id }},  2, {{ $chair->status }})">
                                                        <img src="{{ asset($chair->status == 0 ? 'icons/free.png' : 'icons/booked.png') }}" alt="Chair">
                                                    </div>
                                                @endif
                                            @endforeach
                                        </div>
                                        <div class="bottom-row">
                                            @foreach($tableChairs as $chair)
                                                @if($chair->position == 'bottom')
                                                    <div class="branch-chair chair-bottom-{{ $loop->index + 1 }}"
                                                         onclick="selectChair({{ $chair->id }}, 2, {{ $chair->status }})">
                                                        <img src="{{ asset($chair->status == 0 ? 'icons/free.png' : 'icons/booked.png') }}" alt="Chair">
                                                    </div>
                                                @endif
                                            @endforeach
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
                <div id="bookingPopup" class="toast">This chair is already booked and cannot be selected.</div>
            </div>
            <div class="modal-footer mt-5">
                <button type="button" class="layout-btn" data-bs-dismiss="modal">Submit</button>
            </div>
        </div>
    </div>
</div>
