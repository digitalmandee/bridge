<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Welcome Email</title>
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
                Welcome to Our Platform
            </td>
        </tr>

        <!-- Paragraph -->
        <tr>
            <td style="padding-bottom: 30px; font-size: 16px; color: #555555; line-height: 1.6;">
                Thank you for signing up! Below are your login credentials. Please keep them safe and secure.
            </td>
        </tr>

        <!-- Credentials -->
        <tr>
            <td
                style="background-color: #f0f0f0; padding: 20px; border-radius: 6px; font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 30px;">
                <strong>Email:</strong> user@example.com<br>
                <strong>Password:</strong> user_password123
            </td>
        </tr>

        <!-- Spacer -->
        <tr>
            <td style="height: 30px;"></td>
        </tr>

        <!-- Button -->
        <tr>
            <td align="left" style="padding-bottom: 40px;">
                <a href="https://yourdomain.com/login"
                    style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                    Login to Your Account
                </a>
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
