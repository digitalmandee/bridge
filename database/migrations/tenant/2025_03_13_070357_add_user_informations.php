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
        Schema::table('users', function (Blueprint $table) {
            $table->string('secondary_phone_no')->nullable()->after('phone_no');
            $table->string('cnic_number')->nullable()->unique()->after('address');
            $table->string('cnic_image')->nullable()->after('cnic_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('secondary_phone_no');
            $table->dropColumn('cnic_number');
            $table->dropColumn('cnic_image');
        });
    }
};