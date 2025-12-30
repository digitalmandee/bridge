<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>{{ $data['title'] }}</title>
</head>

<body
    style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #e4e4e4; margin: 0; padding: 20px;">

    <!-- Wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e4e4e4;">
        <tr>
            <td align="center">
                <!-- Container -->
                <table width="800" cellpadding="0" cellspacing="0" border="0"
                    style="background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin: 0 auto; max-width: 800px;">

                    <!-- Header Image -->
                    <tr>
                        <td style="width: 100%;">
                            <img src="{{ url('invoice-header.png') }}" alt="Bridge Co-Working Space"
                                style="width: 100%; height: auto; display: block;">
                        </td>
                    </tr>

                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding: 20px 0 10px 0;">
                            <h1
                                style="margin: 0; font-size: 24px; font-weight: bold; font-family: sans-serif; color: #000;">
                                {{ $data['title'] }}</h1>
                        </td>
                    </tr>

                    <!-- Greeting & Message -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px; font-size: 16px; color: #333; line-height: 1.6;">
                            <p style="margin-bottom: 15px;">Hi <strong>{{ $data['username'] }}</strong>,</p>
                            <p style="margin-bottom: 20px;">{{ $data['message'] }}</p>

                            <!-- Status Box -->
                            <div
                                style="background-color: #f9f9f9; border-left: 4px solid #ffcc16; padding: 15px; margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Invoice Number
                                        </div>
                                        <div style="font-size: 18px; font-weight: bold; color: #000;">
                                            #{{ $data['invoice_id'] }}</div>
                                    </div>
                                    <div>
                                        <div
                                            style="font-size: 14px; color: #666; margin-bottom: 5px; text-align: right;">
                                            Status</div>
                                        <div
                                            style="font-size: 18px; font-weight: bold; color: {{ $data['status'] === 'paid' ? 'green' : ($data['status'] === 'overdue' ? 'red' : '#ffcc16') }}; text-transform: capitalize; text-align: right;">
                                            {{ $data['status'] }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- Items Table -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="border-collapse: collapse; width: 100%;">
                                <thead>
                                    <tr style="background-color: #000;">
                                        <th
                                            style="padding: 12px 15px; text-align: left; font-weight: bold; color: #fff; border: 1px solid #000; width: 50%;">
                                            Item</th>
                                        <th
                                            style="padding: 12px 15px; text-align: center; font-weight: bold; color: #fff; border: 1px solid #000; width: 15%;">
                                            Quantity</th>
                                        <th
                                            style="padding: 12px 15px; text-align: center; font-weight: bold; color: #fff; border: 1px solid #000; width: 15%;">
                                            Rate</th>
                                        <th
                                            style="padding: 12px 15px; text-align: right; font-weight: bold; color: #fff; border: 1px solid #000; width: 20%;">
                                            Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td
                                            style="padding: 4px; border: 1px solid #000; color: #333; vertical-align: top;">
                                            1. {{ $data['invoiceType'] ?? 'Service Charges' }}
                                            @if (isset($data['invoice']['plan']['name']))
                                                - {{ $data['invoice']['plan']['name'] }}
                                            @endif
                                            <br>
                                            <small style="color: #666;">
                                                @if (!empty($data['invoice']['hours']))
                                                    {{ $data['invoice']['hours'] }} Hours
                                                @endif
                                                @if (!empty($data['invoice']['discount']))
                                                    ({{ $data['invoice']['discount'] }}% discount applied)
                                                @endif
                                            </small>
                                        </td>
                                        <td
                                            style="padding: 4px; border: 1px solid #000; color: #333; vertical-align: top; text-align: center;">
                                            {{ $data['invoice']['quantity'] ?? 1 }}
                                        </td>
                                        <td
                                            style="padding: 4px; border: 1px solid #000; color: #333; vertical-align: top; text-align: center;">
                                            {{ number_format($data['amount'] ?? 0) }}/-
                                        </td>
                                        <td
                                            style="padding: 4px; border: 1px solid #000; color: #333; vertical-align: top; text-align: right; font-weight: 600;">
                                            Rs.
                                            {{ number_format(($data['amount'] ?? 0) * ($data['invoice']['quantity'] ?? 1)) }}/-
                                        </td>
                                    </tr>

                                    <!-- Loop for additional items -->
                                    @if (isset($data['invoice']['items']) && is_array($data['invoice']['items']))
                                        @foreach ($data['invoice']['items'] as $index => $item)
                                            <tr>
                                                <td
                                                    style="padding: 4px; border: 1px solid #000; color: #333; vertical-align: top;">
                                                    {{ $index + 2 }}. {{ $item['description'] }}
                                                </td>
                                                <td
                                                    style="padding: 4px; border: 1px solid #000; color: #333; vertical-align: top; text-align: center;">
                                                    {{ $item['quantity'] }}
                                                </td>
                                                <td
                                                    style="padding: 4px; border: 1px solid #000; color: #333; vertical-align: top; text-align: center;">
                                                    {{ number_format($item['rate']) }}/-
                                                </td>
                                                <td
                                                    style="padding: 4px; border: 1px solid #000; color: #333; vertical-align: top; text-align: right; font-weight: 600;">
                                                    Rs. {{ number_format($item['amount']) }}/-
                                                </td>
                                            </tr>
                                        @endforeach
                                    @endif

                                    <!-- Total Row -->
                                    <tr>
                                        <td colspan="3"
                                            style="padding: 4px; border: 1px solid #000; border-top: 2px solid #000; color: #333; font-weight: bold !important;">
                                            {{ isset($data['invoice']['items']) ? count($data['invoice']['items']) + 2 : 2 }}.
                                            Total Amount
                                        </td>
                                        <td
                                            style="padding: 4px; border: 1px solid #000; border-top: 2px solid #000; color: #333; text-align: right; font-weight: bold;">
                                            Rs. {{ number_format($data['amount']) }}/-
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <!-- Total Summary Box -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px; text-align: right;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="right">
                                        <div
                                            style="border: 2px solid #333; padding: 15px 25px; display: inline-block; min-width: 180px; text-align: right;">
                                            <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">Total
                                                (PKR)</div>
                                            <div style="font-size: 24px; font-weight: bold; color: #000;">
                                                {{ number_format($data['amount']) }}/-</div>
                                            <div style="font-size: 11px; color: #666; margin-top: 3px;">Exclusive of Tax
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Bank Details -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <h3
                                style="margin: 0 0 10px 0; font-size: 18px; border-bottom: 2px solid #eee; padding-bottom: 5px;">
                                Bank Details</h3>
                            <table width="100%" cellpadding="5" cellspacing="0" border="0">
                                <tr>
                                    <td width="30%" style="font-weight: 600; color: #555;">Account Holder Name</td>
                                    <td style="color: #333;">BRIDGE</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: 600; color: #555;">Account Number</td>
                                    <td style="color: #333;">PK56ALFH5952005002320929</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: 600; color: #555;">Bank</td>
                                    <td style="color: #333;">Bank Al-Falah</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Call To Action Buttons (View & Download) -->
                    {{-- <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center;">
                            <a href="{{ url('branch/invoice/view/' . $data['invoice_id']) }}"
                                style="display: inline-block; background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View
                                Invoice</a>
                        </td>
                    </tr> --}}

                    <!-- Contact Info -->
                    <tr>
                        <td align="center"
                            style="padding: 20px; background-color: #f9f9f9; color: #666; font-size: 14px; border-top: 1px solid #eee;">
                            For any enquiry, reach out via call on <span style="font-weight: bold; color: #333;">+92 336
                                1312345</span>
                        </td>
                    </tr>

                    <!-- Footer Image -->
                    <tr>
                        <td style="width: 100%;">
                            <img src="{{ url('invoice-footer.png') }}" alt="Bridge Footer"
                                style="width: 100%; height: auto; display: block;">
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>

</html>
