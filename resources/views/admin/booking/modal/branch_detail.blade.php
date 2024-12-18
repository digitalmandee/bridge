


<style>
    .available {
        background-color: green; /* Available chairs */
        color: white;
        cursor: pointer;
    }

    .reserved {
        background-color: red; /* Reserved chairs */
        color: white;
        cursor: not-allowed;
    }
</style>


<script>
$(document).ready(function () {
    $('.btn-toggle').on('click', function () {
        const action = $(this).data('action');

        switch (action) {
            case 'showFloors':
                $('#selectedBranchId').val($(this).data('branch-id'));
                $('#floors').show();
                break;
            case 'showRooms':
                $('#selectedFloorId').val($(this).data('floor-id'));
                $('#rooms').show();
                break;
            case 'showTables':
                $('#selectedRoomId').val($(this).data('room-id'));
                $('#tables').show();
                break;
            case 'showChairs':
                $('#selectedTableId').val($(this).data('table-id'));
                $('#chairs').show();
                break;
        }
    });

    $('.chair').on('click', function() {
        if ($(this).hasClass('available')) {
            $('.chair').removeClass('selected');

            $(this).addClass('selected');
            $(this).removeClass('available').addClass('reserved');

            const chairId = $(this).data('chair-id');
            $('#selectedChairId').val(chairId);

            console.log('Selected Chair ID:', chairId);
        } else if ($(this).hasClass('reserved')) {
            alert('This chair is already reserved.');
        }
    });

    $('#bookingForm').on('submit', function(e) {
        e.preventDefault();

        const chairId = $('#selectedChairId').val();
        if (!chairId) {
            alert('Please select a chair first');
            return;
        }

        let formData = $(this).serialize();
        console.log('Form Data:', formData);

        $.ajax({
            url: $(this).attr('action'),
            method: 'POST',
            data: formData,
            success: function(response) {
                $('#notification').text('Seat booked successfully!').show().delay(2000).fadeOut();
            },
            error: function(xhr) {
                console.error(xhr.responseText);
                $('#notification').text('Booking failed. Please try again.').show().delay(2000).fadeOut();
            }
        });
    });
});

</script>

