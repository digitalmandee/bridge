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
    $(document).on('click', '.btn-toggle', function() {
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
