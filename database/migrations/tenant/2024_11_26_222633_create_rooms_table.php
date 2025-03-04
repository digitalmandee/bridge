<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoomsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('floor_id')->nullable();
            $table->string('name')->nullable();
            $table->string('schedule_start_date')->nullable();
            $table->string('schedule_end_date')->nullable();
            // $table->string('is_blocked')->nullable();
            $table->timestamps();

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
        Schema::dropIfExists('rooms');
    }
}

// Rooms Data
// {
//     "table1": {
//       "name": "Table 1",
//       "chairs":[
//           {"id":0, "booking_date":"","booking_enddate":"","booked": false}
//           {"id":1, "booking_date":"","booking_enddate":"","booked": false}
//       ]
//     },
//     "table2": {
//       "name": "Table 2",
//       "chairs":[
//           {"id":0, "booking_date":"","booking_enddate":"","booked": false}
//           {"id":1, "booking_date":"","booking_enddate":"","booked": false}
//       ]
//     }
//   }

// Available Chairs Data
// [
//     {
//       "roomId": 1,
//       "data": {
//         "table1": {
//           "chairs": [
//             { "id": 'A1' },
//             { "id": 'A2' }
//           ]
//         }
//       }
//     }
//   ]
