<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminAreaAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->isStoreOnly()) {
            return redirect()->route('store.index');
        }

        return $next($request);
    }
}
