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
        Schema::table('booking_plans', function (Blueprint $table) {
            $table->bigInteger('booking_hours')->nullable()->after('type');
            $table->bigInteger('printing_papers')->nullable()->after('booking_hours');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('booking_plans', function (Blueprint $table) {
            $table->dropColumn('booking_hours');
            $table->dropColumn('printing_papers');
        });
    }
};
