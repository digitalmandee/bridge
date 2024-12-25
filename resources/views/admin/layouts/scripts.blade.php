<!-- core:js -->
<script src="{{ asset('adminPanel/vendors/core/core.js') }}"></script>
<!-- endinject -->

<!-- Plugin js for this page -->
<script src="{{ asset('adminPanel/vendors/flatpickr/flatpickr.min.js') }}"></script>
<script src="{{ asset('adminPanel/vendors/apexcharts/apexcharts.min.js') }}"></script>
<!-- End plugin js for this page -->

<!-- inject:js -->
<script src="{{ asset('adminPanel/vendors/feather-icons/feather.min.js') }}"></script>
<script src="{{ asset('adminPanel/js/template.js') }}"></script>
<!-- endinject -->

<!-- Custom js for this page -->
<script src="{{ asset('adminPanel/js/dashboard-light.js') }}"></script>
<!-- End custom js for this page -->

<!-- sidebar-active-script -->
<script>
    $(document).on('click', '.btn-toggle', function () {
        $('.btn-toggle').removeClass('active');
        $(this).addClass('active');
    });
</script>
<!-- sidebar-active-script -->

<!-- chart-script-cdn -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    // JavaScript code
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // 3 datasets for each month
    const expenses1 = [20000, 15000, 25000, 18000, 22000, 19000, 21000, 24000, 26000, 23000, 20000, 22000];
    const expenses2 = [17000, 14000, 24000, 16000, 20000, 18000, 20000, 23000, 25000, 22000, 19000, 21000];
    const expenses3 = [15000, 13000, 23000, 15000, 19000, 17000, 19000, 22000, 24000, 21000, 18000, 20000];

    const ctx1 = document.getElementById('expense-chart1').getContext('2d');
    const myChart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                data: expenses1,
                backgroundColor: '#FFCC16',
                borderWidth: 1,
                borderRadius: 10,
            },
            {
                data: expenses2,
                backgroundColor: '#F98550',
                borderWidth: 1,
                borderRadius: 10,
            },
            {
                data: expenses3,
                backgroundColor: '#2BB2FE',
                borderWidth: 1,
                borderRadius: 10,
            }
            ]
        },
        options: {
            scales: {
                y: {
                    display: true,
                },
                x: {
                    display: true,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        display: true,
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                }
            },
            elements: {
                bar: {
                    borderSkipped: false,
                    borderRadius: 10,
                }
            },
            grouped: true,
        }
    });
</script>
<!-- chart-script -->

<!-- tab-change -->
<script>
    document.querySelectorAll('.tab').forEach(tab =>
        tab.addEventListener('click', () => {
            document.querySelector('.tab.active')?.classList.remove('active');
            document.querySelector('.tab-content.active')?.classList.remove('active');
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        })
    );
</script>

<script>
    $(function () {
        const $startGroup = $('#start-date-group'),
            $endGroup = $('#end-date-group'),
            $duration = $('#duration'),
            $startLabel = $('#start-date-label'),
            $endLabel = $endGroup.find('.form-group label');

        function toggleDateFields() {
            const selectedDuration = $duration.val();
            const showStart = ['daily', 'weekly', 'monthly'].includes(selectedDuration);
            const showEnd = ['weekly', 'monthly'].includes(selectedDuration);

            $startGroup.toggle(showStart).toggleClass('show', showStart);
            $endGroup.toggle(showEnd).toggleClass('show', showEnd);
            $startLabel.text(showStart ? (selectedDuration === 'daily' ? 'Select Date' : 'Start Date') : '');
            if (showStart) $endLabel.text('End Date');
        }

        toggleDateFields();
        $duration.change(toggleDateFields);
        $('.tab').click(() => $duration.val('').change());
    });
</script>

{{-- to validate number input --}}
<script>
    function validateTotalMembers(input) {
        if (input.value < 1) {
            input.value = '';
        }
    }
</script>
<!-- jQuery Script -->
<script>
    $(document).ready(function () {
        // Function definitions
        function showFloors() {
            $('#floors').show();
            $('#rooms, #tables, #chairs').hide();
        }
        function showRooms() {
            $('#rooms').show();
            $('#tables, #chairs').hide();
        }
        function showTables() {
            $('#tables').show();
            $('#chairs').hide();
        }
        function showChairs() {
            $('#chairs').show();
        }
        function bookChair(chair) {
            if ($(chair).hasClass('available')) {
                $(chair).removeClass('available').addClass('booked');
                $('#notification').show().delay(2000).fadeOut();
            }
        }
        // Event delegation to handle button clicks
        $('#flats').on('click', '[data-action="showFloors"]', showFloors);
        $('#floors').on('click', '[data-action="showRooms"]', showRooms);
        $('#rooms').on('click', '[data-action="showTables"]', showTables);
        $('#tables').on('click', '[data-action="showChairs"]', showChairs);
        // Chair booking event
        $('#chairs').on('click', '[data-action="bookChair"]', function () {
            bookChair(this);
        });
    });
</script>
<!-- seatBooking -->
<script>
    function toggleBooking(chair) {
        chair.querySelector('img').src = '{{ asset('icons/booked.png') }}';
        showPopup();
    }

    function showPopup() {
        const popup = document.getElementById("bookingPopup");
        popup.classList.add("show");
        setTimeout(() => popup.classList.remove("show"), 1000);
    }

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab, .tab-content').forEach(el => {
                el.classList.remove('active');
            });
            tab.classList.add('active');
            document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
        });
    });

    document.getElementById('branchSelect')?.addEventListener('change', function () {
        const branchName = this.options[this.selectedIndex]?.getAttribute('data-branch-name');
        if (branchName) {
            document.getElementById('selectedBranchName').innerText = `You selected: ${branchName}`;
            new bootstrap.Modal(document.getElementById('branchModal')).show();
        }
    });
</script>