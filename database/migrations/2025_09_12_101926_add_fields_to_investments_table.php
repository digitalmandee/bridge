<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('investments', function (Blueprint $table) {
            $table->decimal('profit_percent', 5, 2)->nullable()->after('amount');
            $table->decimal('share_percent', 5, 2)->nullable()->after('profit_percent');
            $table->enum('share_type', ['equity', 'fixed', 'other'])->nullable()->after('share_percent');
        });
    }

    public function down()
    {
        Schema::table('investments', function (Blueprint $table) {
            $table->dropColumn(['profit_percent', 'share_percent', 'share_type']);
        });
    }
};
