<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->unsignedBigInteger('map_views')->default(0)->after('is_active');
            $table->unsignedBigInteger('direction_requests')->default(0)->after('map_views');
            $table->timestamp('last_viewed_at')->nullable()->after('direction_requests');
        });
    }

    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn([
                'map_views',
                'direction_requests',
                'last_viewed_at',
            ]);
        });
    }
};