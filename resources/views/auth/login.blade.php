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
        <div class="second_section">
            <div class="logo">
                <img src="{{ asset('images/welcome_page/Container.png') }}" alt="">
                <h1 style="left: 8px;">Welcome To</h1>
            </div>
            <div class="form">
                <h2>Log in</h2>
                <form method="POST" action="{{ route('login') }}">
                    @csrf
                    <label for="email">Email*</label>
                    <input type="email" name="email" id="email" placeholder="Email">
                    <label for="password">Password*</label>
                    <input type="password" name="password" id="password" placeholder="Password">
                    {{-- <h6>Forgot Password?</h6> --}}
                    <button class="login">Log in</button>
                </form>
                {{-- <p href="#">Don't have an Account account? Sign up</p> --}}
            </div>
        </div>
    </div>
</body>

</html>
