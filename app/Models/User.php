<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\StoreAccountSetupNotification;
use Closure;
use Database\Factories\UserFactory;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role', 'is_owner', 'last_login_at', 'person_id', 'is_store_account', 'store_account_enabled'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    private static bool $useStoreSetupPasswordResetNotification = false;

    public const ROLE_OWNER = 'owner';

    public const ROLE_ADMIN = 'admin';

    public const ROLE_USER = 'user';

    public const PERMISSION_RESOURCES = ['people', 'groups', 'links', 'packages', 'assignments'];

    public const PERMISSION_ACTIONS = ['read', 'update'];

    public const EXPORT_PERMISSION = 'export';

    public const STORE_PERMISSION = 'store.read';

    public function permissions(): HasMany
    {
        return $this->hasMany(UserPermission::class);
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }

    public function isAdministrator(): bool
    {
        return $this->role === self::ROLE_OWNER || $this->role === self::ROLE_ADMIN || $this->is_owner;
    }

    public function canManageUsers(): bool
    {
        return $this->isAdministrator();
    }

    public static function withStoreSetupPasswordResetNotification(Closure $callback): mixed
    {
        self::$useStoreSetupPasswordResetNotification = true;

        try {
            return $callback();
        } finally {
            self::$useStoreSetupPasswordResetNotification = false;
        }
    }

    public function sendPasswordResetNotification($token): void
    {
        if (self::$useStoreSetupPasswordResetNotification) {
            $this->notify(new StoreAccountSetupNotification($token));
            return;
        }

        $this->notify(new ResetPassword($token));
    }

    public function hasPermission(string $resource, ?string $action = null): bool
    {
        if ($this->isAdministrator()) {
            return true;
        }

        if ($resource === self::EXPORT_PERMISSION) {
            return $this->permissions->contains(
                fn (UserPermission $permission) => $permission->resource === self::EXPORT_PERMISSION
                    && $permission->action === self::EXPORT_PERMISSION,
            );
        }

        if ($resource === 'store' && $action === 'read') {
            return $this->permissions->contains(
                fn (UserPermission $permission) => $permission->resource === 'store'
                    && $permission->action === 'read',
            );
        }

        if ($action === null) {
            return false;
        }

        if ($action === 'read' && $this->permissions->contains(
            fn (UserPermission $permission) => $permission->resource === $resource
                && $permission->action === 'update',
        )) {
            return true;
        }

        return $this->permissions->contains(
            fn (UserPermission $permission) => $permission->resource === $resource
                && $permission->action === $action,
        );
    }

    public function canAccessStore(): bool
    {
        if ($this->isAdministrator()) {
            return $this->hasPermission('store', 'read');
        }

        return $this->store_account_enabled
            && $this->person_id !== null
            && ($this->isAdministrator() || (bool) $this->person?->public_store_access)
            && $this->hasPermission('store', 'read');
    }

    public function isStoreOnly(): bool
    {
        $permissions = $this->permissionKeys();

        return $this->canAccessStore()
            && ! $this->isAdministrator()
            && count($permissions) === 1
            && in_array(self::STORE_PERMISSION, $permissions, true);
    }

    public function permissionKeys(): array
    {
        if ($this->isAdministrator()) {
            $permissions = [
                ...collect(self::PERMISSION_RESOURCES)
                    ->flatMap(fn (string $resource) => collect(self::PERMISSION_ACTIONS)
                        ->map(fn (string $action) => "{$resource}.{$action}"))
                    ->all(),
                self::EXPORT_PERMISSION,
                self::STORE_PERMISSION,
                'users.manage',
            ];

            return $permissions;
        }

        $permissions = $this->permissions
            ->filter(fn (UserPermission $permission) => $permission->resource === self::EXPORT_PERMISSION
                || ($permission->resource === 'store' && $permission->action === 'read')
                || in_array($permission->action, self::PERMISSION_ACTIONS, true))
            ->map(fn (UserPermission $permission) => $permission->resource === self::EXPORT_PERMISSION
                ? self::EXPORT_PERMISSION
                : "{$permission->resource}.{$permission->action}")
            ->values();

        $impliedReadPermissions = $permissions
            ->filter(fn (string $permission) => str_ends_with($permission, '.update'))
            ->map(fn (string $permission) => str_replace('.update', '.read', $permission));

        return $permissions
            ->merge($impliedReadPermissions)
            ->unique()
            ->values()
            ->all();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_owner' => 'boolean',
            'is_store_account' => 'boolean',
            'store_account_enabled' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }
}
