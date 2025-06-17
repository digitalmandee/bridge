<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>{{ $data['title'] }}</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #333;
            background: #f5f5f5;
        }

        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px 0 #0000001A;
            text-align: center;
        }

        h1 {
            color: #4CAF50;
            margin-bottom: 20px;
            font-size: 24px;
        }

        p {
            font-size: 16px;
            margin-bottom: 20px;
        }

        .details {
            background: #edf5ff;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 20px;
            text-align: left;
        }

        .details p {
            margin-bottom: 10px;
        }

        .cta a {
            display: inline-block;
            padding: 10px 20px;
            background: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }

        @media (max-width: 500px) {
            .container {
                padding: 20px;
            }

            h1 {
                font-size: 20px;
            }

            p {
                font-size: 14px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Company Logo -->
        <img src="{{ url('images/blogo.png') }}" alt="Logo" style="width: 120px; margin-bottom: 30px;">

        <h1>{{ $data['title'] }}</h1>
        <p>Hi {{ $data['username'] }},</p>
        <p>{{ $data['message'] }}</p>

        <div class="details">
            <p><strong>Invoice Number:</strong> {{ $data['invoice_id'] }}</p>
            <p><strong>Status:</strong> {{ ucfirst($data['status']) }}</p>
        </div>

        <p>Thank you for choosing Bridge.</p>
    </div>
</body>

</html>
