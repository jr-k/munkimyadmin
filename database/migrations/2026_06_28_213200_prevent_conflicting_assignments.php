<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $duplicates = DB::table('assignments')
            ->selectRaw('package_id, assignable_type, assignable_id, MAX(id) as keep_id, COUNT(*) as total')
            ->groupBy('package_id', 'assignable_type', 'assignable_id')
            ->having('total', '>', 1)
            ->get();

        foreach ($duplicates as $duplicate) {
            DB::table('assignments')
                ->where('package_id', $duplicate->package_id)
                ->where('assignable_type', $duplicate->assignable_type)
                ->where('assignable_id', $duplicate->assignable_id)
                ->where('id', '!=', $duplicate->keep_id)
                ->delete();
        }

        Schema::table('assignments', function (Blueprint $table) {
            $table->dropUnique('assignments_unique_target_action');
            $table->unique([
                'package_id',
                'assignable_type',
                'assignable_id',
            ], 'assignments_unique_target');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assignments', function (Blueprint $table) {
            $table->dropUnique('assignments_unique_target');
            $table->unique([
                'package_id',
                'assignable_type',
                'assignable_id',
                'action',
            ], 'assignments_unique_target_action');
        });
    }
};
