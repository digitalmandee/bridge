<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bridge</title>
    <link rel="stylesheet" href="{{ asset('custom/bridges.css') }}">
</head>

<body>
    <div class="container">
        <div class="first_section">
            <div class="logo">
                <img src="{{ asset('images/welcome_page/Container.png') }}" alt="">
                <h1>Welcome To</h1>
            </div>
            <p>Chose Account Type</p>
            <div class="login_section">
                <div class="four_login_section">
                    <a href="#">
                    <img src="{{ asset('images/welcome_page/Branch.png') }}" alt="Branch">
                    <h5>Branch Login</h5>
                    </a>
                </div>
                <div class="four_login_section">
                <a href="#">
                    <img src="{{ asset('images/welcome_page/Investigation.png') }}" alt="Investigation">
                    <h5>Investor Login</h5>
                    </a>
                </div>
                <div class="four_login_section">
                    <a href="{{ route('login') }}">
                    <img src="{{ asset('images/welcome_page/SuperAdmin.png') }}" alt="SuperAdmin">
                    <h5>Super Admin</h5>
                    </a>
                </div>
                <div class="four_login_section">
                    <a href="#">
                    <img src="{{ asset('images/welcome_page/user.png') }}" alt="user">
                    <h5>User</h5>
                    </a>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
