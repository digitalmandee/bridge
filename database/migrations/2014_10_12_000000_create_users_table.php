<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->enum('type', ['superadmin', 'admin', 'user', 'company', 'invester'])->default('user');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('profile_image')->nullable();
            $table->string('phone_no')->nullable();
            $table->string('designation')->nullable();
            $table->string('address')->nullable();
            $table->decimal('total_booking_quota', 10, 1)->default(0);
            $table->decimal('booking_quota', 10, 1)->default(0);
            $table->integer('printing_quota')->default(0);
            $table->integer('total_printing_quota')->default(0);
            $table->bigInteger('company_id')->nullable();
            $table->bigInteger('allocated_seat_id')->nullable();
            $table->timestamp('booking_quota_updated_at')->nullable()->default(now());
            $table->string('status')->default('active');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}