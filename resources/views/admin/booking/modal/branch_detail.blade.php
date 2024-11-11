<!-- HTML structure -->
<div class="modal modal-lg fade" id="branchModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Booking System</h5>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Flat Selection -->
                <div id="flats">
                    <h4>Select a Branch</h4>
                    <div class="flat btn-toggle" data-action="showFloors">Johar Town</div>
                    <div class="flat btn-toggle" data-action="showFloors">Model Town</div>
                    <div class="flat btn-toggle" data-action="showFloors">Gulberg</div>
                    <div class="flat btn-toggle" data-action="showFloors">DHA</div>
                    <div class="flat btn-toggle" data-action="showFloors">Bahria Town</div>
                </div>

                <!-- Floor Selection -->
                <div id="floors" style="display: none;">
                    <h4>Select a Floor</h4>
                    <div class="floor btn-toggle" data-action="showRooms">Floor 1</div>
                    <div class="floor btn-toggle" data-action="showRooms">Floor 2</div>
                    <div class="floor btn-toggle" data-action="showRooms">Floor 3</div>
                </div>

                <!-- Room Selection -->
                <div id="rooms" style="display: none;">
                    <h4>Select a Room</h4>
                    <div class="room btn-toggle" data-action="showTables">Room 101</div>
                    <div class="room btn-toggle" data-action="showTables">Room 102</div>
                    <div class="room btn-toggle" data-action="showTables">Room 103</div>
                </div>

                <!-- Table Selection -->
                <div id="tables" style="display: none;">
                    <h4>Select a Table</h4>
                    <div class="tabl btn-toggle" data-action="showChairs">Table 1</div>
                    <div class="tabl btn-toggle" data-action="showChairs">Table 2</div>
                    <div class="tabl btn-toggle" data-action="showChairs">Table 3</div>
                </div>

                <!-- Chair Selection -->
                <div id="chairs" style="display: none;">
                    <h4>Select a Chair</h4>
                    <div class="chair available" data-action="bookChair">Chair 1</div>
                    <div class="chair booked">Chair 2</div>
                    <div class="chair available" data-action="bookChair">Chair 3</div>
                    <div class="chair damaged">Chair 4</div>
                    <div class="chair available" data-action="bookChair">Chair 5</div>
                </div>

                <!-- Notification -->
                <div id="notification" style="display: none;">Seat booked successfully!</div>
            </div>
        </div>
    </div>
</div>