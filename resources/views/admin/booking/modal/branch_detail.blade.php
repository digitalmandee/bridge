<div class="modal modal-lg fade" id="branchModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Booking System</h5>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">

                <!-- Flat Selection -->
                <div id="flats">
                    <h4>Select a Branch</h4>
                    <div class="flat btn-toggle" onclick="showFloors(this)">Johar Town</div>
                    <div class="flat btn-toggle" onclick="showFloors(this)">Model Town</div>
                    <div class="flat btn-toggle" onclick="showFloors(this)">Gulberg</div>
                    <div class="flat btn-toggle" onclick="showFloors(this)">DHA</div>
                    <div class="flat btn-toggle" onclick="showFloors(this)">Bahria Town</div>
                </div>

                <!-- Floor Selection -->
                <div id="floors">
                    <h4>Select a Floor</h4>
                    <div class="floor btn-toggle" onclick="showRooms(this)">Floor 1</div>
                    <div class="floor btn-toggle" onclick="showRooms(this)">Floor 2</div>
                    <div class="floor btn-toggle" onclick="showRooms(this)">Floor 3</div>
                </div>

                <!-- Room Selection -->
                <div id="rooms">
                    <h4>Select a Room</h4>
                    <div class="room btn-toggle" onclick="showTables(this)">Room 101</div>
                    <div class="room btn-toggle" onclick="showTables(this)">Room 102</div>
                    <div class="room btn-toggle" onclick="showTables(this)">Room 103</div>
                </div>

                <!-- Table Selection -->
                <div id="tables">
                    <h4>Select a Table</h4>
                    <div class="tabl btn-toggle" onclick="showChairs(this)">Table 1</div>
                    <div class="tabl btn-toggle" onclick="showChairs(this)">Table 2</div>
                    <div class="tabl btn-toggle" onclick="showChairs(this)">Table 3</div>
                </div>

                <!-- Chair Selection -->
                <div id="chairs">
                    <h4>Select a Chair</h4>
                    <div class="chair available" onclick="bookChair(this)">Chair 1</div>
                    <div class="chair booked">Chair 2</div>
                    <div class="chair available" onclick="bookChair(this)">Chair 3</div>
                    <div class="chair damaged">Chair 4</div>
                    <div class="chair available" onclick="bookChair(this)">Chair 5</div>
                </div>
                <!-- Notification -->
                <div id="notification">Seat booked successfully!</div>
            </div>
        </div>
    </div>
</div>
