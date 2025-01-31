<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('booking_schedules', function (Blueprint $table) {
            $table->id('event_id');
            $table->unsignedBigInteger('branch_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('schedule_floor_id')->nullable();
            $table->unsignedBigInteger('schedule_room_id')->nullable();
            $table->unsignedBigInteger('created_by_branch')->nullable();
            $table->unsignedBigInteger('created_by_user')->nullable();
            $table->string('title');
            $table->string('description', 400)->nullable();
            $table->timestamp('startTime', 0)->nullable();
            $table->timestamp('endTime', 0)->nullable();
            $table->timestamp('date', 0)->nullable();
            $table->integer('persons')->unsigned(); // Ensure it's unsigned for valid counts
            $table->decimal('price', 10, 2)->default(0.00);
            $table->string('status')->default('pending');
            $table->timestamps();

            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('schedule_floor_id')->references('id')->on('schedule_floors')->onDelete('cascade');
            $table->foreign('schedule_room_id')->references('id')->on('schedule_rooms')->onDelete('cascade');
            $table->foreign('created_by_branch')->references('id')->on('branches')->onDelete('cascade');
            $table->foreign('created_by_user')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('booking_schedules');
    }
}