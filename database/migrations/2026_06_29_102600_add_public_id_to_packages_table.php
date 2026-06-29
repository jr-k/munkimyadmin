<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->string('public_id', 26)->nullable()->after('id');
        });

        DB::table('packages')
            ->select('id')
            ->orderBy('id')
            ->each(function (object $package): void {
                DB::table('packages')
                    ->where('id', $package->id)
                    ->update(['public_id' => (string) Str::ulid()]);
            });

        Schema::table('packages', function (Blueprint $table) {
            $table->unique('public_id');
        });
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropUnique(['public_id']);
            $table->dropColumn('public_id');
        });
    }
};
