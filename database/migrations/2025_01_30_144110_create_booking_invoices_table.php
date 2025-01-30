<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('booking_invoices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('booking_id')->nullable();
            $table->unsignedBigInteger('floor_id')->nullable();
            $table->unsignedBigInteger('room_id')->nullable();
            $table->timestamp('due_date', 0)->nullable();
            $table->decimal('amount', 10, 2)->default(0.00);
            $table->string('status')->default('pending');
            $table->timestamps();

            $table->foreign('booking_id')->references('event_id')->on('booking_schedules')->onDelete('cascade');
            $table->foreign('floor_id')->references('id')->on('schedule_floors')->onDelete('cascade');
            $table->foreign('room_id')->references('id')->on('schedule_rooms')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('booking_invoices');
    }
}