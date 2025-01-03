<style>
    .branch-chair {
        margin: 10px; 
        background-color: transparent;
        border: none;
    }

    .branch-chair img {
        width: 70px;
        height: 70px;
    }

    .table-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .top-row, .bottom-row {
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    .table-inner {
        border: 1px solid #ccc;
        margin: 20px;
        padding: 10px;
    }

    /* Toast Notification Styles */
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #f44336;
        color: white;
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        display: none;
        z-index: 1000;
    }
    #step3 {
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   padding: 20px;
   }
   .card-body h4 {
   margin-bottom: 15px;
   }
   .payment-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: flex-start;
   padding: 10px;
   }
   .payment-options {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   margin-top: 20px;
   }
   .option {
   display: flex;
   flex-direction: column;
   align-items: center;
   text-align: center;
   cursor: pointer;
   transition: transform 0.3s ease;
   padding: 10px;
   border: 1px solid #ccc;
   border-radius: 10px;
   background-color: #f9f9f9;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
   width: 120px;
   height: 100px;
   justify-content: center;
   }
   .option img {
   margin-bottom: 5px;
   width: 40px;
   height: auto;
   }
   .option:hover {
   transform: scale(1.05);
   }
   .payment-fields {
   width: 100%;
   margin-top: 20px;
   }
   .upload-details {
   margin-top: 15px;
   }
   .footer {
   margin-top: 25px;
   text-align: center;
   }
   .card {
   background: #fff;
   border-radius: 10px;
   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
