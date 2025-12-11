<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToChairsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('chairs', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive'])->default('active')->after('activeColor');  // status: active, inactive
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('chairs', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
}
