<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Package extends Model
{
    public const CATEGORIES = [
        'browsers',
        'developer_tools',
        'security',
        'productivity',
        'communication',
        'internal',
        'utilities',
        'media',
        'system',
    ];

    protected $fillable = [
        'munki_name',
        'display_name',
        'category',
        'description',
        'bundle_identifier',
        'version',
        'icon_path',
        'pkg_path',
        'hash',
        'pkg_url',
        'active',
        'on_public_store',
    ];

    protected static function booted(): void
    {
        static::creating(function (Package $package): void {
            $package->public_id ??= (string) Str::ulid();
        });
    }

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
            'on_public_store' => 'boolean',
        ];
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class);
    }
}
