<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Person;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PersonController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('People', [
            'people' => Person::query()
                ->with('groups', 'user')
                ->orderBy('name', 'asc')
                ->get()
                ->map(fn (Person $person) => [
                    ...$person->toArray(),
                    'manifest' => $this->manifestPreview($person->client_identifier),
                    'store_user' => $person->user ? [
                        'id' => $person->user->id,
                        'email' => $person->user->email,
                        'is_store_account' => $person->user->is_store_account,
                        'store_account_enabled' => $person->user->store_account_enabled,
                    ] : null,
                ]),
            'groups' => Group::query()
                ->orderBy('name', 'asc')
                ->get(),
        ]);
    }

    public function csv(): StreamedResponse
    {
        $people = Person::query()
            ->with('groups')
            ->orderBy('name', 'asc')
            ->get()
            ->map(fn (Person $person) => [
                $person->id,
                $person->first_name,
                $person->name,
                $person->email,
                $person->client_identifier,
                $person->groups->pluck('name')->implode(', '),
                $person->notes,
                $person->created_at?->toIso8601String(),
            ]);

        return $this->streamCsv('munkitop-people.csv', [
            'id',
            'first_name',
            'name',
            'email',
            'client_identifier',
            'groups',
            'notes',
            'created_at',
        ], $people);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $data = $this->validatedData($request);
        $groupIds = $this->withDefaultGroup($data['group_ids'] ?? []);
        unset($data['group_ids']);

        DB::transaction(function () use ($data, $groupIds): void {
            $person = Person::create($data);
            $person->groups()->sync($groupIds);
            $this->syncStoreAccount($person);
        });

        return back()->with('success', ['key' => 'flash.personCreated']);
    }

    public function update(Request $request, Person $person): \Illuminate\Http\RedirectResponse
    {
        $data = $this->validatedData($request, $person);
        $groupIds = $this->withDefaultGroup($data['group_ids'] ?? []);
        unset($data['group_ids']);

        DB::transaction(function () use ($data, $groupIds, $person): void {
            $person->update($data);
            $person->groups()->sync($groupIds);
            $this->syncStoreAccount($person);
        });

        return back()->with('success', ['key' => 'flash.personUpdated']);
    }

    public function inviteStore(Person $person): \Illuminate\Http\RedirectResponse
    {
        if (! $person->public_store_access) {
            return back()->with('error', ['key' => 'flash.storeAccessDisabled']);
        }

        $user = $this->syncStoreAccount($person);

        if (! $user) {
            return back()->with('error', ['key' => 'flash.storeUserMissing']);
        }

        $status = $this->sendStoreSetupLink($user);

        if ($status !== Password::RESET_LINK_SENT) {
            return back()->with('error', ['key' => 'flash.storeInviteFailed']);
        }

        return back()->with('success', ['key' => 'flash.storeInviteSent']);
    }

    public function destroy(Person $person): \Illuminate\Http\RedirectResponse
    {
        Person::query()->whereKey($person->getKey())->delete();

        return back()->with('success', ['key' => 'flash.personDeleted']);
    }

    public function bulkDestroy(Request $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:people,id'],
        ]);

        Person::query()->whereKey($data['ids'])->delete();

        return back()->with('success', ['key' => 'flash.peopleDeleted']);
    }

    public function bulkEnableStore(Request $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:people,id'],
            'send_setup_links' => ['boolean'],
        ]);

        $people = Person::query()
            ->whereKey($data['ids'])
            ->with('user')
            ->get();
        $users = [];

        DB::transaction(function () use ($people, &$users): void {
            foreach ($people as $person) {
                $person->update(['public_store_access' => true]);
                $users[] = $this->syncStoreAccount($person);
            }
        });

        $sendSetupLinks = (bool) ($data['send_setup_links'] ?? false);
        $sent = 0;
        $failed = 0;

        if ($sendSetupLinks) {
            foreach (array_filter($users) as $user) {
                $status = $this->sendStoreSetupLink($user);

                if ($status === Password::RESET_LINK_SENT) {
                    $sent++;
                } else {
                    $failed++;
                }
            }
        }

        if ($sendSetupLinks && $failed > 0) {
            return back()->with('error', [
                'key' => 'flash.peopleStoreBulkPartial',
                'params' => ['count' => $people->count(), 'sent' => $sent, 'failed' => $failed],
            ]);
        }

        return back()->with('success', [
            'key' => $sendSetupLinks ? 'flash.peopleStoreBulkEnabledAndSent' : 'flash.peopleStoreBulkEnabled',
            'params' => ['count' => $people->count(), 'sent' => $sent],
        ]);
    }

    private function validatedData(Request $request, ?Person $person = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('people', 'email')->ignore($person)],
            'notes' => ['nullable', 'string'],
            'public_store_access' => ['boolean'],
            'group_ids' => ['array'],
            'group_ids.*' => ['integer', 'exists:groups,id'],
        ]);

        $data['client_identifier'] = $data['email'];
        $data['public_store_access'] = (bool) ($data['public_store_access'] ?? false);

        return $data;
    }

    private function syncStoreAccount(Person $person): ?User
    {
        $person->refresh();
        $linkedUser = $person->user;

        if (! $person->public_store_access) {
            if ($linkedUser) {
                $linkedUser->update(['store_account_enabled' => false]);
                $this->revokeStorePermission($linkedUser);
            }

            return $linkedUser;
        }

        $name = trim("{$person->first_name} {$person->name}") ?: $person->email;
        $user = $linkedUser ?? User::query()->where('email', $person->email)->first();

        if ($user && $user->person_id !== null && $user->person_id !== $person->id) {
            abort(422, 'This email is already linked to another person.');
        }

        if ($user) {
            $payload = [
                'person_id' => $person->id,
                'store_account_enabled' => true,
            ];

            if ($user->is_store_account) {
                $payload['name'] = $name;
                $payload['email'] = $person->email;
            }

            $user->update($payload);
            $this->grantStorePermission($user);

            return $user;
        }

        $user = User::create([
            'person_id' => $person->id,
            'name' => $name,
            'email' => $person->email,
            'password' => Str::random(48),
            'role' => User::ROLE_USER,
            'is_owner' => false,
            'is_store_account' => true,
            'store_account_enabled' => true,
        ]);

        $this->grantStorePermission($user);

        return $user;
    }

    private function sendStoreSetupLink(User $user): string
    {
        return User::withStoreSetupPasswordResetNotification(
            fn () => Password::sendResetLink(['email' => $user->email]),
        );
    }

    private function grantStorePermission(User $user): void
    {
        $user->permissions()->updateOrCreate([
            'resource' => 'store',
            'action' => 'read',
        ]);
    }

    private function revokeStorePermission(User $user): void
    {
        $user->permissions()
            ->where('resource', 'store')
            ->where('action', 'read')
            ->delete();
    }

    private function withDefaultGroup(array $groupIds): array
    {
        $defaultGroupId = Group::query()
            ->firstOrCreate(
                ['slug' => Group::DEFAULT_SLUG],
                [
                    'name' => 'Default',
                    'notes' => 'System group automatically included for all people.',
                    'is_system' => true,
                ],
            )
            ->getKey();

        return array_values(array_unique([...$groupIds, $defaultGroupId]));
    }
}
