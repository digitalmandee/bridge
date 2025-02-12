<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('branch_id')->nullable();
            $table->unsignedBigInteger('floor_id')->nullable();
            $table->json('chair_ids');
            $table->string('name')->nullable();
            $table->string('phone_no')->nullable();
            $table->string('type')->nullable();
            $table->date('start_date')->nullable();
            $table->string('start_time')->nullable();
            $table->date('end_date')->nullable();
            $table->string('end_time')->nullable();
            $table->timestamp('package_end_time');
            $table->enum('duration', ['full_day', 'monthly']);
            $table->enum('time_slot', ['day', 'night', 'full_day']);
            $table->string('package_detail')->nullable();
            $table->decimal('total_price', 10, 2)->default(0.00);
            $table->json('plan')->nullable();
            $table->text('purpose')->nullable();
            //
            // New columns for payment details
            $table->string('payment_method')->nullable();
            $table->string('card_number')->nullable();
            $table->string('expiration_date')->nullable();
            $table->string('cvv')->nullable();
            $table->string('receipt')->nullable();
            $table->boolean('save_card_details')->default(false);
            $table->enum('status', ['pending', 'confirmed', 'vacated', 'rejected', 'completed', 'upcoming'])->default('pending');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('cascade');
            $table->foreign('floor_id')->references('id')->on('floors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bookings');
    }
}