<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContractsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('branch_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('plan_id')->nullable();
            $table->string('type');
            $table->string('company_number');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('duration', ['week', 'month']);
            $table->integer('notice_period');
            $table->json('plan');
            $table->date('plan_start_date');
            $table->date('plan_end_date')->nullable();
            $table->decimal('amount', 10, 2)->default(0.00);
            $table->string('contract', 2000);
            $table->boolean('agreement')->default(false);
            $table->string('signature')->nullable();
            $table->enum('status', ['not signed', 'signed', 'completed', 'cancelled'])->default('not signed');
            $table->timestamps();

            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('plan_id')->references('id')->on('booking_plans')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contracts');
    }
}