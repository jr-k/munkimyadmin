<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('people', function (Blueprint $table): void {
            $table->boolean('public_store_access')->default(false)->after('notes');
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->foreignId('person_id')->nullable()->after('id')->constrained('people')->nullOnDelete();
            $table->boolean('is_store_account')->default(false)->after('is_owner');
            $table->boolean('store_account_enabled')->default(true)->after('is_store_account');
        });

        Schema::table('packages', function (Blueprint $table): void {
            $table->boolean('on_public_store')->default(false)->after('active');
        });
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table): void {
            $table->dropColumn('on_public_store');
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('person_id');
            $table->dropColumn(['is_store_account', 'store_account_enabled']);
        });

        Schema::table('people', function (Blueprint $table): void {
            $table->dropColumn('public_store_access');
        });
    }
};
