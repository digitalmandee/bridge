<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScheduleRoomsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedule_rooms', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('schedule_floor_id')->nullable();
            $table->string('name')->nullable();
            $table->string('schedule_start_date')->nullable();
            $table->string('schedule_end_date')->nullable();
            // $table->string('is_blocked')->nullable();
            $table->timestamps();

            $table->foreign('schedule_floor_id')->references('id')->on('schedule_floors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedule_rooms');
    }
}