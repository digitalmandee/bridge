<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('booking_request', function (Blueprint $table) {
            $table->unsignedBigInteger('floor_id')->nullable()->after('no_of_seats');
            $table->date('required_date')->nullable()->after('floor_id');

            // If floors table exists
            $table->foreign('floor_id')->references('id')->on('floors')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_request', function (Blueprint $table) {
            $table->dropForeign(['floor_id']);
            $table->dropColumn(['floor_id', 'required_date']);
        });
    }
};