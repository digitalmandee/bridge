<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('branch_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->string('employee_id');
            $table->string('address')->nullable();
            $table->string('emergency_no')->nullable();
            $table->enum('gender', ['male', 'female'])->default('male');
            $table->enum('marital_status', ['married', 'single', 'divorced', 'widowed'])->default('single');
            $table->string('national_id')->nullable();
            $table->string('account_no')->nullable();
            $table->bigInteger('salary')->default(0);
            $table->date('joining_date');
            $table->enum('status', ['leave', 'inactive'])->default('active');
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('branch_id')->references('id')->on('branches')->onDelete('set null');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
    }
}