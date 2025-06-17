<?php

namespace App\Helpers;

use App\Mail\BookingConfirmationMail;
use App\Mail\BookingSeat;
use App\Mail\Invoice;
use App\Mail\InvoiceStatusMail;
use Illuminate\Support\Facades\Mail;

class MailHelper
{
    /**
     * Send a booking confirmation email.
     *
     * @param string $email
     * @param array $data
     * @return void
     */
    public static function sendBookingMail(string $email, array $data): void
    {
        Mail::to($email)->send(new BookingSeat($data));
    }

    public static function sendInvoiceMail(string $email, array $data): void
    {
        Mail::to($email)->send(new Invoice($data));
    }

    public static function sendInvoiceStatusMail(string $email, array $data): void
    {
        Mail::to($email)->send(new InvoiceStatusMail($data));
    }

    // You can add more methods for other mail types here
    // Example:
    // public static function sendInvoice(string $email, array $data): void {
    //     Mail::to($email)->send(new InvoiceMail($data));
    // }
}