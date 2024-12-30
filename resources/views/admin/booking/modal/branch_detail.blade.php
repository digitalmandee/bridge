<!-- Modal -->
<div class="modal fade bd-example-modal-lg" id="branchModal" tabindex="-1" aria-labelledby="branchModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="selectedBranchName" </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="tab-container">
                    <ul class="tab-list">
                        <li class="tab active" data-tab="tab1">Ground Floor</li>
                        <li class="tab" data-tab="tab2">Frist Floor</li>
                    </ul>
                    <div class="tab-content-container">
                        <div id="tab1" class="tab-content active">
                            <div class="d-flex gap-2">
                                <!-- Branch Selection -->
                                <div class="table-container">
                                    <div class="table-inner"></div>
                                    <!-- Top Chairs -->
                                    <div class="branch-chair chair-top-1" onclick="toggleBooking(this)">
                                        <img src="{{ asset('icons/free.png') }}" alt="Chair">
                                    </div>
                                    <div class="branch-chair chair-top-2" onclick="toggleBooking(this)">
                                        <img src="{{ asset('icons/free.png') }}" alt="Chair">
                                    </div>
                                    <div class="branch-chair chair-top-3" onclick="toggleBooking(this)">
                                        <img src="{{ asset('icons/free.png') }}" alt="Chair">
                                    </div>
                                    <!-- Bottom Chairs -->
                                    <div class="branch-chair chair-bottom-1" onclick="toggleBooking(this)">
                                        <img src="{{ asset('icons/free.png') }}" alt="Chair">
                                    </div>
                                    <div class="branch-chair chair-bottom-2" onclick="toggleBooking(this)">
                                        <img src="{{ asset('icons/free.png') }}" alt="Chair">
                                    </div>
                                    <div class="branch-chair chair-bottom-3" onclick="toggleBooking(this)">
                                        <img src="{{ asset('icons/free.png') }}" alt="Chair">
                                    </div>
                                </div>
                                <!--  -->
                                <div class="table-container">
                                    <div class="table-inner"></div>
                                    <!-- Top Chairs -->
                                    <div class="branch-chair chair-top-1" onclick="toggleBooking(this)">
                                        <img src="{{ asset('icons/free.png') }}" alt="Chair">
                                    </div>
                                    <div class="branch-chair chair-top-2" onclick="toggleBooking(this)">
                                        <img src="{{ asset('icons/free.png') }}" alt="Chair">
                                    </div>
                                    <div class="branch-chair chair-top-3" onclick="toggleBooking(this)">
                                        <img src="{{ asset('icons/free.png') }}" alt="Chair">
                                    </div>
                                    <!-- Bottom Chairs -->
                                    <div class="branch-chair chair-bottom-1" onclick="toggleBooking(this)">
                                        <img src="{{ asset('icons/free.png') }}" alt="Chair">
                                    </div>
                                    <div class="branch-chair chair-bottom-2" onclick="toggleBooking(this)">
                                        <img src="{{ asset('icons/free.png') }}" alt="Chair">
                                    </div>
                                    <div class="branch-chair chair-bottom-3" onclick="toggleBooking(this)">
                                        <img src="{{ asset('icons/free.png') }}" alt="Chair">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="tab2" class="tab-content">
                          <h1>yasir</h1>
                        </div>
                    </div>
                </div>
                <div id="bookingPopup" class="popup">booked Successfully!</div>
            </div>
            <div class="modal-footer mt-5">
                <button type="button" class="layout-btn" data-bs-dismiss="modal">Submit</button>
            </div>
        </div>
    </div>
</div>