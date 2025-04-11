<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Invoice Email</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 40px;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 40px; border-radius: 8px;">

        <!-- Logo -->
        <tr>
            <td align="left" style="padding-bottom: 40px;">
                <img src="{{ url('images/blogo.png') }}" alt="Logo" style="width: 120px;">
            </td>
        </tr>

        <!-- Title -->
        <tr>
            <td style="text-align: left; font-size: 26px; font-weight: bold; color: #333333; padding-bottom: 20px;">
                Invoice Details
            </td>
        </tr>

        <!-- Invoice Details -->
        <tr>
            <td style="padding-bottom: 30px;">
                <table width="100%" cellpadding="10" cellspacing="0" border="0"
                    style="font-size: 16px; color: #333; background-color: #f9f9f9; border-radius: 6px;">
                    <tr>
                        <td><strong>Invoice #:</strong></td>
                        <td>INV-000123</td>
                    </tr>
                    <tr>
                        <td><strong>Booking ID:</strong></td>
                        <td>INV-000123</td>
                    </tr>
                    <tr>
                        <td><strong>Type:</strong></td>
                        <td>Monthly</td>
                    </tr>
                    <tr>
                        <td><strong>Client:</strong></td>
                        <td>John Doe</td>
                    </tr>
                    <tr>
                        <td><strong>Issue Date:</strong></td>
                        <td>April 10, 2025</td>
                    </tr>
                    <tr>
                        <td><strong>Payment Date:</strong></td>
                        <td>April 17, 2025</td>
                    </tr>
                    <tr>
                        <td><strong>Status:</strong></td>
                        <td style="color: green;">Paid</td>
                    </tr>
                    <tr>
                        <td><strong>Amount:</strong></td>
                        <td><strong>$120.00</strong></td>
                    </tr>
                </table>
            </td>
        </tr>


        <!-- Footer -->
        <tr>
            <td style="text-align: left; font-size: 12px; color: #999;">
                © 2025 Your Company Name. All rights reserved.
            </td>
        </tr>
    </table>

</body>

</html>
