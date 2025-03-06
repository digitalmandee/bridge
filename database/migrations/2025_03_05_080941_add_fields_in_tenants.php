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
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('username')->unique()->after('email');
            $table->string('location')->unique()->after('username');
            $table->bigInteger('floors')->after('location');
            $table->bigInteger('rooms')->after('floors');
            $table->bigInteger('seats')->after('rooms');
            $table->bigInteger('tables')->after('seats');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn('username');
            $table->dropColumn('location');
            $table->dropColumn('floors');
            $table->dropColumn('rooms');
            $table->dropColumn('seats');
            $table->dropColumn('tables');
        });
    }
};