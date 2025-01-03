<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChairsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chairs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('floor_id')->nullable();
            $table->string('name')->nullable();
            $table->integer('status')->default(0);// status by default
            $table->string('position')->default('top');
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
        Schema::dropIfExists('chairs');
    }
}
