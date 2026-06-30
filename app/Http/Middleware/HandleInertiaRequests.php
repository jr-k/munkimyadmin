<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\AppIdentitySettings;
use App\Services\PublicStoreSettings;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        $user = $request->user()?->loadMissing('permissions', 'person');
        $safeMode = (bool) config('app.safe_mode');
        $appIdentity = app(AppIdentitySettings::class)->payload();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_owner' => $user->is_owner,
                    'person_id' => $user->person_id,
                    'is_store_account' => $user->is_store_account,
                    'store_account_enabled' => $user->store_account_enabled,
                ] : null,
                'permissions' => $safeMode ? $this->administratorPermissions() : ($user?->permissionKeys() ?? []),
                'isAdmin' => $safeMode || (bool) $user?->isAdministrator(),
                'isOwner' => (bool) $user?->is_owner,
                'canAccessStore' => (bool) $user?->canAccessStore(),
                'isStoreOnly' => ! $safeMode && (bool) $user?->isStoreOnly(),
            ],
            'app' => [
                'display_name' => $appIdentity['name'],
                'main_color' => $appIdentity['main_color'],
                'logo_url' => $appIdentity['logo_url'],
                'preset_colors' => $appIdentity['preset_colors'],
                'public_store' => app(PublicStoreSettings::class)->payload(),
                'version' => config('app.version'),
                'safe_mode' => $safeMode,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

    private function administratorPermissions(): array
    {
        return [
            ...collect(User::PERMISSION_RESOURCES)
                ->flatMap(fn (string $resource) => collect(User::PERMISSION_ACTIONS)
                    ->map(fn (string $action) => "{$resource}.{$action}"))
                ->all(),
            User::EXPORT_PERMISSION,
            User::STORE_PERMISSION,
            'users.manage',
        ];
    }
}
