<!-- Include SweetAlert2 -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    // Initialize the Toast
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    function showToast(icon, message, backgroundColor) {
        Toast.fire({
            icon: icon,
            title: message,
            background: backgroundColor
        });
    }
</script>
<title>Bridge</title>
<link rel="stylesheet" href="{{ asset('custom/bridges.css') }}">
<!-- login-page -->
<div class="container">
    <div class="second_section">
        <div class="logo">
            <img src="{{ asset('images/welcome_page/Container.png') }}" alt="">
            <h1>Welcome To</h1>
        </div>
        <div class="form">
            <h2>Log in</h2>
            <form method="POST" action="{{ route('login') }}">
                @csrf
                <label for="email">Email*</label>
                <input class="form-control" type="email" name="email" id="email" placeholder="Email" required>
                <label for="password">Password*</label>
                <div class="password-container">
                    <input class="form-control" type="password" name="password" id="password" placeholder="Password"
                        required>
                    <span id="toggle-password" class="eye-icon">👁️</span>
                </div>
                <h6 class="forgot">Forgot Password?</h6>
                <button type="submit" class="login">Log in</button>
            </form>
            <!-- SweetAlert trigger -->
            @if (session('error'))
                <script>
                    showToast('error', '{{ session('error') }}', '#f8d7da');
                </script>
            @endif
        </div>
    </div>
</div>
<!-- login-page -->

<!-- password-show-hide -->
<script>
    document.getElementById('toggle-password').addEventListener('click', function() {
        const passwordField = document.getElementById('password');
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️'; // Change icon based on visibility
    });
</script>
<!-- password-show-hide -->
