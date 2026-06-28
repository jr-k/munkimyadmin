<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GroupController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Groups', [
            'groups' => Group::query()
                ->with('people')
                ->withCount('people')
                ->orderBy('name')
                ->get()
                ->map(fn (Group $group) => [
                    ...$group->toArray(),
                    'manifest' => $this->manifestPreview($group->slug),
                ]),
            'people' => Person::query()
                ->orderBy('name', 'asc')
                ->get(),
        ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $data = $this->validatedData($request);
        $personIds = $data['person_ids'] ?? [];
        unset($data['person_ids']);

        $group = Group::create($data);
        $group->people()->sync($personIds);

        return back()->with('success', ['key' => 'flash.groupCreated']);
    }

    public function update(Request $request, Group $group): \Illuminate\Http\RedirectResponse
    {
        if ($group->is_system) {
            return back()->with('error', ['key' => 'flash.defaultGroupLocked']);
        }

        $data = $this->validatedData($request, $group);
        $personIds = $data['person_ids'] ?? [];
        unset($data['person_ids']);

        $group->update($data);
        $group->people()->sync($personIds);

        return back()->with('success', ['key' => 'flash.groupUpdated']);
    }

    public function destroy(Group $group): \Illuminate\Http\RedirectResponse
    {
        if ($group->is_system) {
            return back()->with('error', ['key' => 'flash.defaultGroupDeleteLocked']);
        }

        Group::query()->whereKey($group->getKey())->delete();

        return back()->with('success', ['key' => 'flash.groupDeleted']);
    }

    public function bulkDestroy(Request $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:groups,id'],
        ]);

        Group::query()
            ->whereKey($data['ids'])
            ->where('is_system', false)
            ->delete();

        return back()->with('success', ['key' => 'flash.groupsDeleted']);
    }

    private function validatedData(Request $request, ?Group $group = null): array
    {
        $request->merge([
            'slug' => $request->string('slug')->trim()->value()
                ?: Str::slug($request->string('name')->toString(), '-'),
        ]);

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-Za-z0-9._-]+$/',
                Rule::unique('groups', 'slug')->ignore($group),
            ],
            'person_ids' => ['array'],
            'person_ids.*' => ['integer', 'exists:people,id'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}
